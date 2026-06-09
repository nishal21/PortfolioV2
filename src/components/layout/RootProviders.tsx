'use client';

import CustomCursor from '@/components/CustomCursor';

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomCursor />
      {children}
    </>
  );
}
