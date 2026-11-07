import type { Metadata } from 'next';
import ProfilePageView from '@/components/profile/ProfilePageView';
import { ProfilePageJsonLd } from '@/components/seo/JsonLd';
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
  title: `Profile · ${CREATOR_NAME} (${GITHUB_HANDLE})`,
  description: defaultDescription(),
  alternates: { canonical: absoluteUrl('/profile') },
  openGraph: buildArticleOpenGraph({
    title: `Profile · ${CREATOR_NAME}`,
    description: entityDefinition,
    url: absoluteUrl('/profile'),
    images: [OG_IMAGE],
    section: 'Profile',
    tags: ['Nishal', 'Nishal K', 'nishal21', 'Kerala developer'],
  }),
  twitter: {
    card: 'summary_large_image',
    title: `Profile · ${CREATOR_NAME}`,
    description: entityDefinition,
    images: [OG_IMAGE.url],
  },
};

export default function ProfilePage() {
  return (
    <>
      <ProfilePageJsonLd />
      <ProfilePageView />
    </>
  );
}
