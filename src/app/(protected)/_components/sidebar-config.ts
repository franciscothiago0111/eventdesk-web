import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, CalendarDays } from 'lucide-react';

export interface SidebarLink {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

export const sidebarLinks: SidebarLink[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'events',
    label: 'Events',
    href: '/events',
    icon: CalendarDays,
  },
];
