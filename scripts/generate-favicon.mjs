/**
 * Build public/favicon.ico + PNG sizes from favicon.svg (dark bg, no white edges).
 * Run: npm run generate:favicon
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const svg = join(root, 'public/favicon.svg');

/** ICO container with PNG entries (supported by every current browser and Windows Vista+). */
function pngsToIco(pngs, sizes) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + 16 * pngs.length;
  pngs.forEach((png, i) => {
    const e = Buffer.alloc(16);
    const size = sizes[i] >= 256 ? 0 : sizes[i];
    e.writeUInt8(size, 0);
    e.writeUInt8(size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    entries.push(e);
  });
  return Buffer.concat([header, ...entries, ...pngs]);
}

async function main() {
  const sharp = (await import('sharp')).default;

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

  const ico = pngsToIco(pngBuffers, sizes);
  writeFileSync(join(root, 'public/favicon.ico'), ico);
  console.log('Wrote public/favicon.ico + favicon-16/32/48 PNGs');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
