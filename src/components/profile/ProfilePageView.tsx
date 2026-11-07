'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Mail, UserRound } from 'lucide-react';
import ProjectIndexTable from '@/components/seo/ProjectIndexTable';
import SeoAnswerBlocks from '@/components/seo/SeoAnswerBlocks';
import { personal } from '@/data/personal';
import { entityDefinition } from '@/data/seo-content';
import { gardenMotionTier, loadGsapScroll } from '@/lib/gardenMotion';
import { CREATOR_NAME, GITHUB_HANDLE } from '@/lib/seo';
import './profile-page.css';

export default function ProfilePageView() {
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
        const items = gsap.utils.toArray<HTMLElement>('[data-profile-reveal]', root);

        items.forEach((item) => {
          gsap.from(item, {
            y: 18,
            opacity: 0,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
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
    <main ref={rootRef} className="profile-page">
      <div className="profile-page__wash" aria-hidden />

      <div className="profile-page__inner">
        <Link href="/" className="profile-page__back hit-target">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to portfolio
        </Link>

        <p className="profile-page__eyebrow">Index</p>
        <h1 className="profile-page__title">
          Profile · {CREATOR_NAME}{' '}
          <span className="profile-page__title-ml font-malayalam" lang="ml">
            ({personal.malayalamName})
          </span>
        </h1>
        <p className="profile-page__lede seo-speakable">{entityDefinition}</p>

        <div className="profile-page__ctas">
          <Link href="/about" className="hit-target profile-page__btn profile-page__btn--pri">
            <UserRound className="h-4 w-4" aria-hidden />
            About
          </Link>
          <Link href="/projects" className="hit-target profile-page__btn profile-page__btn--ghost">
            Projects
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link href="/#contact" className="hit-target profile-page__btn profile-page__btn--ghost">
            <Mail className="h-4 w-4" aria-hidden />
            Contact
          </Link>
        </div>

        <div className="profile-page__answers" data-profile-reveal="">
          <p className="profile-page__section-label" id="profile-answers-label">
            Answers
          </p>
          <SeoAnswerBlocks showHeading={false} />
        </div>

        <section
          className="profile-page__directory"
          data-profile-reveal=""
          aria-labelledby="profile-directory-label"
        >
          <h2 id="profile-directory-label" className="profile-page__section-label">
            Project directory
          </h2>
          <p className="profile-page__directory-desc">
            All projects by {CREATOR_NAME} ({GITHUB_HANDLE}). Each page is indexable at nishal.dev.
          </p>
          <ProjectIndexTable />
        </section>
      </div>
    </main>
  );
}
