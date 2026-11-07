'use client';

import { useEffect, useRef } from 'react';

type DigitBody = {
  el: HTMLElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  w: number;
  h: number;
};

type DragState = {
  o: DigitBody;
  dx: number;
  dy: number;
  lx: number;
  ly: number;
  sx: number;
  sy: number;
  moved: boolean;
  lt: number;
};

/**
 * Pointer drag + throw physics for the error-page digit tiles.
 * No-ops when prefers-reduced-motion is on (caller should leave static CSS positions).
 */
export function useThrowableDigits(
  containerRef: React.RefObject<HTMLElement | null>,
  enabled: boolean
) {
  const nudgeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root || !enabled) return;

    const els = [...root.querySelectorAll<HTMLElement>('[data-error-digit]')];
    if (els.length === 0) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    let z = 10;
    let drag: DragState | null = null;
    let base = 200;
    let raf = 0;
    let resizeTimer = 0;

    const objs: DigitBody[] = els.map((el) => ({
      el,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: 0,
      w: 0,
      h: 0,
    }));

    const place = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      const mob = W <= 860;
      base = mob
        ? Math.min(150, (W - 48) / 3.3)
        : Math.min(230, Math.max(120, Math.min(W * 0.17, H * 0.3)));

      objs.forEach((o, i) => {
        o.w = o.h = base;
        o.el.style.width = `${base}px`;
        o.el.style.height = `${base}px`;
        o.el.style.setProperty('--w', `${base}px`);
        o.x = mob ? 24 + i * base * 1.1 : W - 3.3 * base - W * 0.05 + i * base * 1.1;
        o.y = mob ? 86 + (i === 1 ? 16 : 0) : H * 0.15 + (i === 1 ? base * 0.3 : 0);
        o.vx = 0;
        o.vy = 0;
        o.r = 0;
      });
    };

    const onPointerDown = (e: PointerEvent, o: DigitBody) => {
      e.preventDefault();
      o.el.setPointerCapture(e.pointerId);
      drag = {
        o,
        dx: e.clientX - o.x,
        dy: e.clientY - o.y,
        lx: e.clientX,
        ly: e.clientY,
        sx: e.clientX,
        sy: e.clientY,
        moved: false,
        lt: performance.now(),
      };
      o.vx = 0;
      o.vy = 0;
      o.el.style.zIndex = String(++z);
      o.el.classList.add('is-dragging');
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!drag) return;
      const o = drag.o;
      if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 6) drag.moved = true;
      o.vx = o.vx * 0.4 + (e.clientX - drag.lx) * 0.6;
      o.vy = o.vy * 0.4 + (e.clientY - drag.ly) * 0.6;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      drag.lt = performance.now();
      o.x = Math.min(W - o.w * 0.6, Math.max(-o.w * 0.4, e.clientX - drag.dx));
      o.y = Math.min(H - o.h * 0.6, Math.max(40, e.clientY - drag.dy));
    };

    const onPointerUp = () => {
      if (!drag) return;
      const o = drag.o;
      o.el.classList.remove('is-dragging');
      if (performance.now() - drag.lt > 90) {
        o.vx = 0;
        o.vy = 0;
      }
      if (!drag.moved) {
        o.el.animate([{ scale: 1 }, { scale: 1.08 }, { scale: 1 }], {
          duration: 380,
          easing: 'cubic-bezier(.2,.9,.3,1.3)',
        });
      }
      drag = null;
    };

    const downs = objs.map((o) => {
      const handler = (e: PointerEvent) => onPointerDown(e, o);
      o.el.addEventListener('pointerdown', handler);
      return () => o.el.removeEventListener('pointerdown', handler);
    });

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(place, 200);
    };
    window.addEventListener('resize', onResize);

    nudgeRef.current = () => {
      objs.forEach((o) => {
        o.vx += (Math.random() - 0.5) * 7;
        o.vy -= 2 + Math.random() * 3;
      });
    };

    const loop = () => {
      objs.forEach((o) => {
        if (!(drag && drag.o === o)) {
          o.x += o.vx;
          o.y += o.vy;
          o.vx *= 0.96;
          o.vy *= 0.96;
          if (o.x < 0) {
            o.x = 0;
            o.vx *= -0.65;
          }
          if (o.x + o.w > W) {
            o.x = W - o.w;
            o.vx *= -0.65;
          }
          if (o.y < 44) {
            o.y = 44;
            o.vy *= -0.65;
          }
          if (o.y + o.h > H - 84) {
            o.y = H - 84 - o.h;
            o.vy *= -0.65;
          }
          if (Math.abs(o.vx) < 0.05) o.vx = 0;
          if (Math.abs(o.vy) < 0.05) o.vy = 0;
        }
        o.r += (Math.max(-18, Math.min(18, o.vx * 1.4)) - o.r) * 0.15;
        o.el.style.transform = `translate3d(${o.x}px,${o.y}px,0) rotate(${o.r}deg)`;
      });
      raf = requestAnimationFrame(loop);
    };

    els.forEach((el) => {
      el.style.opacity = '0';
    });
    place();
    // Reveal after first layout so digits don’t flash at 0,0
    requestAnimationFrame(() => {
      els.forEach((el) => {
        el.style.opacity = '1';
      });
    });
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      downs.forEach((off) => off());
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('resize', onResize);
      nudgeRef.current = null;
    };
  }, [containerRef, enabled]);

  return {
    nudge: () => nudgeRef.current?.(),
  };
}
