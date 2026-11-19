'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHabitTracker } from '@/lib/context/HabitTrackerContext';

const PUBLIC_NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/create_tracker', label: 'Create Sheet' },
  { href: '/templates', label: 'Templates' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/how-to-use', label: 'How to Use' },
];

const SIGNED_IN_NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/create_tracker', label: 'Create Sheet' },
  { href: '/templates', label: 'Templates' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/how-to-use', label: 'How to Use' },
];

export default function DesktopNavMenu() {
  const pathname = usePathname();
  const { user, hasMounted } = useHabitTracker();
  const links = hasMounted && user ? SIGNED_IN_NAV_LINKS : PUBLIC_NAV_LINKS;

  return (
    <nav className="hidden md:flex items-center gap-3.5 lg:gap-7 text-[13px] lg:text-sm font-medium text-slate-600 dark:text-emerald-100/80">
      {links.map((item) => {
        const isActive =
          (item.href === '/' && pathname === '/') ||
          (item.href !== '/' && !item.href.startsWith('/#') && pathname === item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={item.href !== '/dashboard'}
            className={`whitespace-nowrap shrink-0 transition-colors underline-offset-4 hover:underline ${
              isActive
                ? 'text-[#183f2e] dark:text-[#2fe196] font-semibold underline'
                : 'hover:text-[#183f2e] dark:hover:text-[#2fe196]'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
