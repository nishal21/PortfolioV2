/** Re-export device-tier helpers so existing imports keep working. */
export {
  prefersReducedMotion,
  isCoarsePointer,
  isMobileViewport,
  heavyEffectsEnabled,
  heroLiquidGlassEnabled,
  isAndroid,
  detectDeviceTier,
  lenisEnabled,
  webglEffectsEnabled,
  asciiAnimateEnabled,
  type DeviceTier,
} from '@/lib/deviceTier';
