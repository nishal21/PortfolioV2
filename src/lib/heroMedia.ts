const CLOUDINARY_HERO_VIDEO =
  'https://res.cloudinary.com/dtzzqvvzi/video/upload/v1781247946/hero.mp4';

/** Cloudinary poster — first frame, auto quality JPEG. */
const CLOUDINARY_HERO_POSTER =
  'https://res.cloudinary.com/dtzzqvvzi/video/upload/so_0,q_auto,f_jpg,w_1280/v1781247946/hero.jpg';

/**
 * Hero background video.
 * Set `NEXT_PUBLIC_HERO_VIDEO_URL` to override (e.g. self-hosted `/hero.mp4`).
 */
export const HERO_VIDEO_SRC =
  process.env.NEXT_PUBLIC_HERO_VIDEO_URL ?? CLOUDINARY_HERO_VIDEO;

export const HERO_VIDEO_POSTER =
  process.env.NEXT_PUBLIC_HERO_VIDEO_POSTER ?? CLOUDINARY_HERO_POSTER;
