import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Github } from 'lucide-react';
import { projects, getProjectSlug, getProjectThumbnail } from '@/data/projects';
import ProjectIndexTable from '@/components/seo/ProjectIndexTable';
import { SiteJsonLd } from '@/components/seo/JsonLd';
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
  description: `All projects by ${CREATOR_NAME} — NekoBeat, Otazumi, Publicolio, NMHelper, CarbonLint, GitHub Stars Organizer, and more. Built by ${GITHUB_HANDLE} from Kerala, India.`,
  keywords: [
    'Nishal projects',
    'nishal21 projects',
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
    <div className="studio-stage min-h-screen text-[var(--text)]">
      <SiteJsonLd />
      <div className="page-container py-12 md:py-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition hover:text-[var(--studio-accent)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to portfolio
        </Link>

        <p className="studio-label">Projects</p>
        <h1 className="studio-title max-w-3xl">
          {CREATOR_NAME} ({GITHUB_HANDLE})
        </h1>
        <p className="studio-desc">
          Open-source apps, dev tools, and creative platforms built by Nishal from Kerala.
          Search any project name to find the official portfolio page.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const slug = getProjectSlug(project);
            const thumb = getProjectThumbnail(project.id);

            return (
              <li key={project.id}>
                <Link
                  href={`/projects/${slug}`}
                  className="studio-project-seo-card group block h-full rounded-2xl border border-[var(--studio-border)] bg-[#0a0d12] p-4 transition hover:border-[var(--studio-accent)]/40"
                >
                  {thumb ? (
                    <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl bg-[#06080c]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumb}
                        alt={`${project.title} by ${CREATOR_NAME}`}
                        className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                  <h2 className="font-display text-lg font-semibold text-[var(--text-soft)]">
                    {project.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                    {project.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm text-[var(--studio-accent)]">
                    View project page
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold text-[var(--text-soft)]">Project directory</h2>
          <ProjectIndexTable />
        </section>

        <p className="mt-12 text-sm text-[var(--text-muted)]">
          All repos on{' '}
          <a
            href={`https://github.com/${GITHUB_HANDLE}`}
            className="inline-flex items-center gap-1 text-[var(--studio-accent)] hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub @{GITHUB_HANDLE}
            <Github className="h-4 w-4" aria-hidden />
          </a>
        </p>
      </div>
    </div>
  );
}
