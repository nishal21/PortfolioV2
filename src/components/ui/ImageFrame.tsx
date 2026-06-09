'use client';

import { useState } from 'react';

interface ImageFrameProps {
  src: string | null;
  alt: string;
  className?: string;
  aspect?: 'video' | 'wide' | 'square';
  fit?: 'cover' | 'contain';
  fill?: boolean;
  fallbackLabel?: string;
}

export default function ImageFrame({
  src,
  alt,
  className = '',
  aspect = 'video',
  fit = 'cover',
  fill = false,
  fallbackLabel = 'Preview',
}: ImageFrameProps) {
  const [failed, setFailed] = useState(!src);

  const aspectClass = fill
    ? 'h-full w-full min-h-0'
    : aspect === 'video'
      ? 'aspect-video w-full'
      : aspect === 'wide'
        ? 'aspect-[16/10] w-full'
        : 'aspect-square w-full';

  const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover';

  return (
    <div
      className={`relative overflow-hidden border border-[var(--border-subtle)] bg-[#0c0e11] ${aspectClass} ${className}`}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          decoding="async"
          className={`absolute inset-0 block h-full w-full ${fitClass}`}
          onLoad={() => setFailed(false)}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
          <div className="h-px w-12 bg-[var(--amber)]" />
          <p className="text-center text-xs uppercase tracking-widest text-[var(--text-dim)]">
            {fallbackLabel}
          </p>
        </div>
      )}
    </div>
  );
}
