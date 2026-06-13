import ResumePageShell from '@/components/resume/ResumePageShell';
import { resumeProfiles, resolveResumeProfile } from '@/data/resume';
import { isAutoprint, profileFromPathSegment } from '@/lib/resumeUrl';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CREATOR_NAME, absoluteUrl } from '@/lib/seo';
import '../../resume.css';

interface ResumeViewPageProps {
  params: Promise<{ profile?: string[] }>;
  searchParams: Promise<{ print?: string }>;
}

export async function generateMetadata({ params }: ResumeViewPageProps): Promise<Metadata> {
  const { profile: segments } = await params;
  const id = profileFromPathSegment(segments?.[0]);
  const label = resumeProfiles[id].label;
  const path = id === 'general' ? '/resume/view' : `/resume/view/${id}`;
  return {
    title: `Resume · ${label}`,
    description: `Resume for ${CREATOR_NAME} (nishal21), ${label}. AMV editor, music producer, and full-stack developer from Kerala.`,
    alternates: { canonical: absoluteUrl(path) },
    robots: { index: true, follow: true },
  };
}

export default async function ResumeViewPage({ params, searchParams }: ResumeViewPageProps) {
  const { profile: segments } = await params;
  const { print } = await searchParams;

  const slug = segments?.[0];
  if (slug && slug !== 'general' && !Object.keys(resumeProfiles).includes(slug)) {
    notFound();
  }

  const profileId = profileFromPathSegment(slug);
  const profile = resolveResumeProfile(profileId === 'general' ? null : profileId);

  return (
    <ResumePageShell
      profile={profile}
      activeId={profileId}
      clean
      autoprint={isAutoprint(print)}
    />
  );
}
