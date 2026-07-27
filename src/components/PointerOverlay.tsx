'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { heavyEffectsEnabled } from '@/lib/performance';

/** Desktop pointer dot + ring (not related to any IDE). */
export default function PointerOverlay() {
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const dotPosRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });
  const hoverRef = useRef(false);
  const rafRef = useRef(0);
  const activeRef = useRef(false);

  useEffect(() => {
    setEnabled(heavyEffectsEnabled());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const DOT_LERP = 0.42;
    const RING_LERP = 0.18;
    const EPS = 0.05;

    const paint = () => {
      const target = targetRef.current;
      const dotPos = dotPosRef.current;
      const ringPos = ringPosRef.current;
      const h = hoverRef.current;

      dotPos.x += (target.x - dotPos.x) * DOT_LERP;
      dotPos.y += (target.y - dotPos.y) * DOT_LERP;
      ringPos.x += (target.x - ringPos.x) * RING_LERP;
      ringPos.y += (target.y - ringPos.y) * RING_LERP;

      dot.style.transform = `translate3d(${dotPos.x - 4}px, ${dotPos.y - 4}px, 0) scale(${h ? 1.8 : 1})`;
      ring.style.transform = `translate3d(${ringPos.x - 16}px, ${ringPos.y - 16}px, 0) scale(${h ? 1.6 : 1})`;

      const stillMoving =
        Math.abs(target.x - dotPos.x) > EPS ||
        Math.abs(target.y - dotPos.y) > EPS ||
        Math.abs(target.x - ringPos.x) > EPS ||
        Math.abs(target.y - ringPos.y) > EPS;

      if (stillMoving || activeRef.current) {
        rafRef.current = requestAnimationFrame(paint);
      } else {
        rafRef.current = 0;
      }
    };

    const kick = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(paint);
    };

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      activeRef.current = true;
      kick();
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest('a, button, .hit-target, [role="button"]')) {
        hoverRef.current = true;
        kick();
      }
    };

    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const related = e.relatedTarget as HTMLElement | null;
      if (
        t?.closest('a, button, .hit-target, [role="button"]') &&
        !related?.closest('a, button, .hit-target, [role="button"]')
      ) {
        hoverRef.current = false;
        kick();
      }
    };

    const onLeaveWindow = () => {
      activeRef.current = false;
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeaveWindow);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  if (!enabled || !mounted) return null;

  return createPortal(
    <>
      <div
        ref={dotRef}
        className="pointer-dot fixed top-0 left-0 z-[400] h-2 w-2 rounded-full bg-white pointer-events-none mix-blend-difference will-change-transform"
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="pointer-ring fixed top-0 left-0 z-[399] h-8 w-8 rounded-full border border-white/30 pointer-events-none will-change-transform"
        aria-hidden="true"
      />
    </>,
    document.body
  );
}
