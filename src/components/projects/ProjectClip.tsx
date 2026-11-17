'use client';

import { useEffect, useRef, useState } from 'react';
import type { ProjectClip as Clip } from '@/data/projects';
import { gardenMotionTier } from '@/lib/gardenMotion';

interface ProjectClipProps {
  clip: Clip;
  className?: string;
  /** Visible share of the element before it starts playing */
  threshold?: number;
}

/**
 * Silent looping clip over a poster. Nothing is fetched until the element is
 * near the viewport, it pauses off screen, and it never mounts for Reduce
 * Motion, Data Saver, 2G or low-memory phones (the poster stays).
 */
export default function ProjectClip({ clip, className, threshold = 0.35 }: ProjectClipProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAllowed(gardenMotionTier() !== 'none');
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!allowed || !video) return;

    let loaded = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          if (!loaded) {
            loaded = true;
            video.preload = 'auto';
            video.load();
          }
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0, threshold, 1] }
    );
    io.observe(video);

    const onVisibility = () => {
      if (document.hidden) video.pause();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      video.pause();
    };
  }, [allowed, threshold]);

  if (!allowed) return null;

  return (
    <video
      ref={ref}
      className={className}
      data-ready={ready ? '' : undefined}
      muted
      loop
      playsInline
      preload="none"
      poster={clip.poster}
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
      onPlaying={() => setReady(true)}
    >
      <source src={clip.webm} type="video/webm" />
      <source src={clip.mp4} type="video/mp4" />
    </video>
  );
}
