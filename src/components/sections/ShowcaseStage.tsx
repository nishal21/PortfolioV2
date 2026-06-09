'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { defaultTransition } from '@/lib/motion';

interface ShowcaseStageProps {
  accent?: 'sage' | 'warm';
  flagship: ReactNode;
  reel: ReactNode;
  filters?: ReactNode;
}

export default function ShowcaseStage({ accent = 'sage', flagship, reel, filters }: ShowcaseStageProps) {
  return (
    <div className={`studio-showcase studio-showcase--${accent}`}>
      <motion.div
        className="studio-showcase-flagship"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={defaultTransition}
      >
        {flagship}
      </motion.div>
      {filters ? <div className="studio-showcase-filters">{filters}</div> : null}
      <div className="studio-showcase-reel">{reel}</div>
    </div>
  );
}
