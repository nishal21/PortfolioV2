'use client';

import KineticProviders from '@/components/motion/KineticProviders';
import VoiceDock from '@/components/voice/VoiceDock';
import PointerOverlay from '@/components/PointerOverlay';

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <KineticProviders>
      <PointerOverlay />
      {children}
      <VoiceDock />
    </KineticProviders>
  );
}
