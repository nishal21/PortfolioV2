'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  enableLiquidGlass,
  rebuildAllLiquidGlass,
  removeLiquidGlass,
  rebuildLiquidGlass,
} from '@/lib/liquidGlass';
import { NAV_GLASS_CONFIG } from '@/lib/liquidGlassConfig';
import {
  ensureHeroFonts,
  paintGlyphMask,
  revokeMaskUrl,
  setLetterGlassState,
} from '@/lib/heroGlassMask';
import { heroLiquidGlassEnabled, isAndroid } from '@/lib/performance';
import { useScrollSequence } from './ScrollSequenceContext';

interface HeroGlassTitleProps {
  children: string;
}

const MASK_RETRY_MS = [0, 80, 200, 450, 800];

function HeroGlassLetter({ char }: { char: string }) {
  const glyphRef = useRef<HTMLSpanElement>(null);
  const maskUrlRef = useRef<string | null>(null);
  const resizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hostRef = useRef<HTMLSpanElement>(null);
  const android = isAndroid();

  const tryMask = useCallback(async () => {
    const host = hostRef.current;
    const glyph = glyphRef.current;
    if (!host || !glyph) return false;

    await ensureHeroFonts(glyph);
    revokeMaskUrl(maskUrlRef.current);

    const ok = await paintGlyphMask(host, glyph, (url) => {
      maskUrlRef.current = url;
    });

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
      if (await tryMask()) return;
    }

    applyPlainFallback();
  }, [applyPlainFallback, tryMask]);

  const rebuild = useCallback(() => {
    const host = hostRef.current;
    if (!host || host.classList.contains('hero-letter-host--plain')) return;
    rebuildLiquidGlass(host);
    requestAnimationFrame(() => void repaintWithRetries());
  }, [repaintWithRetries]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    enableLiquidGlass(host, () => NAV_GLASS_CONFIG, { force: true });
    setLetterGlassState(host, 'pending');

    const onRebuilt = () => void repaintWithRetries();
    const onResize = () => {
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(rebuild, 120);
    };

    host.addEventListener('lg-rebuilt', onRebuilt);
    const ro = new ResizeObserver(onResize);
    ro.observe(host);
    window.addEventListener('resize', onResize);
    void repaintWithRetries();

    return () => {
      host.removeEventListener('lg-rebuilt', onRebuilt);
      ro.disconnect();
      window.removeEventListener('resize', onResize);
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
      revokeMaskUrl(maskUrlRef.current);
      removeLiquidGlass(host);
    };
  }, [rebuild, repaintWithRetries]);

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
  const { ready, heroInView } = useScrollSequence();
  const [glassOn, setGlassOn] = useState(false);

  useEffect(() => {
    setGlassOn(heroLiquidGlassEnabled());
  }, []);

  useEffect(() => {
    if (!ready || !glassOn || !heroInView) return;
    const t1 = requestAnimationFrame(() => rebuildAllLiquidGlass());
    const t2 = window.setTimeout(() => rebuildAllLiquidGlass(), 200);
    return () => {
      cancelAnimationFrame(t1);
      window.clearTimeout(t2);
    };
  }, [ready, glassOn, heroInView]);

  if (!glassOn) {
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
