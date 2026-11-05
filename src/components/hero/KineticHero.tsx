'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { personal } from '@/data/personal';
import { GITHUB_HANDLE } from '@/lib/seo';
import { scrollToSection } from '@/lib/scrollNav';
import { detectDeviceTier, prefersReducedMotion } from '@/lib/deviceTier';

/**
 * Kinetic Studio hero v3 — text LCP, then a bright art-directed canvas
 * (Kerala monsoon ridge + beat waveforms + cursor parallax).
 * Composition: scene dominates right/top; type is left-rail editorial.
 */
export default function KineticHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const [sceneOn, setSceneOn] = useState(false);
  const [tc, setTc] = useState('00:00:00:00');
  const ptr = useRef({ x: 0.65, y: 0.35 });

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
    if (!ready || prefersReducedMotion() || detectDeviceTier() < 2) return;
    let cancelled = false;
    const boot = () => { if (!cancelled) setSceneOn(true); };
    const schedule: (cb: () => void) => number =
      typeof window !== 'undefined' && 'requestIdleCallback' in window
        ? (cb) => window.requestIdleCallback(cb, { timeout: 1800 }) as unknown as number
        : (cb) => globalThis.setTimeout(cb, 600) as unknown as number;
    const handle = schedule(boot);
    return () => {
      cancelled = true;
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) window.cancelIdleCallback(handle);
      else globalThis.clearTimeout(handle);
    };
  }, [ready]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || prefersReducedMotion()) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ptr.current = {
        x: (e.clientX - r.left) / Math.max(1, r.width),
        y: (e.clientY - r.top) / Math.max(1, r.height),
      };
    };
    el.addEventListener('pointermove', onMove, { passive: true });
    return () => el.removeEventListener('pointermove', onMove);
  }, []);

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
    const particles: { x: number; y: number; vx: number; vy: number; hue: number; r: number }[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles.length = 0;
      const N = Math.min(220, Math.floor((w * h) / 9000));
      for (let i = 0; i < N; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.3,
          hue: Math.random() > 0.55 ? 38 : 200,
          r: 0.6 + Math.random() * 1.8,
        });
      }
    };

    const beat = (t: number) => {
      const bpm = 98;
      const phase = ((t / 1000) * bpm) / 60;
      const kick = Math.pow(Math.max(0, Math.sin(phase * Math.PI * 2)), 10);
      const hat = Math.pow(Math.max(0, Math.sin(phase * Math.PI * 8)), 3) * 0.4;
      return 0.4 + kick * 0.7 + hat;
    };

    const hillY = (x: number, t: number, parallax: number) => {
      const nx = x / w;
      return (
        h * (0.52 + parallax * 0.04) +
        Math.sin(nx * 2.6 + t * 0.0002) * h * 0.07 +
        Math.sin(nx * 6.2 - t * 0.00028) * h * 0.045 +
        Math.sin(nx * 13 + t * 0.0005) * h * 0.02
      );
    };

    const draw = (t: number) => {
      if (!running) return;
      const amp = beat(t);
      const px = ptr.current.x;
      const py = ptr.current.y;
      ctx.clearRect(0, 0, w, h);

      // Deep Kerala dusk wash — brighter, art-directed
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#0b1018');
      sky.addColorStop(0.45, '#0a0e14');
      sky.addColorStop(1, '#050608');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      const glowX = w * (0.55 + px * 0.25);
      const glowY = h * (0.18 + py * 0.12);
      const g = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, w * 0.55);
      g.addColorStop(0, `rgba(201,149,58,${0.28 + amp * 0.18})`);
      g.addColorStop(0.35, `rgba(120,90,40,${0.12 + amp * 0.08})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Back ridge (parallax)
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 5) ctx.lineTo(x, hillY(x, t, 0.6) - h * 0.06);
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = 'rgba(18,28,42,0.85)';
      ctx.fill();

      // Front ridge
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 4) ctx.lineTo(x, hillY(x, t, 0));
      ctx.lineTo(w, h);
      ctx.closePath();
      const hg = ctx.createLinearGradient(0, h * 0.4, 0, h);
      hg.addColorStop(0, 'rgba(12,20,32,0.2)');
      hg.addColorStop(0.4, 'rgba(8,12,18,0.75)');
      hg.addColorStop(1, '#050608');
      ctx.fillStyle = hg;
      ctx.fill();

      ctx.beginPath();
      for (let x = 0; x <= w; x += 3) {
        const y = hillY(x, t, 0);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(201,149,58,${0.45 + amp * 0.35})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Bright multi-ribbon waveforms (music/AMV) — clearly visible
      for (let ribbon = 0; ribbon < 4; ribbon++) {
        ctx.beginPath();
        const base = h * (0.28 + ribbon * 0.055) + (py - 0.5) * 18;
        for (let x = 0; x <= w; x += 2) {
          const nx = x / w;
          const wave =
            Math.sin(nx * Math.PI * (3.5 + ribbon) + t * 0.0022 + ribbon + px) * (36 + amp * 28) +
            Math.sin(nx * Math.PI * 10 - t * 0.003 + px * 2) * (12 + amp * 10) +
            Math.sin(nx * Math.PI * 1.5 + t * 0.0008) * 14;
          const y = base + wave;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle =
          ribbon % 2 === 0
            ? `rgba(201,149,58,${0.35 + amp * 0.35})`
            : `rgba(230,220,200,${0.18 + amp * 0.22})`;
        ctx.lineWidth = 1.4 + ribbon * 0.25;
        ctx.stroke();
      }

      // Monsoon streaks
      ctx.strokeStyle = `rgba(190,210,230,${0.12 + amp * 0.12})`;
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 42; i++) {
        const x = ((t * 0.18 + i * 53 + px * 40) % (w + 50)) - 25;
        const y0 = ((t * 0.7 + i * 89) % (h + 80)) - 40;
        ctx.beginPath();
        ctx.moveTo(x, y0);
        ctx.lineTo(x - 6, y0 + 22 + amp * 14);
        ctx.stroke();
      }

      for (const p of particles) {
        const local = beat(t + p.x);
        p.x += p.vx + (px - 0.5) * 0.35 + Math.sin(t * 0.001 + p.y) * 0.12 * local;
        p.y += p.vy + Math.cos(t * 0.0011 + p.x) * 0.1;
        if (p.x < -12) p.x = w + 12;
        if (p.x > w + 12) p.x = -12;
        if (p.y < -12) p.y = h + 12;
        if (p.y > h + 12) p.y = -12;
        ctx.fillStyle =
          p.hue === 38
            ? `rgba(201,149,58,${0.35 + local * 0.5})`
            : `rgba(170,200,230,${0.2 + local * 0.3})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (0.8 + local * 0.9), 0, Math.PI * 2);
        ctx.fill();
      }

      // Beat flash line
      if (amp > 0.95) {
        ctx.fillStyle = `rgba(201,149,58,${(amp - 0.95) * 0.35})`;
        ctx.fillRect(0, 0, w, h);
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    const onResize = () => resize();
    window.addEventListener('resize', onResize, { passive: true });
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      if (running) raf = requestAnimationFrame(draw);
      else cancelAnimationFrame(raf);
    }, { threshold: 0.05 });
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
    <section
      id="home"
      ref={wrapRef}
      className={`kinetic-hero kinetic-hero--v3${ready ? ' is-ready' : ''}${sceneOn ? ' has-scene' : ''}`}
      aria-label="Introduction"
    >
      <div className="kinetic-hero-stage" aria-hidden="true">
        <canvas ref={canvasRef} className={`kinetic-hero-canvas${sceneOn ? ' is-live' : ''}`} />
        <div className="kinetic-hero-vignette" />
      </div>

      <div className="kinetic-hero-frame-bl" aria-hidden="true" />
      <div className="kinetic-hero-frame-br" aria-hidden="true" />
      <div className="kinetic-hero-timecode" aria-hidden="true">{tc}</div>

      <div className="page-container kinetic-hero-inner">
        <div className="kinetic-hero-copy">
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

          <div className="kinetic-hero-cta">
            <button
              type="button"
              className="kinetic-frame-btn kinetic-frame-btn--primary"
              onClick={() => void scrollToSection('#projects')}
            >
              <span className="kinetic-frame-btn__label">View work</span>
              <span className="kinetic-frame-btn__hint" aria-hidden="true">02</span>
            </button>
            <button
              type="button"
              className="kinetic-frame-btn"
              onClick={() => void scrollToSection('#contact')}
            >
              <span className="kinetic-frame-btn__label">Contact</span>
              <span className="kinetic-frame-btn__hint" aria-hidden="true">→</span>
            </button>
            <Link className="kinetic-frame-btn" href="/resume/view">
              <span className="kinetic-frame-btn__label">Resume</span>
              <span className="kinetic-frame-btn__hint" aria-hidden="true">PDF</span>
            </Link>
          </div>
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
