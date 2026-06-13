import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SeoAnswerBlocks from '@/components/seo/SeoAnswerBlocks';
import ProjectIndexTable from '@/components/seo/ProjectIndexTable';
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
    <div className="studio-stage min-h-screen text-[var(--text)]">
      <ProfilePageJsonLd />

      <div className="page-container py-12 md:py-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition hover:text-[var(--studio-accent)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to portfolio
        </Link>

        <p className="studio-label">Index</p>
        <h1 className="studio-title max-w-4xl">Profile · {CREATOR_NAME}</h1>
        <p className="studio-desc seo-speakable max-w-3xl">{entityDefinition}</p>

        <SeoAnswerBlocks className="mt-10" showHeading={false} />

        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold text-[var(--text-soft)]">
            Project directory
          </h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            All projects by {CREATOR_NAME} ({GITHUB_HANDLE}). Each page is indexable at nishal.dev.
          </p>
          <ProjectIndexTable />
        </section>

        <p className="mt-10 text-sm text-[var(--text-muted)]">
          <Link href="/about" className="text-[var(--studio-accent)] hover:underline">
            Awards & full about →
          </Link>
          {' · '}
          <Link href="/projects" className="text-[var(--studio-accent)] hover:underline">
            Projects →
          </Link>
        </p>
      </div>
    </div>
  );
}
