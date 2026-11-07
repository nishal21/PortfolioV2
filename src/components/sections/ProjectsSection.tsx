'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Github, X, Youtube } from 'lucide-react';
import StudioSection from '@/components/layout/StudioSection';
import WorkGallery from '@/components/sections/WorkGallery';
import Badge from '@/components/ui/Badge';
import ImageFrame from '@/components/ui/ImageFrame';
import ModalPortal, { useModalLock } from '@/components/ui/ModalPortal';
import Link from 'next/link';
import { projects, getProjectSlug, getProjectThumbnail, isProjectInDevelopment, type Project } from '@/data/projects';

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
    project.huggingfaceUrl
      ? { href: project.huggingfaceUrl, label: 'Hugging Face', icon: ExternalLink, primary: false, external: true }
      : null,
    project.ollamaUrl
      ? { href: project.ollamaUrl, label: 'Ollama', icon: ExternalLink, primary: false, external: true }
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

const modalEase = { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const };

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useModalLock(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const thumb = getProjectThumbnail(project.id);
  // SVG covers already paint the title — skip so the header isn’t doubled
  const coverSrc = thumb && !/\.svg($|\?)/i.test(thumb) ? thumb : null;
  const longCopy =
    project.longDescription &&
    project.longDescription.trim() !== project.description.trim()
      ? project.longDescription
      : null;

  return (
    <ModalPortal>
      <motion.div
        className="studio-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={modalEase}
        onClick={onClose}
        role="presentation"
      >
        <motion.div
          className="studio-modal"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={modalEase}
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
            {coverSrc ? (
              <ImageFrame
                src={coverSrc}
                alt=""
                fallbackLabel={project.liveUrl ? 'Live project' : 'In development'}
                loading="eager"
                {...projectModalCoverProps}
              />
            ) : null}
            <div className="studio-modal-content">
              {project.lastUpdated ? (
                <p className="studio-modal-meta">Last update: {formatLastUpdated(project.lastUpdated)}</p>
              ) : null}
              <p className="studio-modal-lead">{project.description}</p>
              {longCopy ? <p className="studio-modal-copy">{longCopy}</p> : null}
              {project.features.length > 0 ? (
                <ul className="studio-modal-features">
                  {project.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              ) : null}
              {project.attributions && project.attributions.length > 0 ? (
                <div className="studio-modal-stack">
                  <p className="studio-meta">Credits</p>
                  <ul className="studio-modal-features">
                    {project.attributions.map((credit) => (
                      <li key={credit.url}>
                        <a
                          href={credit.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--studio-accent)] hover:underline"
                        >
                          {credit.name}
                        </a>
                        {credit.license ? ` (${credit.license})` : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {project.tags.length > 0 ? (
                <div className="studio-modal-tags">
                  <p className="studio-meta">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 8).map((tag) => (
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

export default function ProjectsSection() {
  const [selected, setSelected] = useState<Project | null>(null);

  if (!projects[0]) return null;

  return (
    <>
      <StudioSection id="projects" label="Build" title="Selected Work" accent="sage" chrome={false}>
        <WorkGallery projects={projects} onOpen={setSelected} />
      </StudioSection>
      <AnimatePresence>
        {selected ? <ProjectModal key={selected.id} project={selected} onClose={() => setSelected(null)} /> : null}
      </AnimatePresence>
    </>
  );
}
