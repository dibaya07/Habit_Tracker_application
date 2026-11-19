'use client';

import React, { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Trash2, X } from 'lucide-react';
import { AnalyticsData, Habit, TrackingStatus } from '@/lib/types/tracker';

interface MobileHabitWorkspaceProps {
  activeHabits: Habit[];
  totalDays: number;
  tracking: Record<string, Record<number, TrackingStatus>>;
  dailyScores: AnalyticsData['dailyScores'];
  getDateLabel: (dayIndex: number) => { dayNum: number; dayName: string };
  onToggleCell: (habitId: string, dayNum: number) => void;
  onDeleteHabit: (habitId: string) => void;
}

const MobileHabitWorkspace = React.memo(function MobileHabitWorkspace({
  activeHabits,
  totalDays,
  tracking,
  dailyScores,
  getDateLabel,
  onToggleCell,
  onDeleteHabit,
}: MobileHabitWorkspaceProps) {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const clampedDay = Math.max(1, Math.min(totalDays, selectedDay));
  const dayScore = dailyScores.find((s) => s.day === clampedDay);
  const completedToday = dayScore?.completed ?? 0;
  const percentageToday = dayScore?.percentage ?? 0;

  // Compute a compact 5-day context strip centered around clampedDay for mini status preview
  const windowStart = Math.max(1, Math.min(Math.max(1, totalDays - 4), clampedDay - 2));
  const windowDays = Array.from(
    { length: Math.min(5, totalDays) },
    (_, i) => windowStart + i
  );

  // Also show scrollable strip of up to 14 days around current window + jump controls
  const stripStart = Math.max(1, Math.min(Math.max(1, totalDays - 13), clampedDay - 5));
  const stripEnd = Math.min(totalDays, stripStart + 13);
  const dayPills = Array.from(
    { length: stripEnd - stripStart + 1 },
    (_, i) => stripStart + i
  );

  return (
    <div className="space-y-4">
      {/* Touch-First Horizontal Date Scroller Card */}
      <div className="rounded-2xl bg-white dark:bg-[#091f17] border border-slate-200 dark:border-emerald-900/50 p-3.5 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-[#2fe196] block">
              Day {clampedDay} of {totalDays}
            </span>
            <p className="text-xs font-mono tabular-nums text-slate-600 dark:text-emerald-200/80">
              {completedToday}/{activeHabits.length} completed · {percentageToday}%
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setSelectedDay(Math.max(1, clampedDay - 1))}
              disabled={clampedDay <= 1}
              title="Previous day"
              aria-label="Previous day"
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl border border-slate-200 dark:border-emerald-800/60 bg-slate-50 dark:bg-emerald-950/60 text-slate-700 dark:text-emerald-200 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setSelectedDay(Math.min(totalDays, clampedDay + 1))}
              disabled={clampedDay >= totalDays}
              title="Next day"
              aria-label="Next day"
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl border border-slate-200 dark:border-emerald-800/60 bg-slate-50 dark:bg-emerald-950/60 text-slate-700 dark:text-emerald-200 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Day Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {dayPills.map((dayNum) => {
            const { dayNum: dateNum, dayName } = getDateLabel(dayNum);
            const isActive = dayNum === clampedDay;
            return (
              <button
                key={dayNum}
                type="button"
                onClick={() => setSelectedDay(dayNum)}
                className={`min-w-[46px] min-h-[48px] px-2.5 py-1.5 rounded-xl flex flex-col items-center justify-center shrink-0 font-mono tabular-nums transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912] shadow-xs font-bold'
                    : 'bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-900/50 text-slate-700 dark:text-emerald-200'
                }`}
              >
                {dayName ? (
                  <span className="text-[9px] uppercase leading-none opacity-80 mb-1">
                    {dayName}
                  </span>
                ) : (
                  <span className="text-[9px] uppercase leading-none opacity-75 mb-1">
                    Day
                  </span>
                )}
                <span className="text-xs font-bold leading-none">{dateNum}</span>
              </button>
            );
          })}
          {stripEnd < totalDays && (
            <button
              type="button"
              onClick={() => setSelectedDay(Math.min(totalDays, stripEnd + 1))}
              className="min-h-[48px] px-3 rounded-xl border border-dashed border-emerald-400/60 text-[11px] font-mono font-semibold text-emerald-700 dark:text-[#2fe196] whitespace-nowrap shrink-0 cursor-pointer"
            >
              +{totalDays - stripEnd} more
            </button>
          )}
        </div>
      </div>

      {/* Touch-Friendly Mobile Habit Cards */}
      <div className="space-y-2.5">
        {activeHabits.map((habit, idx) => {
          const status: TrackingStatus = tracking[habit.id]?.[clampedDay] || 'empty';
          const isConfirming = confirmDeleteId === habit.id;

          return (
            <div
              key={habit.id}
              className={`rounded-2xl border p-3.5 transition-colors space-y-2.5 ${
                status === 'completed'
                  ? 'bg-[#eaf3ed]/70 dark:bg-emerald-950/50 border-[#183f2e]/30 dark:border-[#2fe196]/40'
                  : status === 'failed'
                  ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                  : 'bg-white dark:bg-[#091f17] border-slate-200 dark:border-emerald-900/50'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <span className="font-mono tabular-nums text-xs font-semibold text-slate-400 dark:text-emerald-400/80 mt-0.5 shrink-0">
                    {idx + 1}.
                  </span>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white leading-snug block break-words">
                      {habit.name}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-emerald-300/70">
                      {status === 'completed'
                        ? 'Completed today'
                        : status === 'failed'
                        ? 'Missed'
                        : 'Tap circle to mark'}
                    </span>
                  </div>
                </div>

                {/* Large 44px touch toggle button */}
                <button
                  type="button"
                  onClick={() => onToggleCell(habit.id, clampedDay)}
                  aria-label={`Mark ${habit.name} on day ${clampedDay}`}
                  className={`min-h-[44px] min-w-[44px] rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90 cursor-pointer ${
                    status === 'completed'
                      ? 'bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912] shadow-sm'
                      : status === 'failed'
                      ? 'bg-rose-500/20 border border-rose-500/50 text-rose-600 dark:text-rose-400'
                      : 'border-2 border-slate-300 dark:border-emerald-700 bg-white dark:bg-[#081d15] text-slate-400'
                  }`}
                >
                  {status === 'completed' ? (
                    <Check className="w-5 h-5 stroke-[3]" />
                  ) : status === 'failed' ? (
                    <X className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-emerald-800/70" />
                  )}
                </button>
              </div>

              {/* 5-day mini context strip + remove button */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-emerald-900/30">
                <div className="flex items-center gap-1.5">
                  {windowDays.map((dNum) => {
                    const st = tracking[habit.id]?.[dNum] || 'empty';
                    return (
                      <button
                        key={dNum}
                        type="button"
                        onClick={() => {
                          setSelectedDay(dNum);
                          onToggleCell(habit.id, dNum);
                        }}
                        className={`px-2 py-1 rounded-lg text-[10px] font-mono tabular-nums transition-colors cursor-pointer ${
                          st === 'completed'
                            ? 'bg-[#2fe196]/25 text-[#123524] dark:text-[#2fe196] font-bold'
                            : st === 'failed'
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                            : 'bg-slate-100 dark:bg-emerald-950/60 text-slate-500 dark:text-emerald-300/70'
                        } ${dNum === clampedDay ? 'ring-1 ring-[#183f2e] dark:ring-[#2fe196]' : ''}`}
                      >
                        D{dNum}
                      </button>
                    );
                  })}
                </div>

                {activeHabits.length > 1 && (
                  isConfirming ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 rounded-lg border border-slate-200 dark:border-emerald-800 text-[11px] font-medium text-slate-600 dark:text-emerald-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteHabit(habit.id);
                          setConfirmDeleteId(null);
                        }}
                        className="px-2 py-1 rounded-lg bg-rose-600 text-[11px] font-semibold text-white cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(habit.id)}
                      aria-label={`Remove ${habit.name}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default MobileHabitWorkspace;
