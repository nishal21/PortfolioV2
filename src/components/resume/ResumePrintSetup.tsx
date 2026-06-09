'use client';

import { useEffect, useRef } from 'react';

const DEFAULT_TITLE = 'Resume | Nishal K';

/** Clears document title before print so browser header shows less clutter */
export default function ResumePrintSetup() {
  const savedTitle = useRef(DEFAULT_TITLE);

  useEffect(() => {
    savedTitle.current = document.title || DEFAULT_TITLE;

    const onBeforePrint = () => {
      savedTitle.current = document.title;
      document.title = ' ';
    };

    const onAfterPrint = () => {
      document.title = savedTitle.current || DEFAULT_TITLE;
    };

    window.addEventListener('beforeprint', onBeforePrint);
    window.addEventListener('afterprint', onAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', onBeforePrint);
      window.removeEventListener('afterprint', onAfterPrint);
      document.title = savedTitle.current || DEFAULT_TITLE;
    };
  }, []);

  return null;
}
