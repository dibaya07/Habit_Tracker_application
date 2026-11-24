'use client';

import React, { useState } from 'react';
import { ArrowRight, Check, ChevronRight, Trash2, X } from 'lucide-react';
import { AnalyticsData, Habit, TrackingStatus } from '@/lib/types/tracker';

interface TrackerMatrixTableProps {
  activeHabits: Habit[];
  visibleDays: number[];
  totalDays: number;
  visibleEndDay: number;
  tracking: Record<string, Record<number, TrackingStatus>>;
  dailyScores: AnalyticsData['dailyScores'];
  getDateLabel: (dayIndex: number) => { dayNum: number; dayName: string };
  onToggleCell: (habitId: string, dayNum: number) => void;
  onDeleteHabit: (habitId: string) => void;
  onNextDays: () => void;
  canGoNext: boolean;
  onJumpToStart: () => void;
  minTableWidth: number;
}

const TrackerMatrixTable = React.memo(function TrackerMatrixTable({
  activeHabits,
  visibleDays,
  totalDays,
  visibleEndDay,
  tracking,
  dailyScores,
  getDateLabel,
  onToggleCell,
  onDeleteHabit,
  onNextDays,
  canGoNext,
  onJumpToStart,
  minTableWidth,
}: TrackerMatrixTableProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const remainingDaysAhead = Math.max(0, totalDays - visibleEndDay);

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table
        className="w-full table-fixed text-left border-collapse"
        style={{ minWidth: `${minTableWidth}px` }}
      >
        <colgroup>
          <col className="w-48 sm:w-56" />
          {visibleDays.map((dayNum) => (
            <col key={dayNum} />
          ))}
          <col className="w-24" />
        </colgroup>
        <thead>
          <tr className="border-b border-slate-200 dark:border-emerald-900/60 bg-slate-100/90 dark:bg-[#0b241b]/80 text-[11px] text-slate-700 dark:text-emerald-300">
            <th className="py-3 px-4 font-semibold w-48 sm:w-56 sticky left-0 z-20 bg-slate-100 dark:bg-[#0b241b] border-r border-slate-200 dark:border-emerald-900/50">
              Habit
            </th>

            {visibleDays.map((dayNum) => {
              const { dayNum: dateDay, dayName } = getDateLabel(dayNum);
              return (
                <th
                  key={dayNum}
                  className="py-2.5 px-1 text-center font-mono border-r border-slate-200 dark:border-emerald-900/30 align-middle"
                >
                  {dayName && (
                    <span className="block text-[9px] uppercase tracking-wider text-slate-500 dark:text-emerald-400/80">
                      {dayName}
                    </span>
                  )}
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {dateDay}
                  </span>
                </th>
              );
            })}

            {/* +20 more (or remaining days) column in thead */}
            <th className="py-2.5 px-2 text-center font-mono tabular-nums text-[11px] font-semibold text-emerald-700 dark:text-[#2fe196] w-24 whitespace-nowrap">
              {remainingDaysAhead > 0 ? (
                <button
                  type="button"
                  onClick={onNextDays}
                  className="inline-flex items-center justify-center gap-0.5 px-2 py-1 rounded-lg hover:bg-emerald-500/10 transition-colors cursor-pointer"
                  title="View upcoming days"
                >
                  <span>+{remainingDaysAhead} more</span>
                </button>
              ) : totalDays > visibleDays.length ? (
                <button
                  type="button"
                  onClick={onJumpToStart}
                  className="inline-flex items-center justify-center px-2 py-1 rounded-lg hover:bg-emerald-500/10 text-slate-600 dark:text-emerald-300 transition-colors cursor-pointer"
                >
                  Day 1
                </button>
              ) : (
                <span className="text-slate-400 dark:text-emerald-400/60">+0 more</span>
              )}
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 dark:divide-emerald-900/30 text-xs">
          {activeHabits.map((habit, idx) => {
            const isConfirmingDelete = confirmDeleteId === habit.id;
            return (
              <tr
                key={habit.id}
                className="hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors group"
              >
                {/* Sticky Habit Name Cell with inline delete */}
                <td
                  title={habit.name}
                  className="py-3 px-4 w-48 sm:w-56 sticky left-0 z-10 bg-white group-hover:bg-slate-50 dark:bg-[#081d15] dark:group-hover:bg-[#092219] border-r border-slate-200 dark:border-emerald-900/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      <span className="font-mono tabular-nums text-[11px] font-semibold text-slate-400 dark:text-emerald-400/80 min-w-[1.25rem] shrink-0 mt-0.5">
                        {idx + 1}.
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white whitespace-normal break-words leading-snug">
                        {habit.name}
                      </span>
                    </div>

                    {activeHabits.length > 1 && (
                      isConfirmingDelete ? (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-emerald-800 text-[10px] font-medium text-slate-600 dark:text-emerald-200 cursor-pointer"
                          >
                            No
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              // onDeleteHabit(habit.id);
                              setConfirmDeleteId(null);
                            }}
                            className="px-1.5 py-0.5 rounded bg-rose-600 text-[10px] font-semibold text-white cursor-pointer"
                          >
                            Del
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          // onClick={() => setConfirmDeleteId(habit.id)}
                          title={`Remove ${habit.name}`}
                          aria-label={`Remove ${habit.name}`}
                          className="p-1 rounded text-slate-400 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-rose-600 dark:hover:text-rose-400 transition-all shrink-0 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )
                    )}
                  </div>
                </td>

                {/* Day Cells */}
                {visibleDays.map((dayNum) => {
                  // const status: TrackingStatus = tracking[habit.id]?.[dayNum] || 'empty';
                  return (
                    <td
                      key={dayNum}
                      // onClick={() => onToggleCell(habit.id, dayNum)}
                      className="py-2 px-1 text-center border-r border-slate-200/80 dark:border-emerald-900/20 cursor-pointer select-none"
                    >
                      <button
                        type="button"
                        aria-label={`Toggle ${habit.name} on day ${dayNum}`}
                        className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center transition-all duration-150 transform active:scale-90 ${
                          status === 'completed'
                            ? 'bg-[#2fe196] text-[#071912] shadow-sm shadow-emerald-500/30'
                            : status === 'failed'
                            ? 'bg-rose-500/20 border border-rose-500/40 text-rose-500'
                            : 'border border-slate-300 dark:border-emerald-800/60 text-slate-400 dark:text-emerald-700 hover:border-emerald-500/60'
                        }`}
                      >
                        {status === 'completed' && <Check className="w-4 h-4 stroke-[3]" />}
                        {status === 'failed' && <X className="w-3.5 h-3.5 stroke-[2.5]" />}
                      </button>
                    </td>
                  );
                })}

                {/* Blurry "Next" column in tbody */}
                <td className="py-2 px-2 text-center align-middle">
                  {canGoNext ? (
                    <button
                      type="button"
                      onClick={onNextDays}
                      aria-label={`Next days for ${habit.name}`}
                      className="w-full py-1 px-2 rounded-lg inline-flex items-center justify-center gap-1 text-[11px] font-semibold text-emerald-700/80 dark:text-emerald-300/75 bg-slate-100/70 dark:bg-emerald-950/50 border border-slate-200/70 dark:border-emerald-800/40 blur-[0.7px] opacity-65 hover:blur-none hover:opacity-100 hover:border-[#183f2e] dark:hover:border-[#2fe196] transition-all cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  ) : totalDays > visibleDays.length ? (
                    <button
                      type="button"
                      onClick={onJumpToStart}
                      className="w-full py-1 px-2 rounded-lg inline-flex items-center justify-center gap-1 text-[11px] font-medium text-slate-500 dark:text-emerald-300/60 blur-[0.6px] opacity-60 hover:blur-none hover:opacity-100 transition-all cursor-pointer"
                    >
                      <span>Start</span>
                    </button>
                  ) : (
                    <span className="text-slate-300 dark:text-emerald-800 blur-[0.6px] select-none">
                      ···
                    </span>
                  )}
                </td>
              </tr>
            );
          })}

          {/* Bottom Row: Daily Score */}
          <tr className="bg-slate-50 dark:bg-[#0b241b] border-t-2 border-slate-300 dark:border-emerald-900/60 font-medium">
            <td className="py-3 px-4 sticky left-0 z-10 bg-slate-50 dark:bg-[#0b241b] border-r border-slate-200 dark:border-emerald-900/50">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  Daily Score
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
                  Completed / Total
                </span>
              </div>
            </td>

            {visibleDays.map((dayNum) => {
              const score = dailyScores.find((s) => s.day === dayNum);
              const completed = score ? score.completed : 0;
              const total = activeHabits.length;
              const percentage = score ? score.percentage : 0;

              return (
                <td
                  key={dayNum}
                  className="py-2.5 px-1 text-center border-r border-slate-200/80 dark:border-emerald-900/20"
                >
                  <span className="block font-mono font-bold text-xs text-slate-900 dark:text-white">
                    {completed}/{total}
                  </span>
                  <span
                    className={`text-[9px] font-mono block ${
                      percentage >= 80
                        ? 'text-emerald-600 dark:text-[#2fe196] font-bold'
                        : percentage >= 50
                        ? 'text-amber-600 dark:text-amber-300'
                        : percentage > 0
                        ? 'text-slate-600 dark:text-emerald-400/70'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {percentage}%
                  </span>
                </td>
              );
            })}

            <td className="py-2.5 px-2 text-center align-middle">
              {canGoNext ? (
                <button
                  type="button"
                  onClick={onNextDays}
                  className="inline-flex items-center justify-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-emerald-700/80 dark:text-[#2fe196]/80 blur-[0.6px] opacity-65 hover:blur-none hover:opacity-100 transition-all cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 dark:text-emerald-400/50 blur-[0.5px]">
                  ···
                </span>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default TrackerMatrixTable;
