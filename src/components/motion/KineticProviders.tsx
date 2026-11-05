'use client';

import { useEffect, type ReactNode } from 'react';
import { lenisEnabled, prefersReducedMotion, detectDeviceTier } from '@/lib/deviceTier';

/**
 * Lenis + GSAP ScrollTrigger boot AFTER first scroll or long idle (TBT).
 */
export default function KineticProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    let destroyLenis: (() => void) | undefined;
    let raf = 0;
    let ctxCleanup: (() => void) | undefined;
    let started = false;

    async function bootLenis() {
      if (typeof window !== 'undefined' && /(?:^|[?&])nolenis(?:=|$)/.test(window.location.search)) return;
      if (!lenisEnabled()) return;
      try {
        const { default: Lenis } = await import('lenis');
        const lenis = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.15 });
        const loop = (time: number) => {
          lenis.raf(time);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        (window as Window & { __lenis?: typeof lenis }).__lenis = lenis;
        destroyLenis = () => {
          delete (window as Window & { __lenis?: unknown }).__lenis;
          cancelAnimationFrame(raf);
          lenis.destroy();
        };
      } catch {
        /* optional */
      }
    }

    async function bootGsap() {
      try {
        const gsapMod = await import('gsap');
        const gsap = gsapMod.default || gsapMod.gsap;
        const stMod = await import('gsap/ScrollTrigger');
        const ScrollTrigger = stMod.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        const cards = gsap.utils.toArray('.kinetic-featured-card') as HTMLElement[];
        cards.forEach((el, i) => {
          gsap.from(el, {
            y: 16,
            duration: 0.55,
            delay: i * 0.04,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          });
        });
        ctxCleanup = () => ScrollTrigger.getAll().forEach((t: { kill: () => void }) => t.kill());
      } catch {
        /* optional */
      }
    }

    function start() {
      if (started) return;
      started = true;
      void bootLenis();
      void bootGsap();
      window.removeEventListener('scroll', start);
      window.removeEventListener('pointerdown', start);
    }

    if (prefersReducedMotion() || detectDeviceTier() < 2) return;

    window.addEventListener('scroll', start, { once: true, passive: true });
    window.addEventListener('pointerdown', start, { once: true, passive: true });
    const t = globalThis.setTimeout(start, 6000) as unknown as number;

    return () => {
      globalThis.clearTimeout(t);
      window.removeEventListener('scroll', start);
      window.removeEventListener('pointerdown', start);
      destroyLenis?.();
      ctxCleanup?.();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <>{children}</>;
}
