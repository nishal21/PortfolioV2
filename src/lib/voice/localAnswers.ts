/**
 * Deterministic quick answers built only from this repo's data files.
 * Not AI: keyword matching over personal/projects/skills/contact. If nothing
 * matches, it says so and points to the contact form instead of guessing.
 */
import { personal } from '@/data/personal';
import { getProjectSlug, projects, type Project } from '@/data/projects';
import { skillCategories } from '@/data/skills';
import { socialLinks, supportLinks } from '@/data/contact';

export interface QuickLink {
  label: string;
  href: string;
}

export interface QuickAnswer {
  text: string;
  links: QuickLink[];
}

export const SUGGESTED_QUESTIONS = [
  'Who is Nishal?',
  'What are you building right now?',
  'Tell me about FirstPR',
  'Tell me about NekoBeat',
  'How can I contact you?',
] as const;

const EMAIL = 'nishal@nishal.dev';

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}\s.+#-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function projectHref(p: Project) {
  return `/projects/${getProjectSlug(p)}`;
}

function findProject(q: string): Project | undefined {
  const words = q.split(' ');
  // Prefer the longest title match so "nekobeat" beats generic words.
  return [...projects]
    .sort((a, b) => b.title.length - a.title.length)
    .find((p) => {
      const t = norm(p.title);
      const slug = getProjectSlug(p).replace(/-/g, ' ');
      return words.includes(t) || (t.includes(' ') && q.includes(t)) || q.includes(slug) && slug.length > 3;
    });
}

const has = (q: string, ...keys: string[]) => keys.some((k) => new RegExp(`(^|\\s)${k}`).test(q));

export function answer(question: string): QuickAnswer {
  const q = norm(question);
  if (!q) return { text: 'Ask about my projects, tools, background or how to reach me.', links: [] };

  const project = findProject(q);
  if (project) {
    const status = project.status === 'development' ? 'Still in development.' : project.liveUrl ? 'It is live.' : '';
    const links: QuickLink[] = [{ label: `${project.title} case study`, href: projectHref(project) }];
    if (project.liveUrl) links.push({ label: 'Open live site', href: project.liveUrl });
    if (project.githubUrl) links.push({ label: 'Source on GitHub', href: project.githubUrl });
    return {
      text: `${project.title} (${project.category}). ${project.description} ${status}`.trim(),
      links,
    };
  }

  if (has(q, 'contact', 'email', 'mail', 'reach', 'hire', 'message', 'collab', 'freelance', 'work with')) {
    return {
      text: `Email ${EMAIL}, or use the contact form at the bottom of the homepage. I read everything.`,
      links: [
        { label: EMAIL, href: `mailto:${EMAIL}` },
        { label: 'Contact form', href: '/#contact' },
      ],
    };
  }

  if (has(q, 'support', 'donate', 'sponsor', 'coffee', 'patreon', 'ko-fi', 'kofi', 'fund')) {
    return {
      text: 'You can back the work through any of these. Thank you.',
      links: supportLinks.map((s) => ({ label: s.label, href: s.href })),
    };
  }

  if (has(q, 'social', 'github', 'youtube', 'instagram', 'linkedin', 'twitter', 'x ', 'peerlist', 'follow')) {
    return {
      text: 'Edits and remixes live on YouTube; code is on GitHub as nishal21.',
      links: socialLinks.map((s) => ({ label: s.label, href: s.href })),
    };
  }

  if (has(q, 'skill', 'tool', 'stack', 'software', 'use', 'tech', 'language', 'premiere', 'after effects', 'fl studio', 'react', 'next')) {
    const lines = skillCategories.map((c) => `${c.title}: ${c.skills.slice(0, 3).join(', ')}`);
    return { text: lines.join('. ') + '.', links: [{ label: 'All skills', href: '/#skills' }] };
  }

  if (has(q, 'project', 'build', 'building', 'made', 'app', 'portfolio', 'work', 'latest', 'now', 'current')) {
    const live = projects.filter((p) => p.pinned || p.status === 'live').slice(0, 5);
    const pick = live.length ? live : projects.slice(0, 5);
    const latest = personal.timeline[personal.timeline.length - 1];
    return {
      text: `In ${latest.year}: ${latest.event}. A few to start with: ${pick.map((p) => p.title).join(', ')}.`,
      links: [...pick.slice(0, 3).map((p) => ({ label: p.title, href: projectHref(p) })), { label: 'All projects', href: '/projects' }],
    };
  }

  if (has(q, 'amv', 'edit', 'video', 'music', 'remix', 'beat', 'produc')) {
    return {
      text: 'AMV edits in Premiere Pro, After Effects and DaVinci Resolve; remixes in FL Studio. The best of them are in the videos section.',
      links: [
        { label: 'Videos', href: '/#videos' },
        { label: 'YouTube', href: socialLinks.find((s) => s.label === 'YouTube')?.href ?? '/#videos' },
      ],
    };
  }

  if (has(q, 'where', 'location', 'from', 'live', 'kerala', 'india', 'age', 'old')) {
    return { text: `${personal.location}. I'm ${personal.age}.`, links: [{ label: 'About', href: '/about' }] };
  }

  if (has(q, 'who', 'about', 'yourself', 'nishal', 'hi', 'hello', 'hey', 'intro', 'bio')) {
    return { text: `${personal.tagline}. ${personal.bio[0]}`, links: [{ label: 'Read more', href: '/about' }] };
  }

  return {
    text: `I don't have a quick answer for that on this site. Email ${EMAIL} and I'll reply myself.`,
    links: [{ label: 'Contact form', href: '/#contact' }],
  };
}
