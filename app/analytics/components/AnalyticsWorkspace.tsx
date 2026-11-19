'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, BarChart3, Layers, Plus } from 'lucide-react';
import { useHabitTracker } from '@/lib/context/HabitTrackerContext';
import { HabitTrackerGrid } from '@/components/tracker/HabitTrackerGrid';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import IconTooltip from '@/components/ui/IconTooltip';

const AddHabitModal = dynamic(
  () => import('@/components/modals/AddHabitModal'),
  { ssr: false }
);

export default function AnalyticsWorkspace() {
  const { hasMounted, user, tracker, savedTrackers, selectTracker, isCreateModalOpen } = useHabitTracker();
  const isSignedIn = hasMounted && Boolean(user);

  return (
    <main className="flex-1 bg-[#fafcf9] dark:bg-[#071912] text-[#123524] dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 space-y-4">
        {/* Top Row: Clear Location + Back & Create Sheet cleanly aligned on all screens */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#eaf3ed] dark:bg-emerald-900/40 border border-emerald-200/80 dark:border-emerald-700/40 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#183f2e] dark:text-[#2fe196]">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </span>

            <IconTooltip label={isSignedIn ? 'Return to Dashboard' : 'Return to Home'} position="bottom">
              <Link
                href={isSignedIn ? '/dashboard' : '/'}
                prefetch={!isSignedIn}
                title={isSignedIn ? 'Back to Dashboard' : 'Back to Home'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-emerald-800/60 bg-white dark:bg-[#091f17] text-xs font-medium text-slate-700 dark:text-emerald-200 hover:border-[#183f2e] dark:hover:border-[#2fe196] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isSignedIn ? 'Dashboard' : 'Home'}</span>
              </Link>
            </IconTooltip>
          </div>

          <IconTooltip label="Create a new habit sheet" position="bottom">
            <Link
              href="/create_tracker"
              title="Create New Sheet"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Create Sheet</span>
            </Link>
          </IconTooltip>
        </div>

        {/* Multi-Sheet Switcher cleanly aligned below top bar when multiple sheets exist */}
        {hasMounted && savedTrackers.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-emerald-300/70">
              <Layers className="w-3.5 h-3.5" />
              <span>Active Sheet:</span>
            </span>
            {savedTrackers.map((sheet) => {
              const isActive = sheet.id === tracker.id;
              return (
                <button
                  key={sheet.id}
                  type="button"
                  onClick={() => selectTracker(sheet.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912] border-[#183f2e] dark:border-[#2fe196]'
                      : 'bg-white dark:bg-[#091f17] text-slate-700 dark:text-emerald-200 border-slate-200 dark:border-emerald-800/60 hover:border-[#183f2e] dark:hover:border-[#2fe196]'
                  }`}
                >
                  {sheet.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Complete Digital Workspace with Tracker */}
      <HabitTrackerGrid />

      {/* Complete Progress Analytics */}
      <AnalyticsDashboard />

      {isCreateModalOpen ? <AddHabitModal /> : null}
    </main>
  );
}
