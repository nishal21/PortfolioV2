import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CREATOR_NAME, SITE_URL, absoluteUrl } from '@/lib/seo';
import '../studio.css';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy policy for ${CREATOR_NAME}'s portfolio at nishal.dev.`,
  alternates: { canonical: absoluteUrl('/privacy') },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="studio-stage min-h-screen text-[var(--text)]">
      <div className="page-container max-w-3xl py-12 md:py-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition hover:text-[var(--studio-accent)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to portfolio
        </Link>

        <h1 className="studio-title">Privacy Policy</h1>
        <p className="studio-desc">Last updated: June 2026</p>

        <div className="prose-studio mt-8 space-y-6 text-[var(--text-muted)]">
          <section>
            <h2 className="font-display text-lg font-semibold text-[var(--text-soft)]">Who runs this site</h2>
            <p className="mt-2 leading-relaxed">
              {CREATOR_NAME} operates {SITE_URL}. Contact: nishal@nishal.dev.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-[var(--text-soft)]">Data collected</h2>
            <p className="mt-2 leading-relaxed">
              The contact form sends your name, email, subject, and message to the site owner via FormSubmit.
              Standard server and analytics logs may record IP address and browser type if enabled by the host.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-[var(--text-soft)]">Cookies</h2>
            <p className="mt-2 leading-relaxed">
              This portfolio does not use advertising cookies. Third-party embeds (e.g. YouTube) may set their own cookies.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-[var(--text-soft)]">Your rights</h2>
            <p className="mt-2 leading-relaxed">
              You may request deletion of contact form messages by emailing nishal@nishal.dev.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
