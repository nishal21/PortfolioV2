'use client';

import type { CSSProperties } from 'react';
import { Coffee, Github, Heart } from 'lucide-react';
import { supportLinks } from '@/data/contact';

const icons = {
  bmc: Coffee,
  patreon: Heart,
  kofi: Heart,
  'github-sponsors': Github,
} as const;

export default function SupportStrip() {
  return (
    <div className="studio-support">
      <p className="studio-label">Support</p>
      <h3 className="studio-support-title">Support my work</h3>
      <p className="studio-support-lead">
        If my projects help you, a coffee or sponsorship keeps the edits, music, and code coming.
      </p>
      <div className="studio-support-grid">
        {supportLinks.map((link) => {
          const Icon = icons[link.id];
          return (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hit-target studio-support-card"
              style={
                {
                  '--support-accent': link.accent,
                  '--support-ink': link.ink,
                } as CSSProperties
              }
            >
              <span className="studio-support-icon" aria-hidden>
                <Icon className="h-4 w-4" strokeWidth={2.25} />
              </span>
              <span className="studio-support-label">{link.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
