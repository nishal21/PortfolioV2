'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ArrowUp, Mic, PhoneOff, X } from 'lucide-react';
import { answer, SUGGESTED_QUESTIONS, type QuickLink } from '@/lib/voice/localAnswers';
import {
  startVoiceSession,
  type VoiceErrorCode,
  type VoiceSession,
  type VoiceState,
} from '@/lib/voice/agentSession';
import './talk.css';

type Entry = { id: string; role: 'user' | 'site' | 'agent'; text: string; links?: QuickLink[]; pending?: boolean };

const VOICE_ERRORS: Record<VoiceErrorCode, string> = {
  unconfigured: "Voice calls aren't switched on for this site yet. Quick answers still work.",
  rate_limited: 'Too many calls from here just now. Try again in a few minutes.',
  mic_denied: 'Microphone access was blocked. Allow it in your browser settings, or type instead.',
  mic_unavailable: 'No microphone was found. You can type instead.',
  unsupported: "This browser can't run voice calls here. You can type instead.",
  network: 'The call dropped. Check your connection and try again.',
  server: "The voice service didn't answer. Try again later, or type instead.",
  time_limit: 'Calls end after five minutes. Start another one any time.',
};

const STATE_LABEL: Record<Exclude<VoiceState, 'ended'>, string> = {
  connecting: 'Connecting…',
  listening: 'Listening',
  speaking: 'Speaking',
};

export default function TalkPanel({ onClose }: { onClose: () => void }) {
  const titleId = useId();
  const [entries, setEntries] = useState<Entry[]>([
    {
      id: 'hello',
      role: 'site',
      text: "Hi, I'm Nishal. Ask about my projects, tools or how to reach me.",
    },
  ]);
  const [draft, setDraft] = useState('');
  const [voiceAvailable, setVoiceAvailable] = useState<boolean | null>(null);
  const [voiceState, setVoiceState] = useState<VoiceState | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const sessionRef = useRef<VoiceSession | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLOListElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Ask the server whether voice is configured. Never assume it is.
  useEffect(() => {
    const ctrl = new AbortController();
    fetch('/api/voice/status', { signal: ctrl.signal, cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { voice: false }))
      .then((d: { voice?: boolean }) => setVoiceAvailable(Boolean(d.voice)))
      .catch(() => setVoiceAvailable(false));
    return () => ctrl.abort();
  }, []);

  useEffect(() => {
    // Desktop: straight to the input. Touch: focus the dialog so the keyboard doesn't jump up.
    if (window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus({ preventScroll: true });
    else panelRef.current?.focus({ preventScroll: true });
    return () => {
      abortRef.current?.abort();
      sessionRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [entries]);

  const ask = (q: string) => {
    const text = q.trim();
    if (!text) return;
    const reply = answer(text);
    const n = Date.now();
    setEntries((e) => [
      ...e,
      { id: `u${n}`, role: 'user', text },
      { id: `s${n}`, role: 'site', text: reply.text, links: reply.links },
    ]);
    setDraft('');
  };

  const startVoice = useCallback(async () => {
    setVoiceError(null);
    // Called straight from the click so the AudioContext and mic prompt keep the user gesture.
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    sessionRef.current = await startVoiceSession({
      onState: (s) => {
        setVoiceState(s === 'ended' ? null : s);
        if (s === 'ended') sessionRef.current = null;
      },
      onError: (code) => {
        setVoiceError(VOICE_ERRORS[code]);
        if (code === 'unconfigured') setVoiceAvailable(false);
      },
      onTurn: ({ id, role, text, final }) => {
        const key = `t${id}`;
        setEntries((e) => {
          const entry: Entry = { id: key, role: role === 'user' ? 'user' : 'agent', text, pending: !final };
          const i = e.findIndex((x) => x.id === key);
          if (i === -1) return [...e, entry];
          const next = e.slice();
          next[i] = entry;
          return next;
        });
      },
    }, ctrl.signal);
  }, []);

  const stopVoice = () => {
    abortRef.current?.abort();
    sessionRef.current?.stop();
  };
  const inCall = voiceState !== null;

  return (
    <div
      ref={panelRef}
      id="talk-panel"
      tabIndex={-1}
      className="talk-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
    >
      <header className="talk-panel__head">
        <div>
          <p className="talk-panel__eyebrow">Ask</p>
          <h2 id={titleId} className="talk-panel__title">
            nishal
          </h2>
        </div>
        <button type="button" className="talk-panel__icon" onClick={onClose} aria-label="Close">
          <X aria-hidden size={18} strokeWidth={2.2} />
        </button>
      </header>

      <ol ref={logRef} className="talk-panel__log" aria-live="polite" aria-relevant="additions text">
        {entries.map((m) => (
          <li key={m.id} className={`talk-msg talk-msg--${m.role}`} data-pending={m.pending || undefined}>
            {m.role === 'agent' ? <span className="talk-msg__tag">Voice agent</span> : null}
            <p>{m.text}</p>
            {m.links?.length ? (
              <ul className="talk-msg__links">
                {m.links.map((l) => (
                  <li key={l.href + l.label}>
                    <a
                      href={l.href}
                      {...(/^https?:/.test(l.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      onClick={l.href.startsWith('/') ? onClose : undefined}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>

      <div className="talk-panel__chips" role="group" aria-label="Suggested questions">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button key={q} type="button" className="talk-chip" onClick={() => ask(q)}>
            {q}
          </button>
        ))}
      </div>

      <form
        className="talk-panel__form"
        onSubmit={(e) => {
          e.preventDefault();
          ask(draft);
        }}
      >
        <label htmlFor={`${titleId}-q`} className="sr-only">
          Your question
        </label>
        <input
          ref={inputRef}
          id={`${titleId}-q`}
          className="talk-panel__input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a question"
          autoComplete="off"
          maxLength={200}
          enterKeyHint="send"
        />
        <button type="submit" className="talk-panel__send" aria-label="Send" disabled={!draft.trim()}>
          <ArrowUp aria-hidden size={18} strokeWidth={2.4} />
        </button>
      </form>

      <p className="talk-panel__note">Quick answers come from this site&apos;s own content. They&apos;re not AI.</p>

      <div className="talk-panel__voice">
        {voiceAvailable === null ? (
          <p className="talk-panel__muted">Checking voice…</p>
        ) : voiceAvailable ? (
          inCall ? (
            <>
              <span className={`talk-live talk-live--${voiceState}`} role="status">
                <span className="talk-live__dot" aria-hidden />
                {STATE_LABEL[voiceState as Exclude<VoiceState, 'ended'>]}
              </span>
              <button type="button" className="talk-voice-btn talk-voice-btn--end" onClick={stopVoice}>
                <PhoneOff aria-hidden size={16} strokeWidth={2.2} />
                End call
              </button>
            </>
          ) : (
            <>
              <button type="button" className="talk-voice-btn" onClick={startVoice}>
                <Mic aria-hidden size={16} strokeWidth={2.2} />
                Talk out loud
              </button>
              <span className="talk-panel__muted">Uses your mic. Calls are recorded by Cartesia, max 5 min.</span>
            </>
          )
        ) : (
          <p className="talk-panel__muted">Voice calls aren&apos;t switched on yet.</p>
        )}
      </div>
      {voiceError ? (
        <p className="talk-panel__error" role="alert">
          {voiceError}
        </p>
      ) : null}
    </div>
  );
}
