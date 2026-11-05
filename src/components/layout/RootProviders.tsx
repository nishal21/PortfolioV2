'use client';

import dynamic from 'next/dynamic';
import KineticProviders from '@/components/motion/KineticProviders';

const VoiceDock = dynamic(() => import('@/components/voice/VoiceDock'), {
  ssr: false,
  loading: () => null,
});

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <KineticProviders>
      {children}
      <VoiceDock />
    </KineticProviders>
  );
}