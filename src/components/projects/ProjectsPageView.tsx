'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Mail, UserRound } from 'lucide-react';
import {
  projects,
  getProjectSlug,
  getProjectThumbnail,
  isProjectInDevelopment,
} from '@/data/projects';
import { gardenMotionTier, loadGsapScroll } from '@/lib/gardenMotion';
import { CREATOR_NAME, GITHUB_HANDLE } from '@/lib/seo';
import './projects-page.css';

export default function ProjectsPageView() {
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
        const rows = gsap.utils.toArray<HTMLElement>('[data-projects-row]', root);
        rows.forEach((row, i) => {
          gsap.from(row, {
            y: 14,
            opacity: 0,
            duration: tier === 'rich' ? 0.5 : 0.4,
            delay: Math.min(i * 0.03, 0.35),
            ease: 'power2.out',
            scrollTrigger: {
              trigger: row,
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
    <main ref={rootRef} className="projects-page">
      <div className="projects-page__wash" aria-hidden />

      <div className="projects-page__inner">
        <Link href="/" className="projects-page__back hit-target">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to portfolio
        </Link>

        <p className="projects-page__eyebrow">Projects</p>
        <h1 className="projects-page__title">
          {CREATOR_NAME} · {GITHUB_HANDLE}
        </h1>
        <p className="projects-page__lede">
          Open-source apps, tools, and creative platforms from Kerala. Open a row for the full
          write-up.
        </p>

        <div className="projects-page__ctas">
          <Link href="/profile" className="hit-target projects-page__btn projects-page__btn--pri">
            Profile index
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link href="/about" className="hit-target projects-page__btn projects-page__btn--ghost">
            <UserRound className="h-4 w-4" aria-hidden />
            About
          </Link>
          <Link href="/#contact" className="hit-target projects-page__btn projects-page__btn--ghost">
            <Mail className="h-4 w-4" aria-hidden />
            Contact
          </Link>
        </div>

        <ul className="projects-page__list">
          {projects.map((project) => {
            const slug = getProjectSlug(project);
            const thumb = getProjectThumbnail(project.id);
            const inDev = isProjectInDevelopment(project);

            return (
              <li key={project.id} className="projects-page__row" data-projects-row="">
                <Link
                  href={`/projects/${slug}`}
                  className={`projects-page__row-link hit-target${thumb ? '' : ' projects-page__row-link--no-thumb'}`}
                >
                  {thumb ? (
                    <span className="projects-page__thumb" aria-hidden>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={thumb} alt="" loading="lazy" decoding="async" />
                    </span>
                  ) : null}
                  <span className="projects-page__row-body">
                    <span className="projects-page__row-meta">
                      <span>{project.category}</span>
                      <span
                        className={
                          inDev
                            ? 'projects-page__row-status projects-page__row-status--dev'
                            : 'projects-page__row-status'
                        }
                      >
                        {inDev ? 'In development' : 'Live'}
                      </span>
                    </span>
                    <h2 className="projects-page__row-title">{project.title}</h2>
                    <p className="projects-page__row-desc">{project.description}</p>
                  </span>
                  <ArrowUpRight className="projects-page__row-arrow h-4 w-4" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="projects-page__foot">
          Searchable directory on{' '}
          <Link href="/profile">/profile</Link>
          {' · '}
          Repos at{' '}
          <a
            href={`https://github.com/${GITHUB_HANDLE}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            github.com/{GITHUB_HANDLE}
          </a>
        </p>
      </div>
    </main>
  );
}
