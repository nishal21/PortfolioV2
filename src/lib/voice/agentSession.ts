/**
 * Browser client for a Cartesia Managed Agent over the documented WebSocket:
 *   connect → session_create → session_ready → audio_input / audio_output,
 *   audio_output_clear (barge-in), turn_* events, error {code,message,fatal}.
 * No API key here: a short-lived agent token comes from /api/voice/token.
 */
import {
  VOICE_INPUT_FORMAT,
  VOICE_MAX_SESSION_MS,
  VOICE_SAMPLE_RATE,
  agentSocketUrl,
} from './config';
import { base64ToBytes, bytesToBase64, pcm16ToFloat32 } from './pcm';

export type VoiceState = 'connecting' | 'listening' | 'speaking' | 'ended';
export type VoiceErrorCode =
  | 'unconfigured'
  | 'rate_limited'
  | 'mic_denied'
  | 'mic_unavailable'
  | 'unsupported'
  | 'network'
  | 'server'
  | 'time_limit';

export interface VoiceCallbacks {
  onState: (state: VoiceState) => void;
  onTurn: (turn: { id: number; role: 'user' | 'assistant'; text: string; final: boolean }) => void;
  onError: (code: VoiceErrorCode) => void;
}

export interface VoiceSession {
  stop: () => void;
}

export function voiceSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    typeof navigator.mediaDevices?.getUserMedia === 'function' &&
      typeof WebSocket !== 'undefined' &&
      typeof AudioWorkletNode !== 'undefined' &&
      (window.AudioContext || (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext)
  );
}

type TokenResult = { ok: true; token: string; agentId: string } | { ok: false; code: VoiceErrorCode };

export async function fetchVoiceToken(fetchImpl: typeof fetch = fetch): Promise<TokenResult> {
  try {
    const res = await fetchImpl('/api/voice/token', { method: 'POST', credentials: 'same-origin' });
    if (res.status === 503) return { ok: false, code: 'unconfigured' };
    if (res.status === 429) return { ok: false, code: 'rate_limited' };
    if (!res.ok) return { ok: false, code: 'server' };
    const data = (await res.json()) as { token?: string; agentId?: string };
    if (!data.token || !data.agentId) return { ok: false, code: 'server' };
    return { ok: true, token: data.token, agentId: data.agentId };
  } catch {
    return { ok: false, code: 'network' };
  }
}

/** Must be called from a click/tap handler (mic + audio need a user gesture). */
export async function startVoiceSession(cb: VoiceCallbacks, signal?: AbortSignal): Promise<VoiceSession | null> {
  if (!voiceSupported()) {
    cb.onError('unsupported');
    return null;
  }

  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new Ctx();
  void ctx.resume();
  cb.onState('connecting');

  let stream: MediaStream | null = null;
  let ws: WebSocket | null = null;
  let worklet: AudioWorkletNode | null = null;
  let source: MediaStreamAudioSourceNode | null = null;
  let ready = false;
  let stopped = false;
  let playhead = 0;
  const playing = new Set<AudioBufferSourceNode>();
  const turns = new Map<number, string>();
  let capTimer = 0;

  const cleanup = () => {
    if (stopped) return;
    stopped = true;
    window.clearTimeout(capTimer);
    playing.forEach((n) => {
      try {
        n.stop();
      } catch {
        /* already stopped */
      }
    });
    playing.clear();
    worklet?.port.close();
    worklet?.disconnect();
    source?.disconnect();
    stream?.getTracks().forEach((t) => t.stop());
    if (ws && ws.readyState <= WebSocket.OPEN) ws.close(1000, 'session completed');
    void ctx.close().catch(() => undefined);
    cb.onState('ended');
  };

  const fail = (code: VoiceErrorCode) => {
    if (stopped) return;
    cb.onError(code);
    cleanup();
  };

  signal?.addEventListener('abort', cleanup, { once: true });

  // 1. Microphone first, so a denial costs no token.
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    });
  } catch (err) {
    const name = err instanceof DOMException ? err.name : '';
    fail(name === 'NotAllowedError' || name === 'SecurityError' ? 'mic_denied' : 'mic_unavailable');
    return null;
  }
  if (stopped) {
    stream.getTracks().forEach((t) => t.stop());
    return null;
  }

  // 2. Short-lived token from our server.
  const token = await fetchVoiceToken();
  if (!token.ok) {
    fail(token.code);
    return null;
  }
  if (stopped) return null; // user hung up while the token was in flight

  // 3. Capture graph (16 kHz Int16 chunks from the worklet).
  try {
    await ctx.audioWorklet.addModule('/voice/pcm-capture-worklet.js');
    source = ctx.createMediaStreamSource(stream);
    worklet = new AudioWorkletNode(ctx, 'pcm-capture', { processorOptions: { targetRate: VOICE_SAMPLE_RATE } });
    const sink = ctx.createGain();
    sink.gain.value = 0;
    source.connect(worklet).connect(sink).connect(ctx.destination);
  } catch {
    fail('unsupported');
    return null;
  }
  if (stopped) return null;

  const setSpeaking = () => cb.onState(playing.size > 0 ? 'speaking' : 'listening');

  const play = (b64: string) => {
    const samples = pcm16ToFloat32(base64ToBytes(b64));
    if (!samples.length) return;
    const buf = ctx.createBuffer(1, samples.length, VOICE_SAMPLE_RATE);
    buf.copyToChannel(samples, 0);
    const node = ctx.createBufferSource();
    node.buffer = buf;
    node.connect(ctx.destination);
    const at = Math.max(ctx.currentTime + 0.02, playhead);
    node.start(at);
    playhead = at + buf.duration;
    playing.add(node);
    node.onended = () => {
      playing.delete(node);
      if (!stopped) setSpeaking();
    };
    setSpeaking();
  };

  const clearPlayback = () => {
    playing.forEach((n) => {
      try {
        n.stop();
      } catch {
        /* noop */
      }
    });
    playing.clear();
    playhead = 0;
    if (!stopped) setSpeaking();
  };

  // 4. Socket.
  try {
    ws = new WebSocket(agentSocketUrl(token.agentId, token.token));
  } catch {
    fail('network');
    return null;
  }

  ws.onopen = () => {
    ws?.send(
      JSON.stringify({
        type: 'session_create',
        audio: { input_format: VOICE_INPUT_FORMAT, output_delivery: 'speaking_pace' },
      })
    );
  };

  ws.onmessage = (msg) => {
    if (typeof msg.data !== 'string') return;
    let ev: Record<string, unknown>;
    try {
      ev = JSON.parse(msg.data);
    } catch {
      return;
    }
    switch (ev.type) {
      case 'session_ready':
        ready = true;
        cb.onState('listening');
        break;
      case 'audio_output':
        if (typeof ev.audio === 'string') play(ev.audio);
        break;
      case 'audio_output_clear':
        clearPlayback();
        break;
      case 'turn_output_text_delta': {
        const id = Number(ev.turn);
        const text = (turns.get(id) ?? '') + String(ev.text ?? '');
        turns.set(id, text);
        cb.onTurn({ id, role: 'assistant', text, final: false });
        break;
      }
      case 'turn_ended': {
        const id = Number(ev.turn);
        const role = ev.role === 'user' ? 'user' : 'assistant';
        const text = typeof ev.text === 'string' ? ev.text : turns.get(id) ?? '';
        turns.delete(id);
        if (text) cb.onTurn({ id, role, text, final: true });
        break;
      }
      case 'client_tool_call':
        // No client tools are registered for this agent; answer so it doesn't wait.
        if (ev.expects_response) {
          ws?.send(
            JSON.stringify({
              type: 'client_tool_result',
              tool_call_id: ev.tool_call_id,
              result: 'This website does not provide that tool.',
              is_error: true,
            })
          );
        }
        break;
      case 'error':
        if (ev.fatal) fail('server');
        break;
    }
  };

  ws.onerror = () => fail(ready ? 'network' : 'server');
  ws.onclose = (e) => {
    if (stopped) return;
    if (e.code !== 1000 && !ready) cb.onError('server');
    cleanup();
  };

  worklet.port.onmessage = (e: MessageEvent<ArrayBuffer>) => {
    if (!ready || stopped || ws?.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: 'audio_input', audio: bytesToBase64(new Uint8Array(e.data)) }));
  };

  capTimer = window.setTimeout(() => fail('time_limit'), VOICE_MAX_SESSION_MS);

  return { stop: cleanup };
}
