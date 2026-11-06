import Link from 'next/link';
import { personal } from '@/data/personal';
import { socialLinks } from '@/data/contact';
import { CREATOR_NAME } from '@/lib/seo';
import GardenFooterMotion from '@/components/garden/GardenFooterMotion';
import '@/components/garden/garden.css';

export const COPYRIGHT_START = 2020;

export function copyrightNotice(year = new Date().getFullYear()) {
  return `Copyright © ${COPYRIGHT_START}–${year} ${CREATOR_NAME}. All rights reserved.`;
}

const WORD = 'nishal';

const pageLinks = [
  { href: '/about', label: 'About' },
  { href: '/profile', label: 'Profile' },
  { href: '/projects', label: 'Projects' },
  { href: '/resume', label: 'Resume' },
  { href: '/privacy', label: 'Privacy' },
] as const;

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="garden-footer">
      <GardenFooterMotion>
        <picture className="garden-footer__bg" data-footer-bg="">
          <source media="(max-aspect-ratio: 4/5)" srcSet="/garden/footer-garden-m-780.webp" />
          <img
            src="/garden/footer-garden-1440.webp"
            srcSet="/garden/footer-garden-960.webp 960w, /garden/footer-garden-1440.webp 1440w"
            sizes="100vw"
            width={1440}
            height={900}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
        </picture>

        <div className="garden-footer__inner">
          <p className="garden-footer__tagline" data-footer-chrome="">
            {personal.tagline}
          </p>

          <p className="garden-footer__word" aria-hidden="true">
            {WORD.split('').map((ch, i) => (
              <span key={i} className="garden-footer__letter" data-footer-letter="">
                {ch}
              </span>
            ))}
          </p>

          <div className="garden-footer__bar">
            <div className="garden-footer__col" data-footer-chrome="">
              <p className="garden-footer__strong">
                {personal.name} · Kerala · {year}
              </p>
              <p id="copyright" className="copyright-notice">
                {copyrightNotice(year)}
              </p>
              <p>AMV · Music · Code</p>
            </div>

            <nav className="garden-footer__col garden-footer__col--center" aria-label="Social" data-footer-chrome="">
              {socialLinks.map((link, i) => (
                <span key={link.label}>
                  {i > 0 ? <span aria-hidden="true"> · </span> : null}
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </span>
              ))}
            </nav>

            <div className="garden-footer__col garden-footer__col--end" data-footer-chrome="">
              <nav aria-label="Pages">
                {pageLinks.map((link, i) => (
                  <span key={link.href}>
                    {i > 0 ? <span aria-hidden="true"> · </span> : null}
                    <Link href={link.href}>{link.label}</Link>
                  </span>
                ))}
              </nav>
              <a
                href="https://websitelaunches.com/site/nishal.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="studio-footer-badge-link garden-footer__badge"
              >
                <img
                  src="https://websitelaunches.com/badge/nishal.dev.svg?theme=dark"
                  alt="Established online, public launch record on Website Launches"
                  width={255}
                  height={55}
                  loading="lazy"
                  decoding="async"
                />
              </a>
            </div>
          </div>
        </div>
      </GardenFooterMotion>
    </footer>
  );
}
