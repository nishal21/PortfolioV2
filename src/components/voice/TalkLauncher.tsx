'use client';

import { useCallback, useRef, useState, type ComponentType } from 'react';
import './talk-launcher.css';

type PanelProps = { onClose: () => void };

/**
 * Tiny always-loaded pill. The panel (data, styles, voice client) loads on
 * first intent: hover/focus prefetches, click opens.
 */
export default function TalkLauncher() {
  const [open, setOpen] = useState(false);
  const [Panel, setPanel] = useState<ComponentType<PanelProps> | null>(null);
  const [loading, setLoading] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const loadRef = useRef<Promise<void> | null>(null);

  const load = useCallback(() => {
    loadRef.current ??= import('./TalkPanel')
      .then((m) => setPanel(() => m.default))
      .catch(() => {
        loadRef.current = null;
      });
    return loadRef.current;
  }, []);

  const toggle = async () => {
    if (open) {
      setOpen(false);
      return;
    }
    setLoading(true);
    await load();
    setLoading(false);
    setOpen(true);
  };

  const close = useCallback(() => {
    setOpen(false);
    btnRef.current?.focus();
  }, []);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="talk-launcher"
        aria-expanded={open}
        aria-controls="talk-panel"
        aria-haspopup="dialog"
        onPointerEnter={load}
        onFocus={load}
        onClick={toggle}
        data-open={open || undefined}
        data-loading={loading || undefined}
      >
        <span className="talk-launcher__dot" aria-hidden />
        <span className="talk-launcher__label">{open ? 'Close' : 'Talk'}</span>
      </button>
      {open && Panel ? <Panel onClose={close} /> : null}
    </>
  );
}
