'use client';

import { useEffect } from 'react';

/** When clean view opens with ?autoprint=1, trigger print after paint */
export default function ResumeAutoPrint({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return;
    document.title = ' ';
    const t = window.setTimeout(() => window.print(), 400);
    return () => window.clearTimeout(t);
  }, [enabled]);

  return null;
}
