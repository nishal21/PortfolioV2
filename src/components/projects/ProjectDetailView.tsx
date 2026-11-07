'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import type { Project } from '@/data/projects';
import { getProjectThumbnail, isProjectInDevelopment } from '@/data/projects';
import { gardenMotionTier, loadGsapScroll } from '@/lib/gardenMotion';
import { CREATOR_NAME, GITHUB_HANDLE } from '@/lib/seo';
import './project-detail.css';

interface ProjectDetailViewProps {
  project: Project;
  slug: string;
}

export default function ProjectDetailView({ project, slug }: ProjectDetailViewProps) {
  const rootRef = useRef<HTMLElement>(null);
  const thumb = getProjectThumbnail(project.id);
  const inDev = isProjectInDevelopment(project);

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
        const head = root.querySelector<HTMLElement>('[data-pd-head]');
        if (head) {
          gsap.from(head, {
            y: 16,
            opacity: 0,
            duration: 0.55,
            ease: 'power2.out',
          });
        }

        const bands = gsap.utils.toArray<HTMLElement>('[data-pd-band]', root);
        bands.forEach((band) => {
          if (tier === 'rich') {
            gsap.fromTo(
              band,
              { y: 28, opacity: 0.4 },
              {
                y: 0,
                opacity: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: band,
                  start: 'top 92%',
                  end: 'top 55%',
                  scrub: 0.55,
                },
              }
            );
          } else {
            gsap.from(band, {
              y: 16,
              opacity: 0,
              duration: 0.45,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: band,
                start: 'top 90%',
                toggleActions: 'play none none none',
              },
            });
          }
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
    <main ref={rootRef} className="project-detail">
      <div className="project-detail__wash" aria-hidden />

      <article className="project-detail__inner">
        <Link href="/projects" className="project-detail__back hit-target">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All projects
        </Link>

        <div data-pd-head="">
          <p className="project-detail__eyebrow">{project.category}</p>
          <h1 className="project-detail__title">{project.title}</h1>
          <p className="project-detail__lede seo-speakable">
            Built by <strong>{CREATOR_NAME}</strong> (
            <a href={`https://github.com/${GITHUB_HANDLE}`} rel="noopener noreferrer" target="_blank">
              {GITHUB_HANDLE}
            </a>
            ). {project.longDescription}
          </p>

          <div className="project-detail__ctas">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hit-target project-detail__btn project-detail__btn--pri"
              >
                Live site
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            ) : null}
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hit-target project-detail__btn project-detail__btn--ghost"
              >
                GitHub
                <Github className="h-4 w-4" aria-hidden />
              </a>
            ) : null}
            {project.huggingfaceUrl ? (
              <a
                href={project.huggingfaceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hit-target project-detail__btn project-detail__btn--ghost"
              >
                Hugging Face
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            ) : null}
            {project.ollamaUrl ? (
              <a
                href={project.ollamaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hit-target project-detail__btn project-detail__btn--ghost"
              >
                Ollama
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            ) : null}
            <Link href="/#projects" className="hit-target project-detail__btn project-detail__btn--ghost">
              On portfolio
            </Link>
          </div>

          <p
            className={
              inDev
                ? 'project-detail__status project-detail__status--dev'
                : 'project-detail__status'
            }
          >
            {inDev ? 'Status: In development' : 'Status: Live'}
          </p>

          {thumb ? (
            <div className="project-detail__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumb}
                alt={`${project.title}, project by ${CREATOR_NAME}`}
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : null}
        </div>

        <section className="project-detail__section" data-pd-band="" aria-labelledby={`about-${slug}`}>
          <h2 id={`about-${slug}`} className="project-detail__section-label">
            About
          </h2>
          <p>{project.description}</p>
        </section>

        <section className="project-detail__section" data-pd-band="" aria-labelledby={`features-${slug}`}>
          <h2 id={`features-${slug}`} className="project-detail__section-label">
            Features
          </h2>
          <ul className="project-detail__features">
            {project.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>

        {project.attributions && project.attributions.length > 0 ? (
          <section className="project-detail__section" data-pd-band="" aria-labelledby={`credits-${slug}`}>
            <h2 id={`credits-${slug}`} className="project-detail__section-label">
              Credits
            </h2>
            <ul className="project-detail__credits">
              {project.attributions.map((credit) => (
                <li key={credit.url}>
                  <a href={credit.url} target="_blank" rel="noopener noreferrer">
                    {credit.name}
                  </a>
                  {credit.license ? ` — ${credit.license}` : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="project-detail__section" data-pd-band="" aria-labelledby={`stack-${slug}`}>
          <h2 id={`stack-${slug}`} className="project-detail__section-label">
            Tech stack
          </h2>
          <dl className="project-detail__stack">
            {Object.entries(project.techStack).map(([key, values]) => (
              <div key={key} className="project-detail__stack-row">
                <dt>{key}</dt>
                <dd>{values.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="project-detail__who" data-pd-band="">
          {project.title} is by {CREATOR_NAME} ({GITHUB_HANDLE}). AMV editor, music producer, and
          full-stack developer from Malappuram, Kerala.{' '}
          <Link href="/">nishal.dev</Link>
          {' · '}
          <Link href="/about">About</Link>
          {' · '}
          <Link href="/profile">Profile</Link>
        </p>
      </article>
    </main>
  );
}
