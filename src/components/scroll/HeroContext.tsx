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
import { HERO_PAUSE_EVENT, HERO_RESUME_EVENT } from '@/lib/scrollNav';

type ProgressListener = (value: number) => void;

interface HeroContextValue {
  ready: boolean;
  heroInView: boolean;
  heroPaused: boolean;
  setHeroReady: () => void;
  emitProgress: (value: number) => void;
  subscribeProgress: (listener: ProgressListener) => () => void;
}

const HeroContext = createContext<HeroContextValue | null>(null);

export function HeroProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const [heroPaused, setHeroPaused] = useState(false);
  const progressListenersRef = useRef(new Set<ProgressListener>());

  const setHeroReady = useCallback(() => {
    setReady(true);
  }, []);

  const emitProgress = useCallback((value: number) => {
    const clamped = Math.max(0, Math.min(1, value));
    progressListenersRef.current.forEach((listener) => listener(clamped));
  }, []);

  const subscribeProgress = useCallback((listener: ProgressListener) => {
    progressListenersRef.current.add(listener);
    return () => {
      progressListenersRef.current.delete(listener);
    };
  }, []);

  useEffect(() => {
    const hero = document.getElementById('home');
    if (!hero) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setHeroInView(entry.isIntersecting && entry.intersectionRatio > 0.08);
      },
      { threshold: [0, 0.08, 0.15] }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onPause = () => setHeroPaused(true);
    const onResume = () => setHeroPaused(false);
    window.addEventListener(HERO_PAUSE_EVENT, onPause);
    window.addEventListener(HERO_RESUME_EVENT, onResume);
    return () => {
      window.removeEventListener(HERO_PAUSE_EVENT, onPause);
      window.removeEventListener(HERO_RESUME_EVENT, onResume);
    };
  }, []);

  return (
    <HeroContext.Provider
      value={{
        ready,
        heroInView,
        heroPaused,
        setHeroReady,
        emitProgress,
        subscribeProgress,
      }}
    >
      {children}
    </HeroContext.Provider>
  );
}

export function useHero() {
  const ctx = useContext(HeroContext);
  if (!ctx) throw new Error('useHero must be used within HeroProvider');
  return ctx;
}
