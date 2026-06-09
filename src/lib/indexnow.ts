import { INDEXNOW_KEY, SITE_URL, getIndexableUrls } from '@/lib/seo';

const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
];

export function getIndexNowPayload(urls = getIndexableUrls()) {
  const host = new URL(SITE_URL).host;

  return {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };
}

export async function submitIndexNow(urls?: string[]) {
  const payload = getIndexNowPayload(urls);
  const results: { endpoint: string; ok: boolean; status: number }[] = [];

  await Promise.all(
    INDEXNOW_ENDPOINTS.map(async (endpoint) => {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      });

      results.push({ endpoint, ok: response.ok, status: response.status });
    })
  );

  return { payload, results };
}
