'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import type { VoiceErrorCode, VoiceSession } from '@/lib/voice/agentSession';
import type { QuickAnswer } from '@/lib/voice/localAnswers';
import './voice-dock.css';

/**
 * Voice-first floating dock: idle CTA → call bar (connecting / listening /
 * speaking, real timer, end) with one live caption above it. Typing is a
 * secondary, on-request drawer. The voice client and site data load lazily.
 */

type Phase = 'idle' | 'off' | 'connecting' | 'listening' | 'speaking' | 'error' | 'typing';
type Caption = { who: 'agent' | 'you' | 'site' | 'note'; text: string; links?: QuickAnswer['links']; alert?: boolean };

const ERRORS: Record<VoiceErrorCode, string> = {
  unconfigured: "Voice calls aren't switched on right now. You can type a question instead.",
  rate_limited: 'Too many calls from here just now. Try again in a few minutes, or type instead.',
  mic_denied: 'Microphone access is blocked. Allow it in your browser settings, or type instead.',
  mic_unavailable: 'No microphone found. You can type a question instead.',
  unsupported: "This browser can't run voice calls here. You can type instead.",
  network: 'The call dropped. Check your connection and try again.',
  server: "The voice service didn't answer. Try again later, or type instead.",
  time_limit: 'Calls end after five minutes. Start another any time.',
};

const PRIVACY = 'Uses your mic. Cartesia records calls, and each one ends after 5 minutes.';
const SUGGESTIONS = ['Who is Nishal?', 'What are you building now?', 'How can I contact you?'];
const BARS = 14;
/** Short disclosure shown inside the bar while connecting (full text in PRIVACY). */
const DISCLOSE = 'Mic on · Cartesia records calls';

const loadVoice = () => import('@/lib/voice/agentSession');
const loadAnswers = () => import('@/lib/voice/localAnswers');

function fmt(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden width="16" height="16">
    <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

export default function VoiceDock() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [caption, setCaption] = useState<Caption | null>(null);
  const [readyAt, setReadyAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [draft, setDraft] = useState('');
  const statusRef = useRef<Promise<boolean> | null>(null);
  const sessionRef = useRef<VoiceSession | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const genRef = useRef(0);
  const meterRef = useRef<HTMLSpanElement>(null);
  const orbRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const endRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const inCall = phase === 'connecting' || phase === 'listening' || phase === 'speaking';
  const live = phase === 'listening' || phase === 'speaking';

  const checkStatus = useCallback(() => {
    statusRef.current ??= fetch('/api/voice/status', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { voice: false }))
      .then((d: { voice?: boolean }) => Boolean(d.voice))
      .catch(() => {
        statusRef.current = null;
        return false;
      });
    return statusRef.current;
  }, []);

  const prefetch = useCallback(() => {
    void checkStatus();
    void loadVoice();
  }, [checkStatus]);

  // Let the page coordinate layout around the dock (see voice-dock.css).
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.voice = phase === 'idle' ? 'idle' : phase === 'typing' ? 'typing' : 'open';
    if (caption || phase === 'typing') root.dataset.voiceCaption = '';
    else delete root.dataset.voiceCaption;
  }, [phase, caption]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
      sessionRef.current?.stop();
      delete document.documentElement.dataset.voice;
      delete document.documentElement.dataset.voiceCaption;
    },
    []
  );

  // Elapsed time starts only when the agent session is actually ready.
  useEffect(() => {
    if (readyAt === null) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [readyAt]);

  // Meter draws measured mic / agent RMS. Without real audio it stays flat.
  useEffect(() => {
    if (!live) return;
    const meter = meterRef.current;
    const orb = orbRef.current;
    if (!meter) return;
    const bars = Array.from(meter.children) as HTMLElement[];
    const history = new Array<number>(BARS).fill(0);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (t - last < (reduce ? 250 : 50)) return;
      last = t;
      const lv = sessionRef.current?.levels() ?? { input: 0, output: 0 };
      const v = Math.min(1, Math.max(lv.input, lv.output) * 4.5);
      history.shift();
      history.push(v);
      for (let i = 0; i < BARS; i++) bars[i].style.transform = `scaleY(${(0.12 + history[i] * 0.88).toFixed(3)})`;
      meter.dataset.src = lv.output > lv.input ? 'agent' : 'you';
      orb?.style.setProperty('--lv', Math.min(1, lv.output * 4.5).toFixed(3));
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      bars.forEach((b) => (b.style.transform = ''));
      orb?.style.removeProperty('--lv');
    };
  }, [live]);

  useEffect(() => {
    if (inCall) endRef.current?.focus({ preventScroll: true });
    else if (phase === 'typing') inputRef.current?.focus({ preventScroll: true });
  }, [inCall, phase]);

  const reset = useCallback(() => {
    genRef.current++;
    abortRef.current?.abort();
    sessionRef.current?.stop();
    sessionRef.current = null;
    setReadyAt(null);
    setPhase('idle');
    setCaption(null);
    setDraft('');
    requestAnimationFrame(() => ctaRef.current?.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    if (phase !== 'typing' && phase !== 'off' && phase !== 'error') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') reset();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, reset]);

  const startCall = async () => {
    const gen = ++genRef.current;
    // Create the AudioContext inside the click so later playback is allowed.
    const AC =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    const ctx = AC ? new AC() : null;
    void ctx?.resume();
    const drop = () => void ctx?.close().catch(() => undefined);

    setPhase('connecting');
    setCaption(null);

    const configured = await checkStatus();
    if (gen !== genRef.current) return drop();
    if (!configured) {
      drop();
      setPhase('off');
      setCaption({ who: 'note', text: ERRORS.unconfigured });
      return;
    }

    const { startVoiceSession } = await loadVoice();
    if (gen !== genRef.current) return drop();

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    let failed = false;
    sessionRef.current = await startVoiceSession(
      {
        onReady: () => {
          if (gen !== genRef.current) return;
          setReadyAt(Date.now());
          setCaption(null);
        },
        onState: (s) => {
          if (gen !== genRef.current) return;
          if (s === 'ended') {
            sessionRef.current = null;
            setReadyAt(null);
            if (!failed) {
              setPhase('idle');
              setCaption(null);
            }
            return;
          }
          setPhase(s);
        },
        onError: (code) => {
          if (gen !== genRef.current) return;
          failed = true;
          setPhase('error');
          setCaption({ who: 'note', text: ERRORS[code], alert: true });
        },
        onTurn: ({ role, text }) => {
          if (gen !== genRef.current) return;
          setCaption({ who: role === 'user' ? 'you' : 'agent', text });
        },
      },
      { signal: ctrl.signal, ctx: ctx ?? undefined }
    );
  };

  const openTyping = () => {
    genRef.current++;
    abortRef.current?.abort();
    sessionRef.current?.stop();
    setReadyAt(null);
    setPhase('typing');
    setCaption(null);
    void loadAnswers();
  };

  const ask = async (q: string, e?: FormEvent) => {
    e?.preventDefault();
    const text = q.trim();
    if (!text) return;
    const { answer } = await loadAnswers();
    const a = answer(text);
    setCaption({ who: 'site', text: a.text, links: a.links.slice(0, 3) });
    setDraft('');
  };

  const label = {
    connecting: 'Connecting…',
    listening: 'Listening',
    speaking: 'Speaking',
    off: 'Voice off',
    error: 'Call ended',
    idle: '',
    typing: '',
  }[phase];

  return (
    <div className="vdock" data-phase={phase}>
      <div className="vdock__float">
        {caption ? (
          <div
            key={caption.who + caption.text.slice(0, 16)}
            className="vdock__caption"
            data-who={caption.who}
            role={caption.alert ? 'alert' : 'status'}
          >
            {caption.who === 'agent' ? (
              <span className="vdock__who">Garden guide · voice AI</span>
            ) : caption.who === 'you' ? (
              <span className="vdock__who">You</span>
            ) : caption.who === 'site' ? (
              <span className="vdock__who">From this site · not AI</span>
            ) : null}
            <p>{caption.text}</p>
            {caption.links?.length ? (
              <span className="vdock__links">
                {caption.links.map((l) => (
                  <a
                    key={l.href + l.label}
                    href={l.href}
                    {...(/^https?:/.test(l.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {l.label}
                  </a>
                ))}
              </span>
            ) : null}
            {phase === 'off' || phase === 'error' ? (
              <button type="button" className="vdock__textlink" onClick={openTyping}>
                Type a question
              </button>
            ) : null}
          </div>
        ) : phase === 'typing' ? (
          <div className="vdock__chips" role="group" aria-label="Suggested questions">
            {SUGGESTIONS.map((q) => (
              <button key={q} type="button" onClick={() => ask(q)}>
                {q}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="vdock__row">
        <button
          type="button"
          className="vdock__type"
          onClick={openTyping}
          onPointerEnter={() => void loadAnswers()}
          aria-label="Type a question instead"
          title="Type instead"
          tabIndex={phase === 'idle' ? 0 : -1}
          aria-hidden={phase === 'idle' ? undefined : true}
        >
          <svg viewBox="0 0 24 24" aria-hidden width="18" height="18">
            <path
              d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5zM8 9.5h.01M12 9.5h.01M16 9.5h.01M8 13h.01M16 13h.01M10 16h4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="vdock__shell">
          {phase === 'idle' ? (
            <button
              ref={ctaRef}
              type="button"
              className="vdock__cta"
              onClick={(e) => {
                // Calls start only from a real user gesture, never a scripted click.
                if (e.nativeEvent.isTrusted) void startCall();
              }}
              onPointerEnter={prefetch}
              onFocus={prefetch}
              aria-describedby="vdock-privacy"
            >
              <span className="vdock__orb" aria-hidden />
              <span className="vdock__cta-label">Talk to Nishal</span>
              <span id="vdock-privacy" className="sr-only">
                Starts a voice call. {PRIVACY}
              </span>
            </button>
          ) : phase === 'typing' ? (
            <form className="vdock__form" onSubmit={(e) => ask(draft, e)}>
              <label htmlFor="vdock-q" className="sr-only">
                Your question
              </label>
              <input
                ref={inputRef}
                id="vdock-q"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask about work, tools, contact"
                autoComplete="off"
                maxLength={200}
                enterKeyHint="send"
              />
              <button type="submit" className="vdock__send" aria-label="Send" disabled={!draft.trim()}>
                <svg viewBox="0 0 24 24" aria-hidden width="18" height="18">
                  <path
                    d="M12 19V5M6 11l6-6 6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button type="button" className="vdock__end" onClick={reset} aria-label="Close">
                <CloseIcon />
              </button>
            </form>
          ) : (
            <div className="vdock__bar">
              <span ref={orbRef} className="vdock__orb vdock__orb--call" aria-hidden />
              <span className="vdock__state">
                <span className="vdock__label" role="status">
                  {label}
                </span>
                <span className="vdock__sub" title={phase === 'connecting' ? PRIVACY : undefined}>
                  {phase === 'connecting' ? DISCLOSE : live ? 'Ends at 5:00' : phase === 'off' ? 'Text answers still work' : 'You can try again'}
                </span>
              </span>
              {live ? (
                <span ref={meterRef} className="vdock__meter" aria-hidden>
                  {Array.from({ length: BARS }, (_, i) => (
                    <i key={i} />
                  ))}
                </span>
              ) : null}
              <span className="vdock__time">
                {readyAt ? (
                  <>
                    <span className="sr-only">Call time </span>
                    {fmt(now - readyAt)}
                  </>
                ) : null}
              </span>
              <button
                ref={endRef}
                type="button"
                className={`vdock__end${inCall ? ' vdock__end--hang' : ''}`}
                onClick={reset}
                aria-label={inCall ? 'End call' : 'Close'}
              >
                <CloseIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
