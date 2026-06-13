import { redirect } from 'next/navigation';
import ResumePageShell from '@/components/resume/ResumePageShell';
import { resolveResumeProfile, type ResumeProfileId } from '@/data/resume';
import { cleanResumeRedirectPath, isAutoprint, isCleanResumeView } from '@/lib/resumeUrl';
import type { Metadata } from 'next';
import './resume.css';

export const metadata: Metadata = {
  title: 'Resume | Nishal K',
  description: 'Resume for Nishal K, configurable by role (general, developer, creative, full-stack).',
  robots: { index: true, follow: true },
};

interface ResumePageProps {
  searchParams: Promise<{ profile?: string; clean?: string; autoprint?: string; print?: string }>;
}

export default async function ResumePage({ searchParams }: ResumePageProps) {
  const params = await searchParams;

  if (isCleanResumeView(params.clean)) {
    redirect(cleanResumeRedirectPath(params.profile, isAutoprint(params.autoprint)));
  }

  const profile = resolveResumeProfile(params.profile);
  const activeId = profile.id as ResumeProfileId;

  return <ResumePageShell profile={profile} activeId={activeId} />;
}
