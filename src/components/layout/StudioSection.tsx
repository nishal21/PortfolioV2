'use client';

import { ReactNode } from 'react';

interface StudioSectionProps {
  id: string;
  label: string;
  title: string;
  description?: string;
  accent?: 'sage' | 'warm';
  children: ReactNode;
}

/** CSS-first section chrome — no framer-motion (protects TBT/LCP). */
export default function StudioSection({
  id,
  label,
  title,
  description,
  accent = 'sage',
  children,
}: StudioSectionProps) {
  return (
    <section
      id={id}
      className={`studio-section page-container studio-section--${accent}`}
    >
      <header className="studio-section-header">
        <p className="studio-label">{label}</p>
        <h2 className="studio-title">{title}</h2>
        {description ? <p className="studio-desc">{description}</p> : null}
      </header>
      <div className="studio-section-body">{children}</div>
    </section>
  );
}

