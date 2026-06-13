import type { Metadata } from 'next';
import PortfolioPage from '@/components/PortfolioPage';
import { SiteJsonLd } from '@/components/seo/JsonLd';
import { OG_IMAGE, SITE_NAME, SITE_TITLE, SITE_URL, metaDescription, socialDescription } from '@/lib/seo';

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: metaDescription(),
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: SITE_TITLE,
    description: socialDescription(),
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: socialDescription(),
    images: [OG_IMAGE.url],
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
