'use client';

import Link from 'next/link';
import { projects, getProjectSlug } from '@/data/projects';
import { FEATURED_PROJECT_TITLES } from '@/data/featured';
import StudioSection from '@/components/layout/StudioSection';

const featuredTitles = FEATURED_PROJECT_TITLES as readonly string[];

export default function ProjectsSection() {
  const featured = featuredTitles
    .map((title) => projects.find((p) => p.title === title))
    .filter(Boolean) as typeof projects;

  const archive = projects.filter((p) => !featuredTitles.includes(p.title));

  return (
    <StudioSection id="projects" label="Selected work" title="Projects that shipped." accent="warm">
      <p className="studio-desc" style={{ marginTop: '-1rem', marginBottom: '1.75rem' }}>
        Six featured builds. Everything else lives in the archive below — same honesty, less noise.
      </p>

      <div className="kinetic-featured-grid">
        {featured.map((project) => {
          const slug = getProjectSlug(project);
          return (
            <article key={project.id} className="kinetic-featured-card">
              <h3>
                <Link href={`/projects/${slug}`}>{project.title}</Link>
              </h3>
              <p>{project.description}</p>
              <div className="kinetic-featured-meta">
                <span>{project.category}</span>
                {project.status ? <span>{project.status}</span> : null}
                {project.liveUrl ? (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    Live
                  </a>
                ) : null}
                {project.githubUrl ? (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      <div className="kinetic-archive">
        <h3 className="studio-label" style={{ marginBottom: '0.75rem' }}>
          Archive
        </h3>
        <ul className="kinetic-archive-list">
          {archive.map((project) => {
            const slug = getProjectSlug(project);
            return (
              <li key={project.id}>
                <Link href={`/projects/${slug}`}>{project.title}</Link>
                <span style={{ color: 'var(--text-dim)' }}>{project.category}</span>
              </li>
            );
          })}
        </ul>
        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
          Full index:{' '}
          <Link href="/projects" style={{ color: 'var(--amber)' }}>
            /projects
          </Link>
        </p>
      </div>
    </StudioSection>
  );
}

