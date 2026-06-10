/**
 * Build public/favicon.ico + PNG sizes from favicon.svg (dark bg, no white edges).
 * Run: npm run generate:favicon
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const svg = join(root, 'public/favicon.svg');

async function main() {
  const sharp = (await import('sharp')).default;
  const toIco = (await import('to-ico')).default;

  const sizes = [16, 32, 48];
  const pngBuffers = [];

  for (const size of sizes) {
    const buf = await sharp(svg)
      .resize(size, size, { fit: 'contain', background: { r: 8, g: 10, b: 12, alpha: 1 } })
      .png()
      .toBuffer();
    pngBuffers.push(buf);
    writeFileSync(join(root, `public/favicon-${size}x${size}.png`), buf);
  }

  const ico = await toIco(pngBuffers);
  writeFileSync(join(root, 'public/favicon.ico'), ico);
  console.log('Wrote public/favicon.ico + favicon-16/32/48 PNGs');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
