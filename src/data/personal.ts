export const personal = {
  name: 'Nishal',
  tagline: 'AMV editor, music producer, and full-stack dev from Kerala',
  location: 'Malappuram, Kerala, India',
  age: 18,
  malayalamName: 'നിശാൽ',
  pullQuote:
    'A beat has to land on time. Your code should too. I put the same care into both.',
  bio: [
    'I\'m Nishal, 18, living in Malappuram. Five years in on AMV edits, FL Studio remixes, and apps that actually go live.',
    'YouTube is @DemonKing0.___ (edits and remixes). GitHub is nishal21 (NekoBeat, Otazumi, Publicolio, NMHelper, plus whatever side project has my attention that month).',
    'Off the clock I\'m usually hunting a scene to sync, fixing a mix that almost sounds right, or poking at game dev and 3D.',
  ],
  timeline: [
    { year: '2020', event: 'Started AMV editing and learning to code' },
    { year: '2021', event: 'First AMVs on YouTube, early web experiments' },
    { year: '2022', event: 'Remix production and motion polish' },
    { year: '2023', event: '3D animation experiments, motion side projects' },
    { year: '2024', event: 'JARVIS, open-source tooling' },
    { year: '2025', event: 'NMHelper, Musico, Otazumi, OtakuPulse' },
    { year: '2026', event: 'NekoBeat, World News CLI, RYTU, Handoff, SANTRA, Publicolio, CarbonLint' },
  ],
  stats: [
    { number: '60+', label: 'GitHub Repos' },
    { number: '5+', label: 'Years Creating' },
    { number: '80K+', label: 'Top Video Views' },
    { number: '3-in-1', label: 'Edit · Music · Code' },
  ],
};

export const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Videos', href: '#videos' },
  { name: 'Contact', href: '#contact' },
] as const;
