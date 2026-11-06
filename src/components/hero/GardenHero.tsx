'use client';

import { useEffect, useRef } from 'react';
import { scrollToSection } from '@/lib/scrollNav';
import { detectDeviceTier, prefersReducedMotion } from '@/lib/deviceTier';

/**
 * Garden hero — approved Direction A lock.
 * Layer order: background → mist → monumental type → foreground foliage (overlaps letters).
 */
export default function GardenHero() {
  const wrapRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const mistRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || detectDeviceTier() < 2) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    let raf = 0;
    let mx = 0.5;
    let my = 0.45;
    let tx = 0.5;
    let ty = 0.45;
    let running = false;

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      mx = (e.clientX - r.left) / Math.max(1, r.width);
      my = (e.clientY - r.top) / Math.max(1, r.height);
    };

    const tick = () => {
      tx += (mx - tx) * 0.06;
      ty += (my - ty) * 0.06;
      const dx = (tx - 0.5) * 2;
      const dy = (ty - 0.5) * 2;
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${dx * -8}px, ${dy * -4}px, 0) scale(1.06)`;
      }
      if (mistRef.current) {
        mistRef.current.style.transform = `translate3d(${dx * 12}px, ${dy * 6}px, 0)`;
      }
      if (fgRef.current) {
        fgRef.current.style.transform = `translate3d(${dx * 18}px, ${dy * 10}px, 0)`;
      }
      if (running) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const schedule =
      'requestIdleCallback' in window
        ? (cb: () => void) => window.requestIdleCallback(cb, { timeout: 2200 })
        : (cb: () => void) => globalThis.setTimeout(cb, 900);

    const idle = schedule(start) as unknown as number;
    wrap.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      wrap.removeEventListener('pointermove', onMove);
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(idle);
      else globalThis.clearTimeout(idle);
    };
  }, []);

  return (
    <section id="home" ref={wrapRef} className="garden-hero" aria-label="Introduction">
      <div className="garden-hero-scene" aria-hidden="true">
        <div ref={bgRef} className="garden-hero-bg">
          <picture>
            <source media="(max-width: 767px)" type="image/avif" srcSet="/garden/hero-bg-mobile.avif" />
            <source media="(max-width: 767px)" type="image/webp" srcSet="/garden/hero-bg-mobile.webp" />
            <source type="image/avif" srcSet="/garden/hero-bg-desktop.avif" />
            <source type="image/webp" srcSet="/garden/hero-bg-desktop.webp" />
            <img
              src="/garden/hero-bg-desktop.webp"
              alt=""
              width={1280}
              height={720}
              decoding="async"
              fetchPriority="low"
              className="garden-hero-bg-img"
            />
          </picture>
        </div>
        <div ref={mistRef} className="garden-hero-mist" />
      </div>

      {/* Type sits UNDER foreground foliage so leaves overlap letters */}
      <div className="garden-hero-type page-container">
        <p className="garden-hero-kicker">AMV · music · code</p>
        <h1 className="garden-hero-name">nishal</h1>
        <p className="sr-only">
          Nishal — AMV editor, music producer, and full-stack developer from Kerala.
        </p>
      </div>

      <div ref={fgRef} className="garden-hero-fg" aria-hidden="true">
        <picture>
          <source media="(max-width: 767px)" type="image/webp" srcSet="/garden/hero-fg-mobile-clean.webp" />
          <source type="image/webp" srcSet="/garden/hero-fg-clean.webp" />
          <img
            src="/garden/hero-fg-clean.webp"
            alt=""
            width={1280}
            height={720}
            decoding="async"
            loading="lazy"
            className="garden-hero-fg-img"
          />
        </picture>
      </div>

      <button
        type="button"
        className="garden-hero-cta"
        onClick={() => void scrollToSection('#projects')}
      >
        Selected work →
      </button>
    </section>
  );
}
