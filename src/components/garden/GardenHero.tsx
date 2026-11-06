'use client';

import { useEffect, useRef } from 'react';
import { ArrowDownRight } from 'lucide-react';
import { personal } from '@/data/personal';
import { CREATOR_NAME, GITHUB_HANDLE } from '@/lib/seo';
import { scrollToSection } from '@/lib/scrollNav';
import { gardenMotionTier, loadGsapScroll } from '@/lib/gardenMotion';
import './garden.css';

const WORD = 'nishal';
/** Portrait screens get the tall plate; everything else the wide one. */
const PORTRAIT = '(max-aspect-ratio: 4/5)';

function GardenPlate({ layer }: { layer: 'bg' | 'fg' }) {
  const fg = layer === 'fg';
  const wide = fg
    ? '/garden/hero-garden-fg-640.webp 640w, /garden/hero-garden-fg-960.webp 960w, /garden/hero-garden-fg-1280.webp 1280w'
    : '/garden/hero-garden-640.webp 640w, /garden/hero-garden-960.webp 960w, /garden/hero-garden-1280.webp 1280w';
  const tall = fg
    ? '/garden/hero-garden-m-fg-480.webp 480w, /garden/hero-garden-m-fg-720.webp 720w'
    : '/garden/hero-garden-m-480.webp 480w, /garden/hero-garden-m-720.webp 720w';

  return (
    <picture className={`garden-hero__plate garden-hero__plate--${layer}`} data-garden-plate="">
      <source media={PORTRAIT} srcSet={tall} sizes="100vw" />
      <img
        src={fg ? '/garden/hero-garden-fg-1280.webp' : '/garden/hero-garden-1280.webp'}
        srcSet={wide}
        sizes="100vw"
        width={1280}
        height={720}
        alt=""
        aria-hidden="true"
        decoding="async"
        fetchPriority={fg ? 'auto' : 'high'}
        loading="eager"
      />
    </picture>
  );
}

export default function GardenHero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const tier = gardenMotionTier();
    if (tier === 'none') return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const start = async () => {
      const { gsap } = await loadGsapScroll();
      if (cancelled) return;

      const ctx = gsap.context(() => {
        const plates = gsap.utils.toArray<HTMLElement>('[data-garden-plate]', root);
        const title = root.querySelector<HTMLElement>('[data-garden-title]');
        const chrome = gsap.utils.toArray<HTMLElement>('[data-garden-chrome]', root);

        // The name sinks into the foliage as you leave; both plates move as one
        // so the foreground cut never drifts off the background.
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: tier === 'rich' ? 0.6 : true },
        });
        // Explicit start values: the CSS entrance may still be mid-flight when this boots.
        tl.fromTo(
          plates,
          { yPercent: 0, scale: 1, transformOrigin: '50% 100%' },
          { yPercent: 10, scale: 1.04, duration: 1 },
          0
        )
          .fromTo(title, { yPercent: 0 }, { yPercent: 34, duration: 1 }, 0)
          .fromTo(chrome, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -24, duration: 0.3 }, 0);

        if (tier === 'rich' && window.matchMedia('(hover: hover) and (pointer: fine)').matches && title) {
          const tx = gsap.quickTo(title, 'x', { duration: 1.1, ease: 'power3.out' });
          const px = gsap.quickTo(plates, 'x', { duration: 1.4, ease: 'power3.out' });
          const onMove = (e: PointerEvent) => {
            const n = e.clientX / window.innerWidth - 0.5;
            tx(n * 18);
            px(n * -10);
          };
          root.addEventListener('pointermove', onMove, { passive: true });
          return () => root.removeEventListener('pointermove', onMove);
        }
      }, root);

      cleanup = () => ctx.revert();
    };

    // Never compete with first paint.
    const idle =
      typeof requestIdleCallback !== 'undefined'
        ? requestIdleCallback(() => void start(), { timeout: 1200 })
        : window.setTimeout(() => void start(), 300);

    return () => {
      cancelled = true;
      if (typeof cancelIdleCallback !== 'undefined' && typeof idle === 'number') cancelIdleCallback(idle);
      window.clearTimeout(idle as number);
      cleanup?.();
    };
  }, []);

  const region = personal.location.split(',')[1]?.trim() ?? 'Kerala';

  return (
    <section id="home" ref={rootRef} className="garden-hero" aria-labelledby="hero-title">
      <GardenPlate layer="bg" />

      <p className="garden-hero__eyebrow" data-garden-chrome="">
        AMV <span aria-hidden="true">·</span> music <span aria-hidden="true">·</span> code
      </p>

      <h1 id="hero-title" className="garden-hero__title" data-garden-title="">
        <span className="sr-only">{personal.name}</span>
        <span className="garden-hero__word" aria-hidden="true">
          {WORD.split('').map((ch, i) => (
            <span key={i} className="garden-hero__letter" style={{ '--i': i } as React.CSSProperties}>
              {ch}
            </span>
          ))}
        </span>
      </h1>

      <GardenPlate layer="fg" />

      <div className="garden-hero__bar" data-garden-chrome="">
        <div className="garden-hero__meta">
          <p className="garden-hero__id seo-speakable">
            {CREATOR_NAME} · {GITHUB_HANDLE} · {region} · {personal.age}{' '}
            <span className="font-malayalam" lang="ml">
              {personal.malayalamName}
            </span>
          </p>
          <p className="garden-hero__tagline seo-speakable">{personal.tagline}</p>
        </div>
        <nav className="garden-hero__links" aria-label="Jump to">
          <a
            href="#projects"
            className="hit-target garden-hero__link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#projects');
            }}
          >
            Selected work <ArrowDownRight className="h-4 w-4" aria-hidden />
          </a>
          <a
            href="#about"
            className="hit-target garden-hero__link garden-hero__link--quiet"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#about');
            }}
          >
            About
          </a>
        </nav>
      </div>
    </section>
  );
}
