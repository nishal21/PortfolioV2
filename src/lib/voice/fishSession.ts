/**
 * Fish Audio voice agent behind the same VoiceSession contract as the Cartesia
 * client, so the dock's call bar (status, timer, caption, meter) drives both.
 * Uses the documented Web SDK (@fishaudio/agent-client, WebRTC via LiveKit)
 * in public-agent mode. This module and its SDK load only when a visitor
 * picks the Fish voice.
 */
import { AgentSession, type FishAgentError } from '@fishaudio/agent-client';
import type { VoiceCallbacks, VoiceErrorCode, VoiceSession, VoiceStartOptions } from './agentSession';
import { FISH_AGENT_ID, VOICE_MAX_SESSION_MS } from './config';

export function fishSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return typeof navigator.mediaDevices?.getUserMedia === 'function' && typeof RTCPeerConnection !== 'undefined';
}

/** Duck-typed on `code`: instanceof breaks if the SDK is loaded twice (ESM + CJS). */
export function mapFishError(err: unknown): VoiceErrorCode {
  const e = (err ?? {}) as Partial<FishAgentError>;
  if (typeof e.code !== 'string') return 'server';
  if (e.statusCode === 429) return 'rate_limited';
  switch (e.code) {
    case 'mic_permission_denied':
      return 'mic_denied';
    case 'device_change_failed':
      return 'mic_unavailable';
    case 'connection_failed':
      return 'network';
    case 'unsupported_transport':
      return 'unsupported';
    default:
      return 'server';
  }
}

/** Must be called from a click/tap handler (mic + audio need a user gesture). */
export async function startFishSession(cb: VoiceCallbacks, opts: VoiceStartOptions = {}): Promise<VoiceSession | null> {
  // The SDK plays audio through its own elements; the dock's context isn't needed.
  void opts.ctx?.close().catch(() => undefined);
  const { signal } = opts;
  if (!fishSupported() || !FISH_AGENT_ID) {
    cb.onError(FISH_AGENT_ID ? 'unsupported' : 'unconfigured');
    return null;
  }

  cb.onState('connecting');
  let session: AgentSession | null = null;
  let stopped = false;
  let failed = false;
  let capTimer = 0;

  const finish = () => {
    if (stopped) return;
    stopped = true;
    window.clearTimeout(capTimer);
    void session?.end().catch(() => undefined);
    cb.onState('ended');
  };
  const fail = (code: VoiceErrorCode) => {
    if (stopped || failed) return;
    failed = true;
    cb.onError(code);
    finish();
  };
  signal?.addEventListener('abort', finish, { once: true });

  try {
    session = await AgentSession.start({
      agentId: FISH_AGENT_ID,
      toolEvents: false,
      callbacks: {
        onModeChange: (mode) => {
          if (!stopped) cb.onState(mode === 'speaking' ? 'speaking' : 'listening');
        },
        onUserTranscript: ({ text, final }) => {
          if (!stopped && text.trim()) cb.onTurn({ id: 0, role: 'user', text, final });
        },
        onAgentResponseDelta: ({ text }) => {
          if (!stopped && text.trim()) cb.onTurn({ id: 0, role: 'assistant', text, final: false });
        },
        onAgentResponse: ({ text }) => {
          if (!stopped && text.trim()) cb.onTurn({ id: 0, role: 'assistant', text, final: true });
        },
        onError: (err) => {
          // provider/internal errors may recover on their own; only fatal ones end the call.
          if (err.code === 'provider_error' || err.code === 'internal_error') return;
          fail(mapFishError(err));
        },
        onDisconnect: ({ reason }) => {
          if (stopped) return;
          if (reason === 'conversation_timeout') return fail('time_limit');
          if (reason === 'connection_lost' || reason === 'internal_error' || reason === 'llm_endpoint_failure')
            return fail(reason === 'connection_lost' ? 'network' : 'server');
          finish();
        },
      },
    });
  } catch (err) {
    if (!stopped) fail(mapFishError(err));
    return null;
  }

  if (stopped) {
    void session.end().catch(() => undefined);
    return null;
  }
  void session.startAudio().catch(() => undefined);
  cb.onReady?.();
  cb.onState(session.isSpeaking ? 'speaking' : 'listening');
  capTimer = window.setTimeout(() => fail('time_limit'), VOICE_MAX_SESSION_MS);

  const s = session;
  return {
    stop: finish,
    // SDK volumes are 0..1 loudness; the dock's meter expects raw RMS (it scales by 4.5).
    levels: () => (stopped ? { input: 0, output: 0 } : { input: s.getInputVolume() / 4.5, output: s.getOutputVolume() / 4.5 }),
  };
}
