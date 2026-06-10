import type { Metadata } from 'next';
import { CREATOR_NAME, SITE_NAME } from '@/lib/seo';
import { videoUploadDateIso } from '@/lib/videoSchema';

/** ISO 8601 with timezone for Pinterest `article:published_time`. */
export function articlePublishedIso(date?: string): string {
  return videoUploadDateIso(date ?? '2025-01-01');
}

/**
 * Open Graph Article markup — enables Pinterest Article Rich Pins.
 * @see https://developers.pinterest.com/docs/web-features/article-rich-pins/
 */
export function buildArticleOpenGraph(input: {
  title: string;
  description: string;
  url: string;
  images: NonNullable<Metadata['openGraph']>['images'];
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}): NonNullable<Metadata['openGraph']> {
  const publishedTime = articlePublishedIso(input.publishedTime);
  const modifiedTime = articlePublishedIso(input.modifiedTime ?? input.publishedTime);

  return {
    title: input.title,
    description: input.description,
    url: input.url,
    siteName: SITE_NAME,
    images: input.images,
    locale: 'en_IN',
    type: 'article',
    publishedTime,
    modifiedTime,
    authors: [CREATOR_NAME],
    section: input.section,
    tags: input.tags,
  };
}
