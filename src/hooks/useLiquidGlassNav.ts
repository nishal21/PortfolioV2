'use client';

import { useCallback, useEffect, useRef } from 'react';
import { enableNavLiquidGlass, removeLiquidGlass, rebuildAllLiquidGlass } from '@/lib/liquidGlass';
import { NAV_GLASS_CONFIG, TAB_GLASS_CONFIG } from '@/lib/liquidGlassConfig';

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const SLIDE_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

function slideDurationSec(tabDelta: number) {
  if (tabDelta <= 1) return 0.38;
  return Math.min(0.38 + (tabDelta - 1) * 0.11, 0.82);
}

export function useLiquidGlassNav(
  itemCount: number,
  activeIndex: number,
  onSelect?: (index: number) => void
) {
  const navWrapRef = useRef<HTMLDivElement>(null);
  const navInnerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndexRef = useRef(activeIndex);
  const prevAnimatedIndexRef = useRef(activeIndex);
  const dragSessionRef = useRef(false);
  activeIndexRef.current = activeIndex;

  const snapToIndex = useCallback((index: number, animate: boolean, durationSec = 0.38) => {
    const nav = navInnerRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return;

    if (index < 0) {
      indicator.style.opacity = '0';
      return;
    }

    indicator.style.opacity = '1';
    const btn = itemRefs.current[index];
    if (!btn) return;

    const width = btn.offsetWidth;
    const left = clamp(btn.offsetLeft, 0, Math.max(0, nav.clientWidth - width));

    if (!animate) {
      const old = indicator.style.transition;
      indicator.style.transition = 'none';
      indicator.style.left = `${left}px`;
      indicator.style.width = `${width}px`;
      indicator.offsetWidth;
      indicator.style.transition = old;
      return;
    }

    indicator.style.transition = `left ${durationSec}s ${SLIDE_EASE}, width ${durationSec}s ${SLIDE_EASE}, transform 0.32s ${SLIDE_EASE}, background-color 0.28s ease`;
    indicator.style.left = `${left}px`;
    indicator.style.width = `${width}px`;
  }, []);

  const jumpToIndex = useCallback(
    (index: number) => {
      prevAnimatedIndexRef.current = index;
      snapToIndex(index, false);
    },
    [snapToIndex]
  );

  useEffect(() => {
    if (dragSessionRef.current) return;
    if (prevAnimatedIndexRef.current === activeIndex) return;
    const prev = prevAnimatedIndexRef.current;
    const tabDelta = Math.abs(activeIndex - prev);
    prevAnimatedIndexRef.current = activeIndex;

    const durationSec = slideDurationSec(tabDelta);
    snapToIndex(activeIndex, true, durationSec);

    const indicator = indicatorRef.current;
    const navWrap = navWrapRef.current;
    if (indicator && navWrap && activeIndex >= 0) {
      indicator.classList.add('interacting');
      navWrap.classList.add('engaged');
      const pulse = window.setTimeout(() => {
        indicator.classList.remove('interacting');
        navWrap.classList.remove('engaged');
      }, Math.round(durationSec * 1000) + 40);
      const t = window.setTimeout(() => rebuildAllLiquidGlass(), 400);
      return () => {
        window.clearTimeout(pulse);
        window.clearTimeout(t);
      };
    }

    const t = window.setTimeout(() => rebuildAllLiquidGlass(), 400);
    return () => window.clearTimeout(t);
  }, [activeIndex, snapToIndex]);

  useEffect(() => {
    const navWrap = navWrapRef.current;
    if (!navWrap) return;

    enableNavLiquidGlass(navWrap, () => NAV_GLASS_CONFIG);
    snapToIndex(activeIndexRef.current, false);
    prevAnimatedIndexRef.current = activeIndexRef.current;

    const onResize = () => {
      snapToIndex(activeIndexRef.current, false);
      rebuildAllLiquidGlass();
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      removeLiquidGlass(navWrap);
    };
  }, [snapToIndex]);

  const setItemRef = (index: number) => (el: HTMLButtonElement | null) => {
    itemRefs.current[index] = el;
  };

  const onItemPointerDown = (index: number) => (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!e.isPrimary || e.button !== 0) return;

    const nav = navInnerRef.current;
    const navWrap = navWrapRef.current;
    const indicator = indicatorRef.current;
    const pressTarget = e.currentTarget;
    if (!nav || !navWrap || !indicator) return;

    const pointerId = e.pointerId;
    let dragMode = false;
    const pressX = e.clientX;
    const pressY = e.clientY;
    const pressWidth = itemRefs.current[index]?.getBoundingClientRect().width ?? 80;
    let targetIndex = index;

    dragSessionRef.current = true;

    const navRect = () => nav.getBoundingClientRect();
    const toLocalX = (clientX: number) => {
      const nr = navRect();
      const sx = nr.width > 0 ? nav.clientWidth / nr.width : 1;
      return (clientX - nr.left) * sx;
    };

    const itemMetrics = (i: number) => {
      const btn = itemRefs.current[i];
      if (!btn) return { left: 0, width: 80, center: 40 };
      const left = btn.offsetLeft;
      const width = btn.offsetWidth;
      return { left, width, center: left + width / 2 };
    };

    const nearestIndex = (localX: number) => {
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i < itemCount; i += 1) {
        const d = Math.abs(localX - itemMetrics(i).center);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      return best;
    };

    const setGlow = (clientX: number, clientY: number, alpha: number) => {
      const nr = navRect();
      nav.style.setProperty('--gx', `${toLocalX(clientX)}px`);
      nav.style.setProperty('--gy', `${clientY - nr.top}px`);
      nav.style.setProperty('--ga', String(alpha));
    };

    const queueGlassRebuild = () => {
      requestAnimationFrame(() => rebuildAllLiquidGlass());
    };

    const positionIndicatorAt = (clientX: number) => {
      const localX = toLocalX(clientX);
      const w = pressWidth;
      let left = localX - w / 2;
      left = clamp(left, 0, Math.max(0, nav.clientWidth - w));
      indicator.style.transition = 'none';
      indicator.style.left = `${left}px`;
      indicator.style.width = `${w}px`;
      targetIndex = nearestIndex(localX);
    };

    try {
      pressTarget.setPointerCapture(pointerId);
    } catch {
      /* capture optional */
    }

    indicator.classList.add('interacting');
    navWrap.classList.add('engaged');
    setGlow(e.clientX, e.clientY, 0.24);
    enableNavLiquidGlass(indicator, () => TAB_GLASS_CONFIG);
    queueGlassRebuild();

    const onMove = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      const dx = Math.abs(ev.clientX - pressX);
      const dy = Math.abs(ev.clientY - pressY);
      if (!dragMode && (dx > 5 || dy > 5)) {
        dragMode = true;
        nav.classList.add('dragging');
      }
      if (dragMode) {
        setGlow(ev.clientX, ev.clientY, 0.18);
        positionIndicatorAt(ev.clientX);
        queueGlassRebuild();
      } else {
        setGlow(ev.clientX, ev.clientY, 0.22);
      }
    };

    const cleanup = () => {
      dragSessionRef.current = false;
      try {
        pressTarget.releasePointerCapture(pointerId);
      } catch {
        /* ignore */
      }
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
    };

    const releaseChrome = () => {
      setTimeout(() => {
        indicator.classList.remove('interacting');
        navWrap.classList.remove('engaged');
        nav.style.setProperty('--ga', '0');
        removeLiquidGlass(indicator);
      }, 380);
    };

    const finish = () => {
      nav.classList.remove('dragging');
      if (dragMode) {
        const tabDelta = Math.abs(targetIndex - index);
        snapToIndex(targetIndex, true, slideDurationSec(tabDelta));
        prevAnimatedIndexRef.current = targetIndex;
        onSelect?.(targetIndex);
        setTimeout(queueGlassRebuild, 400);
      } else {
        snapToIndex(activeIndexRef.current, false);
      }
      releaseChrome();
    };

    const onUp = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      cleanup();
      finish();
    };

    const onCancel = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      cleanup();
      nav.classList.remove('dragging');
      snapToIndex(activeIndexRef.current, false);
      releaseChrome();
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);
  };

  return {
    navWrapRef,
    navInnerRef,
    indicatorRef,
    glowRef,
    setItemRef,
    onItemPointerDown,
    jumpToIndex,
  };
}
