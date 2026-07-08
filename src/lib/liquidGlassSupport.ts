export type GlassRenderMode = 'backdrop-svg' | 'filter-svg' | 'css-blur';

let renderModeCached: GlassRenderMode | null = null;

export function isFirefox(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Firefox\//i.test(navigator.userAgent) && !/Seamonkey/i.test(navigator.userAgent);
}

/** Chrome / Safari / Edge — SVG filters via backdrop-filter */
export function svgBackdropFilterSupported(): boolean {
  if (typeof document === 'undefined') return false;

  if (typeof CSS !== 'undefined' && CSS.supports) {
    const hasBlur =
      CSS.supports('backdrop-filter', 'blur(1px)') ||
      CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
    if (!hasBlur) return false;
  }

  if (isFirefox()) return false;

  if (/Vivaldi/i.test(navigator.userAgent)) return false;

  try {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none';

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.id = 'portfolio-lg-probe';
    const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    blur.setAttribute('in', 'SourceGraphic');
    blur.setAttribute('stdDeviation', '2');
    filter.appendChild(blur);
    defs.appendChild(filter);
    svg.appendChild(defs);
    document.documentElement.appendChild(svg);

    const probe = document.createElement('div');
    probe.style.cssText =
      'position:fixed;left:-9999px;top:0;width:40px;height:40px;visibility:hidden;backdrop-filter:url(#portfolio-lg-probe)';
    probe.style.setProperty('-webkit-backdrop-filter', 'url(#portfolio-lg-probe)');
    document.body.appendChild(probe);

    const style = getComputedStyle(probe);
    const value =
      style.backdropFilter ||
      (style as CSSStyleDeclaration & { webkitBackdropFilter?: string }).webkitBackdropFilter ||
      '';

    probe.remove();
    svg.remove();

    return value.includes('url(');
  } catch {
    return false;
  }
}

/** Firefox — SVG filters on element + -moz-element() background snapshot */
export function firefoxFilterGlassSupported(): boolean {
  return isFirefox();
}

export function getGlassRenderMode(): GlassRenderMode {
  if (renderModeCached) return renderModeCached;
  if (svgBackdropFilterSupported()) renderModeCached = 'backdrop-svg';
  else if (firefoxFilterGlassSupported()) renderModeCached = 'filter-svg';
  else renderModeCached = 'css-blur';
  applyGlassRootClass(renderModeCached);
  return renderModeCached;
}

export function applyGlassRootClass(mode: GlassRenderMode) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('lg-svg-backdrop', 'lg-filter-fx', 'lg-css-backdrop');
  if (mode === 'backdrop-svg') root.classList.add('lg-svg-backdrop');
  else if (mode === 'filter-svg') root.classList.add('lg-filter-fx');
  else root.classList.add('lg-css-backdrop');
}

export function cssBackdropGlass(blurPx: number, letter = false): string {
  if (letter) {
    return `blur(${blurPx}px) saturate(1.5) brightness(1.1) contrast(1.05)`;
  }
  return `blur(${blurPx}px) saturate(1.35) brightness(1.06) contrast(1.02)`;
}
