'use client';

import { useCallback, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Copy, Link2, Printer } from 'lucide-react';
import { resumeProfiles, type ResumeProfileId } from '@/data/resume';
import { buildCleanResumeUrl, isCleanResumePath } from '@/lib/resumeUrl';

const profileIds = Object.keys(resumeProfiles) as ResumeProfileId[];

export default function ResumeToolbar({ active }: { active: ResumeProfileId }) {
  const router = useRouter();
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const setProfile = (id: ResumeProfileId) => {
    router.push(id === 'general' ? '/resume' : `/resume?profile=${id}`);
  };

  const shareUrl = buildCleanResumeUrl(active, typeof window !== 'undefined' ? window.location.origin : '');

  const copyShareLink = useCallback(async () => {
    const url = buildCleanResumeUrl(active, window.location.origin);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this link:', url);
    }
  }, [active]);

  const printResume = () => {
    if (isCleanResumePath(pathname)) {
      document.title = ' ';
      window.print();
      return;
    }
    const url = buildCleanResumeUrl(active, window.location.origin, { autoprint: true });
    const popup = window.open(url, '_blank', 'noopener,noreferrer');
    if (!popup) window.print();
  };

  return (
    <div className="resume-toolbar">
      <div className="resume-toolbar-inner">
        <label className="resume-toolbar-label" htmlFor="resume-profile">
          Profile
        </label>
        <select
          id="resume-profile"
          className="resume-profile-select cursor-hover"
          value={active}
          onChange={(e) => setProfile(e.target.value as ResumeProfileId)}
        >
          {profileIds.map((id) => (
            <option key={id} value={id}>
              {resumeProfiles[id].label}
            </option>
          ))}
        </select>
        <button type="button" className="resume-toolbar-btn cursor-hover" onClick={printResume}>
          <Printer className="h-4 w-4" aria-hidden />
          Print / Save PDF
        </button>
        <button type="button" className="resume-toolbar-btn cursor-hover" onClick={copyShareLink}>
          <Copy className="h-4 w-4" aria-hidden />
          {copied ? 'Copied' : 'Copy share link'}
        </button>
        <a
          className="resume-toolbar-btn resume-toolbar-btn--ghost cursor-hover"
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Link2 className="h-4 w-4" aria-hidden />
          Open clean view
        </a>
      </div>
      <p className="resume-toolbar-hint">
        Share link: <code>{active === 'general' ? '/resume/view' : `/resume/view/${active}`}</code> — on
        nishal.dev that becomes a clean public URL. When printing, turn off{' '}
        <strong>Headers and footers</strong> in the browser dialog.
      </p>
    </div>
  );
}
