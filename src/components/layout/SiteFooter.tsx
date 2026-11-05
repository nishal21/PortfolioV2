import Link from 'next/link';
import { personal } from '@/data/personal';
import { CREATOR_NAME } from '@/lib/seo';
import { socialLinks } from '@/data/contact';
import AsciiFooterField from '@/components/footer/AsciiFooterField';

export const COPYRIGHT_START = 2020;

export function copyrightNotice(year = new Date().getFullYear()) {
  return `Copyright \u00a9 ${COPYRIGHT_START}-${year} ${CREATOR_NAME}. All rights reserved.`;
}

const FOOTER_NAV = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Profile', href: '/profile' },
  { label: 'Resume', href: '/resume' },
  { label: 'Privacy', href: '/privacy' },
] as const;

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="kinetic-footer page-container">
      <AsciiFooterField />

      <div className="kinetic-footer-grid">
        <div className="kinetic-footer-brand">
          <p className="kinetic-footer-signoff">
            {personal.name} <span aria-hidden="true">·</span> Kerala
          </p>
          <p className="kinetic-footer-tag">{personal.tagline}</p>
          <p id="copyright" className="copyright-notice kinetic-footer-copy">
            {copyrightNotice(year)}
          </p>
        </div>

        <nav className="kinetic-footer-col" aria-label="Footer">
          <p className="kinetic-footer-heading">Navigate</p>
          <ul>
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="kinetic-footer-col" aria-label="Social">
          <p className="kinetic-footer-heading">Connect</p>
          <ul>
            {socialLinks.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="kinetic-footer-col">
          <p className="kinetic-footer-heading">Craft</p>
          <ul>
            <li>AMV</li>
            <li>Music</li>
            <li>Code</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
