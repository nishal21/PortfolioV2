'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  mobileContactItem,
  mobileTabItems,
} from '@/data/navMeta';
import { getActiveSectionHref, scrollToSection } from '@/lib/scrollNav';

/**
 * Sparse garden chrome — white text on dusk, no pills / glass / HUD.
 */
export default function SiteNav() {
  const [active, setActive] = useState('#home');
  const navLockRef = useRef<string | null>(null);
  const scrollGenRef = useRef(0);
  const spyCooldownUntilRef = useRef(0);

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
    };
    pickActive();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const topLinks = [
    { name: 'Work', href: '#projects' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header className="garden-nav-header">
        <div className="garden-nav-bar page-container">
          <button
            type="button"
            className="garden-nav-mark"
            onClick={() => scrollTo('#home')}
            aria-label="Home"
          >
            NK
          </button>
          <nav className="garden-nav-links" aria-label="Primary">
            {topLinks.map((item, i) => (
              <span key={item.href} className="garden-nav-item-wrap">
                {i > 0 ? (
                  <span className="garden-nav-dot" aria-hidden="true">
                    ·
                  </span>
                ) : null}
                <button
                  type="button"
                  className={`garden-nav-link${active === item.href ? ' is-active' : ''}`}
                  onClick={() => scrollTo(item.href)}
                  aria-current={active === item.href ? 'page' : undefined}
                >
                  {item.name}
                </button>
              </span>
            ))}
          </nav>
        </div>
      </header>

      <nav className="garden-nav-dock" aria-label="Mobile">
        {mobileTabItems.map((item) => {
          const isActive = active === item.href;
          return (
            <button
              key={item.href}
              type="button"
              className={`garden-dock-item${isActive ? ' is-active' : ''}`}
              onClick={() => scrollTo(item.href)}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="garden-dock-label">{item.name}</span>
            </button>
          );
        })}
        <button
          type="button"
          className={`garden-dock-mail${contactActive ? ' is-active' : ''}`}
          onClick={() => scrollTo(mobileContactItem.href)}
          aria-label="Contact"
          aria-current={contactActive ? 'page' : undefined}
        >
          ✉
        </button>
      </nav>
    </>
  );
}
