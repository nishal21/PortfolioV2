export interface SkillCategory {
  title: string;
  skills: readonly string[];
  accent: string;
  featured?: boolean;
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'AMV & Video Editing',
    skills: [
      'DaVinci Resolve',
      'After Effects',
      'Premiere Pro',
      'CapCut',
      'VN',
      'Blurrr',
      'Color Grading',
      'Motion Graphics',
    ],
    accent: 'green',
    featured: true,
  },
  {
    title: 'Music Production',
    skills: ['FL Studio', 'Logic Pro', 'Remix & Fusion', 'Reverb Design', 'Audio Engineering', 'Sound Design'],
    accent: 'purple',
  },
  {
    title: '2D & 3D Animation',
    skills: ['2D Animation', '3D Modeling', 'Character Design', 'Motion Graphics', 'Voxel Art', 'Rigging'],
    accent: 'cyan',
  },
  {
    title: 'Visual Effects',
    skills: ['Color Grading', 'Transitions', 'Anime Effects', 'Compositing', 'Cinematic Edits'],
    accent: 'pink',
  },
  {
    title: 'Web Development',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Rust'],
    accent: 'blue',
  },
  {
    title: 'Game Development',
    skills: ['Unity (Learning)', 'Game Design', 'C# (Planned)', 'Level Design', 'Game Mechanics'],
    accent: 'emerald',
  },
];

export const craftPillars = [
  {
    title: 'Edit',
    blurb: 'Cuts, grade, and motion for AMV and short-form.',
    skills: [
      'DaVinci Resolve',
      'After Effects',
      'Premiere Pro',
      'CapCut',
      'VN',
      'AMV & Cinematic Edits',
      'Color Grading',
      'Blurrr',
    ],
  },
  {
    title: 'Music',
    blurb: 'Remix, reverb, and fusion production.',
    skills: ['FL Studio', 'Remix & Fusion', 'Reverb Design', 'Audio Engineering', 'Sound Design'],
  },
  {
    title: 'Code',
    blurb: 'Apps and tools that have to ship with the edit.',
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Rust'],
  },
] as const;

export const skillBadges = [
  'AMV Editor',
  'Music Producer',
  'Remix Artist',
  'Video Creator',
  'Full-Stack Dev',
] as const;

export const accentMap: Record<string, string> = {
  green: 'border-green-500/30 bg-green-500/5',
  purple: 'border-purple-500/30 bg-purple-500/5',
  cyan: 'border-cyan-500/30 bg-cyan-500/5',
  pink: 'border-pink-500/30 bg-pink-500/5',
  blue: 'border-blue-500/30 bg-blue-500/5',
  emerald: 'border-emerald-500/30 bg-emerald-500/5',
};
