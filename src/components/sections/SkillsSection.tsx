'use client';

import StudioSection from '@/components/layout/StudioSection';
import { craftPillars, skillBadges } from '@/data/skills';

function padIndex(n: number) {
  return String(n + 1).padStart(2, '0');
}

export default function SkillsSection() {
  return (
    <StudioSection
      id="skills"
      label="Craft"
      title="Expertise"
      description="I edit and produce first. Then I write the code that has to ship with it."
    >
      <div className="studio-craft">
        <p className="studio-craft-roles" aria-label="Roles">
          {skillBadges.map((badge, i) => (
            <span key={badge}>
              {i > 0 ? <span className="studio-craft-dot" aria-hidden="true" /> : null}
              {badge}
            </span>
          ))}
        </p>

        <div className="studio-craft-grid">
          {craftPillars.map((pillar, index) => (
            <article key={pillar.title} className="studio-craft-pillar">
              <header className="studio-craft-head">
                <span className="studio-craft-index">{padIndex(index)}</span>
                <h3 className="studio-craft-title">{pillar.title}</h3>
                <p className="studio-craft-blurb">{pillar.blurb}</p>
              </header>
              <ul className="studio-craft-list">
                {pillar.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </StudioSection>
  );
}
