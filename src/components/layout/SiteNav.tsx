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
import { useScrollSequence } from '@/components/scroll/ScrollSequenceContext';
import { getActiveSectionHref, scrollToSection } from '@/lib/scrollNav';
import { useLiquidGlassNav } from '@/hooks/useLiquidGlassNav';
import { enableNavLiquidGlass, removeLiquidGlass, rebuildAllLiquidGlass } from '@/lib/liquidGlass';
import { NAV_GLASS_CONFIG } from '@/lib/liquidGlassConfig';

function NavTabButton({
  item,
  index,
  active,
  mobile,
  setItemRef,
  onItemPointerDown,
  scrollTo,
}: {
  item: (typeof navItems)[number];
  index: number;
  active: boolean;
  mobile?: boolean;
  setItemRef: (index: number) => (el: HTMLButtonElement | null) => void;
  onItemPointerDown: (index: number) => (e: React.PointerEvent<HTMLButtonElement>) => void;
  scrollTo: (href: string) => void;
}) {
  const Icon = navIcons[item.href];
  const label = item.name === 'Home' ? 'Home' : item.name;

  return (
    <button
      ref={setItemRef(index)}
      type="button"
      className={`ios-item cursor-hover ${mobile ? 'ios-item--mobile' : ''} ${active ? 'active' : ''}`}
      onPointerDown={onItemPointerDown(index)}
      onClick={(e) => {
        e.preventDefault();
        scrollTo(item.href);
      }}
      aria-current={active ? 'page' : undefined}
    >
      {mobile && Icon ? <Icon className="ios-item-icon" strokeWidth={2} aria-hidden /> : null}
      <span className={mobile ? 'ios-item-label' : undefined}>
        {mobile ? label : item.name === 'Home' ? 'NK' : item.name}
      </span>
    </button>
  );
}

export default function SiteNav() {
  const { ready: contentReady } = useScrollSequence();
  const [active, setActive] = useState('#home');
  const contactFabRef = useRef<HTMLButtonElement>(null);
  const navLockRef = useRef<string | null>(null);
  const scrollGenRef = useRef(0);
  const spyCooldownUntilRef = useRef(0);
  const contentReadyRef = useRef(contentReady);
  const pendingHrefRef = useRef<string | null>(null);
  const layoutSettleScrollRef = useRef(false);
  const scrollIdleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  contentReadyRef.current = contentReady;

  const activeIndex = Math.max(
    0,
    navItems.findIndex((item) => item.href === active)
  );

  const contactActive = active === mobileContactItem.href;
  const mobileActiveIndex = contactActive ? -1 : mobileTabIndexForHref(active);

  const releaseNavLock = useCallback((href: string, gen: number) => {
    if (gen !== scrollGenRef.current) return;
    if (navLockRef.current !== href) return;
    navLockRef.current = null;
    spyCooldownUntilRef.current = performance.now() + 700;
    setActive(href);
  }, []);

  const finishScroll = useCallback(
    (href: string, layoutSettle = false) => {
      const gen = ++scrollGenRef.current;

      void scrollToSection(href, { layoutSettle }).then(() => {
        if (gen !== scrollGenRef.current) return;
        releaseNavLock(href, gen);
      });
    },
    [releaseNavLock]
  );

  const scrollTo = useCallback(
    (href: string) => {
      navLockRef.current = href;

      if (href !== '#home' && !contentReadyRef.current) {
        pendingHrefRef.current = href;
        return;
      }

      const needsLayoutSettle = layoutSettleScrollRef.current;
      layoutSettleScrollRef.current = false;
      pendingHrefRef.current = null;
      finishScroll(href, needsLayoutSettle);
    },
    [finishScroll]
  );

  const scrollToIndex = useCallback(
    (index: number) => {
      const item = navItems[index];
      if (item) scrollTo(item.href);
    },
    [scrollTo]
  );

  const scrollToMobileIndex = useCallback(
    (index: number) => {
      const item = mobileTabItems[index];
      if (item) scrollTo(item.href);
    },
    [scrollTo]
  );

  const desktopNav = useLiquidGlassNav(navItems.length, activeIndex, scrollToIndex);
  const mobileNav = useLiquidGlassNav(mobileTabItems.length, mobileActiveIndex, scrollToMobileIndex);

  useEffect(() => {
    if (!contentReady) return;

    let cancelled = false;

    const settleAfterContent = () => {
      if (cancelled) return;

      const pending = pendingHrefRef.current;
      pendingHrefRef.current = null;

      if (pending) {
        navLockRef.current = pending;
        layoutSettleScrollRef.current = true;
        finishScroll(pending, true);
        return;
      }

      if (!navLockRef.current) {
        setActive(getActiveSectionHref(true));
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(settleAfterContent);
    });

    return () => {
      cancelled = true;
    };
  }, [contentReady, finishScroll]);

  useEffect(() => {
    let raf = 0;

    const pickActive = () => {
      if (navLockRef.current) return;
      if (performance.now() < spyCooldownUntilRef.current) return;

      if (!contentReadyRef.current) {
        if (window.scrollY < window.innerHeight * 0.45) {
          setActive('#home');
        }
        return;
      }

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

  useEffect(() => {
    const el = contactFabRef.current;
    if (!el) return;

    enableNavLiquidGlass(el, () => NAV_GLASS_CONFIG);

    const onResize = () => rebuildAllLiquidGlass();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      removeLiquidGlass(el);
    };
  }, []);

  return (
    <>
      <header className="ios-nav-header">
        <div ref={desktopNav.navWrapRef} className="ios26-nav lg-demo-target" data-radius="999">
          <nav ref={desktopNav.navInnerRef} className="ios26-nav-inner">
            <div ref={desktopNav.glowRef} className="nav-glow" aria-hidden="true" />
            <div ref={desktopNav.indicatorRef} className="tab-indicator" aria-hidden="true" />
            {navItems.map((item, index) => (
              <NavTabButton
                key={item.href}
                item={item}
                index={index}
                active={active === item.href}
                setItemRef={desktopNav.setItemRef}
                onItemPointerDown={desktopNav.onItemPointerDown}
                scrollTo={scrollTo}
              />
            ))}
          </nav>
        </div>
      </header>

      <nav className="ios-nav-dock" aria-label="Site navigation">
        <div ref={mobileNav.navWrapRef} className="ios26-nav ios26-nav--mobile lg-demo-target" data-radius="999">
          <div ref={mobileNav.navInnerRef} className="ios26-nav-inner ios26-nav-inner--mobile">
            <div ref={mobileNav.glowRef} className="nav-glow" aria-hidden="true" />
            <div ref={mobileNav.indicatorRef} className="tab-indicator tab-indicator--mobile" aria-hidden="true" />
            {mobileTabItems.map((item, index) => (
              <NavTabButton
                key={item.href}
                item={item}
                index={index}
                active={mobileTabIndexForHref(active) === index && !contactActive}
                mobile
                setItemRef={mobileNav.setItemRef}
                onItemPointerDown={mobileNav.onItemPointerDown}
                scrollTo={scrollTo}
              />
            ))}
          </div>
        </div>

        <button
          ref={contactFabRef}
          type="button"
          className={`ios-nav-fab cursor-hover lg-demo-target ${contactActive ? 'active' : ''}`}
          data-radius="999"
          onClick={() => scrollTo(mobileContactItem.href)}
          aria-label={mobileContactItem.name}
          aria-current={contactActive ? 'page' : undefined}
        >
          <Mail className="ios-nav-fab-icon" strokeWidth={2} aria-hidden />
        </button>
      </nav>
    </>
  );
}
