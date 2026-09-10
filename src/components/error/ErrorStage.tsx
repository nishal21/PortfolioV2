'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Film, Home, RefreshCw } from 'lucide-react';

export type ErrorStageKind = 'not-found' | 'error' | 'offline';

interface ErrorStageProps {
  kind: ErrorStageKind;
  title?: string;
  description?: string;
  /** Shown on runtime errors */
  digest?: string;
  onRetry?: () => void;
}

const COPY: Record<
  ErrorStageKind,
  { code: string; label: string; title: string; description: string; malayalam: string }
> = {
  'not-found': {
    code: '404',
    label: 'Frame missing',
    title: 'This cut didn’t make the edit',
    description:
      'That URL isn’t on the reel. It may have moved, never shipped, or the link is off by a frame.',
    malayalam: 'ഈ പേജ് കണ്ടെത്താനായില്ല',
  },
  error: {
    code: '500',
    label: 'Playback fault',
    title: 'Something glitched in the studio',
    description:
      'A render error hit this page. Try again — if it keeps failing, head home or open projects.',
    malayalam: 'എന്തോ തെറ്റ് സംഭവിച്ചു',
  },
  offline: {
    code: '503',
    label: 'Studio offline',
    title: 'The server dropped the feed',
    description:
      'nishal.dev is up, but this hop failed. Wait a moment and refresh, or come back via the home link.',
    malayalam: 'സെർവർ ലഭ്യമല്ല',
  },
};

export default function ErrorStage({
  kind,
  title,
  description,
  digest,
  onRetry,
}: ErrorStageProps) {
  const copy = COPY[kind];
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      setFrame((n) => (n + 1) % 24);
    }, 90);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="error-stage studio-stage">
      <div className="error-stage__grain" aria-hidden />
      <div className="error-stage__vignette" aria-hidden />

      <div className="error-stage__inner page-container">
        <p className="error-stage__meta">
          <Film className="error-stage__meta-icon" strokeWidth={1.75} aria-hidden />
          <span>
            {copy.label} · reel 00 · frame {String(frame).padStart(2, '0')}
          </span>
        </p>

        <p className="error-stage__code" aria-hidden>
          <span className="error-stage__code-ghost">{copy.code}</span>
          <span className="error-stage__code-main">{copy.code}</span>
        </p>

        <h1 className="error-stage__title">{title ?? copy.title}</h1>
        <p className="error-stage__malayalam font-malayalam">{copy.malayalam}</p>
        <p className="error-stage__desc">{description ?? copy.description}</p>

        {digest ? (
          <p className="error-stage__digest">
            Ref <code>{digest}</code>
          </p>
        ) : null}

        <div className="error-stage__actions">
          <Link href="/" className="hit-target error-stage__btn error-stage__btn--primary">
            <Home className="h-4 w-4" aria-hidden />
            Home
          </Link>
          <Link href="/projects" className="hit-target error-stage__btn error-stage__btn--ghost">
            Projects
          </Link>
          {onRetry ? (
            <button
              type="button"
              className="hit-target error-stage__btn error-stage__btn--ghost"
              onClick={onRetry}
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              Try again
            </button>
          ) : (
            <Link href="/#contact" className="hit-target error-stage__btn error-stage__btn--ghost">
              <ArrowLeft className="h-4 w-4 rotate-180" aria-hidden />
              Contact
            </Link>
          )}
        </div>

        <nav className="error-stage__links" aria-label="Quick links">
          <Link href="/about">About</Link>
          <Link href="/resume/view">Resume</Link>
          <Link href="/profile">Profile</Link>
          <a href="https://github.com/nishal21" rel="noopener noreferrer" target="_blank">
            GitHub
          </a>
        </nav>
      </div>
    </div>
  );
}
