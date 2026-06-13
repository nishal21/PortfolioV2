export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isCoarsePointer() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

export function isMobileViewport() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 767px)').matches;
}

/** Skip heavy effects (pointer overlay) on touch / small screens */
export function heavyEffectsEnabled() {
  if (typeof window === 'undefined') return true;
  if (prefersReducedMotion()) return false;
  if (isCoarsePointer()) return false;
  if (isMobileViewport()) return false;
  return true;
}

export function isAndroid() {
  if (typeof navigator === 'undefined') return false;
  return /Android/i.test(navigator.userAgent);
}

/** Hero per-letter liquid glass */
export function heroLiquidGlassEnabled() {
  if (typeof window === 'undefined') return true;
  if (prefersReducedMotion()) return false;
  if (typeof CSS !== 'undefined' && CSS.supports) {
    const hasBackdrop =
      CSS.supports('backdrop-filter', 'blur(1px)') ||
      CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
    if (!hasBackdrop) return false;
  }
  return true;
}
