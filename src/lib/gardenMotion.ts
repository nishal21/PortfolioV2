/**
 * Motion gate for the garden hero/footer.
 * CSS handles the first-paint entrance; GSAP only layers scroll depth on top
 * when the device can afford it. Everything stays readable without JS.
 */
export type GardenMotionTier = 'none' | 'lite' | 'rich';

export function gardenMotionTier(): GardenMotionTier {
  if (typeof window === 'undefined') return 'none';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'none';

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  const saveData = nav.connection?.saveData === true;
  const slowNet = /(^|-)2g$/.test(nav.connection?.effectiveType ?? '');
  const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 3;
  const fewCores = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4;

  if (saveData || slowNet || lowMemory) return 'none';
  if (fewCores) return 'lite';
  return 'rich';
}

export async function loadGsapScroll() {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}
