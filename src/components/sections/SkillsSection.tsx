'use client';

import StudioSection from '@/components/layout/StudioSection';
import { craftPillars, skillBadges } from '@/data/skills';

export default function SkillsSection() {
  return (
    <StudioSection
      id="skills"
      label="Craft"
      title="Expertise"
      description="I edit and produce first. Then I write the code that has to ship with it."
    >
      <div className="studio-skill-badges">
        {skillBadges.map((badge) => (
          <span key={badge} className="studio-chip">
            {badge}
          </span>
        ))}
      </div>

      <div className="studio-lanes">
        {craftPillars.map((pillar) => (
          <div key={pillar.title} className="studio-lane">
            <div className="studio-lane-head">
              <span className="studio-lane-title">{pillar.title}</span>
              <span className="studio-lane-line" aria-hidden="true" />
            </div>
            <div className="studio-lane-track">
              <div className="studio-lane-chips">
                {pillar.skills.map((skill) => (
                  <span key={skill} className="studio-chip studio-chip--lane">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </StudioSection>
  );
}
