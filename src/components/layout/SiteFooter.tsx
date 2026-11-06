import Link from 'next/link';
import { personal } from '@/data/personal';
import { CREATOR_NAME } from '@/lib/seo';
import { socialLinks } from '@/data/contact';

export const COPYRIGHT_START = 2020;

export function copyrightNotice(year = new Date().getFullYear()) {
  return `Copyright \u00a9 ${COPYRIGHT_START}-${year} ${CREATOR_NAME}. All rights reserved.`;
}

const FOOTER_NAV = [
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/projects' },
  { label: 'Contact', href: '/#contact' },
] as const;

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="garden-footer">
      <div className="garden-footer-scene" aria-hidden="true">
        <picture>
          <source type="image/avif" srcSet="/garden/footer-bg-desktop.avif" />
          <source type="image/webp" srcSet="/garden/footer-bg-desktop.webp" />
          <img
            src="/garden/footer-bg-desktop.webp"
            alt=""
            width={1280}
            height={720}
            loading="lazy"
            decoding="async"
            className="garden-footer-bg-img"
          />
        </picture>
      </div>

      <div className="garden-footer-type">
        <p className="garden-footer-kicker">{personal.tagline}</p>
        <p className="garden-footer-name" aria-hidden="true">
          nishal
        </p>
        <h2 className="sr-only">Nishal</h2>
      </div>

      {/* Reuse hero FG so foliage sits over monumental wordmark */}
      <div className="garden-footer-fg" aria-hidden="true">
        <img
          src="/garden/hero-fg-desktop.webp"
          alt=""
          width={1280}
          height={720}
          loading="lazy"
          decoding="async"
          className="garden-footer-fg-img"
        />
      </div>

      <div className="garden-footer-chrome page-container">
        <div className="garden-footer-meta">
          <p id="copyright" className="copyright-notice garden-footer-copy">
            © Nishal {year} · nishal21
          </p>
          <nav className="garden-footer-links" aria-label="Footer">
            {FOOTER_NAV.map((item, i) => (
              <span key={item.href}>
                {i > 0 ? <span aria-hidden="true"> · </span> : null}
                <Link href={item.href}>{item.label}</Link>
              </span>
            ))}
          </nav>
        </div>
        <nav className="garden-footer-socials" aria-label="Social">
          {socialLinks.map((item, i) => (
            <span key={item.label}>
              {i > 0 ? <span aria-hidden="true"> · </span> : null}
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                {item.label}
              </a>
            </span>
          ))}
        </nav>
      </div>
    </footer>
  );
}
