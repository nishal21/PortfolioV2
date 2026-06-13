'use client';

import { useEffect } from 'react';

/** Dark pointer overlay on light resume paper; restored on leave */
export default function ResumePageEffects() {
  useEffect(() => {
    document.body.classList.add('resume-route');
    return () => document.body.classList.remove('resume-route');
  }, []);

  return null;
}
