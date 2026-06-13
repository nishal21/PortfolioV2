import type { LucideIcon } from 'lucide-react';

interface ConnectButtonProps {
  text: string;
  href: string;
  icon?: LucideIcon;
  onClick?: () => void;
}

export default function ConnectButton({ text, href, icon: Icon, onClick }: ConnectButtonProps) {
  const external = href.startsWith('http') || href.startsWith('mailto:');

  return (
    <div className="connect-btn-shell">
      <a
        href={href}
        className="connect-btn-inner hit-target"
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        onClick={onClick}
      >
        {Icon ? <Icon className="h-[1em] w-[1em]" strokeWidth={2} /> : null}
        {text}
      </a>
    </div>
  );
}
