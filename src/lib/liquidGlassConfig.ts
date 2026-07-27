export interface LiquidGlassConfig {
  glassThickness: number;
  bezelWidth: number;
  ior: number;
  scaleRatio: number;
  blur: number;
  specularOpacity: number;
  specularSat: number;
  tintColor: string;
  tintOpacity: number;
  innerShadow: string;
  innerShadowBlur: number;
  innerShadowSpread: number;
  balancedSpecular: boolean;
}

export const NAV_GLASS_CONFIG: LiquidGlassConfig = {
  glassThickness: 72,
  bezelWidth: 28,
  ior: 1.38,
  scaleRatio: 0.92,
  blur: 0.85,
  specularOpacity: 0.28,
  specularSat: 0,
  tintColor: '255,255,255',
  tintOpacity: 0,
  innerShadow: 'rgba(255,255,255,0.04)',
  innerShadowBlur: 2,
  innerShadowSpread: -1,
  balancedSpecular: false,
};

/** Hero title — clear glass (full color through; no desaturate / tint wash) */
export const HERO_GLASS_CONFIG: LiquidGlassConfig = {
  glassThickness: 40,
  bezelWidth: 18,
  ior: 1.36,
  scaleRatio: 0.62,
  blur: 0.9,
  specularOpacity: 0.14,
  // Must stay >= 1 for letter filters — 0 greys the whole backdrop
  specularSat: 1,
  tintColor: '255,255,255',
  tintOpacity: 0,
  innerShadow: 'rgba(255,255,255,0)',
  innerShadowBlur: 0,
  innerShadowSpread: 0,
  balancedSpecular: true,
};

export const TAB_GLASS_CONFIG: LiquidGlassConfig = {
  glassThickness: 24,
  bezelWidth: 18,
  ior: 1.36,
  scaleRatio: 0.9,
  blur: 0,
  specularOpacity: 0.2,
  specularSat: 0,
  tintColor: '255,255,255',
  tintOpacity: 0,
  innerShadow: 'rgba(255,255,255,0.05)',
  innerShadowBlur: 2,
  innerShadowSpread: -1,
  balancedSpecular: false,
};
