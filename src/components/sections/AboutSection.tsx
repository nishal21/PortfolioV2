'use client';

import StudioSection from '@/components/layout/StudioSection';
import { personal } from '@/data/personal';
import { CREATOR_NAME, GITHUB_HANDLE } from '@/lib/seo';

export default function AboutSection() {
  const [intro, ...detailBio] = personal.bio;

  return (
    <StudioSection
      id="about"
      label="About"
      title={`About ${CREATOR_NAME}`}
      description={`${personal.tagline} GitHub: ${GITHUB_HANDLE}.`}
    >
      <div className="studio-about">
        <p className="studio-about-watermark font-malayalam" aria-hidden="true">
          {personal.malayalamName}
        </p>

        <p className="studio-about-intro seo-speakable">{intro}</p>

        <div className="studio-about-grid">
          <blockquote className="studio-about-quote">
            <p>{personal.pullQuote}</p>
          </blockquote>

          <div className="studio-about-bio">
            {detailBio.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
        </div>

        <div className="studio-timeline-wrap">
          <p className="studio-meta studio-timeline-label">Timeline</p>
          <ol className="studio-timeline">
            {personal.timeline.map((item) => (
              <li key={item.year}>
                <span className="studio-timeline-dot" aria-hidden="true" />
                <span className="studio-timeline-year">{item.year}</span>
                <span className="studio-timeline-event">{item.event}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="studio-stats">
          {personal.stats.map((stat) => (
            <div key={stat.label} className="studio-stat">
              <p className="studio-stat-num">{stat.number}</p>
              <p className="studio-stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </StudioSection>
  );
}
