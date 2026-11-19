'use client';

import React, { useCallback, useMemo, useState } from 'react';
import {
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  SlidersHorizontal,
  X,
  TrendingUp,
} from 'lucide-react';
import { useHabitTracker } from '../../lib/context/HabitTrackerContext';
import {
  addUtcDays,
  formatUtcFullDate,
  formatUtcShortDate,
  getUtcDayNumber,
  getUtcWeekdayNarrow,
  parseUtcDate,
} from '../../lib/utils/date';
import BrandMark from '../ui/BrandMark';
import IconTooltip from '../ui/IconTooltip';
import DayLabelDropdown from './DayLabelDropdown';
import ExtendDaysControl from './ExtendDaysControl';
import TrackerMatrixTable from './TrackerMatrixTable';
import MobileHabitWorkspace from './MobileHabitWorkspace';
import HabitInsightsSidebar from './HabitInsightsSidebar';
import ProgressLineGraph, { GraphDayPoint } from './ProgressLineGraph';

export const HabitTrackerGrid: React.FC = () => {
  const {
    tracker,
    toggleCell,
    deleteHabit,
    analytics,
    setIsCreateModalOpen,
    extendPlan,
    resetTrackerData,
    setDayLabelMode,
    setIncludeGraph,
  } = useHabitTracker();

  const dayLabelMode = tracker.dayLabelMode || 'dates';
  const showGraph = tracker.includeGraph !== false;

  // Show 10 visible days per window so a 30-day sheet starts with "+20 more"
  const daysPerPage = 10;
  const [dayOffset, setDayOffset] = useState<number>(0);
  const [confirmingReset, setConfirmingReset] = useState<boolean>(false);
  const [mobileActionsOpen, setMobileActionsOpen] = useState<boolean>(false);

  const activeHabits = useMemo(
    () => tracker.habits.filter((h) => h.active),
    [tracker.habits]
  );

  const totalDays = tracker.durationDays;
  const maxOffset = Math.max(0, totalDays - daysPerPage);
  const clampedOffset = Math.min(dayOffset, maxOffset);

  const visibleStartDay = 1 + clampedOffset;
  const visibleEndDay = Math.min(totalDays, visibleStartDay + daysPerPage - 1);
  const remainingDaysAhead = Math.max(0, totalDays - visibleEndDay);

  const visibleDays = useMemo(() => {
    const arr: number[] = [];
    for (let d = visibleStartDay; d <= visibleEndDay; d++) {
      arr.push(d);
    }
    return arr;
  }, [visibleStartDay, visibleEndDay]);

  const baseDate = useMemo(() => parseUtcDate(tracker.startDate), [tracker.startDate]);

  const getDateLabel = useCallback(
    (dayIndex: number) => {
      if (dayLabelMode === 'numbers') {
        return {
          dayNum: dayIndex,
          dayName: '',
        };
      }
      const d = addUtcDays(baseDate, dayIndex - 1);
      return {
        dayNum: getUtcDayNumber(d),
        dayName: getUtcWeekdayNarrow(d),
      };
    },
    [dayLabelMode, baseDate]
  );

  const formattedPeriodRange = useMemo(() => {
    const start = addUtcDays(baseDate, 0);
    const end = addUtcDays(baseDate, tracker.durationDays - 1);
    return `${formatUtcShortDate(start)} – ${formatUtcFullDate(end)}`;
  }, [baseDate, tracker.durationDays]);

  const onlineGraphDays: GraphDayPoint[] = useMemo(
    () =>
      visibleDays.map((dayNum) => {
        const { dayNum: dateDay, dayName } = getDateLabel(dayNum);
        const hasAnyTrack = activeHabits.some((h) => {
          const st = tracker.tracking[h.id]?.[dayNum];
          return st === 'completed' || st === 'failed';
        });
        const completedCount = hasAnyTrack
          ? activeHabits.reduce(
              (acc, h) => acc + (tracker.tracking[h.id]?.[dayNum] === 'completed' ? 1 : 0),
              0
            )
          : null;

        return {
          dayNum,
          topLabel: dayName,
          bottomLabel: String(dateDay),
          completedCount,
        };
      }),
    [visibleDays, getDateLabel, activeHabits, tracker.tracking]
  );

  const handleNextDays = useCallback(() => {
    setDayOffset((prev) => Math.min(maxOffset, prev + daysPerPage));
  }, [maxOffset]);

  const handlePrevDays = useCallback(() => {
    setDayOffset((prev) => Math.max(0, prev - daysPerPage));
  }, []);

  const handleJumpToStart = useCallback(() => {
    setDayOffset(0);
  }, []);

  const onlineMinWidth = 224 + visibleDays.length * 38 + 96;

  return (
    <section id="tracker" className="py-8 md:py-14 border-t border-emerald-950/15 dark:border-emerald-900/30 mt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <span className="text-xs font-semibold tracking-widest text-emerald-700 dark:text-[#2fe196] uppercase block mb-2">
              DIGITAL WORKSPACE
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-slate-900 dark:text-white">
              Habit Tracker <span className="text-emerald-600 dark:text-emerald-500 font-sans text-xl font-light">(Online)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100/70 mt-1">
              Click any cell to mark habits. Habits left unmarked for 2+ days are marked as missed automatically.
            </p>
          </div>

          {/* Desktop Action Bar (Add Habit + Extend Days + Reset) */}
          <div className="hidden md:flex flex-wrap items-center gap-2.5 shrink-0">
            <IconTooltip label="Add a new habit to this sheet" position="bottom">
              <button
                type="button"
                title="Add Habit"
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Habit</span>
              </button>
            </IconTooltip>

            <ExtendDaysControl
              currentDuration={tracker.durationDays}
              onExtend={extendPlan}
            />

            {confirmingReset ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs">
                <span className="text-rose-700 dark:text-rose-300 font-medium whitespace-nowrap">
                  Clear all ticks?
                </span>
                <button
                  type="button"
                  onClick={() => setConfirmingReset(false)}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-[#091f17] border border-slate-200 dark:border-emerald-800 text-slate-700 dark:text-emerald-200 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetTrackerData();
                    setConfirmingReset(false);
                  }}
                  className="px-2 py-0.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-semibold cursor-pointer"
                >
                  Reset
                </button>
              </div>
            ) : (
              <IconTooltip label="Reset all check-ins" position="bottom">
                <button
                  type="button"
                  onClick={() => setConfirmingReset(true)}
                  title="Reset all check-ins"
                  aria-label="Reset tracker data"
                  className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-emerald-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-emerald-900/40 border border-slate-300 dark:border-emerald-900/30 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </IconTooltip>
            )}
          </div>

          {/* Mobile Unified Workspace Actions Menu */}
          <div className="md:hidden w-full space-y-2.5">
            <button
              type="button"
              onClick={() => setMobileActionsOpen((prev) => !prev)}
              aria-expanded={mobileActionsOpen}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912] text-xs font-semibold flex items-center justify-between gap-2 shadow-xs cursor-pointer"
            >
              <span className="inline-flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Workspace Actions (Add Habit · Extend · Reset)</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${mobileActionsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {mobileActionsOpen && (
              <div className="p-3 rounded-2xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-800/60 shadow-sm space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
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

                  {confirmingReset ? (
                    <div className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs">
                      <button
                        type="button"
                        onClick={() => setConfirmingReset(false)}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-[#091f17] border border-slate-200 dark:border-emerald-800 text-slate-700 dark:text-emerald-200 font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          resetTrackerData();
                          setConfirmingReset(false);
                          setMobileActionsOpen(false);
                        }}
                        className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-semibold cursor-pointer"
                      >
                        Confirm Reset
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmingReset(true)}
                      className="flex-1 min-w-[120px] min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-emerald-800/70 text-slate-700 dark:text-emerald-200 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Ticks</span>
                    </button>
                  )}
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

        {/* Main Tracker & Companion Dashboard Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Spreadsheet Table Container (Desktop/Tablet) + Touch Card Workspace (Mobile) */}
          <div className="w-full lg:flex-[8] xl:flex-[9] min-w-0 space-y-4">
            {/* Table Navigation Sub-Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#091f17] border border-slate-200 dark:border-emerald-900/40 text-xs">
              {/* Sheet Brand & Period Display */}
              <div className="flex items-center gap-2.5 min-w-0">
                <BrandMark size={26} />
                <div className="min-w-0 space-y-0.5 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white block sm:inline truncate">
                    {tracker.name}
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px] block sm:inline">
                    {formattedPeriodRange} · {tracker.durationDays}d Plan
                  </span>
                </div>
              </div>

              {/* Day Label Dropdown + Day Offset Navigator */}
              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-emerald-900/40">
                <span className="text-[11px] font-medium text-slate-500 dark:text-emerald-300/70 sm:hidden">
                  Day Labels:
                </span>
                <DayLabelDropdown
                  id="online-day-label-mode"
                  value={dayLabelMode}
                  onChange={setDayLabelMode}
                />

                {totalDays > daysPerPage && (
                  <div className="hidden md:flex items-center gap-1.5">
                    <IconTooltip label="Previous 10 days" position="top">
                      <button
                        type="button"
                        onClick={handlePrevDays}
                        disabled={clampedOffset === 0}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800/50 text-slate-700 dark:text-emerald-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        title="Previous days"
                        aria-label="Previous days"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </IconTooltip>
                    <span className="text-[11px] text-slate-700 dark:text-emerald-200 px-1.5 font-mono tabular-nums whitespace-nowrap">
                      Days {visibleStartDay}–{visibleEndDay} of {totalDays}
                    </span>
                    <IconTooltip label="Next 10 days" position="top">
                      <button
                        type="button"
                        onClick={handleNextDays}
                        disabled={clampedOffset >= maxOffset}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800/50 text-slate-700 dark:text-emerald-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        title="Next days"
                        aria-label="Next days"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </IconTooltip>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Digital Workspace (< md) */}
            <div className="md:hidden">
              <MobileHabitWorkspace
                activeHabits={activeHabits}
                totalDays={totalDays}
                tracking={tracker.tracking}
                dailyScores={analytics.dailyScores}
                getDateLabel={getDateLabel}
                onToggleCell={toggleCell}
                onDeleteHabit={deleteHabit}
              />
            </div>

            {/* Desktop / Tablet Spreadsheet Table (md+) */}
            <div className="hidden md:block rounded-2xl border border-slate-200 dark:border-emerald-900/40 bg-white dark:bg-[#081d15] shadow-xl overflow-hidden">
              <TrackerMatrixTable
                activeHabits={activeHabits}
                visibleDays={visibleDays}
                totalDays={totalDays}
                visibleEndDay={visibleEndDay}
                tracking={tracker.tracking}
                dailyScores={analytics.dailyScores}
                getDateLabel={getDateLabel}
                onToggleCell={toggleCell}
                onDeleteHabit={deleteHabit}
                onNextDays={handleNextDays}
                canGoNext={clampedOffset < maxOffset}
                onJumpToStart={handleJumpToStart}
                minTableWidth={onlineMinWidth}
              />

              {/* Auto-Calculated Live Progress Graph (Online Mode) */}
              {showGraph && (
                <ProgressLineGraph
                  title="Daily Progress Graph"
                  subtitle={`Auto-plotted from your check-ins (${visibleStartDay}–${visibleEndDay})`}
                  maxHabits={Math.max(1, activeHabits.length)}
                  days={onlineGraphDays}
                  rightLabel={
                    remainingDaysAhead > 0
                      ? `+${remainingDaysAhead} more`
                      : `${analytics.completionRate}%`
                  }
                  leftColClassName="w-48 sm:w-56"
                  rightSpacerClassName="w-24"
                  dayColMinWidthPx={38}
                  minTableWidth={onlineMinWidth}
                  onRemoveGraph={() => setIncludeGraph(false)}
                />
              )}

              {/* Grid Legend & Helper Note */}
              <div className="px-4 py-3 bg-slate-100 dark:bg-[#071912] border-t border-slate-200 dark:border-emerald-900/40 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-emerald-300/70">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#2fe196] flex items-center justify-center text-[#071912]">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                    <span>Completed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500">
                      <X className="w-2.5 h-2.5" />
                    </span>
                    <span>Missed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full border border-slate-400 dark:border-emerald-700/60" />
                    <span>Unmarked</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {!showGraph && (
                    <button
                      type="button"
                      onClick={() => setIncludeGraph(true)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-[#091f17] border border-slate-300 dark:border-emerald-800/60 text-[11px] font-semibold text-emerald-700 dark:text-[#2fe196] hover:border-emerald-500 transition-colors cursor-pointer"
                    >
                      <TrendingUp className="w-3 h-3" />
                      <span>Show Progress Graph</span>
                    </button>
                  )}
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Tip: Tap any cell to update graph &amp; score.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Weekly Progress & Streak Gauge Sidebar */}
          <HabitInsightsSidebar analytics={analytics} />
        </div>
      </div>
    </section>
  );
};
