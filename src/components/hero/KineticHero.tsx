'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { personal } from '@/data/personal';
import { GITHUB_HANDLE } from '@/lib/seo';
import { scrollToSection } from '@/lib/scrollNav';
import { detectDeviceTier, prefersReducedMotion } from '@/lib/deviceTier';

/**
 * Kinetic Studio hero: typographic LCP (no video, no glass).
 * Optional beat bars on canvas for tier >= 2 only.
 */
export default function KineticHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (prefersReducedMotion() || detectDeviceTier() < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let running = true;
    const bars = 24;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      if (!running) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const gap = w / bars;
      for (let i = 0; i < bars; i++) {
        const phase = t / 400 + i * 0.35;
        const amp = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(phase));
        const bh = h * 0.12 * amp;
        const x = gap * i + gap * 0.25;
        ctx.fillStyle = `rgba(201, 149, 58, ${0.08 + amp * 0.18})`;
        ctx.fillRect(x, h - bh - 24, gap * 0.45, bh);
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running) raf = requestAnimationFrame(draw);
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    const el = nameRef.current;
    if (!el || prefersReducedMotion()) return;
    const letters = el.querySelectorAll<HTMLElement>('.kinetic-letter');
    letters.forEach((node, i) => {
      node.style.animationDelay = `${80 + i * 55}ms`;
      node.classList.add('is-in');
    });
  }, []);

  const letters = personal.name.split('').map((ch, i) => (
    <span key={`${ch}-${i}`} className="kinetic-letter" aria-hidden="true">
      {ch}
    </span>
  ));

  return (
    <section id="home" className="kinetic-hero" aria-label="Introduction">
      <canvas ref={canvasRef} className="kinetic-hero-canvas" aria-hidden="true" />
      <div className="kinetic-hero-grid" aria-hidden="true" />

      <div className="page-container kinetic-hero-inner">
        <p className="kinetic-hero-kicker">
          {personal.name.toUpperCase()} · {GITHUB_HANDLE.toUpperCase()} · KERALA · {personal.age}
        </p>

        <h1 className="kinetic-hero-title">
          <span className="kinetic-hero-name" ref={nameRef}>
            <span className="sr-only">{personal.name}</span>
            {letters}
          </span>
          <span className="kinetic-hero-ml font-malayalam" lang="ml">
            {personal.malayalamName}
          </span>
        </h1>

        <p className="kinetic-hero-tag">{personal.tagline}</p>
        <p className="kinetic-hero-quote">{personal.pullQuote}</p>

        <div className="kinetic-hero-cta">
          <button
            type="button"
            className="kinetic-btn kinetic-btn--primary"
            onClick={() => void scrollToSection('#projects')}
          >
            View work
          </button>
          <button
            type="button"
            className="kinetic-btn kinetic-btn--ghost"
            onClick={() => void scrollToSection('#contact')}
          >
            Contact
          </button>
          <Link className="kinetic-btn kinetic-btn--ghost" href="/resume/view">
            Resume
          </Link>
        </div>
      </div>

      <button
        type="button"
        className="kinetic-hero-scroll"
        aria-label="Scroll to about"
        onClick={() => void scrollToSection('#about')}
      >
        <span aria-hidden="true">↓</span>
      </button>
    </section>
  );
}
