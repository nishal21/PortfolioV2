import { projects, getProjectSlug } from '@/data/projects';
import { videos } from '@/data/videos';
import {
  CREATOR_NAME,
  GITHUB_HANDLE,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  metaDescription,
  projectDescription,
} from '@/lib/seo';

export const FEED_PATH = '/feed.xml';

export interface RssItem {
  id: string;
  title: string;
  link: string;
  description: string;
  pubDate: Date;
  category?: string;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(date: Date) {
  return date.toUTCString();
}

function parseVideoDate(raw: string): Date {
  const parsed = Date.parse(raw);
  return Number.isFinite(parsed) ? new Date(parsed) : new Date('2024-01-01');
}

function projectItems(): RssItem[] {
  return projects.map((project) => {
    const slug = getProjectSlug(project);
    const link = absoluteUrl(`/projects/${slug}`);
    const pubDate = project.lastUpdated
      ? new Date(`${project.lastUpdated}T12:00:00+05:30`)
      : new Date('2025-01-01T12:00:00+05:30');

    return {
      id: link,
      title: `${project.title} — ${project.category}`,
      link,
      description: projectDescription(project.title, project.longDescription || project.description),
      pubDate,
      category: project.category,
    };
  });
}

function videoItems(): RssItem[] {
  return videos.map((video) => {
    const link = `https://www.youtube.com/watch?v=${video.youtubeId}`;
    return {
      id: link,
      title: video.title,
      link,
      description: `${video.description} · ${CREATOR_NAME} (@DemonKing0.___) · ${video.role}`,
      pubDate: parseVideoDate(video.date),
      category: 'YouTube',
    };
  });
}

function siteItems(): RssItem[] {
  const pages = [
    {
      path: '/projects',
      title: 'Projects — open source & creative work',
      description: `All projects by ${CREATOR_NAME} (${GITHUB_HANDLE}) on nishal.dev.`,
      pubDate: new Date('2026-06-01T12:00:00+05:30'),
      category: 'Portfolio',
    },
    {
      path: '/about',
      title: 'About Nishal K',
      description: `About ${CREATOR_NAME} — AMV editor, music producer, and developer from Kerala.`,
      pubDate: new Date('2026-05-01T12:00:00+05:30'),
      category: 'Portfolio',
    },
    {
      path: '/profile',
      title: 'Profile — Nishal K (nishal21)',
      description: `Professional profile for ${CREATOR_NAME} (${GITHUB_HANDLE}).`,
      pubDate: new Date('2026-05-01T12:00:00+05:30'),
      category: 'Portfolio',
    },
  ];

  return pages.map((page) => {
    const link = absoluteUrl(page.path);
    return {
      id: link,
      title: page.title,
      link,
      description: page.description,
      pubDate: page.pubDate,
      category: page.category,
    };
  });
}

export function getRssItems(limit = 50): RssItem[] {
  return [...projectItems(), ...videoItems(), ...siteItems()]
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, limit);
}

export function buildRssFeedXml() {
  const feedUrl = absoluteUrl(FEED_PATH);
  const items = getRssItems();
  const lastBuild = items[0]?.pubDate ?? new Date();
  const imageUrl = absoluteUrl('/og-image.jpg');

  const channel = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(metaDescription())}</description>
    <language>en-in</language>
    <copyright>Copyright ${new Date().getFullYear()} ${escapeXml(CREATOR_NAME)}</copyright>
    <managingEditor>${escapeXml(GITHUB_HANDLE)}@users.noreply.github.com (${escapeXml(CREATOR_NAME)})</managingEditor>
    <webMaster>${escapeXml(GITHUB_HANDLE)}@users.noreply.github.com (${escapeXml(CREATOR_NAME)})</webMaster>
    <lastBuildDate>${toRfc822(lastBuild)}</lastBuildDate>
    <pubDate>${toRfc822(lastBuild)}</pubDate>
    <ttl>1440</ttl>
    <image>
      <url>${escapeXml(imageUrl)}</url>
      <title>${escapeXml(SITE_NAME)}</title>
      <link>${escapeXml(SITE_URL)}</link>
    </image>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    ${items
      .map(
        (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.id)}</guid>
      <pubDate>${toRfc822(item.pubDate)}</pubDate>
      <description>${escapeXml(item.description)}</description>${item.category ? `\n      <category>${escapeXml(item.category)}</category>` : ''}
    </item>`
      )
      .join('\n')}
  </channel>
</rss>`;

  return channel;
}
