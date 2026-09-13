/**
 * Writes public/robots.txt from src/lib/seo.ts indexable paths.
 * Run: npm run generate:robots
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getIndexablePaths, SITE_URL } from '../src/lib/seo';

const root = join(import.meta.dirname, '..');
const paths = getIndexablePaths().sort((a, b) => a.localeCompare(b));

const crawlers = [
  'Googlebot',
  'Googlebot-Image',
  'Googlebot-News',
  'Googlebot-Video',
  'Google-InspectionTool',
  'Storebot-Google',
  'Bingbot',
  'msnbot',
  'Slurp',
  'DuckDuckBot',
  'Baiduspider',
  'YandexBot',
  'applebot',
  'facebot',
  'facebookexternalhit',
  'LinkedInBot',
  'Twitterbot',
  'Pinterestbot',
  'Discordbot',
  'TelegramBot',
  'GPTBot',
  'ChatGPT-User',
  'ClaudeBot',
  'anthropic-ai',
  'PerplexityBot',
  'Bytespider',
  'cohere-ai',
];

const botRules = [
  'Allow: /',
  'Disallow: /api/',
  // Keep chunks crawlable for rendering; block only hashed media fonts Google was indexing.
  'Disallow: /_next/static/media/',
  'Disallow: /feed.xml',
  'Disallow: /rss.xml',
  'Disallow: /manifest.webmanifest',
];

const lines = [
  '# nishal.dev — allow crawlers; explicit public pages listed below',
  '# Auto-maintained: npm run generate:robots',
  '',
  '# Search, social, and AI crawlers',
  ...crawlers.flatMap((bot) => [`User-agent: ${bot}`, ...botRules, '']),
  '# Default rule',
  'User-agent: *',
  'Disallow: /api/',
  'Disallow: /_next/static/media/',
  'Disallow: /feed.xml',
  'Disallow: /rss.xml',
  'Disallow: /manifest.webmanifest',
  ...paths.map((path) => `Allow: ${path}`),
  '',
  `Sitemap: ${SITE_URL}/sitemap.xml`,
  '',
];

writeFileSync(join(root, 'public', 'robots.txt'), lines.join('\n'), 'utf8');
console.log(`Wrote public/robots.txt (${paths.length} paths, ${crawlers.length} crawlers)`);
