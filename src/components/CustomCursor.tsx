'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { heavyEffectsEnabled } from '@/lib/performance';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const hoverRef = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    setEnabled(heavyEffectsEnabled());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const paint = () => {
      const { x, y } = posRef.current;
      const h = hoverRef.current;
      dot.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0) scale(${h ? 1.8 : 1})`;
      ring.style.transform = `translate3d(${x - 16}px, ${y - 16}px, 0) scale(${h ? 1.6 : 1})`;
      rafRef.current = 0;
    };

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!rafRef.current) rafRef.current = requestAnimationFrame(paint);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest('a, button, .cursor-hover, [role="button"]')) {
        hoverRef.current = true;
        if (!rafRef.current) rafRef.current = requestAnimationFrame(paint);
      }
    };

    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const related = e.relatedTarget as HTMLElement | null;
      if (
        t?.closest('a, button, .cursor-hover, [role="button"]') &&
        !related?.closest('a, button, .cursor-hover, [role="button"]')
      ) {
        hoverRef.current = false;
        if (!rafRef.current) rafRef.current = requestAnimationFrame(paint);
      }
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut, { passive: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  if (!enabled || !mounted) return null;

  return createPortal(
    <>
      <div
        ref={dotRef}
        className="custom-cursor-dot fixed top-0 left-0 z-[400] h-2 w-2 rounded-full bg-white pointer-events-none mix-blend-difference will-change-transform"
      />
      <div
        ref={ringRef}
        className="custom-cursor-ring fixed top-0 left-0 z-[399] h-8 w-8 rounded-full border border-white/30 pointer-events-none will-change-transform"
      />
    </>,
    document.body
  );
}
