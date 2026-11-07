'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { defaultTransition } from '@/lib/motion';

interface ShowcaseStageProps {
  accent?: 'sage' | 'warm';
  flagship: ReactNode;
  reel: ReactNode;
  filters?: ReactNode;
  reelLabel?: string;
}

/**
 * Flagship + local horizontal reel.
 * Pattern from Interface Lab / Awwwards horizontal-portfolio guidance:
 * bounded set, peek of next item, real arrow controls, native snap —
 * no page-level pin that freezes the site.
 */
export default function ShowcaseStage({
  accent = 'sage',
  flagship,
  reel,
  filters,
  reelLabel = 'More work',
}: ShowcaseStageProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [progress, setProgress] = useState(0);

  const sync = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const max = Math.max(1, el.scrollWidth - el.clientWidth);
    const left = el.scrollLeft;
    setCanPrev(left > 8);
    setCanNext(left < max - 8);
    setProgress(Math.min(1, left / max));
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    sync();
    el.addEventListener('scroll', sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener('resize', sync, { passive: true });
    return () => {
      el.removeEventListener('scroll', sync);
      ro.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, [sync, reel]);

  const step = (dir: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector('.studio-reel-card') as HTMLElement | null;
    const amount = card ? card.offsetWidth + 16 : Math.min(360, el.clientWidth * 0.8);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * amount, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div className={`studio-showcase studio-showcase--${accent}`}>
      <motion.div
        className="studio-showcase-flagship"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-12% 0px' }}
        transition={defaultTransition}
      >
        {flagship}
      </motion.div>

      {filters ? <div className="studio-showcase-filters">{filters}</div> : null}

      <div className="studio-rail">
        <div className="studio-rail-head">
          <p className="studio-rail-label">{reelLabel}</p>
          <div className="studio-rail-controls">
            <button
              type="button"
              className="studio-rail-btn"
              aria-label="Previous"
              disabled={!canPrev}
              onClick={() => step(-1)}
            >
              <ChevronLeft aria-hidden />
            </button>
            <button
              type="button"
              className="studio-rail-btn"
              aria-label="Next"
              disabled={!canNext}
              onClick={() => step(1)}
            >
              <ChevronRight aria-hidden />
            </button>
          </div>
        </div>

        <div
          ref={railRef}
          className="studio-showcase-reel"
          role="region"
          aria-label={reelLabel}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              e.preventDefault();
              step(1);
            }
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              step(-1);
            }
          }}
        >
          {reel}
        </div>

        <div className="studio-rail-progress" aria-hidden>
          <i style={{ transform: `scaleX(${Math.max(0.08, progress || 0.08)})` }} />
        </div>
      </div>
    </div>
  );
}
