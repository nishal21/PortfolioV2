export const contactInfo = [
  {
    label: 'Email',
    value: 'nishal@nishal.dev',
    href: 'mailto:nishal@nishal.dev',
  },
  {
    label: 'Phone',
    value: '+91 xxxxxxxxxx',
    href: 'tel:+91xxxxxxxxxxx',
  },
  {
    label: 'Location',
    value: 'Malappuram, Kerala, India',
    href: 'https://maps.google.com/?q=Malappuram,Kerala,India',
  },
] as const;

export const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/nishal21' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/nishal-k-167b1a328' },
  { label: 'YouTube', href: 'https://youtube.com/@DemonKing0.___' },
  { label: 'X', href: 'https://x.com/Etainment2' },
  { label: 'Instagram', href: 'https://instagram.com/nishal_k_' },
] as const;

export const supportLinks = [
  {
    id: 'bmc',
    label: 'Buy Me a Coffee',
    href: 'https://buymeacoffee.com/kingtanjiro',
    accent: '#FFDD00',
    ink: '#1a1204',
  },
  {
    id: 'patreon',
    label: 'Patreon',
    href: 'https://patreon.com/DemonKing08',
    accent: '#F96854',
    ink: '#ffffff',
  },
  {
    id: 'kofi',
    label: 'Ko-fi',
    href: 'https://ko-fi.com/demon_king',
    accent: '#F16061',
    ink: '#ffffff',
  },
  {
    id: 'github-sponsors',
    label: 'GitHub Sponsors',
    href: 'https://github.com/sponsors/nishal21',
    accent: '#EA4AAA',
    ink: '#ffffff',
  },
] as const;

export const formSubmit = {
  url: 'https://formsubmit.co/nishal@nishal.dev',
  subject: 'New Portfolio Contact Message',
  autoresponse:
    "Got your message. I'll reply within a day or so. - Nishal",
};
