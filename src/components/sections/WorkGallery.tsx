'use client';

import { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  getProjectThumbnail,
  isProjectInDevelopment,
  type Project,
} from '@/data/projects';
import { gardenMotionTier, loadGsapScroll } from '@/lib/gardenMotion';
import './work-gallery.css';

const FEATURED_CAP = 5;

const CARD_GRADIENTS = [
  'linear-gradient(135deg,#2a1f3d,#5b4578 55%,#c9b8ff)',
  'linear-gradient(135deg,#1a2e28,#2d6a5a 60%,#8fd6c4)',
  'linear-gradient(135deg,#2c2418,#6b4f2a 50%,#f0c79a)',
  'linear-gradient(135deg,#1a2438,#3d5a80 55%,#9db7d9)',
  'linear-gradient(135deg,#2a1820,#6b3048 55%,#e8a0b8)',
  'linear-gradient(135deg,#1e1a28,#4a4060 55%,#a89cc8)',
];

function pickFeatured(all: Project[]): Project[] {
  const pinned = all.filter((p) => p.pinned);
  const rest = all.filter((p) => !p.pinned);
  return [...pinned, ...rest].slice(0, FEATURED_CAP);
}

function padIndex(n: number) {
  return String(n).padStart(2, '0');
}

interface WorkGalleryProps {
  projects: Project[];
  onOpen: (project: Project) => void;
}

export default function WorkGallery({ projects, onOpen }: WorkGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLElement>(null);
  const cntRef = useRef<HTMLDivElement>(null);

  const featured = useMemo(() => pickFeatured(projects), [projects]);
  const moreCount = Math.max(0, projects.length - featured.length);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

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
        const cards = gsap.utils.toArray<HTMLElement>('.work-gallery__card', root);
        const n = cards.length;

        mm.add(`(min-width: 768px) and ${rm}`, () => {
          const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
          const tw = gsap.to(track, {
            x: () => -dist(),
            ease: 'none',
            scrollTrigger: {
              trigger: root.querySelector('.work-gallery__hs'),
              pin: true,
              scrub: tier === 'rich' ? 1 : 0.6,
              end: () => `+=${dist()}`,
              invalidateOnRefresh: true,
              anticipatePin: 1,
              onUpdate: (self) => {
                if (progRef.current) gsap.set(progRef.current, { scaleX: self.progress });
                if (cntRef.current && n > 0) {
                  const idx = Math.min(n, Math.floor(self.progress * n) + 1);
                  cntRef.current.textContent = `${padIndex(idx)} / ${padIndex(n)}`;
                }
              },
            },
          });

          cards.forEach((c) => {
            const st = { trigger: c, containerAnimation: tw, scrub: true };
            const art = c.querySelector('.work-gallery__art');
            const num = c.querySelector('.work-gallery__num');
            if (art) {
              gsap.fromTo(
                art,
                { xPercent: -8 },
                {
                  xPercent: 8,
                  ease: 'none',
                  scrollTrigger: { ...st, start: 'left right', end: 'right left' },
                }
              );
            }
            gsap.from(c, {
              scale: 0.9,
              ease: 'none',
              scrollTrigger: { ...st, start: 'left 100%', end: 'left 55%' },
            });
            if (num) {
              gsap.from(num, {
                xPercent: 60,
                ease: 'none',
                scrollTrigger: { ...st, start: 'left right', end: 'right left' },
              });
            }
          });
        });

        mm.add(`(max-width: 767px) and ${rm}`, () => {
          cards.forEach((c) => {
            const art = c.querySelector('.work-gallery__art');
            const titleSpan = c.querySelector('.work-gallery__meta h4 span');
            const meta = c.querySelector('.work-gallery__meta');

            gsap.from(c, {
              y: 48,
              opacity: 0,
              duration: 0.75,
              ease: 'power3.out',
              scrollTrigger: { trigger: c, start: 'top 88%', toggleActions: 'play none none none' },
            });

            if (art) {
              gsap.fromTo(
                art,
                { yPercent: -6 },
                {
                  yPercent: 6,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: c,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                  },
                }
              );
            }

            if (titleSpan) {
              gsap.from(titleSpan, {
                yPercent: 110,
                duration: 0.7,
                ease: 'power3.out',
                scrollTrigger: { trigger: c, start: 'top 82%' },
              });
            }

            if (meta) {
              gsap.from(meta, {
                y: 16,
                opacity: 0,
                duration: 0.6,
                delay: 0.08,
                ease: 'power2.out',
                scrollTrigger: { trigger: c, start: 'top 82%' },
              });
            }
          });
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
  }, [featured.length]);

  return (
    <div className="work-gallery" ref={rootRef}>
      <div className="work-gallery__hs">
        <div className="work-gallery__track" ref={trackRef}>
          <div className="work-gallery__head">
            <div className="work-gallery__lab">01 — Build</div>
            <div className="work-gallery__title">
              Selected
              <br />
              Work
            </div>
            <p className="work-gallery__lede">
              Emulators, anime &amp; music apps, dev tools and school software from Kerala.
            </p>
          </div>

          {featured.map((project, i) => {
            const thumb = getProjectThumbnail(project.id);
            // SVG covers already paint the project name — skip them so meta title isn’t doubled
            const artSrc = thumb && !/\.svg($|\?)/i.test(thumb) ? thumb : null;
            const status = isProjectInDevelopment(project)
              ? 'In Development'
              : project.pinned
                ? `${project.category} · Pinned`
                : project.category;
            const tags = project.tags.slice(0, 3);

            return (
              <button
                key={project.id}
                type="button"
                className="work-gallery__card"
                style={{ ['--wg-i' as string]: i, ['--wg-g' as string]: CARD_GRADIENTS[i % CARD_GRADIENTS.length] }}
                onClick={() => onOpen(project)}
              >
                <div className="work-gallery__art">
                  {artSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={artSrc} alt="" loading="lazy" decoding="async" />
                  ) : null}
                </div>
                <div className="work-gallery__num" aria-hidden="true">
                  {padIndex(i + 1)}
                </div>
                <div className="work-gallery__meta">
                  <small>{status}</small>
                  <h4>
                    <span>{project.title}</span>
                  </h4>
                  {tags.length > 0 ? (
                    <div className="work-gallery__tags">
                      {tags.map((t) => (
                        <i key={t}>{t}</i>
                      ))}
                    </div>
                  ) : null}
                  <span className="work-gallery__go">View details →</span>
                </div>
              </button>
            );
          })}

          <div className="work-gallery__head work-gallery__head--end">
            <div className="work-gallery__lab">Browse all</div>
            <div className="work-gallery__title">
              <Link href="/projects">+ {moreCount > 0 ? moreCount : projects.length} more →</Link>
            </div>
          </div>
        </div>

        <div className="work-gallery__bar" aria-hidden="true">
          <b ref={progRef} />
        </div>
        <div className="work-gallery__cnt" ref={cntRef} aria-live="polite">
          {featured.length > 0 ? `${padIndex(1)} / ${padIndex(featured.length)}` : '00 / 00'}
        </div>
      </div>
    </div>
  );
}
