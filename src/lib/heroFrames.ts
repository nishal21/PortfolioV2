import { playbackFps } from '@/lib/performance';

/** Mobile loads this many evenly-spaced keyframes (not all 166). */
export const MOBILE_FRAME_TARGET = 60;

/** Evenly sample `target` frames across the full sequence. */
export function sparseFrameIndices(frameCount: number, target = MOBILE_FRAME_TARGET): number[] {
  if (target >= frameCount) {
    return Array.from({ length: frameCount }, (_, i) => i);
  }

  const indices: number[] = [];
  for (let i = 0; i < target; i += 1) {
    indices.push(Math.round((i * (frameCount - 1)) / (target - 1)));
  }

  return [...new Set(indices)].sort((a, b) => a - b);
}

export function isSparseHeroMode() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
}

/** Same wall-clock duration as the source clip (~frameCount / manifestFps). */
export function heroPlaybackFps(
  manifestFps: number,
  totalFrameCount: number,
  playbackFrameCount: number
): number {
  const deviceCap = playbackFps(manifestFps);
  if (deviceCap <= 0 || playbackFrameCount <= 0) return 0;
  if (playbackFrameCount >= totalFrameCount) return deviceCap;

  const sourceDurationSec = (totalFrameCount - 1) / manifestFps;
  const naturalRate = playbackFrameCount / sourceDurationSec;
  return Math.min(deviceCap, Math.max(8, naturalRate));
}
