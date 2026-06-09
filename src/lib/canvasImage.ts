function drawFittedImage(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  width: number,
  height: number,
  iw: number,
  ih: number,
  fit: 'cover' | 'contain'
) {
  const scale = fit === 'cover' ? Math.max(width / iw, height / ih) : Math.min(width / iw, height / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (width - dw) / 2;
  const dy = (height - dh) / 2;
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, dx, dy, dw, dh);
}

export function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  width: number,
  height: number,
  iw: number,
  ih: number
) {
  drawFittedImage(ctx, img, width, height, iw, ih, 'cover');
}

export function drawContainImage(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  width: number,
  height: number,
  iw: number,
  ih: number
) {
  drawFittedImage(ctx, img, width, height, iw, ih, 'contain');
}

export function resizeCanvasToContainer(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.floor(width * dpr));
  canvas.height = Math.max(1, Math.floor(height * dpr));
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}
