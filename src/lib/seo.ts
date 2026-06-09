import { projects, getProjectSlug } from '@/data/projects';
import { socialLinks } from '@/data/contact';
import { personal } from '@/data/personal';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nishal.dev';
export const SITE_NAME = 'Nishal K Portfolio';
export const CREATOR_NAME = 'Nishal K';
export const GITHUB_HANDLE = 'nishal21';

/** IndexNow key — file must live at `public/{key}.txt` with the same value inside. */
export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY ?? 'f8c2a41e9b3d7046e1a5c890d7f6b2e4';

export const OG_IMAGE = {
  url: '/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'Nishal K — Creative developer and visual storyteller from Kerala',
} as const;

export const SITE_KEYWORDS = [
  'Nishal',
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

export function defaultDescription() {
  return `${CREATOR_NAME} (${GITHUB_HANDLE}) — AMV editor, music producer, and full-stack developer from ${personal.location}. Portfolio of NekoBeat, Otazumi, Publicolio, NMHelper, CarbonLint, and 60+ open-source projects on GitHub.`;
}

export function projectDescription(title: string, description: string) {
  return `${title} by ${CREATOR_NAME} (${GITHUB_HANDLE}) — ${description} Official project page on nishal.dev.`;
}
