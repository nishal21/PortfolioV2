import { isMobileViewport } from '@/lib/performance';

const ctxCache = new WeakMap<HTMLCanvasElement, CanvasRenderingContext2D>();

/** Single 2d context per hero canvas — frames are drawn here, never as DOM `<img>`. */
export function getHeroCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
  let ctx = ctxCache.get(canvas);
  if (!ctx) {
    const created = canvas.getContext('2d', {
      alpha: false,
      desynchronized: isMobileViewport(),
      willReadFrequently: false,
    });
    if (!created) return null;
    ctx = created;
    if (isMobileViewport()) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'low';
    }
    ctxCache.set(canvas, ctx);
  }
  return ctx;
}

export function releaseHeroCanvasContext(canvas: HTMLCanvasElement) {
  ctxCache.delete(canvas);
}

export function prepareHeroCanvasContext(ctx: CanvasRenderingContext2D, dpr: number) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (isMobileViewport()) {
    ctx.imageSmoothingQuality = 'low';
  }
}
