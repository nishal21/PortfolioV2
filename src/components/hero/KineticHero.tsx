'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { personal } from '@/data/personal';
import { GITHUB_HANDLE } from '@/lib/seo';
import { scrollToSection } from '@/lib/scrollNav';
import { detectDeviceTier, prefersReducedMotion } from '@/lib/deviceTier';

/**
 * Kinetic Studio hero — text LCP first, deferred particle/waveform field.
 * Craft: Alim mono index + frame discipline; Dave calm editorial pacing.
 * Identity: Kerala ridge dusk, AMV film timecode, music beat ribbons.
 */
export default function KineticHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [sceneOn, setSceneOn] = useState(false);
  const [tc, setTc] = useState('00:00:00:00');

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let raf = 0;
    const start = performance.now();
    const pad = (n: number) => String(n).padStart(2, '0');
    const tick = (now: number) => {
      const totalFrames = Math.floor((now - start) / (1000 / 24));
      const frames = totalFrames % 24;
      const secsTotal = Math.floor(totalFrames / 24);
      const s = secsTotal % 60;
      const m = Math.floor(secsTotal / 60) % 60;
      const h = Math.floor(secsTotal / 3600);
      setTc(`${pad(h)}:${pad(m)}:${pad(s)}:${pad(frames)}`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (prefersReducedMotion()) return;
    if (detectDeviceTier() < 2) return;

    let cancelled = false;
    const boot = () => {
      if (!cancelled) setSceneOn(true);
    };
    const schedule: (cb: () => void) => number =
      typeof window !== 'undefined' && 'requestIdleCallback' in window
        ? (cb) => window.requestIdleCallback(cb, { timeout: 1200 }) as unknown as number
        : (cb) => globalThis.setTimeout(cb, 280) as unknown as number;
    const handle = schedule(boot);
    return () => {
      cancelled = true;
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(handle);
      } else {
        globalThis.clearTimeout(handle);
      }
    };
  }, [ready]);

  useEffect(() => {
    if (!sceneOn) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;
    const particles: { x: number; y: number; vx: number; vy: number; hue: number }[] = [];
    const N = Math.min(160, Math.floor((window.innerWidth * window.innerHeight) / 14000));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      particles.length = 0;
      for (let i = 0; i < N; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.25,
          hue: Math.random() > 0.7 ? 38 : 210,
        });
      }
    };

    const beat = (t: number) => {
      const bpm = 96;
      const phase = ((t / 1000) * bpm) / 60;
      const kick = Math.pow(Math.max(0, Math.sin(phase * Math.PI * 2)), 8);
      const hat = Math.pow(Math.max(0, Math.sin(phase * Math.PI * 8)), 4) * 0.35;
      return 0.35 + kick * 0.65 + hat;
    };

    const hillY = (x: number, t: number) => {
      const nx = x / w;
      return (
        h * 0.62 +
        Math.sin(nx * 3.1 + t * 0.00015) * h * 0.04 +
        Math.sin(nx * 7.4 - t * 0.00022) * h * 0.025 +
        Math.sin(nx * 14.0 + t * 0.0004) * h * 0.012
      );
    };

    const draw = (t: number) => {
      if (!running) return;
      const amp = beat(t);
      ctx.clearRect(0, 0, w, h);

      const g = ctx.createRadialGradient(w * 0.72, h * 0.18, 0, w * 0.55, h * 0.4, w * 0.7);
      g.addColorStop(0, `rgba(201,149,58,${0.1 + amp * 0.06})`);
      g.addColorStop(0.45, 'rgba(40,55,75,0.1)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 6) ctx.lineTo(x, hillY(x, t));
      ctx.lineTo(w, h);
      ctx.closePath();
      const hg = ctx.createLinearGradient(0, h * 0.5, 0, h);
      hg.addColorStop(0, 'rgba(12,18,28,0)');
      hg.addColorStop(0.35, 'rgba(10,14,20,0.55)');
      hg.addColorStop(1, 'rgba(5,6,8,0.92)');
      ctx.fillStyle = hg;
      ctx.fill();

      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const y = hillY(x, t);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(201,149,58,${0.18 + amp * 0.2})`;
      ctx.lineWidth = 1.25;
      ctx.stroke();

      // Monsoon streaks (Kerala)
      ctx.strokeStyle = `rgba(180,200,220,${0.08 + amp * 0.1})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < 28; i++) {
        const x = ((t * 0.12 + i * 47) % (w + 40)) - 20;
        const y0 = ((t * 0.55 + i * 73) % (h + 60)) - 30;
        ctx.beginPath();
        ctx.moveTo(x, y0);
        ctx.lineTo(x - 4, y0 + 18 + amp * 10);
        ctx.stroke();
      }
      for (let ribbon = 0; ribbon < 3; ribbon++) {
        ctx.beginPath();
        const base = h * (0.38 + ribbon * 0.07);
        for (let x = 0; x <= w; x += 3) {
          const nx = x / w;
          const wave =
            Math.sin(nx * Math.PI * (4 + ribbon) + t * 0.0018 + ribbon) * 28 * amp +
            Math.sin(nx * Math.PI * 11 - t * 0.0024) * 10 * amp +
            Math.sin(nx * Math.PI * 2 + t * 0.0007) * 18;
          const y = base + wave;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle =
          ribbon === 1
            ? `rgba(242,240,235,${0.12 + amp * 0.15})`
            : `rgba(201,149,58,${0.16 + amp * 0.22 - ribbon * 0.04})`;
        ctx.lineWidth = 1.1 + ribbon * 0.35;
        ctx.stroke();
      }

      for (const p of particles) {
        const localAmp = beat(t + p.x * 2);
        p.x += p.vx + Math.sin(t * 0.001 + p.y * 0.01) * 0.15 * localAmp;
        p.y += p.vy + Math.cos(t * 0.0012 + p.x * 0.008) * 0.12;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
        const r = 0.8 + localAmp * 1.6 * (p.hue === 38 ? 1.2 : 0.7);
        ctx.fillStyle =
          p.hue === 38
            ? `rgba(201,149,58,${0.25 + localAmp * 0.45})`
            : `rgba(160,190,220,${0.12 + localAmp * 0.25})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = 'rgba(255,255,255,0.045)';
      ctx.lineWidth = 1;
      for (let i = 1; i < 8; i++) {
        const x = (w / 8) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    seed();
    raf = requestAnimationFrame(draw);
    const onResize = () => {
      resize();
      seed();
    };
    window.addEventListener('resize', onResize, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running) raf = requestAnimationFrame(draw);
        else cancelAnimationFrame(raf);
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      io.disconnect();
    };
  }, [sceneOn]);

  const letters = personal.name.split('');

  return (
    <section id="home" className={`kinetic-hero${ready ? ' is-ready' : ''}`} aria-label="Introduction">
      <div className="kinetic-hero-frame-bl" aria-hidden="true" />
      <div className="kinetic-hero-frame-br" aria-hidden="true" />
      <div className="kinetic-hero-timecode" aria-hidden="true">
        {tc}
      </div>

      <div className="kinetic-hero-stage" aria-hidden="true">
        <canvas ref={canvasRef} className={`kinetic-hero-canvas${sceneOn ? ' is-live' : ''}`} />
        <div className="kinetic-hero-vignette" />
        <div className="kinetic-hero-scan" />
      </div>

      <div className="page-container kinetic-hero-inner">
        <div className="kinetic-hero-meta">
          <span className="kinetic-hero-index">01 / INTRO</span>
          <span className="kinetic-hero-loc">
            {personal.location.split(',')[0].toUpperCase()} · {GITHUB_HANDLE.toUpperCase()}
          </span>
        </div>

        <h1 className="kinetic-hero-title">
          <span className="sr-only">{personal.name}</span>
          <span className="kinetic-hero-name" aria-hidden="true">
            {letters.map((ch, i) => (
              <span key={`${ch}-${i}`} className="kinetic-glyph" style={{ ['--i' as string]: i }}>
                {ch}
              </span>
            ))}
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
            className="kinetic-frame-btn kinetic-frame-btn--primary"
            onClick={() => void scrollToSection('#projects')}
          >
            <span className="kinetic-frame-btn__label">View work</span>
            <span className="kinetic-frame-btn__hint" aria-hidden="true">
              02
            </span>
          </button>
          <button
            type="button"
            className="kinetic-frame-btn"
            onClick={() => void scrollToSection('#contact')}
          >
            <span className="kinetic-frame-btn__label">Contact</span>
            <span className="kinetic-frame-btn__hint" aria-hidden="true">
              →
            </span>
          </button>
          <Link className="kinetic-frame-btn" href="/resume/view">
            <span className="kinetic-frame-btn__label">Resume</span>
            <span className="kinetic-frame-btn__hint" aria-hidden="true">
              PDF
            </span>
          </Link>
        </div>
      </div>

      <button
        type="button"
        className="kinetic-hero-scroll"
        aria-label="Scroll to about"
        onClick={() => void scrollToSection('#about')}
      >
        <span className="kinetic-hero-scroll__line" aria-hidden="true" />
        <span>Scroll</span>
      </button>
    </section>
  );
}
