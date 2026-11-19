'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  BookOpen,
  FilePlus2,
  History,
  Home,
  LayoutDashboard,
  LayoutTemplate,
  LogIn,
  LogOut,
  MessageSquare,
  User,
} from 'lucide-react';
import { UserAccount } from '@/lib/types/tracker';
import DownloadAppButton from '@/components/pwa/DownloadAppButton';

interface MobileMenuProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (value: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  user: UserAccount | null;
  logout: () => void;
}

const MOBILE_PUBLIC_LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/create_tracker', label: 'Create Sheet', icon: FilePlus2 },
  { href: '/templates', label: 'Templates', icon: LayoutTemplate },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/how-to-use', label: 'How to Use', icon: BookOpen },
  { href: '/feedback', label: 'Feedback', icon: MessageSquare },
];

const MOBILE_SIGNED_IN_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/create_tracker', label: 'Create Sheet', icon: FilePlus2 },
  { href: '/templates', label: 'Templates', icon: LayoutTemplate },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/how-to-use', label: 'How to Use', icon: BookOpen },
  { href: '/history', label: 'Action History', icon: History },
  { href: '/feedback', label: 'Feedback', icon: MessageSquare },
];

export default function MobileMenu({
  mobileMenuOpen,
  setMobileMenuOpen,
  setIsAuthModalOpen,
  user,
  logout,
}: MobileMenuProps) {
  const pathname = usePathname();

  if (!mobileMenuOpen) return null;

  const links = user ? MOBILE_SIGNED_IN_LINKS : MOBILE_PUBLIC_LINKS;

  return (
    <div
      id="mobile-navigation-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
      className="no-print fixed inset-x-0 top-14 bottom-0 z-50 md:hidden flex flex-col"
    >
      {/* Touch-locked Backdrop prevents background interaction/scrolling */}
      <div
        aria-hidden="true"
        onClick={() => setMobileMenuOpen(false)}
        className="fixed inset-x-0 top-14 bottom-0 bg-slate-950/55 backdrop-blur-xs touch-none"
      />

      {/* Independently Scrollable Drawer Panel */}
      <div className="relative z-10 w-full max-h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain border-b border-slate-200 dark:border-emerald-900/50 bg-white dark:bg-[#071912] text-slate-800 dark:text-slate-100 px-5 py-5 pb-20 space-y-5 shadow-2xl">
        <div className="px-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-[#2fe196]">
            Navigation
          </span>
          <span className="text-[11px] text-slate-400 dark:text-emerald-400/60">
            Habitora
          </span>
        </div>

        <nav className="flex flex-col space-y-1 text-sm font-medium">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={item.href !== '/dashboard'}
                onClick={() => {
                  if (item.href === '/') {
                    try {
                      sessionStorage.setItem('habitora_stay_home', '1');
                    } catch {}
                  }
                  setMobileMenuOpen(false);
                }}
                className={`min-h-[46px] flex items-center gap-3 px-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-[#eaf3ed] dark:bg-emerald-900/45 text-[#183f2e] dark:text-[#2fe196] font-semibold'
                    : 'text-slate-700 dark:text-emerald-100/85 hover:bg-slate-50 dark:hover:bg-emerald-950/40 hover:text-[#183f2e] dark:hover:text-[#2fe196]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-slate-200 dark:border-emerald-900/40 flex flex-col gap-3">
          <DownloadAppButton variant="menu" onActionClick={() => setMobileMenuOpen(false)} />

          {user ? (
            <div className="flex items-center justify-between py-1 gap-3">
              <Link
                href="/profile"
                prefetch={false}
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-2.5 text-sm text-[#183f2e] dark:text-emerald-300 font-semibold hover:underline min-h-[44px] px-2"
              >
                <User className="w-4 h-4" />
                <span>
                  {!user.name || user.name === 'Habitora Member' || user.name === 'Profile'
                    ? 'Profile'
                    : `${user.name} · Profile`}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold min-h-[44px] px-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-300 dark:border-emerald-500/30 text-slate-800 dark:text-emerald-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>

              <Link
                href="/create_tracker"
                prefetch={false}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full min-h-[46px] inline-flex items-center justify-center py-3 rounded-xl bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912] font-semibold text-sm transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
