'use client';

import React from 'react';
import { DayLabelMode } from '@/lib/types/tracker';

interface SheetPreferencesCardProps {
  dayLabelMode: DayLabelMode;
  includeGraph: boolean;
  onChangeDayLabelMode: (mode: DayLabelMode) => void;
  onChangeIncludeGraph: (include: boolean) => void;
}

export default function SheetPreferencesCard({
  dayLabelMode,
  includeGraph,
  onChangeDayLabelMode,
  onChangeIncludeGraph,
}: SheetPreferencesCardProps) {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-6 sm:p-8 shadow-sm space-y-4">
      <h2 className="font-editorial text-xl font-normal text-[#123524] dark:text-white">
        Active Sheet Preferences
      </h2>
      <div className="flex flex-col sm:flex-row gap-4 text-xs">
        <div className="w-full sm:flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-900/40 space-y-2">
          <span className="font-semibold text-slate-700 dark:text-emerald-200 block">
            Day Column Format
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onChangeDayLabelMode('numbers')}
              className={`flex-1 py-2 px-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                dayLabelMode === 'numbers'
                  ? 'bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912]'
                  : 'bg-white dark:bg-[#091f17] border border-slate-200 dark:border-emerald-800 text-slate-600 dark:text-emerald-200'
              }`}
            >
              Day 1, 2, 3
            </button>
            <button
              type="button"
              onClick={() => onChangeDayLabelMode('dates')}
              className={`flex-1 py-2 px-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                dayLabelMode === 'dates'
                  ? 'bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912]'
                  : 'bg-white dark:bg-[#091f17] border border-slate-200 dark:border-emerald-800 text-slate-600 dark:text-emerald-200'
              }`}
            >
              Calendar Dates
            </button>
          </div>
        </div>

        <div className="w-full sm:flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-900/40 space-y-2">
          <span className="font-semibold text-slate-700 dark:text-emerald-200 block">
            Online Progress Graph
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onChangeIncludeGraph(true)}
              className={`flex-1 py-2 px-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                includeGraph
                  ? 'bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912]'
                  : 'bg-white dark:bg-[#091f17] border border-slate-200 dark:border-emerald-800 text-slate-600 dark:text-emerald-200'
              }`}
            >
              Shown
            </button>
            <button
              type="button"
              onClick={() => onChangeIncludeGraph(false)}
              className={`flex-1 py-2 px-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                !includeGraph
                  ? 'bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912]'
                  : 'bg-white dark:bg-[#091f17] border border-slate-200 dark:border-emerald-800 text-slate-600 dark:text-emerald-200'
              }`}
            >
              Hidden
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
