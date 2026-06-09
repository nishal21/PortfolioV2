'use client';

import { useEffect, useState } from 'react';
import ScrollSequenceCanvas from './ScrollSequenceCanvas';

export default function ScrollSequenceLayer() {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setPastHero(window.scrollY > window.innerHeight * 0.35);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const canvasOpacity = pastHero ? 0.22 : 0;

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      {pastHero ? (
        <ScrollSequenceCanvas
          mode="static"
          style={{ opacity: canvasOpacity, transition: 'opacity 0.8s ease' }}
        />
      ) : null}
      <div
        className="film-bg-wash absolute inset-0 transition-opacity duration-700"
        style={{ opacity: pastHero ? 1 : 0 }}
      />
    </div>
  );
}
