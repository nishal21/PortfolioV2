'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import { gardenMotionTier, loadGsapScroll } from '@/lib/gardenMotion';
import { contactMail } from '@/data/contact';
import { CREATOR_NAME, SITE_URL } from '@/lib/seo';
import './privacy-page.css';

const SECTIONS = [
  {
    id: 'who',
    title: 'Who runs this site',
    body: (
      <>
        {CREATOR_NAME} operates {SITE_URL}. Contact:{' '}
        <a href={`mailto:${contactMail.address}`}>{contactMail.address}</a>.
      </>
    ),
  },
  {
    id: 'data',
    title: 'Data collected',
    body: (
      <>
        The contact form sends your name, email, subject, and message to the site owner by email
        (Brevo). Standard server and analytics logs may record IP address and browser type if
        enabled by the host.
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies',
    body: (
      <>
        This portfolio does not use advertising cookies. Third-party embeds (e.g. YouTube) may set
        their own cookies.
      </>
    ),
  },
  {
    id: 'rights',
    title: 'Your rights',
    body: (
      <>
        You may request deletion of contact form messages by emailing{' '}
        <a href={`mailto:${contactMail.address}`}>{contactMail.address}</a>.
      </>
    ),
  },
] as const;

export default function PrivacyPageView() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const tier = gardenMotionTier();
    if (tier === 'none') return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const start = async () => {
      const { gsap } = await loadGsapScroll();
      if (cancelled) return;

      const ctx = gsap.context(() => {
        const items = gsap.utils.toArray<HTMLElement>('[data-privacy-section]', root);
        items.forEach((item) => {
          gsap.from(item, {
            y: 12,
            opacity: 0,
            duration: 0.45,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 92%',
              toggleActions: 'play none none none',
            },
          });
        });
      }, root);

      cleanup = () => ctx.revert();
    };

    const idle =
      typeof requestIdleCallback !== 'undefined'
        ? requestIdleCallback(() => void start(), { timeout: 1200 })
        : window.setTimeout(() => void start(), 300);

    return () => {
      cancelled = true;
      if (typeof cancelIdleCallback !== 'undefined' && typeof idle === 'number') {
        cancelIdleCallback(idle);
      }
      window.clearTimeout(idle as number);
      cleanup?.();
    };
  }, []);

  return (
    <main ref={rootRef} className="privacy-page">
      <div className="privacy-page__wash" aria-hidden />

      <div className="privacy-page__inner">
        <Link href="/" className="privacy-page__back hit-target">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to portfolio
        </Link>

        <p className="privacy-page__eyebrow">Legal</p>
        <h1 className="privacy-page__title">Privacy Policy</h1>
        <p className="privacy-page__updated">Last updated: June 2026</p>

        <div className="privacy-page__ctas">
          <Link href="/#contact" className="hit-target privacy-page__btn">
            <Mail className="h-4 w-4" aria-hidden />
            Contact
          </Link>
        </div>

        <div className="privacy-page__sections">
          {SECTIONS.map((section) => (
            <section
              key={section.id}
              className="privacy-page__section"
              data-privacy-section=""
              aria-labelledby={`privacy-${section.id}`}
            >
              <h2 id={`privacy-${section.id}`} className="privacy-page__section-title">
                {section.title}
              </h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
