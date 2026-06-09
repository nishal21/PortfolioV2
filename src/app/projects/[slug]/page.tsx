import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import {
  projects,
  getProjectBySlug,
  getProjectSlug,
  getProjectThumbnail,
  isProjectInDevelopment,
} from '@/data/projects';
import { ProjectJsonLd } from '@/components/seo/JsonLd';
import {
  CREATOR_NAME,
  GITHUB_HANDLE,
  OG_IMAGE,
  SITE_NAME,
  absoluteUrl,
  projectDescription,
} from '@/lib/seo';
import '../../studio.css';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: getProjectSlug(project) }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const title = `${project.title} by ${CREATOR_NAME} (${GITHUB_HANDLE})`;
  const description = projectDescription(project.title, project.longDescription);
  const pageUrl = absoluteUrl(`/projects/${slug}`);
  const image = getProjectThumbnail(project.id) ?? OG_IMAGE.url;

  return {
    title,
    description,
    keywords: [
      project.title,
      `${project.title} Nishal`,
      `${project.title} nishal21`,
      CREATOR_NAME,
      GITHUB_HANDLE,
      ...project.tags,
    ],
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: SITE_NAME,
      images: [{ ...OG_IMAGE, url: image.startsWith('http') ? image : absoluteUrl(image) }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.startsWith('http') ? image : absoluteUrl(image)],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const thumb = getProjectThumbnail(project.id);
  const inDev = isProjectInDevelopment(project);

  return (
    <div className="studio-stage min-h-screen text-[var(--text)]">
      <ProjectJsonLd
        title={project.title}
        description={project.longDescription}
        slug={slug}
        image={thumb ?? undefined}
        liveUrl={project.liveUrl}
        githubUrl={project.githubUrl}
        tags={project.tags}
      />

      <article className="page-container py-12 md:py-16">
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition hover:text-[var(--studio-accent)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All projects
        </Link>

        {thumb ? (
          <div className="relative mb-8 aspect-[16/9] max-w-4xl overflow-hidden rounded-2xl border border-[var(--studio-border)] bg-[#06080c]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumb}
              alt={`${project.title} — project by ${CREATOR_NAME}`}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        <p className="studio-label">{project.category}</p>
        <h1 className="studio-title max-w-4xl">{project.title}</h1>
        <p className="studio-desc seo-speakable max-w-3xl">
          Built by <strong>{CREATOR_NAME}</strong> (<a href={`https://github.com/${GITHUB_HANDLE}`} className="text-[var(--studio-accent)] hover:underline">{GITHUB_HANDLE}</a>
          ). {project.longDescription}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--studio-accent)] px-5 py-2.5 text-sm font-semibold text-[#061008]"
            >
              Live site
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          ) : null}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--studio-border)] px-5 py-2.5 text-sm font-medium text-[var(--text-soft)] transition hover:border-[var(--studio-accent)]"
            >
              GitHub repo
              <Github className="h-4 w-4" aria-hidden />
            </a>
          ) : null}
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--studio-border)] px-5 py-2.5 text-sm font-medium text-[var(--text-muted)] transition hover:border-[var(--studio-accent)]"
          >
            View on portfolio
          </Link>
        </div>

        {inDev ? (
          <p className="mt-4 text-sm text-[var(--studio-warm)]">Status: In development</p>
        ) : (
          <p className="mt-4 text-sm text-[var(--studio-accent)]">Status: Live</p>
        )}

        <section className="mt-10 max-w-3xl">
          <h2 className="font-display text-xl font-semibold text-[var(--text-soft)]">About {project.title}</h2>
          <p className="mt-3 leading-relaxed text-[var(--text-muted)]">{project.description}</p>
        </section>

        <section className="mt-8 max-w-3xl">
          <h2 className="font-display text-xl font-semibold text-[var(--text-soft)]">Features</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--text-muted)]">
            {project.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8 max-w-3xl">
          <h2 className="font-display text-xl font-semibold text-[var(--text-soft)]">Tech stack</h2>
          <dl className="mt-3 space-y-3">
            {Object.entries(project.techStack).map(([key, values]) => (
              <div key={key}>
                <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--studio-accent)]">
                  {key}
                </dt>
                <dd className="mt-1 text-[var(--text-muted)]">{values.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-10 rounded-2xl border border-[var(--studio-border)] bg-[#0a0d12] p-6">
          <h2 className="font-display text-lg font-semibold text-[var(--text-soft)]">
            Who built {project.title}?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
            {project.title} is an independent project by {CREATOR_NAME}, also known as {GITHUB_HANDLE} on GitHub.
            Nishal is an AMV editor, music producer, and full-stack developer from Malappuram, Kerala, India.
            Official portfolio: <Link href="/" className="text-[var(--studio-accent)] hover:underline">nishal.dev</Link>.
          </p>
        </section>
      </article>
    </div>
  );
}
