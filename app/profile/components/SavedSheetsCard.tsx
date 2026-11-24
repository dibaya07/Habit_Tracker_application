'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Layers, Trash2 } from 'lucide-react';
import { HabitTracker } from '@/lib/types/tracker';

interface SavedSheetsCardProps {
  savedTrackers: HabitTracker[];
  activeTrackerId: string;
  onSelectSheet: (id: string) => void;
  onDeleteSheet: (id: string) => void;
}

export default function SavedSheetsCard({
  savedTrackers,
  activeTrackerId,
  onSelectSheet,
  onDeleteSheet,
}: SavedSheetsCardProps) {
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [expandedSheetId, setExpandedSheetId] = useState<string | null>(activeTrackerId);

  return (
    <div
      id="created-sheets"
      className="rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-6 shadow-sm space-y-4"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-editorial text-xl font-normal text-[#123524] dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#183f2e] dark:text-[#2fe196]" />
          <span>Created Habit Sheets ({savedTrackers.length})</span>
        </h2>
      </div>

      <div className="space-y-3">
        {savedTrackers.map((sheet, idx) => {
          const isActive = sheet.id === activeTrackerId;
          const isConfirming = confirmingDeleteId === sheet.id;
          const isExpanded = expandedSheetId === sheet.id;

          const activeHabits = sheet.habits.filter((h) => h.active);
          let completedTicks = 0;
          // activeHabits.forEach((h) => {
          //   for (let d = 1; d <= sheet.durationDays; d++) {
          //     if (sheet.tracking[h.id]?.[d] === 'completed') {
          //       completedTicks++;
          //     }
          //   }
          // });
          const totalPossible = Math.max(1, activeHabits.length * sheet.durationDays);
          const rate = Math.round((completedTicks / totalPossible) * 100);

          return (
            <div
              key={sheet.id}
              className={`p-4 rounded-2xl border space-y-3 ${
                isActive
                  ? 'bg-[#eaf3ed] dark:bg-emerald-900/35 border-[#183f2e]/40 dark:border-[#2fe196]/50'
                  : 'bg-slate-50 dark:bg-emerald-950/35 border-slate-200 dark:border-emerald-900/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      <span className="font-mono tabular-nums text-xs text-slate-400 mr-1.5">
                        {idx + 1}.
                      </span>
                      {sheet.name}
                    </p>
                    {isActive && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912]">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-emerald-300/75 font-mono tabular-nums mt-0.5">
                    {sheet.durationDays} days · {activeHabits.length} habits · {rate}% done · Start{' '}
                    {sheet.startDate}
                  </p>
                </div>

                {!isConfirming && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedSheetId((prev) => (prev === sheet.id ? null : sheet.id))
                      }
                      aria-label={isExpanded ? `Hide habits for ${sheet.name}` : `View habits for ${sheet.name}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-[#081d15] border border-slate-200 dark:border-emerald-800 text-slate-700 dark:text-emerald-200 hover:border-[#183f2e] dark:hover:border-[#2fe196] cursor-pointer"
                    >
                      <span>View</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectSheet(sheet.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912] hover:opacity-90 cursor-pointer whitespace-nowrap"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    {savedTrackers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setConfirmingDeleteId(sheet.id)}
                        aria-label={`Delete ${sheet.name}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {isExpanded && !isConfirming && (
                <div className="pt-2.5 border-t border-slate-200/80 dark:border-emerald-800/40 space-y-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-emerald-300/75 block">
                    Included Habits ({activeHabits.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeHabits.map((habit) => (
                      <span
                        key={habit.id}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#081d15] border border-slate-200 dark:border-emerald-800/50 text-[11px] font-medium text-slate-700 dark:text-emerald-100"
                      >
                        {habit.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {isConfirming && (
                <div className="pt-2 border-t border-rose-200/80 dark:border-rose-900/50 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-rose-700 dark:text-rose-300 font-medium">
                    Delete &quot;{sheet.name}&quot;? This cannot be undone.
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setConfirmingDeleteId(null)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-emerald-800 bg-white dark:bg-[#081d15] text-slate-700 dark:text-emerald-200 hover:bg-slate-100 dark:hover:bg-emerald-900/40 font-medium cursor-pointer whitespace-nowrap"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteSheet(sheet.id);
                        setConfirmingDeleteId(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold cursor-pointer whitespace-nowrap"
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
