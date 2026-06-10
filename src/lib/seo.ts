import { projects, getProjectSlug } from '@/data/projects';
import { socialLinks } from '@/data/contact';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nishal.dev';
export const SITE_NAME = 'Nishal — nishal.dev';
export const CREATOR_NAME = 'Nishal K';
export const GITHUB_HANDLE = 'nishal21';

/** IndexNow key — file must live at `public/{key}.txt` with the same value inside. */
export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY ?? 'f8c2a41e9b3d7046e1a5c890d7f6b2e4';

/** `public/og-image.jpg` — custom share preview artwork. */
export const OG_IMAGE = {
  url: '/og-image.jpg',
  width: 1024,
  height: 682,
  alt: 'Nishal — AMV editor, music producer, and developer from Kerala',
} as const;

/** ≤60 chars — lead with “Nishal” for name searches. */
export const SITE_TITLE = 'Nishal — AMV Editor, Music Producer & Developer';

/** ~150–160 chars for `<meta name="description">`. */
export function metaDescription() {
  return `Nishal — official portfolio of Nishal K (nishal21). AMV editor, music producer, and full-stack developer from Kerala. NekoBeat, Otazumi, NMHelper, and 60+ GitHub projects.`;
}

/** ~120 chars for Open Graph / X card previews. */
export function socialDescription() {
  return `Nishal — AMV editor, music producer & developer from Kerala. Portfolio of Nishal K (nishal21): NekoBeat, Otazumi, NMHelper & open source.`;
}

export const SITE_KEYWORDS = [
  'Nishal',
  'nishal',
  'Nishal K',
  'nishal21',
  'Nishal Kerala',
  'Nishal developer',
  'Nishal AMV editor',
  'Nishal music producer',
  'Nishal portfolio',
  'nishal.dev',
  'NekoBeat',
  'Otazumi',
  'Publicolio',
  'NMHelper',
  'CarbonLint',
  'NekoDroid',
  'OtakuPulse',
  'Musico',
  'GitHub Stars Organizer',
  'Sigil-extractor',
  'Extracto',
  'ARGUS',
  'Veyra',
  'Askira',
  'Malappuram developer',
  'Kerala developer',
] as const;

export const SAME_AS = socialLinks.map((link) => link.href);

export function absoluteUrl(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalized, SITE_URL).toString();
}

export function getIndexablePaths(): string[] {
  const paths = [
    '/',
    '/about',
    '/profile',
    '/privacy',
    '/projects',
    '/resume',
    '/resume/view',
    '/resume/view/developer',
    '/resume/view/creative',
    '/resume/view/fullstack',
  ];

  for (const project of projects) {
    paths.push(`/projects/${getProjectSlug(project)}`);
  }

  return [...new Set(paths)];
}

export function getIndexableUrls(): string[] {
  return getIndexablePaths().map((path) => absoluteUrl(path));
}

/** @deprecated Prefer `metaDescription()` or `socialDescription()`. */
export function defaultDescription() {
  return metaDescription();
}

export function projectDescription(title: string, description: string) {
  return `${title} by ${CREATOR_NAME} (${GITHUB_HANDLE}) — ${description} Official project page on nishal.dev.`;
}
