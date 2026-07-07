'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, MenuIcon, X } from 'lucide-react';
import type { AuthUser } from '@/core/services/auth.service';
import { sidebarLinks } from './sidebar-config';

interface NavbarProps {
  user: AuthUser;
  onLogout: () => void;
}

export function Navbar({ user, onLogout }: NavbarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen]);

  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const handleCloseMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    handleCloseMobileMenu();
    onLogout();
  };

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-neutral-white px-4 py-3 md:px-6">
      <div className="flex items-center justify-between md:px-2 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3 md:hidden">
          <span className="text-sm font-bold text-neutral-950">eventdesk</span>
        </div>

        <div className="hidden flex-1 md:block" />

        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Open menu"
            className="p-1 text-neutral-900 hover:text-primary-main rounded-lg transition-colors md:hidden"
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-main">
              <span className="text-sm font-bold text-white">{initials}</span>
            </div>
            <div className="hidden lg:flex flex-col items-start">
              <p className="text-sm font-bold text-neutral-950">{user.name}</p>
              <p className="text-xs text-neutral-700 font-medium">{user.role}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={
          'fixed inset-0 z-40 md:hidden transition-opacity duration-300 ' +
          (isMobileMenuOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0')
        }
      >
        <div
          className="absolute inset-0 bg-neutral-950/45"
          onClick={handleCloseMobileMenu}
        />

        <aside
          className={
            'absolute inset-x-0 top-0 flex h-screen w-full flex-col overflow-y-auto bg-neutral-white shadow-2xl transition-transform duration-300 ease-out ' +
            (isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full')
          }
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-8 flex items-center justify-between border-b border-neutral-200 py-3 px-6">
            <span className="text-sm font-bold text-neutral-950">eventdesk</span>
            <button
              onClick={handleCloseMobileMenu}
              aria-label="Close menu"
              className="rounded-lg p-1 text-neutral-950 transition-colors hover:bg-neutral-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex h-full flex-col px-6 pb-4">
            <nav className="flex flex-1 flex-col gap-2">
              {sidebarLinks.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={handleCloseMobileMenu}
                    className={
                      'flex items-center gap-3 px-3 py-3 text-sm border-l-2 transition-colors w-full ' +
                      (isActive
                        ? 'bg-primary-light text-primary-main font-semibold border-l-primary-main'
                        : 'text-neutral-700 border-l-transparent font-normal hover:text-primary-main hover:border-l-primary-main')
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-neutral-200 pt-4">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-3 py-3 text-sm text-neutral-700 transition-colors hover:text-primary-main border-l-2 border-l-transparent hover:border-l-primary-main font-normal"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign out</span>
              </button>

              <p className="pl-3 py-2 text-xs text-neutral-700">{user.email}</p>
            </div>
          </div>
        </aside>
      </div>
    </header>
  );
}
