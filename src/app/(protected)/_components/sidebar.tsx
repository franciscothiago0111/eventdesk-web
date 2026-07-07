'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AuthUser } from '@/core/services/auth.service';
import { sidebarLinks } from './sidebar-config';

interface SidebarProps {
  user: AuthUser;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onLinkClick: () => void;
  onLogout: () => void;
}

export function Sidebar({
  user,
  isSidebarOpen,
  onToggleSidebar,
  onLinkClick,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col bg-neutral-white border-r border-neutral-200 px-6 py-8 transition-all duration-300 ease-in-out',
          'md:translate-x-0',
          isSidebarOpen
            ? 'w-52 lg:w-63 translate-x-0'
            : 'w-52 -translate-x-full md:w-16 lg:w-18 md:translate-x-0 items-center',
        )}
      >
        <div className="flex flex-col gap-11.5">
          <div
            className={cn(
              'flex shrink-0 items-center',
              isSidebarOpen ? 'h-10 gap-3 py-1' : 'h-16 justify-center',
            )}
          >
            {isSidebarOpen ? (
              <span className="text-sm font-bold text-neutral-950">eventdesk</span>
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-main text-xs font-black tracking-tight text-white">
                ED
              </div>
            )}
          </div>

          <nav
            className={cn(
              'flex flex-1 flex-col overflow-x-hidden overflow-y-auto',
              isSidebarOpen ? 'gap-2' : 'items-center gap-0.5 px-2 w-11.5',
            )}
          >
            {sidebarLinks.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onLinkClick}
                  title={!isSidebarOpen ? item.label : undefined}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'group relative flex items-center gap-3 text-sm font-normal border-l-2 border-l-transparent transition-all duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-main',
                    isSidebarOpen
                      ? 'w-full px-3 py-2'
                      : 'w-11.5 justify-center py-2.5',
                    isActive
                      ? 'bg-primary-light text-primary-main font-semibold'
                      : 'text-neutral-700 hover:text-primary-main hover:border-l-primary-main',
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary-light" />
                  )}
                  <item.icon
                    className={cn(
                      'shrink-0 transition-colors',
                      isSidebarOpen ? 'h-4.5 w-4.5' : 'h-5 w-5',
                      isActive
                        ? 'text-primary-main'
                        : 'text-neutral-700 group-hover:text-primary-main',
                    )}
                  />
                  {isSidebarOpen && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div
          className={cn(
            'shrink-0 py-3 mt-auto',
            isSidebarOpen ? 'space-y-0.5' : 'flex flex-col items-center gap-1 px-2',
          )}
        >
          <div
            className={cn(
              'flex flex-col items-center text-neutral-700',
              isSidebarOpen ? 'gap-2 pt-2 w-full' : 'justify-center py-2',
            )}
          >
            <button
              type="button"
              onClick={onLogout}
              title={!isSidebarOpen ? 'Sign out' : undefined}
              className={cn(
                'group cursor-pointer flex items-center gap-2.5 text-sm border-l-2 border-l-transparent font-normal text-neutral-700 transition-all duration-150',
                'hover:text-primary-main hover:border-l-primary-main',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500',
                isSidebarOpen ? 'w-full px-3 py-2' : 'w-11.5 justify-center py-2',
              )}
            >
              <LogOut className="h-4.5 w-4.5 shrink-0 transition-transform group-hover:-translate-x-0.5" />
              {isSidebarOpen && <span>Sign out</span>}
            </button>

            {isSidebarOpen && (
              <p className="text-center text-xs text-neutral-700">{user.email}</p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className="absolute -right-3 top-19 hidden p-1 min-h-6 min-w-6 items-center justify-center rounded-full bg-primary-main text-neutral-white shadow-md transition-colors md:flex hover:bg-primary-darker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-main cursor-pointer"
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-neutral-950/40 md:hidden"
          onClick={onToggleSidebar}
        />
      )}
    </>
  );
}
