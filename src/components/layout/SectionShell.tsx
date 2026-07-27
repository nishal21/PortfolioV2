'use client';

import { ReactNode, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { defaultTransition } from '@/lib/motion';

interface SectionShellProps {
  id: string;
  index: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export default function SectionShell({
  id,
  index,
  title,
  description,
  children,
}: SectionShellProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      id={id}
      ref={ref}
      className="film-section page-container"
    >
      <motion.header
        className="film-section-header"
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={defaultTransition}
      >
        <p className="film-section-index">{index}</p>
        <h2 className="film-section-title">{title}</h2>
        {description ? <p className="film-section-desc">{description}</p> : null}
      </motion.header>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ ...defaultTransition, delay: 0.05 }}
      >
        {children}
      </motion.div>
    </section>
  );
}
