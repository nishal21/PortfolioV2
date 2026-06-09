'use client';

import { useEffect, useRef } from 'react';
import { useScrollSequence } from './ScrollSequenceContext';

interface ScrollSequenceCanvasProps {
  className?: string;
  style?: React.CSSProperties;
  mode?: 'live' | 'static';
}

export default function ScrollSequenceCanvas({
  className = '',
  style,
  mode = 'live',
}: ScrollSequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { registerCanvas, ready } = useScrollSequence();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return registerCanvas(canvas, mode);
  }, [registerCanvas, mode]);

  return (
    <canvas
      ref={canvasRef}
      className={`block h-full w-full ${className}`}
      style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.4s ease', ...style }}
      aria-hidden="true"
    />
  );
}
