'use client';

import { HeroProvider } from '@/components/scroll/HeroContext';
import ScrollIntroSection from '@/components/scroll/ScrollIntroSection';
import SiteNav from '@/components/layout/SiteNav';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import VideosSection from '@/components/sections/VideosSection';
import ContactSection from '@/components/sections/ContactSection';

function PortfolioBody() {
  return (
    <div
      id="page-root"
      className="relative min-h-screen overflow-x-hidden bg-[var(--ink)] pb-[calc(5.75rem+env(safe-area-inset-bottom))] text-[var(--text)] md:pb-0"
    >
      <SiteNav />
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
  );
}

export default function PortfolioPage() {
  return (
    <HeroProvider>
      <PortfolioBody />
    </HeroProvider>
  );
}
