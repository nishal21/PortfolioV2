import {
  FolderKanban,
  Home,
  Mail,
  Play,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import { navItems } from '@/data/personal';

export const navIcons: Record<(typeof navItems)[number]['href'], LucideIcon> = {
  '#home': Home,
  '#about': UserRound,
  '#skills': UserRound,
  '#projects': FolderKanban,
  '#videos': Play,
  '#contact': Mail,
};

/** Primary tabs in the floating mobile pill (Contact is the separate circle). */
export const mobileTabItems = [
  navItems[0],
  navItems[1],
  navItems[3],
  navItems[4],
] as const;

export const mobileContactItem = navItems[5];

export function mobileTabIndexForHref(href: string): number {
  const index = mobileTabItems.findIndex((item) => item.href === href);
  if (index >= 0) return index;
  if (href === '#skills') return 1;
  if (href === '#contact') return -1;
  return 0;
}
