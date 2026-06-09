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

/** Hero title — full-area refraction so letter bodies warp like nav glass */
export const HERO_GLASS_CONFIG: LiquidGlassConfig = {
  glassThickness: 64,
  bezelWidth: 32,
  ior: 1.45,
  scaleRatio: 1.15,
  blur: 0.6,
  specularOpacity: 0.52,
  specularSat: 0,
  tintColor: '255,255,255',
  tintOpacity: 0.03,
  innerShadow: 'rgba(255,255,255,0.14)',
  innerShadowBlur: 4,
  innerShadowSpread: -1,
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
