export const contactMail = {
  /** Public / reply-facing address (Brevo verified sender). */
  address: 'hi@nishal.dev',
  /** Where form submissions are delivered. */
  inbox: 'nishalamv@gmail.com',
  subjectPrefix: 'Portfolio contact: ',
  autoresponse:
    "Got your message. I'll reply within a day or so. — Nishal",
} as const;

export const contactInfo = [
  {
    label: 'Email',
    value: contactMail.address,
    href: `mailto:${contactMail.address}`,
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
  { label: 'Peerlist', href: 'https://peerlist.io/nishal21' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/nishal-k' },
  { label: 'YouTube', href: 'https://youtube.com/@DemonKing0.___' },
  { label: 'X', href: 'https://x.com/nishal21_' },
  { label: 'Instagram', href: 'https://instagram.com/demonking.___' },
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

/** Browser posts here (same-origin → Brevo via /api/contact). */
export const formSubmit = {
  url: '/api/contact',
  subject: 'New Portfolio Contact Message',
  autoresponse: contactMail.autoresponse,
};
