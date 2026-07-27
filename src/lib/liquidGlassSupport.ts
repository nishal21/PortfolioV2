export type GlassRenderMode = 'backdrop-svg' | 'filter-svg' | 'css-blur';

let renderModeCached: GlassRenderMode | null = null;

function ua() {
  return typeof navigator !== 'undefined' ? navigator.userAgent : '';
}

/** Firefox, Zen, LibreWolf, Waterfox, Tor Browser — Gecko, not Chromium. */
export function isFirefox(): boolean {
  const s = ua();
  if (!s) return false;
  // Zen / LibreWolf still ship Firefox/ in UA; also catch branded forks.
  if (/Firefox\//i.test(s) && !/Seamonkey/i.test(s)) return true;
  if (/ZenBrowser|LibreWolf|Waterfox|IceCat/i.test(s)) return true;
  // Odd Gecko forks that omit Firefox/ — never Chromium/WebKit.
  return /Gecko\//i.test(s) && !/(Chrome|Chromium|Edg)\//i.test(s) && !/like Gecko/i.test(s);
}

/**
 * Chromium forks where `backdrop-filter: url(#svg)` is broken or flaky.
 * They still get CSS blur glass (looks good, no shear bugs).
 */
export function isSvgBackdropBrokenChromium(): boolean {
  const s = ua();
  // Vivaldi: known broken SVG-url backdrop filters
  if (/Vivaldi/i.test(s)) return true;
  // Samsung Internet has historically flaky SVG backdrop-filter url()
  if (/SamsungBrowser/i.test(s)) return true;
  return false;
}

/** True when standard CSS blur backdrop is available (all modern engines). */
export function cssBlurBackdropSupported(): boolean {
  if (typeof CSS === 'undefined' || !CSS.supports) return true;
  return (
    CSS.supports('backdrop-filter', 'blur(1px)') ||
    CSS.supports('-webkit-backdrop-filter', 'blur(1px)')
  );
}

/** Chrome / Edge / Brave / Arc / Opera — SVG filters via backdrop-filter when probe passes */
export function svgBackdropFilterSupported(): boolean {
  if (typeof document === 'undefined') return false;

  if (!cssBlurBackdropSupported()) return false;
  if (isFirefox()) return false;
  if (isSvgBackdropBrokenChromium()) return false;

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

/** Firefox / Zen — SVG filters on element + -moz-element() background snapshot */
export function firefoxFilterGlassSupported(): boolean {
  if (!isFirefox()) return false;
  if (typeof document === 'undefined') return false;
  try {
    const probe = document.createElement('div');
    probe.style.backgroundImage = '-moz-element(#page-root)';
    return /moz-element/i.test(probe.style.backgroundImage);
  } catch {
    return false;
  }
}

export function getGlassRenderMode(): GlassRenderMode {
  if (renderModeCached) return renderModeCached;
  if (svgBackdropFilterSupported()) renderModeCached = 'backdrop-svg';
  else if (firefoxFilterGlassSupported()) renderModeCached = 'filter-svg';
  else renderModeCached = 'css-blur';
  applyGlassRootClass(renderModeCached);
  return renderModeCached;
}

/** Test helper / HMR — clear cached mode so detection re-runs. */
export function resetGlassRenderModeCache() {
  renderModeCached = null;
}

export function applyGlassRootClass(mode: GlassRenderMode) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('lg-svg-backdrop', 'lg-filter-fx', 'lg-css-backdrop');
  if (mode === 'backdrop-svg') root.classList.add('lg-svg-backdrop');
  else if (mode === 'filter-svg') root.classList.add('lg-filter-fx');
  else root.classList.add('lg-css-backdrop');
  root.dataset.lgMode = mode;
}

export function cssBackdropGlass(blurPx: number, letter = false): string {
  if (letter) {
    // Clear letter glass — no brightness/contrast wash that reads as tint
    return `blur(${blurPx}px) saturate(1.2)`;
  }
  return `blur(${blurPx}px) saturate(1.35) brightness(1.06) contrast(1.02)`;
}
