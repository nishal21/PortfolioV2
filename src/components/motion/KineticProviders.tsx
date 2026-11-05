'use client';

import { useEffect, type ReactNode } from 'react';
import { lenisEnabled, prefersReducedMotion, detectDeviceTier } from '@/lib/deviceTier';

/**
 * Lenis on tier >= 2. GSAP ScrollTrigger loads on idle to protect TBT.
 */
export default function KineticProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    let destroyLenis: (() => void) | undefined;
    let raf = 0;
    let ctxCleanup: (() => void) | undefined;
    let idleId = 0;

    async function bootLenis() {
      if (!lenisEnabled()) return;
      try {
        const { default: Lenis } = await import('lenis');
        const lenis = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.15 });
        const loop = (time: number) => {
          lenis.raf(time);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        destroyLenis = () => {
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

    if (prefersReducedMotion() || detectDeviceTier() < 2) return;

    void bootLenis();

    const schedule =
      typeof window !== 'undefined' && 'requestIdleCallback' in window
        ? (cb: () => void) => window.requestIdleCallback(cb, { timeout: 2200 })
        : (cb: () => void) => window.setTimeout(cb, 900);

    idleId = schedule(() => {
      void bootGsap();
    }) as number;

    return () => {
      destroyLenis?.();
      ctxCleanup?.();
      if (raf) cancelAnimationFrame(raf);
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId);
      }
    };
  }, []);

  return <>{children}</>;
}

