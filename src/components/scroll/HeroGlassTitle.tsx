'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  enableLiquidGlass,
  removeLiquidGlass,
  rebuildLiquidGlass,
} from '@/lib/liquidGlass';
import { HERO_GLASS_CONFIG } from '@/lib/liquidGlassConfig';
import {
  ensureHeroFonts,
  maskIsApplied,
  paintGlyphMask,
  revokeMaskUrl,
  setLetterGlassState,
} from '@/lib/heroGlassMask';
import { heroLiquidGlassEnabled, isAndroid } from '@/lib/performance';
import { HERO_RESUME_EVENT } from '@/lib/scrollNav';
import { useHero } from './HeroContext';

interface HeroGlassTitleProps {
  children: string;
}

const MASK_RETRY_MS = [0, 80, 200, 450, 800];

function HeroGlassLetter({
  char,
  onReady,
}: {
  char: string;
  onReady?: () => void;
}) {
  const glyphRef = useRef<HTMLSpanElement>(null);
  const maskUrlRef = useRef<string | null>(null);
  const resizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hostRef = useRef<HTMLSpanElement>(null);
  const readySentRef = useRef(false);
  const android = isAndroid();

  const notifyReady = useCallback(() => {
    if (readySentRef.current) return;
    readySentRef.current = true;
    onReady?.();
  }, [onReady]);

  const tryMask = useCallback(async () => {
    const host = hostRef.current;
    const glyph = glyphRef.current;
    if (!host || !glyph) return false;

    await ensureHeroFonts(glyph);
    const prevUrl = maskUrlRef.current;

    const ok = await paintGlyphMask(host, glyph, (url) => {
      maskUrlRef.current = url;
    });

    if (ok && prevUrl && prevUrl !== maskUrlRef.current) {
      revokeMaskUrl(prevUrl);
    }

    return ok;
  }, []);

  const applyPlainFallback = useCallback(() => {
    const host = hostRef.current;
    if (!host) return;
    removeLiquidGlass(host);
    revokeMaskUrl(maskUrlRef.current);
    maskUrlRef.current = null;
    setLetterGlassState(host, 'plain');
  }, []);

  const repaintWithRetries = useCallback(async () => {
    const host = hostRef.current;
    if (!host) return;

    setLetterGlassState(host, 'pending');

    for (const delay of MASK_RETRY_MS) {
      if (delay > 0) await new Promise((r) => setTimeout(r, delay));
      if (await tryMask()) {
        notifyReady();
        return;
      }
    }

    applyPlainFallback();
    notifyReady();
  }, [applyPlainFallback, notifyReady, tryMask]);

  const refreshMask = useCallback(async () => {
    const host = hostRef.current;
    if (!host || host.classList.contains('hero-letter-host--plain')) return;
    await tryMask();
  }, [tryMask]);

  const rebuild = useCallback(() => {
    const host = hostRef.current;
    if (!host || host.classList.contains('hero-letter-host--plain')) return;
    rebuildLiquidGlass(host);
    requestAnimationFrame(() => {
      if (host.classList.contains('hero-letter-host--masked')) {
        void refreshMask();
      } else {
        void repaintWithRetries();
      }
    });
  }, [refreshMask, repaintWithRetries]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    enableLiquidGlass(host, () => HERO_GLASS_CONFIG, { force: true });
    setLetterGlassState(host, 'pending');

    const onRebuilt = () => {
      if (host.classList.contains('hero-letter-host--plain')) return;
      if (host.classList.contains('hero-letter-host--masked')) {
        void refreshMask();
        return;
      }
      void repaintWithRetries();
    };
    const onResize = () => {
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(rebuild, 120);
    };

    host.addEventListener('lg-rebuilt', onRebuilt);
    const ro = new ResizeObserver(onResize);
    ro.observe(host);
    window.addEventListener('resize', onResize);

    const onHeroResume = () => {
      if (!host.classList.contains('hero-letter-host--masked')) return;
      if (maskIsApplied(host)) return;
      void refreshMask();
    };
    window.addEventListener(HERO_RESUME_EVENT, onHeroResume);

    void repaintWithRetries();

    return () => {
      host.removeEventListener('lg-rebuilt', onRebuilt);
      ro.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener(HERO_RESUME_EVENT, onHeroResume);
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
      revokeMaskUrl(maskUrlRef.current);
      removeLiquidGlass(host);
    };
  }, [rebuild, refreshMask, repaintWithRetries]);

  return (
    <span
      ref={hostRef}
      className="hero-letter-host"
      data-glass-mode="letter"
      data-radius={android ? '12' : '999'}
    >
      <span className="hero-letter-stack">
        <span className="hero-glass-shadow" aria-hidden="true">
          {char}
        </span>
        <span ref={glyphRef} className="hero-glass-glyphs" aria-hidden="true">
          {char}
        </span>
      </span>
    </span>
  );
}

export default function HeroGlassTitle({ children }: HeroGlassTitleProps) {
  const { setTitleReady } = useHero();
  // Paint plain title immediately for LCP; upgrade to liquid glass after idle.
  const [enhanceGlass, setEnhanceGlass] = useState(false);
  const titleReadySentRef = useRef(false);

  const markTitleReady = useCallback(() => {
    if (titleReadySentRef.current) return;
    titleReadySentRef.current = true;
    setTitleReady();
  }, [setTitleReady]);

  useEffect(() => {
    markTitleReady();
  }, [markTitleReady]);

  useEffect(() => {
    if (!heroLiquidGlassEnabled()) return;

    const start = () => setEnhanceGlass(true);
    if (typeof requestIdleCallback !== 'undefined') {
      const id = requestIdleCallback(start, { timeout: 1400 });
      return () => cancelIdleCallback(id);
    }
    const t = window.setTimeout(start, 500);
    return () => window.clearTimeout(t);
  }, []);

  if (!enhanceGlass) {
    return (
      <h1 className="hero-title hero-title--fallback hero-glass-wrap font-display">{children}</h1>
    );
  }

  const letters = children.split('');

  return (
    <h1 className="hero-title hero-glass-wrap font-display">
      <span className="hero-glass-word">
        {letters.map((char, index) =>
          char === ' ' ? (
            <span key={`space-${index}`} className="hero-glass-space" aria-hidden="true">
              &nbsp;
            </span>
          ) : (
            <HeroGlassLetter key={`${char}-${index}`} char={char} />
          )
        )}
      </span>
    </h1>
  );
}
