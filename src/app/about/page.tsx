import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProjectIndexTable from '@/components/seo/ProjectIndexTable';
import { AboutPageJsonLd, SiteJsonLd } from '@/components/seo/JsonLd';
import { personal } from '@/data/personal';
import { entityDefinition, seoTrustSignals } from '@/data/seo-content';
import {
  CREATOR_NAME,
  GITHUB_HANDLE,
  OG_IMAGE,
  SITE_NAME,
  absoluteUrl,
  defaultDescription,
} from '@/lib/seo';
import '../studio.css';

export const metadata: Metadata = {
  title: `About ${CREATOR_NAME} (${GITHUB_HANDLE}) — Developer & Creator from Kerala`,
  description: defaultDescription(),
  alternates: { canonical: absoluteUrl('/about') },
  openGraph: {
    title: `About ${CREATOR_NAME}`,
    description: entityDefinition,
    url: absoluteUrl('/about'),
    siteName: SITE_NAME,
    images: [OG_IMAGE],
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: `About ${CREATOR_NAME}`,
    description: entityDefinition,
    images: [OG_IMAGE.url],
  },
};

export default function AboutPage() {
  return (
    <div className="studio-stage min-h-screen text-[var(--text)]">
      <SiteJsonLd />
      <AboutPageJsonLd />

      <div className="page-container py-12 md:py-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition hover:text-[var(--studio-accent)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to portfolio
        </Link>

        <p className="studio-label">About</p>
        <h1 className="studio-title max-w-4xl">
          {CREATOR_NAME}{' '}
          <span className="font-malayalam text-[var(--studio-accent)]">({personal.malayalamName})</span>
        </h1>
        <p className="studio-desc seo-speakable max-w-3xl">{entityDefinition}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {seoTrustSignals.stats.map((stat) => (
            <div key={stat.label} className="studio-stat rounded-2xl border border-[var(--studio-border)] p-4">
              <p className="studio-stat-num">{stat.number}</p>
              <p className="studio-stat-label">{stat.label}</p>
            </div>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold text-[var(--text-soft)]">Awards & recognition</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--text-muted)]">
            {seoTrustSignals.awards.map((award) => (
              <li key={award}>{award}</li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold text-[var(--text-soft)]">
            All projects by {CREATOR_NAME}
          </h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Search any project name — each links to an official page on nishal.dev.
          </p>
          <ProjectIndexTable />
        </section>

        <section className="mt-12 rounded-2xl border border-[var(--studio-border)] bg-[#0a0d12] p-6">
          <h2 className="font-display text-lg font-semibold text-[var(--text-soft)]">Contact & trust</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
            Email:{' '}
            <a href={`mailto:${seoTrustSignals.email}`} className="text-[var(--studio-accent)] hover:underline">
              {seoTrustSignals.email}
            </a>
            {' · '}
            Location: {seoTrustSignals.location}
            {' · '}
            GitHub:{' '}
            <a
              href={`https://github.com/${GITHUB_HANDLE}`}
              className="text-[var(--studio-accent)] hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              @{GITHUB_HANDLE}
            </a>
          </p>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            <Link href="/profile" className="text-[var(--studio-accent)] hover:underline">
              Full profile index
            </Link>
            {' · '}
            <Link href="/privacy" className="text-[var(--studio-accent)] hover:underline">
              Privacy policy
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
