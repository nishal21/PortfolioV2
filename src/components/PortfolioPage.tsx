'use client';

import dynamic from 'next/dynamic';
import KineticHero from '@/components/hero/KineticHero';
import SiteNav from '@/components/layout/SiteNav';

const AboutSection = dynamic(() => import('@/components/sections/AboutSection'), {
  loading: () => <div className="min-h-[50vh]" aria-hidden />,
});
const SkillsSection = dynamic(() => import('@/components/sections/SkillsSection'), {
  loading: () => <div className="min-h-[40vh]" aria-hidden />,
});
const ProjectsSection = dynamic(() => import('@/components/sections/ProjectsSection'), {
  loading: () => <div className="min-h-[50vh]" aria-hidden />,
});
const VideosSection = dynamic(() => import('@/components/sections/VideosSection'), {
  loading: () => <div className="min-h-[50vh]" aria-hidden />,
});
const ContactSection = dynamic(() => import('@/components/sections/ContactSection'), {
  loading: () => <div className="min-h-[40vh]" aria-hidden />,
});

export default function PortfolioPage() {
  return (
    <>
      <SiteNav />
      <div
        id="page-root"
        className="relative min-h-screen overflow-x-hidden bg-[var(--ink)] pb-[calc(5.75rem+env(safe-area-inset-bottom))] text-[var(--text)] md:pb-0"
      >
        <KineticHero />
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
