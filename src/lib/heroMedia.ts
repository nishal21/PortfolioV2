/** Cloudinary delivery — auto quality MP4 loop. */
const CLOUDINARY_HERO_VIDEO =
  'https://res.cloudinary.com/dtzzqvvzi/video/upload/q_auto,f_mp4/v1781247946/hero.mp4';

/**
 * Hero background video (muted loop).
 * Set `NEXT_PUBLIC_HERO_VIDEO_URL` to override (e.g. self-hosted `/hero.mp4`).
 */
export const HERO_VIDEO_SRC =
  process.env.NEXT_PUBLIC_HERO_VIDEO_URL ?? CLOUDINARY_HERO_VIDEO;

/** Pinterest source for the hero background loop. */
export const HERO_VIDEO_CREDIT_URL = 'https://pin.it/3T4tJpHL2';

export const HERO_VIDEO_IS_REMOTE = HERO_VIDEO_SRC.startsWith('http');

/** Hint first frame without a separate poster image request. */
export function heroVideoSrcWithTimeHint(src: string) {
  if (!src.startsWith('http')) return src;
  return src.includes('#') ? src : `${src}#t=0.001`;
}
