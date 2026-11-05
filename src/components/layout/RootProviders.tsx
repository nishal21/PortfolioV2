'use client';

import KineticProviders from '@/components/motion/KineticProviders';
import VoiceDock from '@/components/voice/VoiceDock';

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <KineticProviders>
      {children}
      <VoiceDock />
    </KineticProviders>
  );
}
