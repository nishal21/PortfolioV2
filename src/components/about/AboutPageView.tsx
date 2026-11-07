'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Mail } from 'lucide-react';
import { personal } from '@/data/personal';
import { entityDefinition, seoTrustSignals } from '@/data/seo-content';
import { gardenMotionTier, loadGsapScroll } from '@/lib/gardenMotion';
import { CREATOR_NAME, GITHUB_HANDLE } from '@/lib/seo';
import './about-page.css';

export default function AboutPageView() {
  const rootRef = useRef<HTMLElement>(null);
  const [intro, ...detailBio] = personal.bio;

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
        const items = gsap.utils.toArray<HTMLElement>('[data-about-timeline-item]', root);

        items.forEach((item) => {
          gsap.from(item, {
            x: -16,
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
    <main ref={rootRef} className="about-page">
      <div className="about-page__wash" aria-hidden />

      <div className="about-page__inner">
        <Link href="/" className="about-page__back hit-target">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to portfolio
        </Link>

        <p className="about-page__eyebrow">About</p>
        <h1 className="about-page__title">
          {CREATOR_NAME}{' '}
          <span className="about-page__title-ml font-malayalam" lang="ml">
            ({personal.malayalamName})
          </span>
        </h1>
        <p className="about-page__lede seo-speakable">{entityDefinition}</p>

        <div className="about-page__ctas">
          <Link href="/#contact" className="hit-target about-page__btn about-page__btn--pri">
            <Mail className="h-4 w-4" aria-hidden />
            Contact
          </Link>
          <Link href="/projects" className="hit-target about-page__btn about-page__btn--ghost">
            Projects
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link href="/profile" className="hit-target about-page__btn about-page__btn--ghost">
            Profile index
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="about-page__story">
          <p className="about-page__intro seo-speakable">{intro}</p>
          <div className="about-page__bio">
            {detailBio.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
        </div>

        <section className="about-page__timeline-wrap" aria-labelledby="about-timeline-label">
          <h2 id="about-timeline-label" className="about-page__section-label">
            Timeline
          </h2>
          <ol className="about-page__timeline">
            {personal.timeline.map((item) => (
              <li key={item.year} data-about-timeline-item="">
                <span className="about-page__timeline-year">{item.year}</span>
                <span className="about-page__timeline-event">{item.event}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-page__stats" aria-label="Highlights">
          {seoTrustSignals.stats.map((stat) => (
            <div key={stat.label} className="about-page__stat">
              <p className="about-page__stat-num">{stat.number}</p>
              <p className="about-page__stat-label">{stat.label}</p>
            </div>
          ))}
        </section>

        <section className="about-page__awards" aria-labelledby="about-awards-label">
          <h2 id="about-awards-label" className="about-page__section-label">
            Awards & recognition
          </h2>
          <ul>
            {seoTrustSignals.awards.map((award) => (
              <li key={award}>{award}</li>
            ))}
          </ul>
        </section>

        <section className="about-page__index" aria-labelledby="about-index-label">
          <h2 id="about-index-label" className="about-page__section-label">
            Project directory
          </h2>
          <p className="about-page__index-desc">
            Full searchable index of every project lives on the profile page.
          </p>
          <Link href="/profile" className="hit-target about-page__btn about-page__btn--ghost">
            Open profile index
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>

        <section className="about-page__contact" aria-labelledby="about-contact-label">
          <h2 id="about-contact-label" className="about-page__section-label">
            Contact & trust
          </h2>
          <p>
            Email:{' '}
            <a href={`mailto:${seoTrustSignals.email}`}>{seoTrustSignals.email}</a>
            {' · '}
            Location: {seoTrustSignals.location}
            {' · '}
            GitHub:{' '}
            <a href={`https://github.com/${GITHUB_HANDLE}`} rel="noopener noreferrer" target="_blank">
              @{GITHUB_HANDLE}
            </a>
          </p>
          <p>
            <Link href="/profile">Full profile index</Link>
            {' · '}
            <Link href="/privacy">Privacy policy</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
