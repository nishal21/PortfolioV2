'use client';

import PointerOverlay from '@/components/PointerOverlay';

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PointerOverlay />
      {children}
    </>
  );
}
