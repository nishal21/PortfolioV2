'use client';

import { useCallback, useState } from 'react';

type Mode = 'closed' | 'text' | 'voice-mock';

/**
 * Phase 1 voice scaffold: dock UI + text chat fallback.
 * Live Cartesia WebSocket lands in a later phase when keys exist.
 */
export default function VoiceDock() {
  const [mode, setMode] = useState<Mode>('closed');
  const [input, setInput] = useState('');
  const [log, setLog] = useState<{ role: 'you' | 'site'; text: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const sendText = useCallback(async () => {
    const message = input.trim();
    if (!message || busy) return;
    setBusy(true);
    setLog((prev) => [...prev, { role: 'you', text: message }]);
    setInput('');
    try {
      const res = await fetch('/api/voice/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = (await res.json()) as { reply?: string; error?: string; mock?: boolean };
      setLog((prev) => [
        ...prev,
        { role: 'site', text: data.reply || data.error || 'No reply' },
      ]);
      if (data.mock) {
        setNotice('Text mode (Cartesia key not set on server).');
      }
    } catch {
      setLog((prev) => [...prev, { role: 'site', text: 'Network error — try again.' }]);
    } finally {
      setBusy(false);
    }
  }, [input, busy]);

  const startVoice = useCallback(async () => {
    try {
      const res = await fetch('/api/voice/token', { method: 'POST' });
      const data = (await res.json()) as {
        mock?: boolean;
        message?: string;
        error?: string;
      };
      if (!res.ok) {
        setNotice(data.error || 'Could not start voice');
        setMode('text');
        return;
      }
      if (data.mock) {
        setNotice(
          data.message ||
            'Voice mock: set CARTESIA_API_KEY and CARTESIA_AGENT_ID, then redeploy. Use text chat for now.',
        );
        setMode('text');
        return;
      }
      setNotice('Live voice token ready — WebSocket player ships in Phase 4 polish. Use text for now.');
      setMode('text');
    } catch {
      setNotice('Voice unavailable — text chat is open.');
      setMode('text');
    }
  }, []);

  if (mode === 'closed') {
    return (
      <div className="voice-dock voice-dock--closed">
        <button
          type="button"
          className="voice-dock-fab"
          onClick={() => setMode('text')}
          aria-label="Talk with Nishal site"
        >
          Talk
        </button>
      </div>
    );
  }

  return (
    <div className="voice-dock voice-dock--open" role="dialog" aria-label="Talk with Nishal site">
      <div className="voice-dock-panel">
        <header className="voice-dock-head">
          <div>
            <p className="voice-dock-title">Talk with Nishal&apos;s site</p>
            <p className="voice-dock-sub">
              Grounded on public portfolio facts. Calls may be recorded by Cartesia when live voice is on — see Privacy.
            </p>
          </div>
          <button type="button" className="voice-dock-x" onClick={() => setMode('closed')} aria-label="Close">
            ×
          </button>
        </header>

        {notice ? <p className="voice-dock-notice">{notice}</p> : null}

        <div className="voice-dock-log" aria-live="polite">
          {log.length === 0 ? (
            <p className="voice-dock-empty">Ask about projects, AMV work, or how to reach Nishal.</p>
          ) : (
            log.map((m, i) => (
              <p key={`${m.role}-${i}`} className={m.role === 'you' ? 'voice-you' : 'voice-site'}>
                <strong>{m.role === 'you' ? 'You' : 'Site'}:</strong> {m.text}
              </p>
            ))
          )}
        </div>

        <div className="voice-dock-actions">
          <button type="button" className="voice-dock-secondary" onClick={startVoice}>
            Try voice
          </button>
          <input
            className="voice-dock-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void sendText();
            }}
            placeholder="Type a question…"
            aria-label="Message"
            disabled={busy}
          />
          <button type="button" className="voice-dock-primary" onClick={() => void sendText()} disabled={busy}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
