'use client';

import dynamic from 'next/dynamic';
import { HeroProvider } from '@/components/scroll/HeroContext';
import ScrollIntroSection from '@/components/scroll/ScrollIntroSection';
import SiteNav from '@/components/layout/SiteNav';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';

const SkillsSection = dynamic(() => import('@/components/sections/SkillsSection'), {
  loading: () => <div className="min-h-[40vh]" aria-hidden />,
});
const VideosSection = dynamic(() => import('@/components/sections/VideosSection'), {
  loading: () => <div className="min-h-[50vh]" aria-hidden />,
});
const ContactSection = dynamic(() => import('@/components/sections/ContactSection'), {
  loading: () => <div className="min-h-[40vh]" aria-hidden />,
});

function PortfolioBody() {
  return (
    <>
      <SiteNav />
      <div
        id="page-root"
        className="relative min-h-screen overflow-x-hidden bg-[var(--ink)] pb-[calc(5.75rem+env(safe-area-inset-bottom))] text-[var(--text)] md:pb-0"
      >
        <ScrollIntroSection />
        <main id="main-content" className="relative z-10 studio-stage">
          <div className="studio-content--in">
            <AboutSection />
            <SkillsSection />
            <ProjectsSection />
            <VideosSection />
            <ContactSection />
          </div>
        </main>
      </div>
    </>
  );
}

export default function PortfolioPage() {
  return (
    <HeroProvider>
      <PortfolioBody />
    </HeroProvider>
  );
}
