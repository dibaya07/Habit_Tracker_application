'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Flame,
  History,
  LayoutDashboard,
  Plus,
  SlidersHorizontal,
  TrendingUp,
} from 'lucide-react';
import { useHabitTracker } from '@/lib/context/HabitTrackerContext';
import ExtendDaysControl from '@/components/tracker/ExtendDaysControl';
import IconTooltip from '@/components/ui/IconTooltip';
import SheetManagerBar from './SheetManagerBar';

export default function DashboardOverview() {
  const {
    user,
    tracker,
    savedTrackers,
    selectTracker,
    renameTracker,
    deleteSavedTracker,
    analytics,
    toggleCell,
    setIsCreateModalOpen,
    extendPlan,
  } = useHabitTracker();

  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
  const activeHabits = useMemo(
    () => tracker.habits.filter((h) => h.active),
    [tracker.habits]
  );

  // Compute today's day index within the active tracker (clamped to 1..durationDays)
  const defaultTodayDay = useMemo(() => {
    const start = new Date(`${tracker.startDate}T00:00:00`);
    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays =
      Math.floor((todayMidnight.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(tracker.durationDays, diffDays));
  }, [tracker.startDate, tracker.durationDays]);

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const activeDayIndex =
    selectedDay !== null
      ? Math.max(1, Math.min(tracker.durationDays, selectedDay))
      : defaultTodayDay;

  if (!user) return null;

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const activeDayDate = (() => {
    const d = new Date(`${tracker.startDate}T00:00:00`);
    d.setDate(d.getDate() + (activeDayIndex - 1));
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  })();

  const dayCompletedCount = activeHabits.reduce(
    (acc, h) => acc + (tracker.tracking[h.id]?.[activeDayIndex] === 'completed' ? 1 : 0),
    0
  );

  return (
    <section
      id="dashboard"
      className="py-6 sm:py-12 bg-[#fafcf9] dark:bg-[#071912]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        {/* Clear Location Breadcrumb + Greeting & Unified Mobile Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#dce8df] dark:border-emerald-900/40 pb-5">
          <div className="space-y-2 min-w-0">
            {/* Location Indicator so user clearly knows they are on Dashboard */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-[#2fe196]">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#eaf3ed] dark:bg-emerald-900/40 border border-emerald-200/80 dark:border-emerald-700/40 text-[#183f2e] dark:text-[#2fe196]">
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </span>
              <span className="text-slate-400 dark:text-emerald-400/60">·</span>
              <span className="text-slate-600 dark:text-emerald-200/75 font-mono normal-case tracking-normal">
                {todayFormatted}
              </span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#123524] dark:text-white leading-tight">
              {user.name && user.name !== 'Profile' && user.name !== 'Habitora Member'
                ? `Welcome back, ${user.name}`
                : 'Today’s Habits'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100/75">
              {user.dailyGoal || 'Mark today’s habits below. Unmarked cells after 2 days are automatically flagged as missed.'}
            </p>
          </div>

          {/* Desktop Action Row */}
          <div className="hidden md:flex flex-wrap items-center gap-2 shrink-0">
            <IconTooltip label="Add a habit to this sheet" position="bottom">
              <button
                type="button"
                title="Add a habit to this sheet"
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] shadow-xs transition-colors whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Habit</span>
              </button>
            </IconTooltip>

            <ExtendDaysControl
              currentDuration={tracker.durationDays}
              onExtend={extendPlan}
            />

            <IconTooltip label="View chronological action history" position="bottom">
              <Link
                href="/history"
                title="Action History"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-emerald-800/70 bg-white dark:bg-[#091f17] text-slate-800 dark:text-emerald-100 hover:border-[#183f2e] dark:hover:border-[#2fe196] transition-colors whitespace-nowrap"
              >
                <History className="w-3.5 h-3.5 text-[#183f2e] dark:text-[#2fe196]" />
                <span>History</span>
              </Link>
            </IconTooltip>

            <IconTooltip label="Open complete analytics & workspace" position="bottom">
              <Link
                href="/analytics"
                title="Full Analytics & Workspace"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-emerald-800/70 bg-white dark:bg-[#091f17] text-slate-800 dark:text-emerald-100 hover:border-[#183f2e] dark:hover:border-[#2fe196] transition-colors whitespace-nowrap"
              >
                <BarChart3 className="w-3.5 h-3.5 text-[#183f2e] dark:text-[#2fe196]" />
                <span>Analytics</span>
              </Link>
            </IconTooltip>
          </div>

          {/* Mobile Unified Single Control wrapping Add Habit, Extend Days, History & Analytics */}
          <div className="md:hidden w-full space-y-2.5">
            <button
              type="button"
              onClick={() => setMobileActionsOpen((prev) => !prev)}
              aria-expanded={mobileActionsOpen}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912] text-xs font-semibold flex items-center justify-between gap-2 shadow-xs cursor-pointer"
            >
              <span className="inline-flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Sheet Actions (Add Habit · Extend · Analytics)</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${mobileActionsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {mobileActionsOpen && (
              <div className="p-3 rounded-2xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-800/60 shadow-sm space-y-2.5">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileActionsOpen(false);
                      setIsCreateModalOpen(true);
                    }}
                    className="flex-1 min-w-[120px] min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#eaf3ed] dark:bg-emerald-900/50 text-[#183f2e] dark:text-[#2fe196] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Add Habit</span>
                  </button>

                  <Link
                    href="/analytics"
                    onClick={() => setMobileActionsOpen(false)}
                    className="flex-1 min-w-[120px] min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-emerald-800/70 text-slate-800 dark:text-emerald-100"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-[#183f2e] dark:text-[#2fe196]" />
                    <span>Analytics</span>
                  </Link>

                  <Link
                    href="/history"
                    onClick={() => setMobileActionsOpen(false)}
                    className="flex-1 min-w-[120px] min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-emerald-800/70 text-slate-800 dark:text-emerald-100"
                  >
                    <History className="w-3.5 h-3.5 text-[#183f2e] dark:text-[#2fe196]" />
                    <span>History</span>
                  </Link>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-emerald-900/40 flex justify-start">
                  <ExtendDaysControl
                    currentDuration={tracker.durationDays}
                    onExtend={extendPlan}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sheet Selector & Manager (only when user has more than 1 sheet) */}
        <SheetManagerBar
          savedTrackers={savedTrackers}
          activeTrackerId={tracker.id}
          onSelect={(id) => {
            selectTracker(id);
            setSelectedDay(null);
          }}
          onRename={renameTracker}
          onDelete={deleteSavedTracker}
        />

        {/* Primary Habits-to-Mark Card */}
        <div className="rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-4 sm:p-6 shadow-sm space-y-5">
          {/* Properly arranged Date Bar for both Mobile and Desktop */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-emerald-900/40 pb-4">
            <div className="min-w-0 space-y-0.5">
              <h2 className="font-editorial text-xl sm:text-2xl text-[#123524] dark:text-white truncate">
                {tracker.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-emerald-300/75 font-mono tabular-nums">
                Day {activeDayIndex} of {tracker.durationDays} · {activeDayDate} · {dayCompletedCount}/{activeHabits.length} done
              </p>
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0">
              <button
                type="button"
                title="View previous day"
                onClick={() => setSelectedDay(Math.max(1, activeDayIndex - 1))}
                disabled={activeDayIndex <= 1}
                className="flex-1 sm:flex-none min-h-[38px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-emerald-800/60 text-xs font-medium text-slate-700 dark:text-emerald-200 hover:bg-slate-50 dark:hover:bg-emerald-900/40 disabled:opacity-35 cursor-pointer whitespace-nowrap"
              >
                Prev Day
              </button>
              <button
                type="button"
                title="Jump to today"
                onClick={() => setSelectedDay(defaultTodayDay)}
                className="flex-1 sm:flex-none min-h-[38px] px-3 py-1.5 rounded-xl bg-[#eaf3ed] dark:bg-emerald-900/40 text-xs font-semibold text-[#183f2e] dark:text-[#2fe196] cursor-pointer whitespace-nowrap"
              >
                Today
              </button>
              <button
                type="button"
                title="View next day"
                onClick={() =>
                  setSelectedDay(Math.min(tracker.durationDays, activeDayIndex + 1))
                }
                disabled={activeDayIndex >= tracker.durationDays}
                className="flex-1 sm:flex-none min-h-[38px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-emerald-800/60 text-xs font-medium text-slate-700 dark:text-emerald-200 hover:bg-slate-50 dark:hover:bg-emerald-900/40 disabled:opacity-35 cursor-pointer whitespace-nowrap"
              >
                Next Day
              </button>
            </div>
          </div>

          {/* Interactive Habit Checklist */}
          <div className="flex flex-wrap gap-3">
            {activeHabits.map((habit, idx) => {
              const status = tracker.tracking[habit.id]?.[activeDayIndex] || 'empty';
              const isDone = status === 'completed';
              return (
                <button
                  key={habit.id}
                  type="button"
                  onClick={() => toggleCell(habit.id, activeDayIndex)}
                  className={`w-full sm:w-[calc(50%-0.375rem)] min-h-[56px] flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isDone
                      ? 'bg-[#eaf3ed] dark:bg-emerald-900/35 border-[#183f2e]/40 dark:border-[#2fe196]/60'
                      : status === 'failed'
                      ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                      : 'bg-slate-50/70 dark:bg-emerald-950/30 border-slate-200 dark:border-emerald-900/40 hover:border-slate-300 dark:hover:border-emerald-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono tabular-nums text-xs font-semibold text-slate-400 dark:text-emerald-400/80 shrink-0">
                      {idx + 1}.
                    </span>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-slate-900 dark:text-white block break-words leading-snug">
                        {habit.name}
                      </span>
                      {status === 'failed' && (
                        <span className="text-[10px] font-medium text-rose-600 dark:text-rose-400">
                          Missed
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    title={isDone ? 'Completed' : status === 'failed' ? 'Missed' : 'Tap to complete'}
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isDone
                        ? 'bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912]'
                        : status === 'failed'
                        ? 'bg-rose-500/20 border border-rose-500/40 text-rose-500 text-xs font-bold'
                        : 'border border-slate-300 dark:border-emerald-700 bg-white dark:bg-[#081d15]'
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : status === 'failed' ? (
                      '×'
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Little Analytics Snapshot + CTA to Full Analytics & Digital Workspace */}
        <div className="rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-4 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-4 sm:gap-8">
            <div className="flex items-center gap-2.5">
              <IconTooltip label="Overall completion rate" position="top">
                <span className="w-9 h-9 rounded-xl bg-[#eaf3ed] dark:bg-emerald-500/15 text-[#183f2e] dark:text-[#2fe196] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </IconTooltip>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-emerald-300/75 block">
                  Overall Rate
                </span>
                <span className="font-mono tabular-nums text-xl font-bold text-[#123524] dark:text-white">
                  {analytics.completionRate}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <IconTooltip label="Current active streak" position="top">
                <span className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4" />
                </span>
              </IconTooltip>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-emerald-300/75 block">
                  Active Streak
                </span>
                <span className="font-mono tabular-nums text-xl font-bold text-[#123524] dark:text-white">
                  {analytics.currentStreak}d
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <IconTooltip label="Completed today" position="top">
                <span className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </span>
              </IconTooltip>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-emerald-300/75 block">
                  Today
                </span>
                <span className="font-mono tabular-nums text-xl font-bold text-[#123524] dark:text-white">
                  {dayCompletedCount}/{activeHabits.length}
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/analytics"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] shadow-xs transition-all whitespace-nowrap shrink-0"
          >
            <BarChart3 className="w-4 h-4" />
            <span>View Full Analytics &amp; Digital Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
