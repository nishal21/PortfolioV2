import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectDetailView from '@/components/projects/ProjectDetailView';
import {
  projects,
  getProjectBySlug,
  getProjectSlug,
  getProjectThumbnail,
} from '@/data/projects';
import { ProjectJsonLd } from '@/components/seo/JsonLd';
import {
  CREATOR_NAME,
  GITHUB_HANDLE,
  OG_IMAGE,
  absoluteUrl,
  projectDescription,
} from '@/lib/seo';
import { buildArticleOpenGraph } from '@/lib/pinterest';
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
  const imageUrl = image.startsWith('http') ? image : absoluteUrl(image);

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
    openGraph: buildArticleOpenGraph({
      title,
      description,
      url: pageUrl,
      images: [{ ...OG_IMAGE, url: imageUrl }],
      publishedTime: project.lastUpdated,
      modifiedTime: project.lastUpdated,
      section: 'Projects',
      tags: [...project.tags, project.title, CREATOR_NAME],
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const thumb = getProjectThumbnail(project.id);

  return (
    <>
      <ProjectJsonLd
        title={project.title}
        description={project.longDescription}
        slug={slug}
        image={thumb ?? undefined}
        liveUrl={project.liveUrl}
        githubUrl={project.githubUrl}
        tags={project.tags}
      />
      <ProjectDetailView project={project} slug={slug} />
    </>
  );
}
