'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { HERO_VIDEO_POSTER, heroPosterSrc, heroVideoSrc, heroVideoSrcWithTimeHint } from '@/lib/heroMedia';
import { isMobileViewport, prefersReducedMotion } from '@/lib/performance';

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
  const readyFiredRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [mobile] = useState(() => isMobileViewport());
  const [loadVideo, setLoadVideo] = useState(() => !isMobileViewport());
  const reducedMotion = prefersReducedMotion();
  const poster = mobile ? heroPosterSrc({ mobile: true }) : HERO_VIDEO_POSTER;
  const src = heroVideoSrcWithTimeHint(heroVideoSrc({ mobile }));

  const markReady = useCallback(() => {
    if (readyFiredRef.current) return;
    readyFiredRef.current = true;
    onReady?.();
  }, [onReady]);

  const handlePlaying = useCallback(() => {
    setVisible(true);
    markReady();
  }, [markReady]);

  const handleCanPlay = useCallback(() => {
    markReady();
    if (reducedMotion) setVisible(true);
  }, [markReady, reducedMotion]);

  useEffect(() => {
    if (!mobile || loadVideo) return;

    const start = () => setLoadVideo(true);
    if (typeof requestIdleCallback !== 'undefined') {
      const id = requestIdleCallback(start, { timeout: 700 });
      return () => cancelIdleCallback(id);
    }

    const t = window.setTimeout(start, 350);
    return () => window.clearTimeout(t);
  }, [loadVideo, mobile]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const syncProgress = () => {
      if (!video.duration || !Number.isFinite(video.duration)) return;
      onProgress?.(video.currentTime / video.duration);
    };

    video.addEventListener('timeupdate', syncProgress);
    return () => video.removeEventListener('timeupdate', syncProgress);
  }, [onProgress]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !loadVideo) return;

    if (paused || reducedMotion) {
      video.pause();
      if (reducedMotion && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        setVisible(true);
      }
      return;
    }

    const play = () => {
      video.muted = true;
      void video.play().catch(() => {
        /* autoplay blocked — poster stays visible */
      });
    };

    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      play();
    } else {
      video.addEventListener('canplay', play, { once: true });
    }

    document.addEventListener('visibilitychange', play);
    return () => {
      video.removeEventListener('canplay', play);
      document.removeEventListener('visibilitychange', play);
    };
  }, [loadVideo, paused, reducedMotion, src]);

  return (
    <video
      ref={videoRef}
      key={src}
      className={`hero-video ${className}${visible ? ' hero-video--in' : ''}`}
      src={loadVideo ? src : undefined}
      poster={poster}
      muted
      playsInline
      loop
      autoPlay={loadVideo && !reducedMotion && !paused}
      preload={mobile ? 'none' : 'auto'}
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden="true"
      onCanPlay={handleCanPlay}
      onPlaying={handlePlaying}
      onLoadedData={() => {
        if (reducedMotion) setVisible(true);
      }}
    />
  );
}
