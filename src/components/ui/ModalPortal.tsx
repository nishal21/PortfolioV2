'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const MODAL_OPEN_CLASS = 'studio-modal-open';

export function useModalLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    document.body.classList.add(MODAL_OPEN_CLASS);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.classList.remove(MODAL_OPEN_CLASS);
      document.body.style.overflow = prev;
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
