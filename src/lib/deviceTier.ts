/**
 * Kinetic Studio device tiers (progressive enhancement).
 * 0 = static/no-JS path, 1 = core, 2 = standard motion, 3 = cinematic.
 */
export type DeviceTier = 0 | 1 | 2 | 3;

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isCoarsePointer(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 767px)').matches;
}

export function saveDataEnabled(): boolean {
  if (typeof navigator === 'undefined') return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return Boolean(conn?.saveData);
}

export function isSlowNetwork(): boolean {
  if (typeof navigator === 'undefined') return false;
  const conn = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
  const t = conn?.effectiveType;
  return t === 'slow-2g' || t === '2g' || t === '3g';
}

export function detectDeviceTier(): DeviceTier {
  if (typeof window === 'undefined') return 1;
  if (prefersReducedMotion()) return 1;
  if (saveDataEnabled() || isSlowNetwork()) return 1;

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const lowPower = cores < 4 || memory < 4;

  if (lowPower || (isMobileViewport() && isCoarsePointer())) {
    return isSlowNetwork() ? 1 : 2;
  }

  if (!isCoarsePointer() && !isMobileViewport() && cores >= 4 && memory >= 4) {
    return 3;
  }

  return 2;
}

/** Skip heavy pointer / particle effects */
export function heavyEffectsEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  return detectDeviceTier() >= 3 && !prefersReducedMotion();
}

export function heroLiquidGlassEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  if (prefersReducedMotion()) return false;
  if (detectDeviceTier() < 2) return false;
  if (typeof CSS !== 'undefined' && CSS.supports) {
    const hasBackdrop =
      CSS.supports('backdrop-filter', 'blur(1px)') ||
      CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
    if (!hasBackdrop) return false;
  }
  return true;
}

export function lenisEnabled(): boolean {
  return detectDeviceTier() >= 2 && !prefersReducedMotion();
}

export function webglEffectsEnabled(): boolean {
  return detectDeviceTier() >= 3 && !prefersReducedMotion();
}

export function asciiAnimateEnabled(): boolean {
  return detectDeviceTier() >= 2 && !prefersReducedMotion();
}

export function isAndroid(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android/i.test(navigator.userAgent);
}
