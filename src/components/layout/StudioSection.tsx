'use client';

import { ReactNode, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { defaultTransition } from '@/lib/motion';

interface StudioSectionProps {
  id: string;
  label: string;
  title: string;
  description?: string;
  accent?: 'sage' | 'warm';
  children: ReactNode;
}

export default function StudioSection({
  id,
  label,
  title,
  description,
  accent = 'sage',
  children,
}: StudioSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      id={id}
      ref={ref}
      className={`studio-section page-container studio-section--${accent}`}
    >
      <motion.header
        className="studio-section-header"
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={defaultTransition}
      >
        <p className="studio-label">{label}</p>
        <h2 className="studio-title">{title}</h2>
        {description ? <p className="studio-desc">{description}</p> : null}
      </motion.header>
      <motion.div
        className="studio-body"
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ ...defaultTransition, delay: 0.05 }}
      >
        {children}
      </motion.div>
    </section>
  );
}
