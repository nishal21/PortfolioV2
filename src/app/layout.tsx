import type { Metadata } from 'next';
import { Inter, DM_Sans } from 'next/font/google';
import { copyrightNotice } from '@/components/layout/SiteFooter';
import RootProviders from '@/components/layout/RootProviders';
import { FEED_PATH } from '@/lib/rss';
import {
  CREATOR_NAME,
  OG_IMAGE,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  metaDescription,
  socialDescription,
} from '@/lib/seo';
import './globals.css';

const inter = Inter({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'optional',
  preload: true,
});

const dmSans = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

const siteVerificationOther: Record<string, string> = {};
if (process.env.BING_SITE_VERIFICATION) {
  siteVerificationOther['msvalidate.01'] = process.env.BING_SITE_VERIFICATION;
}
if (process.env.PINTEREST_DOMAIN_VERIFY) {
  siteVerificationOther['p:domain_verify'] = process.env.PINTEREST_DOMAIN_VERIFY;
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${CREATOR_NAME}`,
  },
  description: metaDescription(),
  keywords: [...SITE_KEYWORDS],
  authors: [{ name: CREATOR_NAME, url: SITE_URL }],
  creator: CREATOR_NAME,
  publisher: CREATOR_NAME,
  applicationName: SITE_NAME,
  category: 'technology',
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': [{ url: FEED_PATH, title: `${CREATOR_NAME} · RSS` }],
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon', type: 'image/png', sizes: '48x48' },
    ],
    apple: [{ url: '/apple-icon', type: 'image/png', sizes: '180x180' }],
    shortcut: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'googlef3453f029349740e',
    ...(Object.keys(siteVerificationOther).length ? { other: siteVerificationOther } : {}),
  },
  openGraph: {
    title: SITE_TITLE,
    description: socialDescription(),
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [OG_IMAGE],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Etainment2',
    creator: '@Etainment2',
    title: SITE_TITLE,
    description: socialDescription(),
    images: [OG_IMAGE.url],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080a0c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="copyright" content={copyrightNotice()} />
      </head>
      <body className={`${inter.variable} ${dmSans.variable} antialiased`}>
        <noscript>
          <div className="noscript-notice">
            <strong>Nishal · Nishal K (nishal21)</strong>. AMV editor, music producer, and full-stack developer from
            Kerala, India. Portfolio:{' '}
            <a href="https://nishal.dev/projects">projects</a>,{' '}
            <a href="https://nishal.dev/profile">profile</a>,{' '}
            <a href="https://nishal.dev/about">about</a>,{' '}
            <a href="https://nishal.dev/resume/view">resume</a>.
            {' '}
            {copyrightNotice()}
          </div>
        </noscript>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
