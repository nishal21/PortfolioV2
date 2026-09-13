'use client';

import { Syne, DM_Sans, Noto_Sans_Malayalam } from 'next/font/google';
import ErrorStage from '@/components/error/ErrorStage';
import './globals.css';

const syne = Syne({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

const notoMalayalam = Noto_Sans_Malayalam({
  variable: '--font-noto-malayalam',
  subsets: ['malayalam'],
  weight: ['400', '700'],
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dmSans.variable} ${notoMalayalam.variable} antialiased`}>
        <ErrorStage kind="error" digest={error.digest} onRetry={reset} />
      </body>
    </html>
  );
}
