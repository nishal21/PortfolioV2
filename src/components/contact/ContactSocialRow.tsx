import { Github, Instagram, Linkedin, Youtube } from 'lucide-react';
import XLogo from '@/components/icons/XLogo';
import { socialLinks } from '@/data/contact';

const iconMap = {
  GitHub: Github,
  LinkedIn: Linkedin,
  YouTube: Youtube,
  X: XLogo,
  Instagram: Instagram,
} as const;

export default function ContactSocialRow() {
  return (
    <nav className="studio-contact-socials" aria-label="Social links">
      {socialLinks.map((link) => {
        const Icon = iconMap[link.label as keyof typeof iconMap] ?? Github;
        return (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-hover studio-contact-social-link"
            aria-label={link.label}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </a>
        );
      })}
    </nav>
  );
}
