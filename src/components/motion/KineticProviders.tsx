'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { lenisEnabled } from '@/lib/deviceTier';

/**
 * Soft Lenis inertia scroll on tier 2+. No-op on reduced-motion / low tiers.
 * GSAP ScrollTrigger hooks land in Phase 2 on top of this.
 */
export default function KineticProviders({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let destroy: (() => void) | undefined;
    let raf = 0;

    async function boot() {
      if (!lenisEnabled()) {
        setReady(true);
        return;
      }
      try {
        const { default: Lenis } = await import('lenis');
        const lenis = new Lenis({
          duration: 1.1,
          smoothWheel: true,
          touchMultiplier: 1.2,
        });
        const loop = (time: number) => {
          lenis.raf(time);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        destroy = () => {
          cancelAnimationFrame(raf);
          lenis.destroy();
        };
      } catch {
        // Lenis optional
      }
      setReady(true);
    }

    void boot();
    return () => {
      destroy?.();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <>{children}{ready ? null : null}</>;
}
