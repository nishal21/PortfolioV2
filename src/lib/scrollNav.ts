import { navItems } from '@/data/personal';

/** Pause hero autoplay when leaving the head section. */
export const HERO_PAUSE_EVENT = 'hero-pause';
export const HERO_RESUME_EVENT = 'hero-resume';

/** Fixed nav clearance (top bar + padding). */
export const NAV_SCROLL_OFFSET = 80;

function getScrollY() {
  return (
    window.scrollY ||
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

function setScrollY(top: number) {
  try {
    window.scrollTo({ top, behavior: 'auto' });
  } catch {
    window.scrollTo(0, top);
  }
}

export function pauseHeroEffects() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(HERO_PAUSE_EVENT));
}

export function resumeHeroEffects() {
  if (typeof window === 'undefined') return;
  snapHeroTextVisible();
  window.dispatchEvent(new Event(HERO_RESUME_EVENT));
}

/** Restore hero copy opacity instantly (scroll fade can lag behind canvas). */
export function snapHeroTextVisible() {
  if (typeof window === 'undefined') return;
  const copy = document.querySelector('#home .hero-copy') as HTMLElement | null;
  copy?.style.setProperty('--hero-fade', '1');
}

export function isInHeroZone(scrollY = getScrollY()) {
  return scrollY < window.innerHeight * 0.55;
}

function isSectionMeasurable(el: Element) {
  const rect = el.getBoundingClientRect();
  return rect.height > 24;
}

/** Wait for document height to stop shifting (skeleton → sections swap). */
export function waitForLayoutSettle(timeoutMs = 900): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  return new Promise((resolve) => {
    let lastH = document.documentElement.scrollHeight;
    let stable = 0;
    const start = performance.now();

    const tick = () => {
      const h = document.documentElement.scrollHeight;
      if (h === lastH) stable += 1;
      else {
        stable = 0;
        lastH = h;
      }

      if (stable >= 4 || performance.now() - start >= timeoutMs) {
        resolve();
        return;
      }
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
}

/** Wait until a section exists in the layout (post-skeleton / hydration). */
export function waitUntilSectionReady(href: string, timeoutMs = 5000): Promise<Element | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (href === '#home') return Promise.resolve(document.querySelector('#home'));

  const start = performance.now();

  return new Promise((resolve) => {
    const tick = () => {
      const el = document.querySelector(href);
      if (el && isSectionMeasurable(el)) {
        resolve(el);
        return;
      }
      if (performance.now() - start >= timeoutMs) {
        resolve(el);
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });
}

/** Scroll-spy: section whose top has passed the nav marker (last match wins). */
export function getActiveSectionHref(contentReady = true): string {
  if (typeof window === 'undefined') return '#home';

  const y = getScrollY();
  const vh = window.innerHeight;

  if (y < vh * 0.45) return '#home';
  if (!contentReady) return '#home';

  const marker = y + NAV_SCROLL_OFFSET + 40;
  let current = '#home';

  for (const item of navItems) {
    const el = document.querySelector(item.href);
    if (!el || !isSectionMeasurable(el)) continue;
    const top = el.getBoundingClientRect().top + y;
    if (marker >= top) current = item.href;
  }

  return current;
}

export function getScrollTopForSection(href: string, el?: Element | null) {
  if (href === '#home') return 0;
  const node = el ?? document.querySelector(href);
  if (!node) return 0;
  const rect = node.getBoundingClientRect();
  return Math.max(0, getScrollY() + rect.top - NAV_SCROLL_OFFSET);
}

export function snapToSection(href: string) {
  if (typeof window === 'undefined') return;
  setScrollY(getScrollTopForSection(href));
}

/** Keep observing until the target section is in view; hard-snap only as a last resort. */
export function waitUntilSectionArrived(href: string, timeoutMs = 4500): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  const start = performance.now();

  return new Promise((resolve) => {
    const tick = () => {
      if (isSectionArrived(href)) {
        resolve();
        return;
      }

      if (performance.now() - start >= timeoutMs) {
        snapToSection(href);
        resolve();
        return;
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
}

export function isSectionArrived(href: string) {
  if (href === '#home') {
    return getScrollY() < window.innerHeight * 0.4;
  }

  const el = document.querySelector(href);
  if (!el) return false;

  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const topOk = rect.top <= NAV_SCROLL_OFFSET + 28;
  const visibleEnough = rect.bottom > Math.min(vh * 0.35, 280);

  return topOk && visibleEnough;
}

/**
 * Scroll to an in-page section and resolve when the target has been reached.
 * Uses an eased RAF scroll for steadier motion than native `behavior: 'smooth'`.
 */
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function animateScrollTo(top: number, durationMs = 720): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  const from = getScrollY();
  const delta = top - from;
  if (Math.abs(delta) < 2) {
    setScrollY(top);
    return Promise.resolve();
  }

  const reduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    setScrollY(top);
    return Promise.resolve();
  }

  const distance = Math.abs(delta);
  const duration = Math.min(durationMs, Math.max(420, distance * 0.55));
  const start = performance.now();

  return new Promise((resolve) => {
    let raf = 0;
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      cancelAnimationFrame(raf);
      setScrollY(top);
      resolve();
    };

    const step = (now: number) => {
      if (settled) return;
      const t = Math.min(1, (now - start) / duration);
      setScrollY(from + delta * easeInOutCubic(t));
      if (t < 1) {
        raf = requestAnimationFrame(step);
        return;
      }
      finish();
    };

    raf = requestAnimationFrame(step);
    window.setTimeout(finish, duration + 160);
  });
}

function scrollToSectionTarget(href: string, target: Element): Promise<void> {
  const fromHero = isInHeroZone();
  const scrollTop = getScrollTopForSection(href, target);
  const useInstant = href === '#home';

  if (href === '#home') {
    resumeHeroEffects();
  } else if (fromHero) {
    pauseHeroEffects();
  }

  if (isSectionArrived(href) && Math.abs(getScrollY() - scrollTop) < 4) {
    return Promise.resolve();
  }

  if (useInstant) {
    setScrollY(scrollTop);
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        if (!isSectionArrived(href)) {
          snapToSection(href);
        }
        resolve();
      });
    });
  }

  return animateScrollTo(scrollTop).then(() => {
    if (!isSectionArrived(href)) {
      snapToSection(href);
    }
  });
}

export type ScrollToSectionOptions = {
  /** Wait for skeleton → content layout shift before measuring (first nav after load). */
  layoutSettle?: boolean;
};

export function scrollToSection(href: string, options?: ScrollToSectionOptions): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  return waitUntilSectionReady(href)
    .then(async (target) => {
      if (!target) return;
      if (options?.layoutSettle) await waitForLayoutSettle();
      await scrollToSectionTarget(href, target);
      await waitUntilSectionArrived(href);
    });
}
