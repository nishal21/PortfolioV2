'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gardenMotionTier, loadGsapScroll } from '@/lib/gardenMotion';

/** Scroll-linked reveal for the footer: the garden settles, the name grows out of it. */
export default function GardenFooterMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const tier = gardenMotionTier();
    if (tier === 'none') return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const { gsap } = await loadGsapScroll();
        if (cancelled) return;
        const ctx = gsap.context(() => {
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom bottom', scrub: tier === 'rich' ? 0.5 : true },
          });
          tl.fromTo('[data-footer-bg]', { scale: 1.12, yPercent: -6 }, { scale: 1, yPercent: 0 }, 0)
            .fromTo(
              '[data-footer-letter]',
              { yPercent: 62 },
              { yPercent: 0, stagger: 0.05, ease: 'power2.out' },
              0.1
            )
            .fromTo('[data-footer-chrome]', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, stagger: 0.04 }, 0.45);
        }, root);
        revert = () => ctx.revert();
      },
      { rootMargin: '400px 0px' }
    );
    io.observe(root);

    return () => {
      cancelled = true;
      io.disconnect();
      revert?.();
    };
  }, []);

  return (
    <div ref={ref} className="garden-footer__motion">
      {children}
    </div>
  );
}
