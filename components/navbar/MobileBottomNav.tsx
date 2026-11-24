'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  BookOpen,
  Home,
  LayoutDashboard,
  Plus,
  User,
} from 'lucide-react';
import { useHabitTracker } from '@/lib/context/HabitTrackerContext';
import IconTooltip from '@/components/ui/IconTooltip';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { hasMounted, user } = useHabitTracker();
  const isSignedIn = hasMounted && Boolean(user);

  const primaryHref = isSignedIn ? '/dashboard' : '/';
  const isPrimaryActive = isSignedIn ? pathname === '/dashboard' : pathname === '/';
  const primaryLabel = isSignedIn ? 'Open Dashboard' : 'Go to Home';

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="no-print fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#fafcf9]/95 dark:bg-[#071912]/95 backdrop-blur-md border-t border-slate-200 dark:border-emerald-900/50 pb-[env(safe-area-inset-bottom)] select-none touch-none [transform:translateZ(0)]"
    >
      <div className="flex items-center justify-around h-14 px-2 max-w-lg mx-auto">
        {/* Tab 1: Dashboard (signed in) or Home (public) */}
        <Link
          href={primaryHref}
          prefetch={!isSignedIn}
          title={primaryLabel}
          onClick={() => {
            if (!isSignedIn) {
              try {
                sessionStorage.setItem('habitora_stay_home', '1');
              } catch {}
            }
          }}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors touch-manipulation ${
            isPrimaryActive
              ? 'text-[#183f2e] dark:text-[#2fe196] font-semibold'
              : 'text-slate-500 dark:text-emerald-200/70'
          }`}
        >
          <IconTooltip label={primaryLabel} position="top">
            {isSignedIn ? (
              <LayoutDashboard className="w-5 h-5" />
            ) : (
              <Home className="w-5 h-5" />
            )}
          </IconTooltip>
          <span className="text-[10px] leading-none whitespace-nowrap">
            {isSignedIn ? 'Dashboard' : 'Home'}
          </span>
        </Link>

        {/* Tab 2: Analytics */}
        <Link
          href="/analytics"
          title="Open Progress Analytics"
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors touch-manipulation ${
            pathname === '/analytics'
              ? 'text-[#183f2e] dark:text-[#2fe196] font-semibold'
              : 'text-slate-500 dark:text-emerald-200/70'
          }`}
        >
          <IconTooltip label="Open Progress Analytics" position="top">
            <BarChart3 className="w-5 h-5" />
          </IconTooltip>
          <span className="text-[10px] leading-none whitespace-nowrap">Analytics</span>
        </Link>

        {/* Tab 3: Center Instagram-style Create (+) Action */}
        <Link
          href="/create_tracker"
          title="Create Habit Sheet"
          aria-label="Create Habit Sheet"
          className="flex-1 min-h-[44px] flex flex-col items-center justify-center touch-manipulation"
        >
          <IconTooltip label="Create New Habit Sheet" position="top">
            <span
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm transition-transform active:scale-95 ${
                pathname === '/create_tracker'
                  ? 'bg-[#2fe196] text-[#071912]'
                  : 'bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912]'
              }`}
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </span>
          </IconTooltip>
        </Link>

        {/* Tab 4: How to Use */}
        <Link
          href="/how-to-use"
          title="How to Use Habitora"
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors touch-manipulation ${
            pathname === '/how-to-use'
              ? 'text-[#183f2e] dark:text-[#2fe196] font-semibold'
              : 'text-slate-500 dark:text-emerald-200/70'
          }`}
        >
          <IconTooltip label="How to Use Guide" position="top">
            <BookOpen className="w-5 h-5" />
          </IconTooltip>
          <span className="text-[10px] leading-none whitespace-nowrap">Guide</span>
        </Link>

        {/* Tab 5: Profile (or Sign In) */}
        {isSignedIn ? (
          <Link
            href="/profile"
            title="Open Profile & Settings"
            className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors touch-manipulation ${
              pathname === '/profile'
                ? 'text-[#183f2e] dark:text-[#2fe196] font-semibold'
                : 'text-slate-500 dark:text-emerald-200/70'
            }`}
          >
            <IconTooltip label="Profile & Settings" position="top">
              <User className="w-5 h-5" />
            </IconTooltip>
            <span className="text-[10px] leading-none whitespace-nowrap">Profile</span>
          </Link>
        ) : (
          <Link
            href="/signin"
            title="Sign In or Create Account"
            className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors touch-manipulation ${
              pathname === '/signin' || pathname === '/signup'
                ? 'text-[#183f2e] dark:text-[#2fe196] font-semibold'
                : 'text-slate-500 dark:text-emerald-200/70 hover:text-[#183f2e] dark:hover:text-[#2fe196]'
            }`}
          >
            <IconTooltip label="Sign In to Habitora" position="top">
              <User className="w-5 h-5" />
            </IconTooltip>
            <span className="text-[10px] leading-none whitespace-nowrap">Sign In</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
