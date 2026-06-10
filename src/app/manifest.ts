import type { MetadataRoute } from 'next';
import { CREATOR_NAME, OG_IMAGE } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${CREATOR_NAME} — Portfolio`,
    short_name: CREATOR_NAME,
    description: 'AMV editor, music producer, and full-stack developer from Kerala.',
    start_url: '/',
    display: 'standalone',
    background_color: '#06080c',
    theme_color: '#080a0c',
    lang: 'en',
    orientation: 'portrait-primary',
    categories: ['portfolio', 'productivity', 'entertainment'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
        purpose: 'any',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: OG_IMAGE.url,
        sizes: '1200x630',
        type: 'image/jpeg',
        purpose: 'any',
      },
    ],
    scope: '/',
  };
}
