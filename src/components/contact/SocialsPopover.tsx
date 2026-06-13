'use client';

import { useEffect, useRef, useState } from 'react';
import { Github, Instagram, Linkedin, Youtube } from 'lucide-react';
import XLogo from '@/components/icons/XLogo';
import PeerlistIcon from '@/components/icons/PeerlistIcon';
import { socialLinks } from '@/data/contact';

const iconMap = {
  GitHub: Github,
  Peerlist: PeerlistIcon,
  LinkedIn: Linkedin,
  YouTube: Youtube,
  X: XLogo,
  Instagram: Instagram,
} as const;

export default function SocialsPopover() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('click', onClick);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="socials-wrap">
      <div className="connect-btn-shell">
        <button
          type="button"
          className="hit-target connect-btn-inner"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          Socials
        </button>
      </div>

      {open ? (
        <>
          <div className="socials-backdrop" aria-hidden onClick={() => setOpen(false)} />
          <div className="socials-popover" role="dialog" aria-label="Social links">
            <div className="socials-grid">
              {socialLinks.map((link) => {
                const Icon = iconMap[link.label as keyof typeof iconMap] ?? Github;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hit-target socials-card"
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="h-9 w-9 text-white/80 transition-transform group-hover:scale-110" />
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
