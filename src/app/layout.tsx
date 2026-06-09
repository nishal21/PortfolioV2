import type { Metadata } from 'next';
import { Syne, DM_Sans, Noto_Sans_Malayalam } from 'next/font/google';
import RootProviders from '@/components/layout/RootProviders';
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

const syne = Syne({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
});

const dmSans = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const notoMalayalam = Noto_Sans_Malayalam({
  variable: '--font-noto-malayalam',
  subsets: ['malayalam'],
  weight: ['400', '700'],
});

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
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon', type: 'image/png', sizes: '48x48' },
    ],
    apple: [{ url: '/apple-icon', type: 'image/png', sizes: '180x180' }],
    shortcut: '/favicon.svg',
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
      <body className={`${syne.variable} ${dmSans.variable} ${notoMalayalam.variable} antialiased`}>
        <noscript>
          <div
            style={{
              padding: '1rem 1.5rem',
              background: '#0a0d12',
              color: '#f8f6f2',
              borderBottom: '1px solid #1a2030',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.9rem',
              lineHeight: 1.5,
            }}
          >
            <strong>Nishal K (nishal21)</strong> — AMV editor, music producer, and full-stack developer from
            Kerala, India. Portfolio:{' '}
            <a href="https://nishal.dev/projects" style={{ color: '#a6c78c' }}>
              projects
            </a>
            ,{' '}
            <a href="https://nishal.dev/profile" style={{ color: '#a6c78c' }}>
              profile
            </a>
            ,{' '}
            <a href="https://nishal.dev/about" style={{ color: '#a6c78c' }}>
              about
            </a>
            ,{' '}
            <a href="https://nishal.dev/resume/view" style={{ color: '#a6c78c' }}>
              resume
            </a>
            .
          </div>
        </noscript>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
