'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, LayoutDashboard, Play } from 'lucide-react';
import { useHabitTracker } from '@/lib/context/HabitTrackerContext';

export default function HeroPrimaryActions() {
  const { hasMounted, user } = useHabitTracker();
  const isSignedIn = hasMounted && Boolean(user);

  if (isSignedIn) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
        <Link
          href="/dashboard"
          prefetch={false}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm sm:text-base font-medium bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] shadow-sm transition-all duration-200 active:scale-[0.98] whitespace-nowrap shrink-0"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Open Dashboard</span>
        </Link>

        <Link
          href="/create_tracker"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm sm:text-base font-medium border border-slate-300 dark:border-emerald-800/60 bg-white dark:bg-[#091f17] text-slate-800 dark:text-emerald-100 hover:bg-slate-50 dark:hover:bg-emerald-950/60 transition-all duration-200 shadow-2xs whitespace-nowrap shrink-0"
        >
          <span>Create Sheet</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
      <Link
        href="/create_tracker"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm sm:text-base font-medium bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] shadow-sm transition-all duration-200 active:scale-[0.98] whitespace-nowrap shrink-0"
      >
        <span>Get Started</span>
        <ArrowRight className="w-4 h-4" />
      </Link>

      <a
        href="#how-it-works"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm sm:text-base font-medium border border-slate-300 dark:border-emerald-800/60 bg-white dark:bg-[#091f17] text-slate-800 dark:text-emerald-100 hover:bg-slate-50 dark:hover:bg-emerald-950/60 transition-all duration-200 shadow-2xs whitespace-nowrap shrink-0"
      >
        <span className="w-5 h-5 rounded-full border border-slate-400 dark:border-emerald-400 flex items-center justify-center">
          <Play className="w-2.5 h-2.5 text-[#183f2e] dark:text-[#2fe196] fill-[#183f2e] dark:fill-[#2fe196] translate-x-0.5" />
        </span>
        <span>How It Works</span>
      </a>
    </div>
  );
}
