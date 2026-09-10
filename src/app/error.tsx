'use client';

import { useEffect } from 'react';
import ErrorStage from '@/components/error/ErrorStage';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[nishal.dev]', error);
  }, [error]);

  return <ErrorStage kind="error" digest={error.digest} onRetry={reset} />;
}
