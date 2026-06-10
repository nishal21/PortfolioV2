import {
  getExperienceForProfile,
  getTechnicalSkillsForProfile,
  resumeAccomplishments,
  resumeAwards,
  resumeContact,
  resumeEducation,
  resumeSoftSkills,
  type ResumeProfile,
} from '@/data/resume';

interface ResumeDocumentProps {
  profile: ResumeProfile;
}

function SkillLine({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <li className="resume-skill-line">
      <span className="resume-skill-label">{label}:</span> {items.join(', ')}
    </li>
  );
}

export default function ResumeDocument({ profile }: ResumeDocumentProps) {
  const skills = getTechnicalSkillsForProfile(profile.skillFocus);
  const experience = getExperienceForProfile(profile);

  return (
    <article className="resume-doc" aria-label={`Resume, ${profile.label} profile`}>
      <header className="resume-header">
        <h1 className="resume-name">{resumeContact.name}</h1>
        <p className="resume-contact-line">{resumeContact.email}</p>
        <p className="resume-contact-line">{resumeContact.location}</p>
        <p className="resume-contact-line">
          <a href={resumeContact.linkedin}>LinkedIn</a>
          {' · '}
          <a href={resumeContact.peerlist}>Peerlist</a>
          {' · '}
          <a href={resumeContact.github}>GitHub</a>
          {' · '}
          <a href={resumeContact.portfolio}>Portfolio</a>
        </p>
      </header>

      <section className="resume-section">
        <div className="resume-section-group">
          <h2 className="resume-heading">Executive Summary</h2>
          <p className="resume-body">{profile.summary}</p>
        </div>
      </section>

      <section className="resume-section">
        <div className="resume-section-group">
          <h2 className="resume-heading">Technical Skills</h2>
          <ul className="resume-list resume-skill-list">
            <SkillLine label="Programming Languages" items={skills.programmingLanguages} />
            <SkillLine label="Tools & Software" items={skills.toolsSoftware} />
            <SkillLine label="Databases" items={skills.databases} />
            <SkillLine label="AI/ML Technologies" items={skills.aiMl} />
            <SkillLine label="Other Technical Skills" items={skills.other} />
          </ul>
        </div>
      </section>

      <section className="resume-section">
        <div className="resume-section-group">
          <h2 className="resume-heading">Soft Skills</h2>
          <ul className="resume-list">
            {resumeSoftSkills.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="resume-section resume-section--experience">
        <div className="resume-section-group">
          <h2 className="resume-heading">Professional Experience</h2>
          {experience.map((job) => (
            <div key={job.id} className="resume-job">
              <div className="resume-job-head">
                <p className="resume-job-org">
                  {job.organization}
                  {job.location ? ` · ${job.location}` : ''}
                </p>
                <p className="resume-job-date">{job.dateRange}</p>
              </div>
              <p className="resume-job-role">
                <strong>Role:</strong> {job.role}
              </p>
              <p className="resume-subhead">Responsibilities</p>
              <ul className="resume-list">
                {job.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="resume-subhead">Impact</p>
              <ul className="resume-list">
                {job.impact.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="resume-section">
        <div className="resume-section-group">
          <h2 className="resume-heading">Education</h2>
          {resumeEducation.map((row) => (
            <div key={row.degree} className="resume-edu-row">
              <p className="resume-edu-degree">
                {row.degree}, {row.school}
              </p>
              <p className="resume-edu-year">
                <span className="resume-edu-year-label">Year of Graduation:</span> {row.graduation}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="resume-section">
        <div className="resume-section-group">
          <h2 className="resume-heading">Awards</h2>
          <ul className="resume-list">
            {resumeAwards.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="resume-section">
        <div className="resume-section-group">
          <h2 className="resume-heading">Accomplishments & Activities</h2>
          <ul className="resume-list">
            {resumeAccomplishments.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
