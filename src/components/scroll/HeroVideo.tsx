'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { HERO_VIDEO_POSTER, HERO_VIDEO_SRC } from '@/lib/heroMedia';
import { prefersReducedMotion } from '@/lib/performance';

interface HeroVideoProps {
  className?: string;
  onReady?: () => void;
  onProgress?: (value: number) => void;
  paused?: boolean;
}

export default function HeroVideo({
  className = '',
  onReady,
  onProgress,
  paused = false,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = prefersReducedMotion();

  const handleReady = useCallback(() => {
    setVisible(true);
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncProgress = () => {
      if (!video.duration || !Number.isFinite(video.duration)) return;
      onProgress?.(video.currentTime / video.duration);
    };

    video.addEventListener('timeupdate', syncProgress);
    return () => video.removeEventListener('timeupdate', syncProgress);
  }, [onProgress]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (paused || reducedMotion) {
      video.pause();
      return;
    }

    const play = () => {
      void video.play().catch(() => {
        /* autoplay blocked — poster/backdrop still visible */
      });
    };

    play();
    document.addEventListener('visibilitychange', play);
    return () => document.removeEventListener('visibilitychange', play);
  }, [paused, reducedMotion]);

  return (
    <video
      ref={videoRef}
      className={`hero-video ${className}${visible ? ' hero-video--in' : ''}`}
      src={HERO_VIDEO_SRC}
      poster={HERO_VIDEO_POSTER}
      muted
      playsInline
      loop
      autoPlay={!reducedMotion}
      preload="auto"
      aria-hidden="true"
      onLoadedData={handleReady}
      onCanPlay={handleReady}
    />
  );
}
