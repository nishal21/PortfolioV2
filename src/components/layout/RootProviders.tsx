'use client';

import { useEffect, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import KineticProviders from '@/components/motion/KineticProviders';

const VoiceDock = dynamic(() => import('@/components/voice/VoiceDock'), {
  ssr: false,
  loading: () => null,
});

export default function RootProviders({ children }: { children: ReactNode }) {
  const [dock, setDock] = useState(false);

  useEffect(() => {
    let done = false;
    let idleHandle = 0;
    let hardHandle = 0;

    const enable = () => {
      if (done) return;
      done = true;
      setDock(true);
      cleanup();
    };

    const onInteract = () => enable();

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleHandle = window.requestIdleCallback(() => enable(), { timeout: 8000 }) as unknown as number;
    } else {
      idleHandle = globalThis.setTimeout(enable, 5000) as unknown as number;
    }
    hardHandle = globalThis.setTimeout(enable, 10000) as unknown as number;

    window.addEventListener('pointerdown', onInteract, { once: true, passive: true });
    window.addEventListener('keydown', onInteract, { once: true });
    window.addEventListener('scroll', onInteract, { once: true, passive: true });

    function cleanup() {
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
      window.removeEventListener('scroll', onInteract);
      globalThis.clearTimeout(hardHandle);
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleHandle);
      } else {
        globalThis.clearTimeout(idleHandle);
      }
    }

    return cleanup;
  }, []);

  return (
    <KineticProviders>
      {children}
      {dock ? <VoiceDock /> : null}
    </KineticProviders>
  );
}
