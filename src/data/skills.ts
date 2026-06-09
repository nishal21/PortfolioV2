export interface SkillCategory {
  title: string;
  skills: readonly string[];
  accent: string;
  featured?: boolean;
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'AMV & Video Editing',
    skills: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Sony Vegas', 'Blurrr', 'Motion Graphics'],
    accent: 'green',
    featured: true,
  },
  {
    title: 'Music Production',
    skills: ['FL Studio', 'Ableton Live', 'Logic Pro', 'Remix & Fusion', 'Reverb Design', 'Audio Engineering'],
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
    skills: [
      'DaVinci Resolve',
      'After Effects',
      'Premiere Pro',
      'AMV & Cinematic Edits',
      'Color Grading',
      'Blurrr',
    ],
  },
  {
    title: 'Music',
    skills: ['FL Studio', 'Remix & Fusion', 'Reverb Design', 'Ableton Live', 'Audio Engineering', 'Sound Design'],
  },
  {
    title: 'Code',
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Rust', 'Gemini API'],
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
