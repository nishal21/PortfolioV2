/**
 * Resume content + role profiles.
 *
 * Edit `resumeBase` for facts that rarely change.
 * Tune `resumeProfiles` per job type (summary, section order, what to show).
 * Editor: /resume?profile=developer. Share: /resume/view or /resume/view/developer
 */

export type ResumeProfileId = 'general' | 'developer' | 'creative' | 'fullstack';

export interface ResumeContact {
  name: string;
  email: string;
  location: string;
  linkedin: string;
  peerlist: string;
  github: string;
  portfolio: string;
}

export interface ResumeExperience {
  id: string;
  organization: string;
  location?: string;
  dateRange: string;
  role: string;
  responsibilities: string[];
  impact: string[];
}

export interface ResumeEducation {
  degree: string;
  school: string;
  graduation: string;
}

export interface ResumeTechnicalSkills {
  programmingLanguages: string[];
  toolsSoftware: string[];
  databases: string[];
  aiMl: string[];
  other: string[];
}

export interface ResumeProfile {
  id: ResumeProfileId;
  label: string;
  summary: string;
  /** Experience entry ids in display order */
  experienceOrder: string[];
  /** Optional ids to hide for this profile */
  hiddenExperience?: string[];
  /** Tag filters for technical skill lines (omit line if empty after filter) */
  skillFocus?: 'all' | 'dev' | 'creative';
}

export const resumeContact: ResumeContact = {
  name: 'Nishal K',
  email: 'nishal@nishal.dev',
  location: 'Malappuram, Kerala, India',
  linkedin: 'https://www.linkedin.com/in/nishal-k',
  peerlist: 'https://peerlist.io/nishal21',
  github: 'https://github.com/nishal21',
  portfolio: 'https://nishal.dev',
};

export const resumeSummaries = {
  general:
    'I edit AMVs, make music in FL Studio, and build full-stack apps with React, Next.js, TypeScript, and Node.js. I am looking for work that mixes creative projects with shipping code, on the frontend, in media, or both. FirstPR, NekoBeat, Otazumi, NMHelper, Publicolio, and GitHub Stars Organizer are live on GitHub. My edits are on YouTube.',
  short:
    'AMV editor, music producer, and full-stack developer (React, Next.js, TypeScript, Node.js). Live apps and 60+ public repos on GitHub. Eighteen years old, five years into this work.',
  developer:
    'I build with React, Next.js, TypeScript, Node.js, and Python. FirstPR, NMHelper, Otazumi, Publicolio, NekoBeat, and GitHub Stars Organizer are live or published. I handle APIs, databases, UI, and deploys myself. Looking for a software role where I own features from schema through deploy.',
  creative:
    'Five years editing AMVs and producing remixes on YouTube (@DemonKing0.___). I cut in Premiere Pro, After Effects, and DaVinci Resolve. I mix in FL Studio. I also build my own sites and tools when I need them. Open to creative, media, or hybrid roles.',
  fullstack:
    'I shipped FirstPR (first open-source PR guidance at firstpr.nishal.dev), NMHelper (school meal tracking), Otazumi (anime streaming), Publicolio (GitHub portfolios), and music apps like NekoBeat and Musico. Stack: React, Next.js, TypeScript, Node.js, PostgreSQL, MongoDB, Rust. I can take a feature from the database schema through to deploy.',
} as const;

export const resumeTechnicalSkills: ResumeTechnicalSkills = {
  programmingLanguages: [
    'TypeScript',
    'JavaScript',
    'Rust',
    'Python',
    'HTML5',
    'CSS3',
    'C# (learning)',
  ],
  toolsSoftware: [
    'React',
    'Next.js',
    'Node.js',
    'Express',
    'Tailwind CSS',
    'Framer Motion',
    'Capacitor',
    'Git',
    'GitHub',
    'WebAssembly',
    'Unity (learning)',
    'Premiere Pro',
    'After Effects',
    'DaVinci Resolve',
    'Sony Vegas',
    'FL Studio',
    'Ableton Live',
    'Blurrr',
  ],
  databases: ['PostgreSQL', 'MongoDB'],
  aiMl: ['Google Gemini API', 'prompt-based scraping (Extracto)'],
  other: [
    'Full-stack web apps',
    'REST APIs',
    'GitHub Pages / Netlify / Render deploys',
    'AMV and video editing',
    'Music production and remixing',
    'Motion graphics',
    'Open-source maintenance',
  ],
};

const devTools = new Set([
  'React',
  'Next.js',
  'Node.js',
  'Express',
  'Tailwind CSS',
  'Framer Motion',
  'Capacitor',
  'Git',
  'GitHub',
  'WebAssembly',
  'Unity (learning)',
]);

const creativeTools = new Set([
  'Premiere Pro',
  'After Effects',
  'DaVinci Resolve',
  'Sony Vegas',
  'FL Studio',
  'Ableton Live',
  'Blurrr',
]);

export function getTechnicalSkillsForProfile(focus: ResumeProfile['skillFocus'] = 'all') {
  const base = resumeTechnicalSkills;
  if (focus === 'all') return base;

  if (focus === 'dev') {
    return {
      ...base,
      toolsSoftware: base.toolsSoftware.filter((t) => devTools.has(t)),
      other: base.other.filter(
        (s) =>
          !s.includes('AMV') &&
          !s.includes('music') &&
          !s.includes('motion graphics')
      ),
    };
  }

  return {
    programmingLanguages: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3'],
    toolsSoftware: base.toolsSoftware.filter((t) => creativeTools.has(t)),
    databases: [],
    aiMl: [],
    other: base.other.filter(
      (s) =>
        s.includes('AMV') ||
        s.includes('music') ||
        s.includes('motion') ||
        s.includes('video')
    ),
  };
}

export const resumeSoftSkills = [
  'Communication and teamwork',
  'Problem solving',
  'Time management',
  'Adaptability',
  'Self-directed learning',
  'Attention to detail (editing and code)',
  'English (fluent), Malayalam (native)',
] as const;

export const resumeExperience: ResumeExperience[] = [
  {
    id: 'nmhelper',
    organization: 'NMHelper',
    location: 'Malappuram, Kerala',
    dateRange: 'Jun 2025 - Present',
    role: 'Full-Stack Developer · Project Lead (Independent)',
    responsibilities: [
      'Built a noon-meal tracking app for Kerala schools with Malayalam forms and admin dashboards',
      'Built the frontend in React, Tailwind CSS, and Framer Motion for school clerks who do not live in tech',
      'Ran the backend on Node.js, Express, and PostgreSQL for strength logs and meal reports',
      'Added export flows with validation so schools could stop doing the counts on paper',
      'Tested against real school workflows and kept fixing field layout and copy',
      'Keep nmhelper.in live and updated',
    ],
    impact: [
      'App in use for school meal tracking in Kerala',
      'Less daily paperwork for strength and meal counts',
      'UI in English and Malayalam for local staff',
    ],
  },
  {
    id: 'github',
    organization: 'Independent Developer · GitHub (nishal21)',
    location: 'Remote',
    dateRange: 'Jan 2024 - Present',
    role: 'Full-Stack Developer · Open-Source Project Lead',
    responsibilities: [
      'Shipped live apps and tools under my name: FirstPR (firstpr.nishal.dev), NekoBeat, World News CLI (worldnews-cli on PyPI), Otazumi, Publicolio, Musico, OtakuPulse, CarbonLint, RYTU (rytu.nishal.dev), Handoff (send.nishal.dev), SANTRA (santra.nishal.dev)',
      'Built FirstPR at AIBoomi Startup Weekend with Anan Shaji. Match, Explain, and Review guide a first open-source PR. FirstPRbot posts maintainer comments. AGPL. The app does not write the contributor\'s fix.',
      'Built GitHub Stars Organizer, a Python CLI that sorts hundreds of starred repos into GitHub lists without a paid LLM',
      'Built Geo Q&A (capital_llm_model): geography answers from a verified database and Wikidata first, GPT-2 only as fallback. Published on Hugging Face and Ollama.',
      'Grew Otazumi into anime streaming with auth, reviews, mail, and watch parties',
      'Built Publicolio so people can turn a GitHub profile into a portfolio link',
      'Started NekoDroid, a browser Android emulator with a Rust core compiled to Wasm',
      'Work across React, Next.js, TypeScript, Node.js, Rust, MongoDB, and PostgreSQL',
      'Handle my own repos, deploys (GitHub Pages, Netlify, Render), and bug fixes',
    ],
    impact: [
      '60+ public repos on GitHub (nishal21)',
      'Live sites with users: firstpr.nishal.dev, otazumi.page, app.publicolio.qzz.io, musico21.netlify.app',
      'Pinned repos include FirstPR, music apps, anime projects, and developer tools',
    ],
  },
  {
    id: 'youtube',
    organization: 'YouTube · @DemonKing0.___',
    location: 'Remote',
    dateRange: '2021 - Present',
    role: 'AMV Editor · Music Producer · Content Creator',
    responsibilities: [
      'Cut AMVs in Premiere Pro, After Effects, and DaVinci Resolve',
      'Made remixes and tracks in FL Studio, timing hits to the edit',
      'Planned each video around beat drops, pacing, and color',
      'Uploaded edits and remixes and kept the channel organized',
      'Handled thumbnails, titles, and the upload workflow myself',
    ],
    impact: [
      'Five years of regular uploads',
      'Best video topped 80,000 views',
      'Channel is mostly AMV edits and remix production',
    ],
  },
  {
    id: 'otakupulse',
    organization: 'OtakuPulse',
    location: 'Personal Project',
    dateRange: 'Jul 2025 - Present',
    role: 'Backend Developer · Project Contributor',
    responsibilities: [
      'Wrote a Discord bot for anime and manga alerts, daily quotes, and trailer pings',
      'Connected AniList with rate-limited polling for new episodes',
      'Added a web dashboard so admins can set alerts per server',
      'Stored settings in MongoDB with Node.js and Discord.js',
      'Deployed the bot and dashboard on Render (otakupulse.onrender.com)',
    ],
    impact: [
      'Bot running on multiple Discord servers',
      'Episode alerts fire on their own instead of manual checks',
      'Built alone: bot, API, database, and admin UI',
    ],
  },
];

export const resumeEducation: ResumeEducation[] = [
  {
    degree: 'Higher Secondary (+2 / 12th)',
    school: 'IKTHSS Cherukulamba',
    graduation: '2027 (pursuing)',
  },
  {
    degree: 'Higher Secondary (+1 / 11th)',
    school: 'IKTHSS Cherukulamba',
    graduation: '2026',
  },
];

export const resumeAwards = [
  '3rd Place, State-Level Animation Competition (2023)',
  'A Grade, District-Level Animation Competition (2024)',
  'A Grade, State-Level Web Designing Competition (2022)',
] as const;

export const resumeAccomplishments = [
  'Selected for State-Level Little Kites Camp',
  'Built AgriLive (farm assistant) for the Gemini Live Agent Challenge',
  'MLH Hackathons',
  'Hack Club member',
] as const;

export const resumeProfiles: Record<ResumeProfileId, ResumeProfile> = {
  general: {
    id: 'general',
    label: 'General',
    summary: resumeSummaries.general,
    experienceOrder: ['nmhelper', 'github', 'youtube', 'otakupulse'],
    skillFocus: 'all',
  },
  developer: {
    id: 'developer',
    label: 'Software / Developer',
    summary: resumeSummaries.developer,
    experienceOrder: ['nmhelper', 'github', 'otakupulse', 'youtube'],
    skillFocus: 'dev',
  },
  creative: {
    id: 'creative',
    label: 'Creative / Media',
    summary: resumeSummaries.creative,
    experienceOrder: ['youtube', 'nmhelper', 'github', 'otakupulse'],
    hiddenExperience: ['otakupulse'],
    skillFocus: 'creative',
  },
  fullstack: {
    id: 'fullstack',
    label: 'Full-Stack',
    summary: resumeSummaries.fullstack,
    experienceOrder: ['nmhelper', 'github', 'otakupulse'],
    hiddenExperience: ['youtube'],
    skillFocus: 'dev',
  },
};

export function resolveResumeProfile(id?: string | null): ResumeProfile {
  if (id && id in resumeProfiles) return resumeProfiles[id as ResumeProfileId];
  return resumeProfiles.general;
}

export function getExperienceForProfile(profile: ResumeProfile): ResumeExperience[] {
  const hidden = new Set(profile.hiddenExperience ?? []);
  const byId = new Map(resumeExperience.map((e) => [e.id, e]));
  return profile.experienceOrder
    .filter((id) => !hidden.has(id))
    .map((id) => byId.get(id))
    .filter((e): e is ResumeExperience => Boolean(e));
}
