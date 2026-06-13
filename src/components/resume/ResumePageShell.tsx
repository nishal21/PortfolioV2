import Link from 'next/link';
import { Suspense } from 'react';
import ResumeDocument from '@/components/resume/ResumeDocument';
import ResumePageEffects from '@/components/resume/ResumePageEffects';
import ResumeAutoPrint from '@/components/resume/ResumeAutoPrint';
import ResumePrintSetup from '@/components/resume/ResumePrintSetup';
import ResumeToolbar from '@/components/resume/ResumeToolbar';
import type { ResumeProfile } from '@/data/resume';
import type { ResumeProfileId } from '@/data/resume';

interface ResumePageShellProps {
  profile: ResumeProfile;
  activeId: ResumeProfileId;
  clean?: boolean;
  autoprint?: boolean;
}

export default function ResumePageShell({
  profile,
  activeId,
  clean = false,
  autoprint = false,
}: ResumePageShellProps) {
  return (
    <div className={`resume-page${clean ? ' resume-page--clean' : ''}`}>
      <ResumePageEffects />
      <ResumePrintSetup />
      {clean && autoprint ? <ResumeAutoPrint enabled /> : null}
      <div className="resume-shell">
        {!clean && (
          <p className="mb-3 text-center text-sm no-print">
            <Link href="/" className="hit-target text-[#9ea8b0] underline hover:text-[#e8e3db]">
              ← Back to portfolio
            </Link>
          </p>
        )}
        {!clean && (
          <Suspense fallback={null}>
            <ResumeToolbar active={activeId} />
          </Suspense>
        )}
        <ResumeDocument profile={profile} />
      </div>
    </div>
  );
}
