import fs from 'fs';

const path = 'src/data/projects.ts';
const src = fs.readFileSync(path, 'utf8');
const match = src.match(/export const projects: Project\[\] = \[([\s\S]*?)\];/);
if (!match) throw new Error('projects array not found');
const projects = eval('[' + match[1] + ']');

const sigil = {
  id: 13,
  title: 'Sigil-extractor',
  category: 'Cryptography · Rust',
  status: 'live',
  pinned: true,
  description:
    'Zero-knowledge cryptographic steganography for AI dataset licensing — embed and verify license proofs in data.',
  longDescription:
    'Sigil-extractor is a Rust steganography engine for AI dataset licensing. It hides and recovers cryptographic license proofs inside datasets with zero-knowledge guarantees — built for creators and teams who need traceable, verifiable data rights.',
  tags: ['Rust', 'Cryptography', 'Steganography', 'Zero-Knowledge', 'Open Source'],
  liveUrl: 'https://nishal21.github.io/Sigil-extractor/',
  githubUrl: 'https://github.com/nishal21/Sigil-extractor',
  color: 'from-violet-400 to-indigo-500',
  bgColor: 'from-violet-400/10 to-indigo-500/10',
  challenges: ['ZK proof embedding in binary data', 'Recoverable without server trust'],
  solutions: ['Rust-native crypto pipeline', 'Browser demo on GitHub Pages'],
  features: ['License proof embedding', 'Verification workflow', 'Open source', 'Rust core'],
  techStack: { core: ['Rust'], crypto: ['Steganography', 'Zero-Knowledge'], deployment: ['GitHub Pages'] },
  images: ['/projects/sigil-extractor.svg'],
};

if (!projects.find((p) => p.title === 'Sigil-extractor')) {
  projects.push(sigil);
}

const pinnedTitles = new Set([
  'Publicolio',
  'NekoDroid',
  'Sigil-extractor',
  'NekoBeat',
  'CarbonLint',
  'Extracto',
]);

for (const p of projects) {
  p.pinned = pinnedTitles.has(p.title);
}

const byTitle = Object.fromEntries(projects.map((p) => [p.title, p]));
const order = [
  'NekoBeat',
  'NMHelper',
  'NekoDroid',
  'Publicolio',
  'Sigil-extractor',
  'CarbonLint',
  'Extracto',
  'Otazumi',
  'OtakuPulse',
  'Musico',
  'ARGUS',
  'Veyra',
  'Askira',
];

const ordered = order.map((t) => {
  if (!byTitle[t]) throw new Error('missing project: ' + t);
  return byTitle[t];
});

const body = ordered
  .map((p) => JSON.stringify(p, null, 2))
  .map((block) => block.split('\n').map((l) => '  ' + l).join('\n'))
  .join(',\n');

const iface = src.split('export const projects')[0];
const tail = src.slice(src.indexOf('export function getProjectThumbnail'));
const out = iface + 'export const projects: Project[] = [\n' + body + '\n];\n\n' + tail;

fs.writeFileSync(path, out);
console.log('synced', ordered.length, 'projects:', ordered.map((p) => p.title).join(' → '));
