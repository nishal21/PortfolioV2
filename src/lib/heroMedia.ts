/** Cloudinary delivery — auto quality MP4 loop. */
const CLOUDINARY_BASE = 'https://res.cloudinary.com/dtzzqvvzi/video/upload';
const CLOUDINARY_HERO_ID = 'v1781247946/hero';

/**
 * Hero background video (muted loop).
 * Set `NEXT_PUBLIC_HERO_VIDEO_URL` to override (e.g. self-hosted `/hero.mp4`).
 */
export function heroVideoSrc(options?: { mobile?: boolean }) {
  if (process.env.NEXT_PUBLIC_HERO_VIDEO_URL) {
    return process.env.NEXT_PUBLIC_HERO_VIDEO_URL;
  }
  const transform = options?.mobile ? 'q_auto:eco,w_720,c_limit' : 'q_auto';
  return `${CLOUDINARY_BASE}/${transform},f_mp4/${CLOUDINARY_HERO_ID}.mp4`;
}

export const HERO_VIDEO_SRC = heroVideoSrc();

/** Pinterest source for the hero background loop. */
export const HERO_VIDEO_CREDIT_URL = 'https://pin.it/3T4tJpHL2';

export const HERO_VIDEO_IS_REMOTE = HERO_VIDEO_SRC.startsWith('http');

/** First-frame still for crawlers and the pre-video backdrop. */
export function heroPosterSrc(options?: { mobile?: boolean }) {
  const w = options?.mobile ? 960 : 1280;
  return `${CLOUDINARY_BASE}/so_0,q_auto,f_jpg,w_${w}/${CLOUDINARY_HERO_ID}.jpg`;
}

export const HERO_VIDEO_POSTER = heroPosterSrc();

/** Hint first frame without a separate poster image request. */
export function heroVideoSrcWithTimeHint(src: string) {
  if (!src.startsWith('http')) return src;
  return src.includes('#') ? src : `${src}#t=0.001`;
}
