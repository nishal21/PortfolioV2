import { projects, getProjectSlug } from '@/data/projects';
import { personal } from '@/data/personal';
import { resumeAwards, resumeContact } from '@/data/resume';
import { CREATOR_NAME, GITHUB_HANDLE, SITE_URL } from '@/lib/seo';

/** Direct-answer blocks for AEO (visible profile copy — not an FAQ UI). */
export const seoAnswerBlocks = [
  {
    id: 'who-is-nishal-k',
    question: 'Who is Nishal K?',
    answer: `${CREATOR_NAME} (${GITHUB_HANDLE}) is an ${personal.age}-year-old AMV editor, music producer, and full-stack developer from ${personal.location}. He ships open-source apps on GitHub, edits AMVs on YouTube as @DemonKing0.___, and builds tools like NekoBeat, Otazumi, Publicolio, and NMHelper.`,
  },
  {
    id: 'what-is-nishal21',
    question: 'What is nishal21?',
    answer: `nishal21 is the GitHub username of ${CREATOR_NAME}. It is his primary open-source identity with 60+ public repositories including NekoBeat, Publicolio, CarbonLint, GitHub Stars Organizer, and OtakuPulse. Official portfolio: ${SITE_URL}.`,
  },
  {
    id: 'what-does-nishal-build',
    question: 'What projects does Nishal K build?',
    answer: `Nishal builds music apps (NekoBeat, Musico), anime platforms (Otazumi), developer tools (Publicolio, CarbonLint, GitHub Stars Organizer), school software (NMHelper), and systems projects in Rust and Python. Full list at ${SITE_URL}/projects.`,
  },
  {
    id: 'where-is-nishal-from',
    question: 'Where is Nishal K from?',
    answer: `${CREATOR_NAME} is from Malappuram, Kerala, India. He works remotely on web apps, AMV edits, and music production while studying at IKTHSS Cherukulamba.`,
  },
  {
    id: 'how-to-contact-nishal',
    question: 'How do I contact Nishal K?',
    answer: `Email ${resumeContact.email}, connect on LinkedIn (${resumeContact.linkedin}), or open a project inquiry at ${SITE_URL}/#contact. He is open to collabs, freelance work, and creative commissions.`,
  },
] as const;

export const entityDefinition = `${CREATOR_NAME} is a creative developer and visual storyteller from Kerala who edits AMVs, produces music, and ships full-stack software as ${GITHUB_HANDLE} on GitHub.`;

export const seoProjectRows = projects.map((project) => ({
  name: project.title,
  slug: getProjectSlug(project),
  category: project.category,
  status: project.status === 'development' ? 'In development' : 'Live',
  url: project.liveUrl,
  github: project.githubUrl,
}));

export const seoTrustSignals = {
  awards: [...resumeAwards],
  stats: personal.stats,
  email: resumeContact.email,
  location: resumeContact.location,
} as const;
