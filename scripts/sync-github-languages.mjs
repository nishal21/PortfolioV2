/**
 * Sync project tags + lastUpdated from GitHub /languages and repo.pushed_at.
 * Manual overrides for repos without public GH data (e.g. NMHelper).
 *
 * Usage: node scripts/sync-github-languages.mjs
 */
import fs from 'fs';
import path from 'path';

const OVERRIDES = {
  NMHelper: {
    tags: ['JavaScript', 'TypeScript', 'HTML', 'CSS'],
    lastUpdated: '2026-05-27',
  },
  Otazumi: {
    repo: 'otazumi-auth',
    tags: ['JavaScript'],
    lastUpdated: '2025-10-28',
  },
  Askira: {
    tags: ['TypeScript', 'JavaScript'],
  },
};

const SKIP_LANGS = new Set(['NSIS', 'Linker Script', 'Assembly', 'DTrace', 'Makefile', 'Dockerfile']);

function repoFromUrl(url) {
  if (!url) return null;
  const m = url.match(/github\.com\/[^/]+\/([^/]+)/i);
  return m?.[1] ?? null;
}

async function fetchGitHubMeta(repo) {
  const [langRes, repoRes] = await Promise.all([
    fetch(`https://api.github.com/repos/nishal21/${repo}/languages`),
    fetch(`https://api.github.com/repos/nishal21/${repo}`),
  ]);
  if (!langRes.ok || !repoRes.ok) return null;
  const langs = await langRes.json();
  const meta = await repoRes.json();
  const tags = Object.entries(langs)
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k)
    .filter((k) => !SKIP_LANGS.has(k));
  return {
    tags,
    lastUpdated: meta.pushed_at?.slice(0, 10),
  };
}

const projectsPath = path.join('src', 'data', 'projects.ts');
const src = fs.readFileSync(projectsPath, 'utf8');
const match = src.match(/export const projects: Project\[\] = (\[[\s\S]*?\n\]);/);
if (!match) {
  console.error('Could not parse projects.ts');
  process.exit(1);
}

const projects = eval(match[1]);

for (const project of projects) {
  const override = OVERRIDES[project.title];
  const repo = override?.repo ?? repoFromUrl(project.githubUrl);
  if (override?.tags) project.tags = override.tags;
  if (override?.lastUpdated) project.lastUpdated = override.lastUpdated;

  if (repo) {
    const gh = await fetchGitHubMeta(repo);
    if (gh) {
      if (!override?.tags) project.tags = gh.tags.slice(0, 6);
      if (!override?.lastUpdated && gh.lastUpdated) project.lastUpdated = gh.lastUpdated;
      if (project.techStack && !hasDetailedStack(project.techStack)) {
        project.techStack.languages = [...gh.tags];
      }
      console.log(project.title, '←', repo, project.tags.join(', '));
    }
  }
}

function hasDetailedStack(stack) {
  return Object.keys(stack).some((k) => ['standards', 'components', 'doctype'].includes(k));
}

console.log('\nRe-run is manual: update projects.ts from this output or wire a full file writer.');
