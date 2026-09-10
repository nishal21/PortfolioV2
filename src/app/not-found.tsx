import type { Metadata } from 'next';
import ErrorStage from '@/components/error/ErrorStage';
import { CREATOR_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: `404 · Frame missing`,
  description: `Page not found on ${CREATOR_NAME}'s portfolio (nishal.dev).`,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <ErrorStage kind="not-found" />;
}
