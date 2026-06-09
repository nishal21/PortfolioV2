import type { LiquidGlassConfig } from './liquidGlassConfig';
import { heavyEffectsEnabled } from './performance';

type ConfigGetter = () => LiquidGlassConfig;

interface GlassInstance {
  rebuild: () => void;
  destroy: () => void;
}

const targets = new Map<HTMLElement, GlassInstance>();
let defs: SVGDefsElement | null = null;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function surfaceFn(x: number) {
  return (1 - (1 - x) ** 4) ** 0.25;
}

function calcRefractionProfile(glassThickness: number, bezelWidth: number, ior: number, samples = 128) {
  const eta = 1 / ior;
  const refract = (nx: number, ny: number) => {
    const dot = ny;
    const k = 1 - eta * eta * (1 - dot * dot);
    if (k < 0) return null;
    const sq = Math.sqrt(k);
    return [-(eta * dot + sq) * nx, eta - (eta * dot + sq) * ny] as const;
  };
  const p = new Float64Array(samples);
  for (let i = 0; i < samples; i += 1) {
    const x = i / samples;
    const y = surfaceFn(x);
    const dx = x < 1 ? 0.0001 : -0.0001;
    const y2 = surfaceFn(x + dx);
    const deriv = (y2 - y) / dx;
    const mag = Math.sqrt(deriv * deriv + 1);
    const ref = refract(-deriv / mag, -1 / mag);
    p[i] = ref ? (ref[0] * ((y * bezelWidth + glassThickness)) / ref[1]) : 0;
  }
  return p;
}

function generateDisplacementMap(
  w: number,
  h: number,
  radius: number,
  bezelWidth: number,
  profile: Float64Array,
  maxDisp: number
) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (!ctx) return '';
  const img = ctx.createImageData(w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = 128;
    d[i + 1] = 128;
    d[i + 2] = 0;
    d[i + 3] = 255;
  }
  const r = radius;
  const rSq = r * r;
  const r1Sq = (r + 1) ** 2;
  const rBSq = Math.max(r - bezelWidth, 0) ** 2;
  const wB = w - r * 2;
  const hB = h - r * 2;
  const S = profile.length;
  for (let y1 = 0; y1 < h; y1 += 1) {
    for (let x1 = 0; x1 < w; x1 += 1) {
      const x = x1 < r ? x1 - r : x1 >= w - r ? x1 - r - wB : 0;
      const y = y1 < r ? y1 - r : y1 >= h - r ? y1 - r - hB : 0;
      const dSq = x * x + y * y;
      if (dSq > r1Sq || dSq < rBSq) continue;
      const dist = Math.sqrt(dSq);
      const fromSide = r - dist;
      const op =
        dSq < rSq ? 1 : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(r1Sq) - Math.sqrt(rSq));
      if (op <= 0 || dist === 0) continue;
      const cos = x / dist;
      const sin = y / dist;
      const bi = Math.min(((fromSide / bezelWidth) * S) | 0, S - 1);
      const disp = profile[bi] || 0;
      const dX = (-cos * disp) / maxDisp;
      const dY = (-sin * disp) / maxDisp;
      const idx = (y1 * w + x1) * 4;
      d[idx] = (128 + dX * 127 * op + 0.5) | 0;
      d[idx + 1] = (128 + dY * 127 * op + 0.5) | 0;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

function generateSpecularMap(w: number, h: number, radius: number, bezelWidth: number, balanced: boolean) {
  const angle = Math.PI / 3;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (!ctx) return '';
  const img = ctx.createImageData(w, h);
  const d = img.data;
  d.fill(0);
  const r = radius;
  const rSq = r * r;
  const r1Sq = (r + 1) ** 2;
  const rBSq = Math.max(r - bezelWidth, 0) ** 2;
  const wB = w - r * 2;
  const hB = h - r * 2;
  const sv = [Math.cos(angle), Math.sin(angle)];
  for (let y1 = 0; y1 < h; y1 += 1) {
    for (let x1 = 0; x1 < w; x1 += 1) {
      const x = x1 < r ? x1 - r : x1 >= w - r ? x1 - r - wB : 0;
      const y = y1 < r ? y1 - r : y1 >= h - r ? y1 - r - hB : 0;
      const dSq = x * x + y * y;
      if (dSq > r1Sq || dSq < rBSq) continue;
      const dist = Math.sqrt(dSq);
      const fromSide = r - dist;
      const op =
        dSq < rSq ? 1 : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(r1Sq) - Math.sqrt(rSq));
      if (op <= 0 || dist === 0) continue;
      const cos = x / dist;
      const sin = -y / dist;
      const dot = balanced ? 1 : Math.abs(cos * sv[0] + sin * sv[1]);
      const edge = Math.sqrt(Math.max(0, 1 - (1 - fromSide) ** 2));
      const coeff = dot * edge;
      const col = (255 * coeff) | 0;
      const alpha = (col * coeff * op) | 0;
      const idx = (y1 * w + x1) * 4;
      d[idx] = col;
      d[idx + 1] = col;
      d[idx + 2] = col;
      d[idx + 3] = alpha;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

function svgEl(tag: string, attrs: Record<string, string>) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

function ensureDefs() {
  if (defs && document.documentElement.contains(defs)) return;
  const old = document.getElementById('portfolio-lg-defs');
  old?.remove();
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;pointer-events:none;z-index:-1;';
  defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.id = 'portfolio-lg-defs';
  svg.appendChild(defs);
  document.documentElement.appendChild(svg);
}

function generateEdgeDisplacementMap(
  w: number,
  h: number,
  bezelWidth: number,
  profile: Float64Array,
  maxDisp: number
) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (!ctx) return '';
  const img = ctx.createImageData(w, h);
  const d = img.data;
  const S = profile.length;
  const cx = (w - 1) / 2;
  const cy = (h - 1) / 2;
  const midDisp = profile[(S / 3) | 0] || 0;

  for (let y1 = 0; y1 < h; y1 += 1) {
    for (let x1 = 0; x1 < w; x1 += 1) {
      const edgeDist = Math.min(x1, w - 1 - x1, y1, h - 1 - y1);
      const fromEdge = 1 - clamp(edgeDist / bezelWidth, 0, 1);
      const bi = Math.min((fromEdge * (S - 1)) | 0, S - 1);
      const edgeDisp = profile[bi] || 0;
      const disp = edgeDisp * fromEdge + midDisp * (1 - fromEdge) * 0.5;

      const dx = cx - x1;
      const dy = cy - y1;
      const mag = Math.sqrt(dx * dx + dy * dy) || 1;
      const dX = (-(dx / mag) * disp) / maxDisp;
      const dY = (-(dy / mag) * disp) / maxDisp;
      const idx = (y1 * w + x1) * 4;
      d[idx] = (128 + dX * 127 + 0.5) | 0;
      d[idx + 1] = (128 + dY * 127 + 0.5) | 0;
      d[idx + 2] = 0;
      d[idx + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

function generateEdgeSpecularMap(w: number, h: number, bezelWidth: number, balanced: boolean) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (!ctx) return '';
  const img = ctx.createImageData(w, h);
  const d = img.data;
  const angle = Math.PI / 3;
  const sv = [Math.cos(angle), Math.sin(angle)];

  for (let y1 = 0; y1 < h; y1 += 1) {
    for (let x1 = 0; x1 < w; x1 += 1) {
      const edgeDist = Math.min(x1, w - 1 - x1, y1, h - 1 - y1);
      const fromEdge = 1 - clamp(edgeDist / bezelWidth, 0, 1);
      const wave = 0.72 + 0.28 * Math.sin(x1 * 0.09 + y1 * 0.07);
      const coeff = (balanced ? 0.85 : Math.abs(sv[0])) * fromEdge * wave;
      const col = (255 * coeff) | 0;
      const alpha = (col * coeff) | 0;
      const idx = (y1 * w + x1) * 4;
      d[idx] = col;
      d[idx + 1] = col;
      d[idx + 2] = col;
      d[idx + 3] = alpha;
    }
  }

  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

function buildTextFilter(id: string, w: number, h: number, cfg: LiquidGlassConfig) {
  const bezel = Math.min(cfg.bezelWidth, Math.min(w, h) / 2 - 1);
  const profile = calcRefractionProfile(cfg.glassThickness, bezel, cfg.ior, 128);
  const maxDisp = Math.max(...Array.from(profile).map(Math.abs)) || 1;
  const dispUrl = generateEdgeDisplacementMap(w, h, bezel, profile, maxDisp);
  const specUrl = generateEdgeSpecularMap(w, h, bezel * 1.8, cfg.balancedSpecular);
  const scale = maxDisp * cfg.scaleRatio;

  const filter = svgEl('filter', {
    id,
    x: '0',
    y: '0',
    width: String(w),
    height: String(h),
    filterUnits: 'userSpaceOnUse',
    primitiveUnits: 'userSpaceOnUse',
    'color-interpolation-filters': 'sRGB',
  });

  const blur = svgEl('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: String(cfg.blur), result: 'blurred' });
  const dispImg = svgEl('feImage', { href: dispUrl, x: '0', y: '0', width: String(w), height: String(h), result: 'disp_map' });
  const dispMap = svgEl('feDisplacementMap', {
    in: 'blurred',
    in2: 'disp_map',
    scale: String(scale),
    xChannelSelector: 'R',
    yChannelSelector: 'G',
    result: 'displaced',
  });
  const turb = svgEl('feTurbulence', {
    type: 'fractalNoise',
    baseFrequency: '0.011',
    numOctaves: '2',
    seed: '4',
    result: 'turb',
  });
  const turbDisp = svgEl('feDisplacementMap', {
    in: 'displaced',
    in2: 'turb',
    scale: '7',
    xChannelSelector: 'R',
    yChannelSelector: 'G',
    result: 'wavy',
  });
  const sat = svgEl('feColorMatrix', {
    in: 'wavy',
    type: 'saturate',
    values: String(cfg.specularSat),
    result: 'wavy_sat',
  });
  const spec = svgEl('feImage', { href: specUrl, x: '0', y: '0', width: String(w), height: String(h), result: 'spec_layer' });
  const comp = svgEl('feComposite', { in: 'wavy_sat', in2: 'spec_layer', operator: 'in', result: 'spec_masked' });
  const tr = svgEl('feComponentTransfer', { in: 'spec_layer', result: 'spec_faded' });
  tr.appendChild(svgEl('feFuncA', { type: 'linear', slope: String(cfg.specularOpacity) }));
  const b1 = svgEl('feBlend', { in: 'spec_masked', in2: 'wavy_sat', mode: 'normal', result: 'with_sat' });
  const b2 = svgEl('feBlend', { in: 'spec_faded', in2: 'with_sat', mode: 'normal' });

  filter.append(blur, dispImg, dispMap, turb, turbDisp, sat, spec, comp, tr, b1, b2);
  return filter;
}

function buildFilter(id: string, w: number, h: number, radius: number, cfg: LiquidGlassConfig) {
  const bezel = Math.min(cfg.bezelWidth, radius - 1, Math.min(w, h) / 2 - 1);
  const profile = calcRefractionProfile(cfg.glassThickness, bezel, cfg.ior, 128);
  const maxDisp = Math.max(...Array.from(profile).map(Math.abs)) || 1;
  const dispUrl = generateDisplacementMap(w, h, radius, bezel, profile, maxDisp);
  const specUrl = generateSpecularMap(w, h, radius, bezel * 2.5, cfg.balancedSpecular);
  const scale = maxDisp * cfg.scaleRatio;
  const pad = cfg.balancedSpecular ? 0.36 : 0;
  const fx = Math.round(-w * pad);
  const fy = Math.round(-h * pad);
  const fw = Math.round(w * (1 + pad * 2));
  const fh = Math.round(h * (1 + pad * 2));

  const filter = svgEl('filter', {
    id,
    x: String(fx),
    y: String(fy),
    width: String(fw),
    height: String(fh),
    filterUnits: 'userSpaceOnUse',
    primitiveUnits: 'userSpaceOnUse',
    'color-interpolation-filters': 'sRGB',
  });

  const blur = svgEl('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: String(cfg.blur), result: 'blurred' });
  const dispImg = svgEl('feImage', { href: dispUrl, x: '0', y: '0', width: String(w), height: String(h), result: 'disp_map' });
  const dispMap = svgEl('feDisplacementMap', {
    in: 'blurred',
    in2: 'disp_map',
    scale: String(scale),
    xChannelSelector: 'R',
    yChannelSelector: 'G',
    result: 'displaced',
  });
  const sat = svgEl('feColorMatrix', {
    in: 'displaced',
    type: 'saturate',
    values: String(cfg.specularSat),
    result: 'displaced_sat',
  });
  const spec = svgEl('feImage', { href: specUrl, x: '0', y: '0', width: String(w), height: String(h), result: 'spec_layer' });
  const comp = svgEl('feComposite', { in: 'displaced_sat', in2: 'spec_layer', operator: 'in', result: 'spec_masked' });
  const tr = svgEl('feComponentTransfer', { in: 'spec_layer', result: 'spec_faded' });
  tr.appendChild(svgEl('feFuncA', { type: 'linear', slope: String(cfg.specularOpacity) }));
  const b1 = svgEl('feBlend', { in: 'spec_masked', in2: 'displaced', mode: 'normal', result: 'with_sat' });
  const b2 = svgEl('feBlend', { in: 'spec_faded', in2: 'with_sat', mode: 'normal' });

  filter.append(blur, dispImg, dispMap, sat, spec, comp, tr, b1, b2);
  return filter;
}

function applyGlass(el: HTMLElement, cfgGetter: ConfigGetter) {
  if (targets.has(el)) return;
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';

  const refr = document.createElement('div');
  refr.className = 'lg-layer lg-refr';
  refr.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none;';
  const tint = document.createElement('div');
  tint.className = 'lg-layer lg-tint';
  tint.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none;';
  el.insertBefore(tint, el.firstChild);
  el.insertBefore(refr, el.firstChild);

  let filterNode: Element | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const elevate = () => {
    Array.from(el.children).forEach((c) => {
      if (c === refr || c === tint) return;
      if (getComputedStyle(c as HTMLElement).position === 'static') {
        (c as HTMLElement).style.position = 'relative';
      }
      if (!(c as HTMLElement).style.zIndex) (c as HTMLElement).style.zIndex = '1';
    });
  };

  const rebuild = () => {
    ensureDefs();
    if (!defs) return;
    const rect = el.getBoundingClientRect();
    const w = Math.round(el.offsetWidth || rect.width);
    const h = Math.round(el.offsetHeight || rect.height);
    if (w < 4 || h < 4) return;
    const glassMode = el.dataset.glassMode ?? '';
    const isLetter = glassMode === 'letter';
    const dataR = parseFloat(el.getAttribute('data-radius') || '0');
    const cssR = parseFloat(getComputedStyle(el).borderTopLeftRadius || '0');
    const r = Math.max(2, Math.min(dataR || cssR || 24, w / 2, h / 2));
    filterNode?.remove();
    const cfg = cfgGetter();
    const id = `portfolio-lg-${Math.random().toString(36).slice(2, 10)}`;
    filterNode = buildFilter(id, w, h, r, cfg);
    defs.appendChild(filterNode);
    refr.style.borderRadius = `${r}px`;
    refr.style.backdropFilter = `url(#${id})`;
    refr.style.webkitBackdropFilter = `url(#${id})`;
    tint.style.borderRadius = `${r}px`;
    tint.style.display = isLetter ? 'none' : 'block';
    tint.style.backgroundColor = `rgba(${cfg.tintColor},${cfg.tintOpacity})`;
    tint.style.boxShadow = `inset 0 0 ${cfg.innerShadowBlur}px ${cfg.innerShadowSpread}px ${cfg.innerShadow}`;
    el.dispatchEvent(new CustomEvent('lg-rebuilt', { bubbles: false }));
    elevate();
  };

  const schedule = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(rebuild, 48);
  };

  const ro = new ResizeObserver(schedule);
  ro.observe(el);
  targets.set(el, {
    rebuild,
    destroy: () => {
      if (timer) clearTimeout(timer);
      ro.disconnect();
      filterNode?.remove();
      refr.remove();
      tint.remove();
    },
  });
  rebuild();
}

export type LiquidGlassOptions = { force?: boolean };

export function enableLiquidGlass(
  el: HTMLElement,
  cfgGetter: ConfigGetter,
  opts?: LiquidGlassOptions
) {
  if (typeof window !== 'undefined' && !opts?.force && !heavyEffectsEnabled()) return;
  if (!targets.has(el)) applyGlass(el, cfgGetter);
  else targets.get(el)?.rebuild();
}

/** Nav bar, tab indicator, and contact fab — always use liquid glass (not gated by mobile perf). */
export function enableNavLiquidGlass(el: HTMLElement, cfgGetter: ConfigGetter) {
  enableLiquidGlass(el, cfgGetter, { force: true });
}

export function removeLiquidGlass(el: HTMLElement) {
  targets.get(el)?.destroy();
  targets.delete(el);
}

export function rebuildLiquidGlass(el: HTMLElement) {
  targets.get(el)?.rebuild();
}

export function rebuildAllLiquidGlass() {
  targets.forEach((inst) => inst.rebuild());
}
