import { buildRssFeedXml } from '@/lib/rss';

export const dynamic = 'force-static';

export function GET() {
  const xml = buildRssFeedXml();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
