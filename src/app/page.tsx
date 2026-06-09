import type { Metadata } from 'next';
import PortfolioPage from '@/components/PortfolioPage';
import { SiteJsonLd } from '@/components/seo/JsonLd';
import { CREATOR_NAME, GITHUB_HANDLE, OG_IMAGE, SITE_NAME, SITE_URL, defaultDescription } from '@/lib/seo';

export const metadata: Metadata = {
  title: `${CREATOR_NAME} — AMV Editor, Music Producer & Full-Stack Developer`,
  description: defaultDescription(),
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${CREATOR_NAME} (${GITHUB_HANDLE}) — Portfolio`,
    description: defaultDescription(),
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [OG_IMAGE],
  },
};

export default function Home() {
  return (
    <>
      <SiteJsonLd />
      <PortfolioPage />
    </>
  );
}
