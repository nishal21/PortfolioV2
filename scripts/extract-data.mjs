import fs from 'fs';

function extractArray(file, varName) {
  const src = fs.readFileSync(file, 'utf8');
  const start = src.indexOf(`const ${varName} = [`);
  if (start === -1) throw new Error(`not found ${varName} in ${file}`);
  let i = src.indexOf('[', start);
  let depth = 0;
  let end = i;
  for (; end < src.length; end++) {
    if (src[end] === '[') depth++;
    if (src[end] === ']') {
      depth--;
      if (depth === 0) {
        end++;
        break;
      }
    }
  }
  return src.slice(i, end);
}

fs.mkdirSync('src/data', { recursive: true });

const projects = extractArray('src/components/ProjectsSection.tsx', 'projects');
fs.writeFileSync(
  'src/data/projects.ts',
  `export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  tags: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  color: string;
  bgColor: string;
  challenges: string[];
  solutions: string[];
  features: string[];
  techStack: Record<string, string[]>;
}

export const projects: Project[] = ${projects};

export function getProjectThumbnail(id: number): string | null {
  const map: Record<number, string> = { 5: '/pro/4.png', 6: '/pro/5.png', 7: '/pro/6.png' };
  if (map[id]) return map[id];
  if ([1, 2, 3, 5, 6, 7, 8, 9, 10].includes(id)) return \`/pro/\${id}.png\`;
  return null;
}
`
);

const videos = extractArray('src/components/VideoGallery.tsx', 'videos');
fs.writeFileSync(
  'src/data/videos.ts',
  `export interface Video {
  id: number;
  title: string;
  category: string;
  thumbnail: string;
  duration: string;
  views: string;
  date: string;
  description: string;
  youtubeId: string;
  tags: string[];
  client: string;
  role: string;
  equipment: string[];
}

export const videos: Video[] = ${videos};

export const videoCategories = [
  { id: 'all', label: 'All Videos' },
  { id: 'music-remix', label: 'Music Remixes' },
  { id: 'amv', label: 'AMV' },
  { id: 'gaming', label: 'Gaming Edits' },
  { id: 'automotive', label: 'Automotive' },
  { id: 'anime-content', label: 'Anime Content' },
] as const;
`
);

console.log('Done');
