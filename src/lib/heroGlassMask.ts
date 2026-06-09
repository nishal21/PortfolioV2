import { isAndroid } from '@/lib/performance';

export async function ensureHeroFonts(glyphEl: HTMLElement) {
  const style = getComputedStyle(glyphEl);
  const fontSpec = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  if (document.fonts?.load) {
    await Promise.all([
      document.fonts.load(fontSpec),
      document.fonts.load(`700 ${style.fontSize} Syne`),
      document.fonts.ready,
    ]);
  }
}

export function maskIsApplied(host: HTMLElement): boolean {
  const refr = host.querySelector('.lg-refr') as HTMLElement | null;
  if (!refr) return false;
  const inline = refr.style.webkitMaskImage || refr.style.maskImage;
  if (inline && inline !== 'none') return true;
  const computed = getComputedStyle(refr);
  const mask = computed.webkitMaskImage || computed.maskImage;
  return Boolean(mask && mask !== 'none');
}

function applyMaskToLayers(host: HTMLElement, src: string, w: number, h: number) {
  host.querySelectorAll('.lg-refr').forEach((layer) => {
    const el = layer as HTMLElement;
    const value = `url(${JSON.stringify(src)})`;
    el.style.maskImage = value;
    el.style.webkitMaskImage = value;
    el.style.maskRepeat = 'no-repeat';
    el.style.webkitMaskRepeat = 'no-repeat';
    el.style.maskSize = `${w}px ${h}px`;
    el.style.webkitMaskSize = `${w}px ${h}px`;
    el.style.maskPosition = '0 0';
    el.style.webkitMaskPosition = '0 0';
  });
}

function paintTextToCanvas(
  ctx: CanvasRenderingContext2D,
  glyphEl: HTMLElement,
  w: number,
  h: number
) {
  const style = getComputedStyle(glyphEl);
  const text = glyphEl.textContent ?? '';
  const fontSize = parseFloat(style.fontSize) || 16;

  ctx.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px ${style.fontFamily}`;
  ctx.fillStyle = '#fff';

  if ('letterSpacing' in ctx) {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = style.letterSpacing;
  }

  const host = glyphEl.parentElement?.parentElement;
  const hostRect = host?.getBoundingClientRect();
  const glyphRect = glyphEl.getBoundingClientRect();

  if (hostRect && hostRect.width > 0) {
    const x = glyphRect.left - hostRect.left;
    const y = glyphRect.top - hostRect.top;
    ctx.textBaseline = 'top';
    ctx.fillText(text, x, y);
    return;
  }

  ctx.textBaseline = 'alphabetic';
  const metrics = ctx.measureText(text);
  const x = (w - metrics.width) / 2;
  const y = (h + fontSize * 0.72) / 2;
  ctx.fillText(text, x, y);
}

export function paintGlyphMask(
  host: HTMLElement,
  glyphEl: HTMLElement,
  onUrl?: (url: string) => void
): Promise<boolean> {
  return new Promise((resolve) => {
    const w = host.offsetWidth;
    const h = host.offsetHeight;
    if (w < 2 || h < 2) {
      resolve(false);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, isAndroid() ? 2.5 : 1.5);
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(w * dpr);
    canvas.height = Math.ceil(h * dpr);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(false);
      return;
    }

    ctx.scale(dpr, dpr);
    paintTextToCanvas(ctx, glyphEl, w, h);

    const finish = (url: string) => {
      applyMaskToLayers(host, url, w, h);
      onUrl?.(url);

      let maskImg = host.querySelector('.hero-mask-img') as HTMLImageElement | null;
      if (!maskImg) {
        maskImg = document.createElement('img');
        maskImg.className = 'hero-mask-img';
        maskImg.alt = '';
        maskImg.setAttribute('aria-hidden', 'true');
        maskImg.style.cssText =
          'position:absolute;width:0;height:0;opacity:0;pointer-events:none;overflow:hidden';
        host.appendChild(maskImg);
      }
      maskImg.src = url;

      const done = () => {
        setLetterGlassState(host, 'masked');
        resolve(true);
      };

      if (maskImg.complete) {
        requestAnimationFrame(() => requestAnimationFrame(done));
      } else {
        maskImg.onload = () => requestAnimationFrame(done);
        maskImg.onerror = () => resolve(maskIsApplied(host));
      }
    };

    if (isAndroid() && canvas.toBlob) {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            finish(canvas.toDataURL('image/png'));
            return;
          }
          finish(URL.createObjectURL(blob));
        },
        'image/png',
        1
      );
      return;
    }

    finish(canvas.toDataURL('image/png'));
  });
}

export function revokeMaskUrl(url: string | null) {
  if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
}

export function setLetterGlassState(host: HTMLElement, state: 'pending' | 'masked' | 'plain') {
  host.classList.remove('hero-letter-host--masked', 'hero-letter-host--plain');
  if (state === 'masked') host.classList.add('hero-letter-host--masked');
  if (state === 'plain') host.classList.add('hero-letter-host--plain');
}
