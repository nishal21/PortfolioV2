import type { CSSProperties } from 'react';

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

const roundedClass = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const;

export default function Skeleton({ className = '', style, rounded = 'md' }: SkeletonProps) {
  return (
    <span
      className={`skeleton block ${roundedClass[rounded]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}
