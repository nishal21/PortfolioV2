import type { Metadata } from 'next';
import ProjectsPageView from '@/components/projects/ProjectsPageView';
import { ProjectsPageJsonLd } from '@/components/seo/JsonLd';
import {
  CREATOR_NAME,
  GITHUB_HANDLE,
  OG_IMAGE,
  absoluteUrl,
  socialDescription,
} from '@/lib/seo';
import { buildArticleOpenGraph } from '@/lib/pinterest';
import '../studio.css';

export const metadata: Metadata = {
  title: `Projects by ${CREATOR_NAME} (${GITHUB_HANDLE})`,
  description: `All projects by ${CREATOR_NAME}: FirstPR, NekoBeat, Otazumi, Publicolio, NMHelper, CarbonLint, GitHub Stars Organizer, and more. Built by ${GITHUB_HANDLE} from Kerala, India.`,
  keywords: [
    'Nishal projects',
    'nishal21 projects',
    'FirstPR',
    'NekoBeat',
    'Otazumi',
    'Publicolio',
    'NMHelper',
    'CarbonLint',
  ],
  alternates: { canonical: absoluteUrl('/projects') },
  openGraph: buildArticleOpenGraph({
    title: `Projects by ${CREATOR_NAME}`,
    description: socialDescription(),
    url: absoluteUrl('/projects'),
    images: [OG_IMAGE],
    section: 'Projects',
    tags: ['Nishal', 'nishal21', 'portfolio', 'open source'],
  }),
  twitter: {
    card: 'summary_large_image',
    title: `Projects by ${CREATOR_NAME}`,
    description: socialDescription(),
    images: [OG_IMAGE.url],
  },
};

export default function ProjectsIndexPage() {
  return (
    <>
      <ProjectsPageJsonLd />
      <ProjectsPageView />
    </>
  );
}
