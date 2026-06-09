'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { drawCoverImage } from '@/lib/canvasImage';
import { HERO_PAUSE_EVENT, HERO_RESUME_EVENT } from '@/lib/scrollNav';
import { canvasDpr, playbackFps, prefersReducedMotion } from '@/lib/performance';

export interface ScrollManifest {
  frameCount: number;
  fps: number;
  width: number;
  height: number;
  prefix: string;
  padding: number;
  extension: string;
  scrollDistancePerFrame: number;
}

type CanvasMode = 'live' | 'static';

interface RegisteredCanvas {
  canvas: HTMLCanvasElement;
  mode: CanvasMode;
}

type ProgressListener = (value: number) => void;

interface ScrollSequenceContextValue {
  manifest: ScrollManifest | null;
  ready: boolean;
  heroInView: boolean;
  progress: number;
  setProgress: (value: number) => void;
  subscribeProgress: (listener: ProgressListener) => () => void;
  registerCanvas: (canvas: HTMLCanvasElement, mode?: CanvasMode) => () => void;
}

const ScrollSequenceContext = createContext<ScrollSequenceContextValue | null>(null);

const LOAD_CONCURRENCY = 5;

function framePath(manifest: ScrollManifest, index: number): string {
  return `${manifest.prefix}${String(index + 1).padStart(manifest.padding, '0')}.${manifest.extension}`;
}

export function ScrollSequenceProvider({ children }: { children: ReactNode }) {
  const [manifest, setManifest] = useState<ScrollManifest | null>(null);
  const [ready, setReady] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const [progress, setProgressState] = useState(0);
  const canvasesRef = useRef<Map<HTMLCanvasElement, RegisteredCanvas>>(new Map());
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef(-1);
  const loadingRef = useRef(false);
  const autoplayFrameRef = useRef(0);
  const heroActiveRef = useRef(true);
  const progressRef = useRef(0);
  const progressListenersRef = useRef(new Set<ProgressListener>());
  const canvasSizeRef = useRef({ w: 0, h: 0 });

  const emitProgress = useCallback((value: number) => {
    progressRef.current = value;
    progressListenersRef.current.forEach((listener) => listener(value));
  }, []);

  const subscribeProgress = useCallback((listener: ProgressListener) => {
    progressListenersRef.current.add(listener);
    listener(progressRef.current);
    return () => {
      progressListenersRef.current.delete(listener);
    };
  }, []);

  const paintCanvas = useCallback((canvas: HTMLCanvasElement, img: HTMLImageElement) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = canvasDpr();

    if (canvasSizeRef.current.w !== w || canvasSizeRef.current.h !== h) {
      canvasSizeRef.current = { w, h };
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawCoverImage(ctx, img, w, h, img.naturalWidth, img.naturalHeight);
  }, []);

  const drawFrame = useCallback(
    (index: number, force = false) => {
      const m = manifest;
      if (!m) return;

      const clamped = Math.max(0, Math.min(m.frameCount - 1, index));
      if (!force && clamped === currentFrameRef.current) return;

      const img = framesRef.current[clamped];
      if (!img?.complete || !img.naturalWidth) return;

      currentFrameRef.current = clamped;
      autoplayFrameRef.current = clamped;

      canvasesRef.current.forEach(({ canvas, mode }) => {
        if (mode === 'static' && canvas.dataset.painted === '1') return;
        paintCanvas(canvas, img);
        if (mode === 'static') canvas.dataset.painted = '1';
      });
    },
    [manifest, paintCanvas]
  );

  const resizeCanvases = useCallback(() => {
    canvasSizeRef.current = { w: 0, h: 0 };
    canvasesRef.current.forEach(({ canvas }) => {
      delete canvas.dataset.painted;
    });
    if (currentFrameRef.current >= 0) drawFrame(currentFrameRef.current, true);
    else drawFrame(0, true);
  }, [drawFrame]);

  const setProgress = useCallback(
    (value: number) => {
      const m = manifest;
      if (!m) return;
      const clamped = Math.max(0, Math.min(1, value));
      setProgressState(clamped);
      emitProgress(clamped);
      drawFrame(Math.round(clamped * (m.frameCount - 1)));
    },
    [drawFrame, emitProgress, manifest]
  );

  const registerCanvas = useCallback(
    (canvas: HTMLCanvasElement, mode: CanvasMode = 'live') => {
      canvasesRef.current.set(canvas, { canvas, mode });
      delete canvas.dataset.painted;

      if (currentFrameRef.current >= 0) {
        const img = framesRef.current[currentFrameRef.current];
        if (img?.complete && img.naturalWidth) paintCanvas(canvas, img);
        if (mode === 'static') canvas.dataset.painted = '1';
      } else {
        drawFrame(0);
      }

      return () => {
        canvasesRef.current.delete(canvas);
        delete canvas.dataset.painted;
      };
    },
    [drawFrame, paintCanvas]
  );

  const pauseAutoplay = useCallback(() => {
    heroActiveRef.current = false;
  }, []);

  const resumeAutoplay = useCallback(() => {
    heroActiveRef.current = true;
    if (currentFrameRef.current >= 0) {
      drawFrame(currentFrameRef.current, true);
    }
  }, [drawFrame]);

  useEffect(() => {
    fetch('/scroll/manifest.json')
      .then((r) => r.json())
      .then((data: ScrollManifest) => setManifest(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!manifest || loadingRef.current) return;
    loadingRef.current = true;
    framesRef.current = new Array(manifest.frameCount).fill(null);

    const loadOne = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.src = framePath(manifest, i);
        img.onload = async () => {
          try {
            await img.decode();
          } catch {
            /* decode optional */
          }
          framesRef.current[i] = img;
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to load scroll frame ${i + 1}`);
          resolve();
        };
        framesRef.current[i] = img;
      });

    const run = async () => {
      await loadOne(0);
      setReady(true);
      drawFrame(0, true);
      emitProgress(0);

      const rest = Array.from({ length: manifest.frameCount - 1 }, (_, k) => k + 1);
      for (let i = 0; i < rest.length; i += LOAD_CONCURRENCY) {
        const batch = rest.slice(i, i + LOAD_CONCURRENCY);
        await Promise.all(batch.map(loadOne));
        if (typeof requestIdleCallback !== 'undefined') {
          await new Promise<void>((r) => requestIdleCallback(() => r()));
        }
      }
    };

    void run();
  }, [manifest, drawFrame, emitProgress]);

  useEffect(() => {
    const hero = document.getElementById('home');
    if (!hero) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting && entry.intersectionRatio > 0.08;
        setHeroInView(inView);
        if (inView) {
          heroActiveRef.current = true;
          if (currentFrameRef.current >= 0) {
            drawFrame(currentFrameRef.current, true);
          }
        } else {
          heroActiveRef.current = false;
        }
      },
      { threshold: [0, 0.08, 0.15] }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [drawFrame]);

  useEffect(() => {
    const onPause = () => pauseAutoplay();
    const onResume = () => resumeAutoplay();
    window.addEventListener(HERO_PAUSE_EVENT, onPause);
    window.addEventListener(HERO_RESUME_EVENT, onResume);
    return () => {
      window.removeEventListener(HERO_PAUSE_EVENT, onPause);
      window.removeEventListener(HERO_RESUME_EVENT, onResume);
    };
  }, [pauseAutoplay, resumeAutoplay]);

  useEffect(() => {
    if (!manifest || !ready) return;

    const fps = playbackFps(manifest.fps);
    if (fps <= 0 || prefersReducedMotion()) return;

    let raf = 0;
    let lastTime = performance.now();
    const msPerFrame = 1000 / fps;

    const findNextLoadedFrame = (from: number) => {
      for (let step = 1; step <= manifest.frameCount; step += 1) {
        const idx = (from + step) % manifest.frameCount;
        const img = framesRef.current[idx];
        if (img?.complete && img.naturalWidth) return idx;
      }
      return from;
    };

    const tick = (now: number) => {
      if (!document.hidden && heroActiveRef.current) {
        const elapsed = now - lastTime;
        if (elapsed >= msPerFrame) {
          lastTime = now - (elapsed % msPerFrame);
          const next = findNextLoadedFrame(autoplayFrameRef.current);
          drawFrame(next);
          const p = next / (manifest.frameCount - 1);
          emitProgress(p);
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (!document.hidden) lastTime = performance.now();
    };

    raf = requestAnimationFrame(tick);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [manifest, ready, drawFrame, emitProgress]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (!heroActiveRef.current) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(resizeCanvases, 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, [resizeCanvases]);

  return (
    <ScrollSequenceContext.Provider
      value={{
        manifest,
        ready,
        heroInView,
        progress,
        setProgress,
        subscribeProgress,
        registerCanvas,
      }}
    >
      {children}
    </ScrollSequenceContext.Provider>
  );
}

export function useScrollSequence() {
  const ctx = useContext(ScrollSequenceContext);
  if (!ctx) throw new Error('useScrollSequence must be used within ScrollSequenceProvider');
  return ctx;
}
