#!/usr/bin/env node
/**
 * Submit all indexable URLs to IndexNow (Bing + api.indexnow.org).
 * Usage: node scripts/indexnow-ping.mjs [site-url]
 * Example: node scripts/indexnow-ping.mjs https://nishal.dev
 */

const SITE_URL = (process.argv[2] ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nishal.dev').replace(/\/$/, '');
const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? 'f8c2a41e9b3d7046e1a5c890d7f6b2e4';
const SECRET = process.env.INDEXNOW_SECRET;

async function main() {
  const endpoint = `${SITE_URL}/api/indexnow`;
  const headers = { 'Content-Type': 'application/json' };
  if (SECRET) headers.Authorization = `Bearer ${SECRET}`;

  console.log(`Pinging IndexNow via ${endpoint} ...`);

  const response = await fetch(endpoint, { method: 'POST', headers, body: '{}' });
  const data = await response.json();

  if (!response.ok) {
    console.error('Failed:', data);
    process.exit(1);
  }

  console.log('Submitted:', data.submitted, 'URLs');
  console.log('Key file:', data.keyLocation ?? `${SITE_URL}/${INDEXNOW_KEY}.txt`);
  console.log('Results:', data.results ?? data);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
