'use client';

import { supportLinks } from '@/data/contact';

export default function SupportStrip() {
  return (
    <div className="studio-support kinetic-support">
      <p className="studio-label">Support</p>
      <h3 className="studio-support-title">Support my work</h3>
      <p className="studio-support-lead">
        If my projects help you, a coffee or sponsorship keeps the edits, music, and code coming.
      </p>
      <div className="studio-support-grid kinetic-support-grid">
        {supportLinks.map((link, i) => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hit-target kinetic-support-btn"
          >
            <span className="kinetic-support-idx" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="kinetic-support-label">{link.label}</span>
            <span className="kinetic-support-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
