import Link from 'next/link';
import { personal } from '@/data/personal';

export default function SiteFooter() {
  return (
    <footer className="studio-footer page-container">
      <p className="font-display text-sm font-semibold text-[var(--text-muted)]">
        {personal.name} · Kerala · {new Date().getFullYear()}
      </p>
      <p className="mt-1 text-xs text-[var(--text-dim)]">
        AMV · Music · Code ·{' '}
        <Link href="/about" className="underline decoration-[var(--studio-border)] hover:text-[var(--text-muted)]">
          About
        </Link>
        {' · '}
        <Link href="/profile" className="underline decoration-[var(--studio-border)] hover:text-[var(--text-muted)]">
          Profile
        </Link>
        {' · '}
        <Link href="/projects" className="underline decoration-[var(--studio-border)] hover:text-[var(--text-muted)]">
          Projects
        </Link>
        {' · '}
        <Link href="/resume" className="underline decoration-[var(--studio-border)] hover:text-[var(--text-muted)]">
          Resume
        </Link>
        {' · '}
        <Link href="/privacy" className="underline decoration-[var(--studio-border)] hover:text-[var(--text-muted)]">
          Privacy
        </Link>
      </p>
      <div className="studio-footer-badges">
        <a
          href="https://websitelaunches.com/site/nishal.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="studio-footer-badge-link"
        >
          <img
            src="https://websitelaunches.com/badge/nishal.dev.svg?theme=dark"
            alt="Established online — public launch record on Website Launches"
            width={255}
            height={55}
            loading="lazy"
            decoding="async"
          />
        </a>
      </div>
    </footer>
  );
}
