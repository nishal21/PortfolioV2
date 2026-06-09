import { resumeProfiles, type ResumeProfileId } from '@/data/resume';

const PROFILE_IDS = Object.keys(resumeProfiles) as ResumeProfileId[];

export function isResumeProfileId(value: string): value is ResumeProfileId {
  return PROFILE_IDS.includes(value as ResumeProfileId);
}

export function profileFromPathSegment(segment?: string | null): ResumeProfileId {
  if (!segment || segment === 'general') return 'general';
  if (isResumeProfileId(segment)) return segment;
  return 'general';
}

/** Public share URL — no query string */
export function buildCleanResumeUrl(
  profile: ResumeProfileId,
  origin = '',
  opts?: { autoprint?: boolean }
) {
  const base = origin.replace(/\/$/, '');
  const path = profile === 'general' ? '/resume/view' : `/resume/view/${profile}`;
  if (opts?.autoprint) return `${base}${path}?print=1`;
  return `${base}${path}`;
}

export function cleanResumeRedirectPath(profile?: string | null, autoprint?: boolean) {
  const id = profileFromPathSegment(profile);
  const path = id === 'general' ? '/resume/view' : `/resume/view/${id}`;
  return autoprint ? `${path}?print=1` : path;
}

export function isCleanResumePath(pathname: string) {
  return pathname === '/resume/view' || pathname.startsWith('/resume/view/');
}

/** @deprecated query clean=1 — use /resume/view */
export function isCleanResumeView(clean?: string | null) {
  return clean === '1' || clean === 'true';
}

export function isAutoprint(autoprint?: string | null) {
  return autoprint === '1' || autoprint === 'true';
}
