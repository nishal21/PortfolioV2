'use client';

import PointerOverlay from '@/components/PointerOverlay';
import VoiceDock from '@/components/voice/VoiceDock';

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PointerOverlay />
      {children}
      <VoiceDock />
    </>
  );
}
