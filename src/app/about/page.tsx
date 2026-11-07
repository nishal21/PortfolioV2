import type { Metadata } from 'next';
import AboutPageView from '@/components/about/AboutPageView';
import { AboutPageJsonLd } from '@/components/seo/JsonLd';
import { entityDefinition } from '@/data/seo-content';
import {
  CREATOR_NAME,
  GITHUB_HANDLE,
  OG_IMAGE,
  absoluteUrl,
  defaultDescription,
} from '@/lib/seo';
import { buildArticleOpenGraph } from '@/lib/pinterest';
import '../studio.css';

export const metadata: Metadata = {
  title: `About ${CREATOR_NAME} (${GITHUB_HANDLE}) · Developer & Creator from Kerala`,
  description: defaultDescription(),
  alternates: { canonical: absoluteUrl('/about') },
  openGraph: buildArticleOpenGraph({
    title: `About ${CREATOR_NAME}`,
    description: entityDefinition,
    url: absoluteUrl('/about'),
    images: [OG_IMAGE],
    section: 'About',
    tags: ['Nishal', 'nishal21', 'Kerala', 'developer'],
  }),
  twitter: {
    card: 'summary_large_image',
    title: `About ${CREATOR_NAME}`,
    description: entityDefinition,
    images: [OG_IMAGE.url],
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutPageJsonLd />
      <AboutPageView />
    </>
  );
}
