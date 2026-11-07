'use client';

import { useEffect, useRef, useState } from 'react';
import type { Video } from '@/data/videos';
import { gardenMotionTier, loadGsapScroll } from '@/lib/gardenMotion';
import './reel-showcase.css';

const CUT_GRADIENTS = [
  'linear-gradient(135deg,#3a2e28,#1a1410 60%,#8a6a4a)',
  'linear-gradient(160deg,#6b3a18,#2a1408 70%,#d4a854)',
  'linear-gradient(160deg,#1e3a48,#0c1e28 70%,#7eb8d0)',
  'linear-gradient(160deg,#4a1e30,#1a0810 70%,#e090a8)',
  'linear-gradient(160deg,#2a3040,#10141c 70%,#8898b0)',
  'linear-gradient(160deg,#3a2840,#140c1c 70%,#b098d0)',
];

interface ReelShowcaseProps {
  featured: Video | null;
  cuts: Video[];
  onOpen: (video: Video) => void;
}

export default function ReelShowcase({ featured, cuts, onOpen }: ReelShowcaseProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeCut, setActiveCut] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !featured) return;

    const tier = gardenMotionTier();
    if (tier === 'none') {
      root.dataset.motion = 'none';
      return;
    }
    root.dataset.motion = tier;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const start = async () => {
      const { gsap, ScrollTrigger } = await loadGsapScroll();
      if (cancelled) return;

      ScrollTrigger.config({ ignoreMobileResize: true });

      const ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        const rm = '(prefers-reduced-motion: no-preference)';

        mm.add(rm, () => {
          const mobile = window.matchMedia('(max-width: 767px)').matches;
          gsap
            .timeline({
              scrollTrigger: {
                trigger: root.querySelector('.reel-showcase__rv'),
                pin: true,
                scrub: mobile ? 0.6 : tier === 'rich' ? 1 : 0.6,
                start: 'top top',
                end: mobile ? '+=120%' : '+=160%',
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            })
            .to(
              '.reel-showcase__win',
              { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut', duration: 1 },
              0
            )
            .to('#reel-r1', { yPercent: -120, opacity: 0, duration: 1 }, 0)
            .to('#reel-r2', { yPercent: 120, opacity: 0, duration: 1 }, 0)
            .to('.reel-showcase__play', { scale: 0, duration: 0.4 }, 0.6)
            .to('.reel-showcase__cap', { opacity: 1, duration: 0.4 }, 0.9);
        });

        mm.add('(prefers-reduced-motion: reduce)', () => {
          gsap.set('.reel-showcase__win', { clipPath: 'inset(0% 0% 0% 0% round 0px)' });
          gsap.set('.reel-showcase__cap', { opacity: 1 });
        });

        gsap.from('.reel-showcase__cut', {
          y: 60,
          opacity: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: root.querySelector('.reel-showcase__acc'),
            start: 'top 88%',
          },
        });
      }, root);

      cleanup = () => ctx.revert();
      ScrollTrigger.refresh();
    };

    const idle =
      typeof requestIdleCallback !== 'undefined'
        ? requestIdleCallback(() => void start(), { timeout: 1200 })
        : window.setTimeout(() => void start(), 300);

    return () => {
      cancelled = true;
      if (typeof cancelIdleCallback !== 'undefined' && typeof idle === 'number') {
        cancelIdleCallback(idle);
      }
      window.clearTimeout(idle as number);
      cleanup?.();
    };
  }, [featured?.id, cuts.length]);

  const onCutClick = (video: Video, index: number, el: HTMLButtonElement) => {
    setActiveCut(index);
    if (window.matchMedia('(max-width: 767px)').matches) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
    onOpen(video);
  };

  if (!featured) {
    return <p className="studio-empty">No videos in this category yet.</p>;
  }

  return (
    <div className="reel-showcase" ref={rootRef}>
      <div
        className="reel-showcase__rv"
        role="button"
        tabIndex={0}
        onClick={() => onOpen(featured)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen(featured);
          }
        }}
        aria-label={`Play featured: ${featured.title}`}
      >
        <div className="reel-showcase__win">
          <div className="reel-showcase__win-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={featured.thumbnail} alt="" loading="lazy" decoding="async" />
          </div>
          <div className="reel-showcase__play" aria-hidden="true" />
        </div>
        <p className="reel-showcase__rt" aria-hidden="true">
          <span id="reel-r1">AMV EDITS</span>
          <span id="reel-r2">&amp; REMIXES</span>
        </p>
        <div className="reel-showcase__cap">
          <small className="reel-showcase__lab">Featured premiere</small>
          <h3>{featured.title}</h3>
          <p>
            {featured.views} views · {featured.date}
          </p>
        </div>
      </div>

      {cuts.length > 0 ? (
        <div className="reel-showcase__cuts" aria-label="More cuts">
          <div className="reel-showcase__acc">
            {cuts.map((video, i) => (
              <button
                key={video.id}
                type="button"
                className={`reel-showcase__cut${activeCut === i ? ' is-on' : ''}`}
                style={{ ['--rs-g' as string]: CUT_GRADIENTS[i % CUT_GRADIENTS.length] }}
                onClick={(e) => onCutClick(video, i, e.currentTarget)}
                onMouseEnter={() => {
                  if (
                    window.matchMedia('(hover: hover)').matches &&
                    window.innerWidth >= 768
                  ) {
                    setActiveCut(i);
                  }
                }}
                aria-label={video.title}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={video.thumbnail} alt="" loading="lazy" decoding="async" />
                <span>{video.title}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
