'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Github, X, Youtube } from 'lucide-react';
import StudioSection from '@/components/layout/StudioSection';
import ShowcaseStage from '@/components/sections/ShowcaseStage';
import Badge from '@/components/ui/Badge';
import ImageFrame from '@/components/ui/ImageFrame';
import ModalPortal, { useModalLock } from '@/components/ui/ModalPortal';
import Link from 'next/link';
import { projects, getProjectSlug, getProjectThumbnail, isProjectInDevelopment, type Project } from '@/data/projects';
import { CREATOR_NAME } from '@/lib/seo';

const projectCardCoverProps = {
  aspect: 'wide' as const,
  fit: 'cover' as const,
  className: 'border-0 studio-project-cover',
};

const projectModalCoverProps = {
  aspect: 'wide' as const,
  fit: 'cover' as const,
  className: 'border-0 studio-modal-cover',
};

const STACK_LABELS: Record<string, string> = {
  standards: 'Standards',
  components: 'Components',
  backend: 'Backend',
  languages: 'Languages',
  doctype: 'Doctype',
  deployment: 'Deployment',
  platform: 'Platform',
  services: 'Services',
  stack: 'Stack',
  apis: 'APIs',
  features: 'Features',
};

function hasDetailedTechStack(techStack: Project['techStack']) {
  return Object.keys(techStack).some((key) =>
    ['standards', 'components', 'doctype'].includes(key)
  );
}

function formatLastUpdated(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${y}/${m}/${d}`;
}

function ProjectModalActions({ project }: { project: Project }) {
  const actions = [
    project.liveUrl
      ? { href: project.liveUrl, label: 'Live', icon: ExternalLink, primary: true, external: true }
      : null,
    project.githubUrl
      ? { href: project.githubUrl, label: 'Repo', icon: Github, primary: false, external: true }
      : null,
    project.video
      ? { href: project.video, label: 'Watch', icon: Youtube, primary: false, external: true }
      : null,
    {
      href: `/projects/${getProjectSlug(project)}`,
      label: 'Project page',
      icon: ArrowUpRight,
      primary: false,
      external: false,
    },
  ].filter((action): action is NonNullable<typeof action> => action !== null);

  if (actions.length === 0) return null;

  return (
    <div className="studio-modal-actions" role="group" aria-label="Project links">
      {actions.map(({ href, label, icon: Icon, primary, external }) =>
        external ? (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`hit-target studio-modal-action${primary ? ' studio-modal-action--primary' : ''}`}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            <span>{label}</span>
          </a>
        ) : (
          <Link
            key={label}
            href={href}
            className={`hit-target studio-modal-action${primary ? ' studio-modal-action--primary' : ''}`}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            <span>{label}</span>
          </Link>
        )
      )}
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useModalLock(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <ModalPortal>
      <motion.div
        className="studio-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="presentation"
      >
        <motion.div
          className="studio-modal"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <div className="studio-modal-head">
            <div className="studio-modal-head-main">
              <div className="studio-modal-head-meta">
                <p className="studio-meta">{project.category}</p>
                {project.pinned || isProjectInDevelopment(project) ? (
                  <div className="studio-modal-pills">
                    {project.pinned ? (
                      <span className="studio-pin-badge studio-pin-badge--sm">Pinned</span>
                    ) : null}
                    {isProjectInDevelopment(project) ? (
                      <span className="studio-pin-badge studio-pin-badge--dev studio-pin-badge--sm">
                        <span className="studio-pin-badge__full">In development</span>
                        <span className="studio-pin-badge__short">Dev</span>
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <h3 id="project-modal-title" className="studio-modal-title">
                {project.title}
              </h3>
            </div>
            <button type="button" onClick={onClose} className="hit-target studio-modal-close shrink-0" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="studio-modal-body">
            <ImageFrame
              src={getProjectThumbnail(project.id)}
              alt={project.title}
              fallbackLabel={project.liveUrl ? 'Live project' : 'In development'}
              {...projectModalCoverProps}
            />
            <div className="studio-modal-content">
              {project.lastUpdated ? (
                <p className="studio-modal-meta">Last update: {formatLastUpdated(project.lastUpdated)}</p>
              ) : null}
              <p className="studio-modal-lead">{project.description}</p>
              <p className="studio-modal-copy">{project.longDescription}</p>
              {project.features.length > 0 ? (
                <ul className="studio-modal-features">
                  {project.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              ) : null}
              {project.tags.length > 0 ? (
                <div className="studio-modal-tags">
                  <p className="studio-meta">Repository languages</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </div>
              ) : null}
              {hasDetailedTechStack(project.techStack) ? (
                <div className="studio-modal-stack">
                  {Object.entries(project.techStack).map(([group, items]) => (
                    <div key={group} className="studio-modal-stack-group">
                      <p className="studio-meta">{STACK_LABELS[group] ?? group}</p>
                      <div className="flex flex-wrap gap-2">
                        {items.map((item) => (
                          <Badge key={item}>{item}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          <ProjectModalActions project={project} />
        </motion.div>
      </motion.div>
    </ModalPortal>
  );
}

function ProjectCard({
  project,
  variant,
  onOpen,
}: {
  project: Project;
  variant: 'flagship' | 'reel';
  onOpen: () => void;
}) {
  if (variant === 'flagship') {
    return (
      <article
        className="studio-flagship hit-target group"
        onClick={onOpen}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen())}
        role="button"
        tabIndex={0}
        aria-label={`${project.title}, click for full description`}
      >
        <div className="studio-flagship-media">
          <ImageFrame
            src={getProjectThumbnail(project.id)}
            alt={`${project.title} by ${CREATOR_NAME}`}
            fallbackLabel={isProjectInDevelopment(project) ? 'In development' : 'Live'}
            loading="eager"
            {...projectCardCoverProps}
          />
        </div>
        <div className="studio-flagship-copy">
          <p className="studio-meta">
            {isProjectInDevelopment(project) ? 'In development' : 'Featured project'}
            {project.pinned ? ' · Pinned' : ''}
          </p>
          <h3 className="studio-flagship-title">{project.title}</h3>
          <p className="studio-flagship-desc">{project.description}</p>
          <div className="studio-flagship-tags">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="studio-chip studio-chip--sm">
                {tag}
              </span>
            ))}
          </div>
          <p className="studio-flagship-cta">
            View details <ArrowUpRight className="h-4 w-4" />
          </p>
        </div>
      </article>
    );
  }

  return (
    <article
      className="studio-reel-card hit-target"
      onClick={onOpen}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen())}
      role="button"
      tabIndex={0}
      aria-label={`${project.title}, click for full description`}
    >
      <ImageFrame
        src={getProjectThumbnail(project.id)}
        alt={`${project.title} by ${CREATOR_NAME}`}
        fallbackLabel="Project"
        {...projectCardCoverProps}
      />
      <div className="studio-reel-meta">
        <div className="flex flex-wrap items-center gap-2">
          <p className="studio-meta">
            {isProjectInDevelopment(project) ? 'In development' : project.category}
          </p>
          {project.pinned ? <span className="studio-pin-badge studio-pin-badge--sm">Pinned</span> : null}
        </div>
        <h4 className="studio-reel-title">{project.title}</h4>
        <p className="studio-reel-desc">{project.description}</p>
        <p className="studio-reel-hint">Click for details</p>
      </div>
    </article>
  );
}

export default function ProjectsSection() {
  const [selected, setSelected] = useState<Project | null>(null);
  const featured = projects[0];
  const reel = projects.slice(1);

  if (!featured) return null;

  return (
    <>
      <StudioSection
        id="projects"
        label="Build"
        title="Selected Work"
        description="Wasm emulators, anime and music apps, dev tools, and school software from Kerala. Full index at nishal.dev/projects."
        accent="sage"
      >
        <p className="mb-6 text-sm text-[var(--text-muted)]">
          <Link href="/projects" className="text-[var(--studio-accent)] hover:underline">
            Browse all {projects.length} projects →
          </Link>
        </p>
        <ShowcaseStage
          accent="sage"
          flagship={<ProjectCard project={featured} variant="flagship" onOpen={() => setSelected(featured)} />}
          reel={
            <>
              {reel.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  variant="reel"
                  onOpen={() => setSelected(project)}
                />
              ))}
            </>
          }
        />
      </StudioSection>
      <AnimatePresence>
        {selected ? <ProjectModal key={selected.id} project={selected} onClose={() => setSelected(null)} /> : null}
      </AnimatePresence>
    </>
  );
}
