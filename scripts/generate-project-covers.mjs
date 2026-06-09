import fs from 'fs';
import path from 'path';

const outDir = path.join('public', 'projects');
fs.mkdirSync(outDir, { recursive: true });

/** @typedef {{ slug: string; title: string; sub: string; badge?: string; c1: string; c2: string; accent: string; motif: string }} Cover */

const covers = /** @type {Cover[]} */ ([
  { slug: 'neko-beat', title: 'NekoBeat', sub: 'Music aggregator', badge: 'LIVE', c1: '#120818', c2: '#5b21b6', accent: '#f472b6', motif: 'music' },
  { slug: 'nmhelper', title: 'NMHelper', sub: 'Kerala schools', badge: 'LIVE', c1: '#1a0a04', c2: '#9a3412', accent: '#fdba74', motif: 'school' },
  { slug: 'neko-droid', title: 'NekoDroid', sub: 'Wasm · Android', badge: 'DEV', c1: '#060a10', c2: '#0e7490', accent: '#a6c78c', motif: 'android' },
  { slug: 'sigil-extractor', title: 'Sigil', sub: 'Crypto steganography', badge: 'LIVE', c1: '#0a0612', c2: '#5b21b6', accent: '#c4b5fd', motif: 'sigil' },
  { slug: 'publicolio', title: 'Publicolio', sub: 'GitHub portfolios', badge: 'LIVE', c1: '#030712', c2: '#1d4ed8', accent: '#93c5fd', motif: 'portfolio' },
  { slug: 'extracto', title: 'Extracto', sub: 'AI web scraper', badge: 'LIVE', c1: '#02150d', c2: '#047857', accent: '#6ee7b7', motif: 'scraper' },
  { slug: 'carbonlint', title: 'CarbonLint', sub: 'Green profiling', badge: 'LIVE', c1: '#031a0c', c2: '#15803d', accent: '#bbf7d0', motif: 'carbon' },
  { slug: 'otazumi', title: 'Otazumi', sub: 'Anime streaming', badge: 'LIVE', c1: '#041210', c2: '#0f766e', accent: '#5eead4', motif: 'anime' },
  { slug: 'otaku-pulse', title: 'OtakuPulse', sub: 'Discord bot', badge: 'LIVE', c1: '#0c0a1f', c2: '#4338ca', accent: '#a5b4fc', motif: 'discord' },
  { slug: 'musico', title: 'Musico', sub: 'Music discovery', badge: 'LIVE', c1: '#18061f', c2: '#a21caf', accent: '#e879f9', motif: 'discover' },
  { slug: 'argus', title: 'ARGUS', sub: 'Geo intelligence', badge: 'LIVE', c1: '#020403', c2: '#14532d', accent: '#4ade80', motif: 'globe' },
  { slug: 'veyra', title: 'Veyra', sub: 'Programming language', badge: 'LIVE', c1: '#0f0a1e', c2: '#6d28d9', accent: '#c4b5fd', motif: 'code' },
  { slug: 'askira', title: 'Askira', sub: 'Form builder', badge: 'DEV', c1: '#0c0d10', c2: '#374151', accent: '#d4a854', motif: 'forms' },
  { slug: 'github-stars-organizer', title: 'Stars Org', sub: 'GitHub star lists', badge: 'LIVE', c1: '#0a0c14', c2: '#ca8a04', accent: '#fde68a', motif: 'stars' },
]);

const MOTIF_CX = 960;
const MOTIF_CY = 540;

function motifSvg(type, accent) {
  const cx = MOTIF_CX;
  const cy = MOTIF_CY;
  const a = accent;
  const o = 0.5;

  switch (type) {
    case 'music': {
      const bars = [40, 60, 78, 52, 70, 44, 64];
      const startX = cx - ((bars.length - 1) * 16) / 2 - 6;
      return `<g opacity="${o}">${bars
        .map((h, i) => {
          const x = startX + i * 16;
          return `<rect x="${x}" y="${cy - h / 2}" width="12" height="${h}" rx="6" fill="${a}"/>`;
        })
        .join('')}</g>`;
    }
    case 'school':
      return `<g opacity="${o}" transform="translate(${cx - 58} ${cy - 50})">
        <path d="M58 16 L108 40 L58 64 L8 40 Z" fill="none" stroke="${a}" stroke-width="2.5"/>
        <path d="M24 46 V76 H92 V46" fill="none" stroke="${a}" stroke-width="2.5"/>
        <rect x="48" y="56" width="20" height="20" rx="2" fill="${a}" opacity="0.35"/>
      </g>`;
    case 'android':
      return `<g opacity="${o}" transform="translate(${cx - 46} ${cy - 78})">
        <rect x="0" y="0" width="92" height="156" rx="14" fill="none" stroke="${a}" stroke-width="2.5"/>
        <rect x="10" y="20" width="72" height="116" rx="5" fill="${a}" opacity="0.12"/>
        <circle cx="46" cy="10" r="3" fill="${a}"/>
      </g>`;
    case 'sigil':
      return `<g opacity="${o}">
        <circle cx="${cx}" cy="${cy}" r="58" fill="none" stroke="${a}" stroke-width="2"/>
        <path d="M${cx} ${cy - 38} L${cx + 34} ${cy + 30} L${cx - 34} ${cy + 30} Z" fill="${a}" opacity="0.18" stroke="${a}" stroke-width="1.5"/>
      </g>`;
    case 'portfolio':
      return `<g opacity="${o}" transform="translate(${cx - 64} ${cy - 80})">
        <rect x="0" y="0" width="128" height="160" rx="12" fill="none" stroke="${a}" stroke-width="2"/>
        <circle cx="38" cy="42" r="18" fill="${a}" opacity="0.25"/>
        <rect x="66" y="32" width="46" height="6" rx="3" fill="${a}" opacity="0.4"/>
        <rect x="66" y="46" width="32" height="5" rx="2.5" fill="${a}" opacity="0.25"/>
        <rect x="18" y="80" width="90" height="6" rx="3" fill="${a}" opacity="0.2"/>
        <rect x="18" y="94" width="70" height="6" rx="3" fill="${a}" opacity="0.15"/>
      </g>`;
    case 'scraper':
      return `<g opacity="${o}">
        <circle cx="${cx}" cy="${cy}" r="52" fill="none" stroke="${a}" stroke-width="2"/>
        <line x1="${cx - 32}" y1="${cy - 32}" x2="${cx + 32}" y2="${cy + 32}" stroke="${a}" stroke-width="2"/>
        <line x1="${cx + 32}" y1="${cy - 32}" x2="${cx - 32}" y2="${cy + 32}" stroke="${a}" stroke-width="2"/>
        <circle cx="${cx}" cy="${cy}" r="10" fill="${a}" opacity="0.4"/>
      </g>`;
    case 'carbon':
      return `<g opacity="${o}">
        <path d="M${cx} ${cy + 56} Q${cx - 64} ${cy} ${cx} ${cy - 56} Q${cx + 64} ${cy} ${cx} ${cy + 56}" fill="${a}" opacity="0.12" stroke="${a}" stroke-width="1.5"/>
        <text x="${cx}" y="${cy + 6}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="24" font-weight="700" fill="${a}">CO₂</text>
      </g>`;
    case 'anime':
      return `<g opacity="${o}">
        <polygon points="${cx},${cy - 56} ${cx + 48},${cy + 40} ${cx - 48},${cy + 40}" fill="${a}" opacity="0.18" stroke="${a}" stroke-width="1.5"/>
        <polygon points="${cx},${cy - 16} ${cx + 14},${cy + 22} ${cx - 14},${cy + 22}" fill="${a}" opacity="0.45"/>
      </g>`;
    case 'discord':
      return `<g opacity="${o}" transform="translate(${cx - 60} ${cy - 44})">
        <path d="M0 32 Q60 0 120 32 L108 76 Q60 96 12 76 Z" fill="${a}" opacity="0.12" stroke="${a}" stroke-width="2"/>
        <circle cx="36" cy="42" r="11" fill="${a}" opacity="0.35"/>
        <circle cx="84" cy="42" r="11" fill="${a}" opacity="0.35"/>
      </g>`;
    case 'discover':
      return `<g opacity="${o}">
        <circle cx="${cx - 28}" cy="${cy}" r="22" fill="none" stroke="${a}" stroke-width="1.5"/>
        <circle cx="${cx}" cy="${cy}" r="22" fill="none" stroke="${a}" stroke-width="1.5"/>
        <circle cx="${cx + 28}" cy="${cy}" r="22" fill="none" stroke="${a}" stroke-width="1.5"/>
      </g>`;
    case 'globe':
      return `<g opacity="${o}">
        <circle cx="${cx}" cy="${cy}" r="62" fill="none" stroke="${a}" stroke-width="2"/>
        <ellipse cx="${cx}" cy="${cy}" rx="62" ry="22" fill="none" stroke="${a}" stroke-width="1.25"/>
        <line x1="${cx - 62}" y1="${cy}" x2="${cx + 62}" y2="${cy}" stroke="${a}" stroke-width="1.25"/>
      </g>`;
    case 'code':
      return `<g opacity="${o}" stroke="${a}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M${cx - 44} ${cy + 40} L${cx - 76} ${cy} L${cx - 44} ${cy - 40}"/>
        <path d="M${cx + 44} ${cy - 40} L${cx + 76} ${cy} L${cx + 44} ${cy + 40}"/>
      </g>`;
    case 'forms':
      return `<g opacity="${o}" transform="translate(${cx - 64} ${cy - 72})">
        <rect x="0" y="0" width="128" height="144" rx="10" fill="none" stroke="${a}" stroke-width="2"/>
        <rect x="16" y="22" width="96" height="11" rx="3" fill="${a}" opacity="0.3"/>
        <rect x="16" y="44" width="96" height="11" rx="3" fill="${a}" opacity="0.22"/>
        <rect x="16" y="66" width="64" height="11" rx="3" fill="${a}" opacity="0.18"/>
        <rect x="16" y="104" width="44" height="18" rx="5" fill="${a}" opacity="0.35"/>
      </g>`;
    case 'stars':
      return `<g opacity="${o}" fill="${a}">
        <polygon points="${cx},${cy - 52} ${cx + 14},${cy - 18} ${cx + 48},${cy - 14} ${cx + 22},${cy + 10} ${cx + 30},${cy + 46} ${cx},${cy + 28} ${cx - 30},${cy + 46} ${cx - 22},${cy + 10} ${cx - 48},${cy - 14} ${cx - 14},${cy - 18}" opacity="0.55"/>
        <polygon points="${cx - 56},${cy + 8} ${cx - 48},${cy + 22} ${cx - 34},${cy + 24} ${cx - 44},${cy + 34} ${cx - 40},${cy + 48} ${cx - 56},${cy + 40} ${cx - 72},${cy + 48} ${cx - 68},${cy + 34} ${cx - 78},${cy + 24} ${cx - 64},${cy + 22}" opacity="0.28"/>
        <polygon points="${cx + 56},${cy + 8} ${cx + 64},${cy + 22} ${cx + 78},${cy + 24} ${cx + 68},${cy + 34} ${cx + 72},${cy + 48} ${cx + 56},${cy + 40} ${cx + 40},${cy + 48} ${cx + 44},${cy + 34} ${cx + 34},${cy + 24} ${cx + 48},${cy + 22}" opacity="0.28"/>
      </g>`;
    default:
      return '';
  }
}

function titleSize(title) {
  if (title.length <= 6) return 72;
  if (title.length <= 10) return 56;
  return 46;
}

function buildCover(c) {
  const uid = c.slug.replace(/[^a-z0-9]/g, '');
  const badgeFill = c.badge === 'DEV' ? '#d4a854' : '#a6c78c';
  const badgeText = c.badge === 'DEV' ? '#1a1204' : '#061008';
  const titleFs = titleSize(c.title);
  const titleY = 248;
  const subY = titleY + titleFs * 0.5 + 18;
  const badgeW = c.badge === 'DEV' ? 64 : 68;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800">
  <defs>
    <linearGradient id="bg-${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c.c1}"/>
      <stop offset="100%" stop-color="${c.c2}"/>
    </linearGradient>
    <radialGradient id="glow-${uid}" cx="72%" cy="58%" r="48%">
      <stop offset="0%" stop-color="${c.accent}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${c.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1280" height="800" fill="url(#bg-${uid})"/>
  <rect width="1280" height="800" fill="url(#glow-${uid})"/>

  ${motifSvg(c.motif, c.accent)}

  <rect x="72" y="72" width="${badgeW}" height="26" rx="13" fill="${badgeFill}"/>
  <text x="${72 + badgeW / 2}" y="90" text-anchor="middle" font-family="system-ui,Segoe UI,sans-serif" font-size="10" font-weight="700" fill="${badgeText}" letter-spacing="1.5">${c.badge}</text>

  <text x="72" y="${titleY}" font-family="system-ui,Segoe UI,sans-serif" font-size="${titleFs}" font-weight="700" fill="#f8f6f2" letter-spacing="-2">${c.title}</text>
  <text x="74" y="${subY}" font-family="system-ui,Segoe UI,sans-serif" font-size="20" font-weight="500" fill="${c.accent}" opacity="0.92">${c.sub}</text>
  <rect x="72" y="${subY + 22}" width="80" height="3" rx="1.5" fill="${c.accent}" opacity="0.75"/>
</svg>`;
}

for (const c of covers) {
  fs.writeFileSync(path.join(outDir, `${c.slug}.svg`), buildCover(c));
  console.log('wrote', c.slug);
}
