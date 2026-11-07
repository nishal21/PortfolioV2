'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Home, RefreshCw } from 'lucide-react';
import { useThrowableDigits } from '@/components/error/useThrowableDigits';
import './error-stage.css';

export type ErrorStageKind = 'not-found' | 'error' | 'offline';

type ErrorTheme = 'mist' | 'paper' | 'moss' | 'dusk';

interface ErrorStageProps {
  kind: ErrorStageKind;
  title?: string;
  description?: string;
  digest?: string;
  onRetry?: () => void;
}

const COPY: Record<
  ErrorStageKind,
  { code: string; label: string; title: string; description: string; malayalam: string }
> = {
  'not-found': {
    code: '404',
    label: 'Path missing',
    title: 'This cut didn’t make the edit',
    description:
      'That URL isn’t on the reel. It may have moved, never shipped, or the link is off by a frame.',
    malayalam: 'ഈ പേജ് കണ്ടെത്താനായില്ല',
  },
  error: {
    code: '500',
    label: 'Studio fault',
    title: 'Something glitched in the garden',
    description:
      'A render error hit this page. Try again — if it keeps failing, head home or open projects.',
    malayalam: 'എന്തോ തെറ്റ് സംഭവിച്ചു',
  },
  offline: {
    code: '503',
    label: 'Feed offline',
    title: 'The server dropped the feed',
    description:
      'nishal.dev is up, but this hop failed. Wait a moment and refresh, or come back via home.',
    malayalam: 'സെർവർ ലഭ്യമല്ല',
  },
};

const THEMES: { id: ErrorTheme; label: string; swatch: string }[] = [
  {
    id: 'mist',
    label: 'Mist',
    swatch: 'linear-gradient(135deg,#0f1318 50%,#7d90a6 50%)',
  },
  {
    id: 'paper',
    label: 'Paper',
    swatch: 'linear-gradient(135deg,#e8e4db 50%,#2d2b27 50%)',
  },
  {
    id: 'moss',
    label: 'Moss',
    swatch: 'linear-gradient(135deg,#0d1310 50%,#6c8670 50%)',
  },
  {
    id: 'dusk',
    label: 'Dusk',
    swatch: 'linear-gradient(135deg,#110d18 50%,#c9b8ff 50%)',
  },
];

const THEME_KEY = 'nishal-error-theme';
const THEME_IDS = THEMES.map((t) => t.id);

function readSavedTheme(): ErrorTheme {
  if (typeof window === 'undefined') return 'dusk';
  try {
    const raw = localStorage.getItem(THEME_KEY);
    if (raw && THEME_IDS.includes(raw as ErrorTheme)) return raw as ErrorTheme;
  } catch {
    /* ignore */
  }
  return 'dusk';
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function ErrorStage({
  kind,
  title,
  description,
  digest,
  onRetry,
}: ErrorStageProps) {
  const copy = COPY[kind];
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<ErrorTheme>('dusk');
  const [motionOn, setMotionOn] = useState(false);

  const digits = useMemo(() => {
    const chars = copy.code.padEnd(3, '·').slice(0, 3).split('');
    return chars;
  }, [copy.code]);

  const { nudge } = useThrowableDigits(rootRef, motionOn);

  useEffect(() => {
    setTheme(readSavedTheme());
    setMotionOn(!prefersReducedMotion());
  }, []);

  // Full-bleed playground — hide site chrome while this stage is mounted
  useEffect(() => {
    document.body.classList.add('error-stage-open');
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.classList.remove('error-stage-open');
      document.body.style.overflow = prev;
    };
  }, []);

  const applyTheme = useCallback(
    (next: ErrorTheme, withNudge: boolean) => {
      setTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* ignore */
      }
      if (withNudge && motionOn) nudge();
    },
    [motionOn, nudge]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 't' && e.key !== 'T') return;
      const i = THEME_IDS.indexOf(theme);
      applyTheme(THEME_IDS[(i + 1) % THEME_IDS.length]!, true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [theme, applyTheme]);

  const eyeExtra =
    kind === 'not-found'
      ? pathname || '/'
      : digest
        ? `ref ${digest}`
        : null;

  const themeLabel = THEMES.find((t) => t.id === theme)?.label ?? 'Dusk';

  return (
    <div
      ref={rootRef}
      className="error-stage"
      data-theme={theme}
      data-motion={motionOn ? 'on' : 'none'}
    >
      <div className="error-stage__glow" aria-hidden />

      <p className="error-stage__top">
        <b>nishal</b> / {copy.code}
      </p>

      <section className="error-stage__copy">
        <p className="error-stage__eye">
          {copy.label}
          {eyeExtra ? (
            <>
              {' · '}
              <span>{eyeExtra}</span>
            </>
          ) : null}
        </p>
        <h1 className="error-stage__title">{title ?? copy.title}</h1>
        <p className="error-stage__ml font-malayalam" lang="ml">
          {copy.malayalam}
        </p>
        <p className="error-stage__p">{description ?? copy.description}</p>

        <div className="error-stage__btns">
          <Link href="/" className="hit-target error-stage__btn error-stage__btn--pri">
            <Home className="h-4 w-4" aria-hidden />
            Back to home
          </Link>
          <Link href="/projects" className="hit-target error-stage__btn">
            Projects
          </Link>
          {onRetry ? (
            <button type="button" className="hit-target error-stage__btn" onClick={onRetry}>
              <RefreshCw className="h-4 w-4" aria-hidden />
              Try again
            </button>
          ) : (
            <Link href="/#contact" className="hit-target error-stage__btn">
              Contact
            </Link>
          )}
        </div>
      </section>

      {digits.map((ch, i) => (
        <div
          key={`${copy.code}-${i}`}
          data-error-digit=""
          className={`error-stage__digit error-stage__digit--${i + 1}`}
          aria-hidden={motionOn ? true : undefined}
          style={
            motionOn
              ? undefined
              : {
                  // Static stack when motion is off
                  left: `calc(50% + ${(i - 1) * 5.5}rem)`,
                  top: '22%',
                  width: '5rem',
                  height: '5rem',
                  transform: 'translateX(-50%)',
                  fontSize: '2.5rem',
                }
          }
        >
          {ch}
        </div>
      ))}

      <p className="error-stage__theme-name" aria-live="polite">
        {themeLabel}
      </p>

      <div className="error-stage__themes" role="group" aria-label="Theme">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            className="error-stage__theme"
            data-t={t.id}
            aria-label={`${t.label} theme`}
            aria-pressed={theme === t.id}
            onClick={() => applyTheme(t.id, true)}
          >
            <i style={{ background: t.swatch }} />
          </button>
        ))}
      </div>

      {motionOn ? <p className="error-stage__hint">Drag &amp; throw the shapes</p> : null}
    </div>
  );
}
