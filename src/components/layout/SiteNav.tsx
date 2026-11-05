'use client';

import { Mail } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { navItems } from '@/data/personal';
import {
  mobileContactItem,
  mobileTabIndexForHref,
  mobileTabItems,
  navIcons,
} from '@/data/navMeta';
import { getActiveSectionHref, scrollToSection } from '@/lib/scrollNav';

/**
 * Sharp Kinetic Studio chrome — no pills, no glass, no backdrop-filter.
 */
export default function SiteNav() {
  const [active, setActive] = useState('#home');
  const navLockRef = useRef<string | null>(null);
  const scrollGenRef = useRef(0);
  const spyCooldownUntilRef = useRef(0);
  const scrollIdleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const contactActive = active === mobileContactItem.href;

  const releaseNavLock = useCallback((href: string, gen: number) => {
    if (gen !== scrollGenRef.current) return;
    if (navLockRef.current !== href) return;
    navLockRef.current = null;
    spyCooldownUntilRef.current = performance.now() + 700;
    setActive(href);
  }, []);

  const scrollTo = useCallback(
    (href: string) => {
      navLockRef.current = href;
      const gen = ++scrollGenRef.current;
      void scrollToSection(href).then(() => releaseNavLock(href, gen));
    },
    [releaseNavLock],
  );

  useEffect(() => {
    let raf = 0;
    const pickActive = () => {
      if (navLockRef.current) return;
      if (performance.now() < spyCooldownUntilRef.current) return;
      const current = getActiveSectionHref(true);
      setActive((prev) => (prev === current ? prev : current));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(pickActive);
      if (navLockRef.current) return;
      if (scrollIdleRef.current) clearTimeout(scrollIdleRef.current);
      scrollIdleRef.current = setTimeout(() => pickActive(), 120);
    };
    pickActive();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      if (scrollIdleRef.current) clearTimeout(scrollIdleRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <>
      <header className="kinetic-nav-header">
        <div className="kinetic-nav-bar">
          <button
            type="button"
            className="kinetic-nav-mark"
            onClick={() => scrollTo('#home')}
            aria-label="Home"
          >
            NK
          </button>
          <nav className="kinetic-nav" aria-label="Primary">
            {navItems.map((item, i) => (
              <button
                key={item.href}
                type="button"
                className={`kinetic-nav-item ${active === item.href ? 'is-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(item.href);
                }}
                aria-current={active === item.href ? 'page' : undefined}
              >
                <span className="kinetic-nav-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <nav className="kinetic-nav-dock" aria-label="Site navigation">
        <div className="kinetic-nav-dock-inner">
          {mobileTabItems.map((item) => {
            const Icon = navIcons[item.href];
            const on =
              mobileTabIndexForHref(active) === mobileTabItems.indexOf(item) && !contactActive;
            return (
              <button
                key={item.href}
                type="button"
                className={`kinetic-dock-item ${on ? 'is-active' : ''}`}
                onClick={() => scrollTo(item.href)}
                aria-current={on ? 'page' : undefined}
              >
                {Icon ? <Icon className="kinetic-dock-icon" strokeWidth={2} aria-hidden /> : null}
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className={`kinetic-dock-fab ${contactActive ? 'is-active' : ''}`}
          onClick={() => scrollTo(mobileContactItem.href)}
          aria-label={mobileContactItem.name}
          aria-current={contactActive ? 'page' : undefined}
        >
          <Mail className="kinetic-dock-icon" strokeWidth={2} aria-hidden />
        </button>
      </nav>
    </>
  );
}
