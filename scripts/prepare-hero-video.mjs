/**
 * Copy 1.mp4 → public/hero.mp4 and optionally extract hero-poster.jpg (needs ffmpeg).
 * Only needed if you self-host (NEXT_PUBLIC_HERO_VIDEO_URL=/hero.mp4). Default is Cloudinary.
 * Run: npm run hero:prepare
 */
import { copyFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = join(import.meta.dirname, '..');
const source = join(root, '1.mp4');
const dest = join(root, 'public', 'hero.mp4');
const poster = join(root, 'public', 'hero-poster.jpg');

if (!existsSync(source)) {
  console.error('Missing 1.mp4 at project root. Place your source video there and re-run.');
  process.exit(1);
}

copyFileSync(source, dest);
const sizeMb = statSync(dest).size / (1024 * 1024);
console.log(`Copied → public/hero.mp4 (${sizeMb.toFixed(2)} MB)`);

const ffmpeg = spawnSync(
  'ffmpeg',
  ['-y', '-i', source, '-vf', 'scale=1280:-2', '-frames:v', '1', '-q:v', '2', poster],
  { stdio: 'ignore' }
);

if (ffmpeg.status === 0) {
  console.log('Wrote public/hero-poster.jpg');
} else {
  console.log('Skipped poster (install ffmpeg for hero-poster.jpg). Video still works without it.');
}
