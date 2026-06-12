'use client';

import { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import HeroVideo from './HeroVideo';
import HeroGlassTitle from './HeroGlassTitle';
import HeroSkeleton from './HeroSkeleton';
import { useHero } from './HeroContext';
import { personal } from '@/data/personal';
import { CREATOR_NAME, GITHUB_HANDLE } from '@/lib/seo';
import { HERO_VIDEO_CREDIT_URL } from '@/lib/heroMedia';
import { HERO_RESUME_EVENT, scrollToSection, snapHeroTextVisible } from '@/lib/scrollNav';
import { useMounted } from '@/lib/useMounted';

export default function ScrollIntroSection() {
  const { ready, heroInView, heroPaused, setHeroReady, emitProgress, subscribeProgress } = useHero();
  const mounted = useMounted();
  const copyRef = useRef<HTMLDivElement>(null);
  const scrubRef = useRef<HTMLDivElement>(null);
  const fadeRaf = useRef(0);

  useEffect(() => {
    return subscribeProgress((value) => {
      if (scrubRef.current) scrubRef.current.style.width = `${value * 100}%`;
    });
  }, [subscribeProgress]);

  useEffect(() => {
    const copy = copyRef.current;
    if (!copy) return;

    const updateFade = () => {
      fadeRaf.current = 0;
      const heroHeight = window.innerHeight;

      if (window.scrollY < heroHeight * 0.18) {
        copy.style.setProperty('--hero-fade', '1');
        return;
      }

      const fade = Math.min(1, window.scrollY / (heroHeight * 0.6));
      const opacity = Math.max(0, 1 - fade * 1.4);
      copy.style.setProperty('--hero-fade', String(opacity));
    };

    const onScroll = () => {
      if (fadeRaf.current) return;
      fadeRaf.current = requestAnimationFrame(updateFade);
    };

    updateFade();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (fadeRaf.current) cancelAnimationFrame(fadeRaf.current);
    };
  }, []);

  useEffect(() => {
    if (!heroInView) return;
    snapHeroTextVisible();
  }, [heroInView]);

  useEffect(() => {
    const onResume = () => snapHeroTextVisible();
    window.addEventListener(HERO_RESUME_EVENT, onResume);
    return () => window.removeEventListener(HERO_RESUME_EVENT, onResume);
  }, []);

  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full flex-col justify-end overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        {!ready && <div className="hero-sequence-backdrop" aria-hidden="true" />}
        <HeroVideo
          className="h-full w-full"
          paused={heroPaused || !heroInView}
          onReady={setHeroReady}
          onProgress={emitProgress}
        />
        <div className="hero-vignette" />
      </div>

      {!ready && <HeroSkeleton />}

      <div
        ref={copyRef}
        className={`hero-copy page-container relative z-10${mounted && ready ? ' hero-copy--in' : ''}`}
        style={{
          opacity: ready ? 1 : 0,
          pointerEvents: ready ? undefined : 'none',
          transition: 'opacity 0.5s ease',
          ['--hero-fade' as string]: 1,
        }}
      >
        <p className="hero-eyebrow hero-fade-item seo-speakable">
          {CREATOR_NAME} · {GITHUB_HANDLE} · {personal.location.split(',')[1]?.trim() ?? 'Kerala'} · {personal.age}
        </p>

        <div className="hero-headline">
          {mounted ? (
            <HeroGlassTitle>{personal.name}</HeroGlassTitle>
          ) : (
            <h1 className="hero-title font-display">{personal.name}</h1>
          )}
          <p className="hero-malayalam hero-fade-item font-malayalam">{personal.malayalamName}</p>
        </div>

        <p className="hero-tagline hero-fade-item seo-speakable">{personal.tagline}</p>

        <div className="hero-links hero-fade-item">
          <button type="button" onClick={() => scrollToSection('#projects')} className="cursor-hover hero-link">
            Projects
          </button>
          <button type="button" onClick={() => scrollToSection('#about')} className="cursor-hover hero-link">
            About
          </button>
        </div>
      </div>

      {ready && heroInView ? (
        <div className="hero-scrub relative z-10" aria-hidden>
          <div ref={scrubRef} className="hero-scrub-fill" />
        </div>
      ) : null}

      {mounted && ready && heroInView ? (
        <div className="hero-scroll-hint hero-fade-item absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
          <ArrowDown className="h-4 w-4 text-white/50" />
        </div>
      ) : null}

      {ready && heroInView ? (
        <a
          href={HERO_VIDEO_CREDIT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hero-video-credit hero-fade-item"
        >
          Video · Pinterest
        </a>
      ) : null}

      <div className="hero-curtain" aria-hidden="true" />
    </section>
  );
}
