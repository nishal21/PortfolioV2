'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { loadGsapScroll } from '@/lib/gardenMotion';

const MODAL_OPEN_CLASS = 'studio-modal-open';

export function useModalLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    document.body.classList.add(MODAL_OPEN_CLASS);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let cancelled = false;
    let paused: Array<{ disable: (revert?: boolean) => void; enable: (revert?: boolean) => void }> = [];

    // Pin/scrub ScrollTriggers under the modal fight touch scroll — pause them.
    void loadGsapScroll()
      .then(({ ScrollTrigger }) => {
        if (cancelled) return;
        paused = ScrollTrigger.getAll() as typeof paused;
        paused.forEach((t) => t.disable(false));
      })
      .catch(() => {
        /* gsap may not be loaded yet */
      });

    return () => {
      cancelled = true;
      document.body.classList.remove(MODAL_OPEN_CLASS);
      document.body.style.overflow = prevOverflow;
      paused.forEach((t) => t.enable(false));
      void loadGsapScroll()
        .then(({ ScrollTrigger }) => ScrollTrigger.refresh())
        .catch(() => undefined);
    };
  }, [active]);
}

export default function ModalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}
