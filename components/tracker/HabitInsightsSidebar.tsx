'use client';

import React from 'react';
import { Award, AlertCircle, TrendingUp } from 'lucide-react';
import { AnalyticsData } from '@/lib/types/tracker';

interface HabitInsightsSidebarProps {
  analytics: AnalyticsData;
}

const HabitInsightsSidebar = React.memo(function HabitInsightsSidebar({
  analytics,
}: HabitInsightsSidebarProps) {
  return (
    <div className="w-full lg:flex-[4] xl:flex-[3] min-w-0 space-y-6">
      {/* Weekly Progress Ring Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#091f17] border border-slate-200 dark:border-emerald-900/40 shadow-xl space-y-6 text-center">
        <div className="flex items-center justify-between text-xs border-b border-slate-200 dark:border-emerald-900/50 pb-3">
          <span className="font-semibold text-slate-900 dark:text-white">Weekly Progress</span>
          <span className="text-emerald-700 dark:text-[#2fe196] font-mono font-bold">Active</span>
        </div>

        {/* Progress Ring */}
        <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              className="stroke-slate-200 dark:stroke-emerald-950/80"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              className="stroke-[#2fe196] transition-all duration-500"
              strokeWidth="3"
              strokeDasharray="94.2"
              strokeDashoffset={94.2 - (94.2 * analytics.completionRate) / 100}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
              {analytics.completionRate}%
            </span>
            <span className="text-xs text-slate-600 dark:text-emerald-300 mt-1 font-medium">
              {analytics.totalCompleted} completed
            </span>
          </div>
        </div>

        {/* Streak Counters */}
        <div className="flex gap-3 pt-2 border-t border-slate-200 dark:border-emerald-900/40">
          <div className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-900/30">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-emerald-400 block mb-0.5">
              Current Streak
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
              {analytics.currentStreak} days
            </span>
          </div>
          <div className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-900/30">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-emerald-400 block mb-0.5">
              Best Streak
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
              {analytics.longestStreak} days
            </span>
          </div>
        </div>
      </div>

      {/* Habit Insights Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold tracking-wider uppercase text-emerald-700 dark:text-emerald-400 px-1">
          Habit Insights
        </h4>

        <div className="p-4 rounded-xl bg-white dark:bg-[#091f17] border border-slate-200 dark:border-emerald-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-[#2fe196] flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block font-semibold">
                Most Consistent
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white truncate block">
                {analytics.bestPerformingHabit?.name || 'Exercise'}
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 dark:text-[#2fe196] shrink-0">
            {analytics.bestPerformingHabit?.rate || 0}%
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#091f17] border border-slate-200 dark:border-emerald-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 block font-semibold">
                Needs Attention
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white truncate block">
                {analytics.weakestPerformingHabit?.name || 'Drink water'}
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 shrink-0">
            {analytics.weakestPerformingHabit?.rate || 0}%
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#091f17] border border-slate-200 dark:border-emerald-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-sky-600 dark:text-sky-400 block font-semibold">
                Total Check-ins
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {analytics.totalCompleted} completed
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 shrink-0">
            {analytics.completionRate}%
          </span>
        </div>
      </div>
    </div>
  );
});

export default HabitInsightsSidebar;
