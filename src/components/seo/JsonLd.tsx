import { projects, getProjectSlug } from '@/data/projects';
import { personal } from '@/data/personal';
import { videos } from '@/data/videos';
import { seoAnswerBlocks, seoTrustSignals } from '@/data/seo-content';
import { resumeContact } from '@/data/resume';
import {
  CREATOR_NAME,
  GITHUB_HANDLE,
  OG_IMAGE,
  SAME_AS,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from '@/lib/seo';
import { videoDurationIso, videoUploadDateIso } from '@/lib/videoSchema';

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function personNode() {
  return {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: CREATOR_NAME,
    givenName: 'Nishal',
    familyName: 'K',
    alternateName: ['Nishal', GITHUB_HANDLE, personal.malayalamName],
    url: SITE_URL,
    image: absoluteUrl(OG_IMAGE.url),
    jobTitle: ['Full-Stack Developer', 'AMV Editor', 'Music Producer', 'Content Creator'],
    description: personal.tagline,
    email: resumeContact.email,
    nationality: { '@type': 'Country', name: 'India' },
    homeLocation: {
      '@type': 'Place',
      name: personal.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Malappuram',
        addressRegion: 'Kerala',
        addressCountry: 'IN',
      },
    },
    sameAs: SAME_AS,
    award: seoTrustSignals.awards,
    knowsAbout: [
      'Web Development',
      'AMV Editing',
      'Music Production',
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'Rust',
      'Python',
      ...projects.map((project) => project.title),
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Independent Developer',
    },
  };
}

export function SiteJsonLd() {
  const person = personNode();

  const organization = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: CREATOR_NAME,
    alternateName: ['Nishal', GITHUB_HANDLE, SITE_NAME],
    url: SITE_URL,
    logo: absoluteUrl(OG_IMAGE.url),
    image: absoluteUrl(OG_IMAGE.url),
    founder: { '@id': `${SITE_URL}/#person` },
    sameAs: SAME_AS,
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: ['Nishal', CREATOR_NAME, GITHUB_HANDLE, 'nishal.dev'],
    url: SITE_URL,
    description: personal.tagline,
    inLanguage: ['en', 'ml'],
    publisher: { '@id': `${SITE_URL}/#organization` },
    author: { '@id': `${SITE_URL}/#person` },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/projects?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const profilePage = {
    '@type': 'ProfilePage',
    '@id': `${SITE_URL}/#profile`,
    url: SITE_URL,
    name: `${CREATOR_NAME} · Portfolio`,
    description: personal.tagline,
    mainEntity: { '@id': `${SITE_URL}/#person` },
    isPartOf: { '@id': `${SITE_URL}/#website` },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.seo-speakable', '.hero-tagline', '.studio-about-intro'],
    },
  };

  const webPage = {
    '@type': 'WebPage',
    '@id': `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: `${CREATOR_NAME} · AMV Editor, Music Producer & Developer`,
    description: personal.tagline,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#person` },
    primaryImageOfPage: absoluteUrl(OG_IMAGE.url),
    inLanguage: 'en',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.seo-speakable', '.hero-tagline'],
    },
    hasPart: seoAnswerBlocks.map((block) => ({
      '@type': 'WebPageElement',
      name: block.question,
      description: block.answer,
    })),
  };

  const itemList = {
    '@type': 'ItemList',
    '@id': `${SITE_URL}/#projects`,
    name: `Projects by ${CREATOR_NAME}`,
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: project.title,
      url: absoluteUrl(`/projects/${getProjectSlug(project)}`),
    })),
  };

  const videoObjects = videos.slice(0, 6).map((video) => ({
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnail.startsWith('http')
      ? video.thumbnail
      : absoluteUrl(video.thumbnail),
    uploadDate: videoUploadDateIso(video.date),
    duration: videoDurationIso(video.duration),
    contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
    author: { '@id': `${SITE_URL}/#person` },
    publisher: { '@id': `${SITE_URL}/#organization` },
  }));

  const siteNav = {
    '@type': 'SiteNavigationElement',
    name: 'Main navigation',
    url: SITE_URL,
    hasPart: [
      { '@type': 'SiteNavigationElement', name: 'About', url: `${SITE_URL}/#about` },
      { '@type': 'SiteNavigationElement', name: 'Profile', url: `${SITE_URL}/profile` },
      { '@type': 'SiteNavigationElement', name: 'Projects', url: `${SITE_URL}/projects` },
      { '@type': 'SiteNavigationElement', name: 'Videos', url: `${SITE_URL}/#videos` },
      { '@type': 'SiteNavigationElement', name: 'Contact', url: `${SITE_URL}/#contact` },
      { '@type': 'SiteNavigationElement', name: 'Resume', url: `${SITE_URL}/resume/view` },
    ],
  };

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@graph': [person, organization, website, profilePage, webPage, itemList, siteNav, ...videoObjects],
      }}
    />
  );
}

export function AboutPageJsonLd() {
  const aboutPage = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${absoluteUrl('/about')}#aboutpage`,
    url: absoluteUrl('/about'),
    name: `About ${CREATOR_NAME}`,
    description: `Background, awards, and projects of ${CREATOR_NAME} (${GITHUB_HANDLE}).`,
    mainEntity: { '@id': `${SITE_URL}/#person` },
    isPartOf: { '@id': `${SITE_URL}/#website` },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.seo-speakable'],
    },
  };

  return <JsonLd data={aboutPage} />;
}

export function ProfilePageJsonLd() {
  const profilePage = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${absoluteUrl('/profile')}#profilepage`,
    url: absoluteUrl('/profile'),
    name: `Profile · ${CREATOR_NAME}`,
    description: `Who is ${CREATOR_NAME}? What is ${GITHUB_HANDLE}? Projects, location, and contact.`,
    mainEntity: { '@id': `${SITE_URL}/#person` },
    isPartOf: { '@id': `${SITE_URL}/#website` },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.seo-speakable'],
    },
    hasPart: seoAnswerBlocks.map((block) => ({
      '@type': 'WebPageElement',
      name: block.question,
      description: block.answer,
    })),
  };

  return <JsonLd data={profilePage} />;
}

export function ProjectJsonLd({
  title,
  description,
  slug,
  image,
  liveUrl,
  githubUrl,
  tags,
}: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  liveUrl: string | null;
  githubUrl: string | null;
  tags: string[];
}) {
  const pageUrl = absoluteUrl(`/projects/${slug}`);

  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: title,
    description,
    url: liveUrl ?? pageUrl,
    image: image ? absoluteUrl(image) : absoluteUrl(OG_IMAGE.url),
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    author: { '@id': `${SITE_URL}/#person` },
    creator: { '@id': `${SITE_URL}/#person` },
    keywords: tags.join(', '),
    isPartOf: { '@id': `${SITE_URL}/#website` },
    ...(githubUrl ? { codeRepository: githubUrl } : {}),
    ...(liveUrl ? { downloadUrl: liveUrl } : {}),
  };

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: absoluteUrl('/projects') },
      { '@type': 'ListItem', position: 3, name: title, item: pageUrl },
    ],
  };

  const webPage = {
    '@type': 'WebPage',
    url: pageUrl,
    name: `${title} by ${CREATOR_NAME}`,
    description,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.seo-speakable'],
    },
  };

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@graph': [data, breadcrumb, webPage],
      }}
    />
  );
}
