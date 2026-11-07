import type { Metadata } from 'next';
import PrivacyPageView from '@/components/privacy/PrivacyPageView';
import { CREATOR_NAME, absoluteUrl } from '@/lib/seo';
import '../studio.css';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy policy for ${CREATOR_NAME}'s portfolio at nishal.dev.`,
  alternates: { canonical: absoluteUrl('/privacy') },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return <PrivacyPageView />;
}
