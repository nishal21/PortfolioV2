'use client';

import PointerOverlay from '@/components/PointerOverlay';
import TalkLauncher from '@/components/voice/TalkLauncher';

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PointerOverlay />
      {children}
      <TalkLauncher />
    </>
  );
}
