'use client';

import React from 'react';
import { Award, Calendar, Flame } from 'lucide-react';
import { AnalyticsData } from '@/lib/types/tracker';

interface ProgressSnapshotCardProps {
  analytics: AnalyticsData;
}

export default function ProgressSnapshotCard({ analytics }: ProgressSnapshotCardProps) {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-6 shadow-sm space-y-4">
      <h2 className="font-editorial text-xl font-normal text-[#123524] dark:text-white">
        Progress Snapshot
      </h2>

      <div className="flex flex-wrap gap-3 text-xs">
        <div className="w-[calc(50%-0.375rem)] p-3.5 rounded-2xl bg-[#fafcf9] dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-900/40">
          <span className="text-slate-500 dark:text-emerald-300/75 block mb-1">
            Completion Rate
          </span>
          <span className="font-mono tabular-nums text-xl font-bold text-[#123524] dark:text-white">
            {analytics.completionRate}%
          </span>
        </div>

        <div className="w-[calc(50%-0.375rem)] p-3.5 rounded-2xl bg-[#fafcf9] dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-900/40">
          <span className="text-slate-500 dark:text-emerald-300/75 flex items-center gap-1 mb-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Current Streak</span>
          </span>
          <span className="font-mono tabular-nums text-xl font-bold text-[#123524] dark:text-white">
            {analytics.currentStreak} days
          </span>
        </div>

        <div className="w-[calc(50%-0.375rem)] p-3.5 rounded-2xl bg-[#fafcf9] dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-900/40">
          <span className="text-slate-500 dark:text-emerald-300/75 flex items-center gap-1 mb-1">
            <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-[#2fe196]" />
            <span>Best Habit</span>
          </span>
          <span className="font-semibold text-sm text-[#123524] dark:text-white block truncate">
            {analytics.bestPerformingHabit?.name || 'Exercise'}
          </span>
        </div>

        <div className="w-[calc(50%-0.375rem)] p-3.5 rounded-2xl bg-[#fafcf9] dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-900/40">
          <span className="text-slate-500 dark:text-emerald-300/75 flex items-center gap-1 mb-1">
            <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Total Logged</span>
          </span>
          <span className="font-mono tabular-nums text-xl font-bold text-[#123524] dark:text-white">
            {analytics.totalCompleted}
          </span>
        </div>
      </div>
    </div>
  );
}
