'use client';

import React, { useState } from 'react';
import { Check, Eye, Plus, Trash2, TrendingUp } from 'lucide-react';
import { DayLabelMode, Habit, HabitCategory } from '@/lib/types/tracker';
import {
  addUtcDays,
  formatUtcFullDate,
  getUtcDayNumber,
  getUtcWeekdayNarrow,
  parseUtcDate,
} from '@/lib/utils/date';
import BrandMark from '@/components/ui/BrandMark';
import IconTooltip from '@/components/ui/IconTooltip';
import DayLabelDropdown from '@/components/tracker/DayLabelDropdown';
import CustomHabitForm from './CustomHabitForm';
import QuickSuggestions from './QuickSuggestions';
import HabitProgressGraph from './HabitProgressGraph';

interface HabitListProp {
  trackerName: string;
  durationDays: number;
  startDate: string;
  dayLabelMode: DayLabelMode;
  setDayLabelMode: (mode: DayLabelMode) => void;
  includeGraph: boolean;
  setIncludeGraph: (value: boolean) => void;
  selectedHabits: Habit[];
  handleRemoveHabit: (id: string) => void;
  handleAddCustomHabit: (e: React.FormEvent) => void;
  newHabitName: string;
  setNewHabitName: (name: string) => void;
  handleSelectSuggestedHabit: (name: string, category: HabitCategory) => void;
  checkedCells?: Record<string, boolean>;
  setCheckedCells?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  plottedZeroDays?: Record<number, boolean>;
  setPlottedZeroDays?: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  onOpenPreview?: (mode: 'sheet' | 'graph') => void;
}

export default function HabitList({
  trackerName,
  durationDays,
  startDate,
  dayLabelMode,
  setDayLabelMode,
  includeGraph,
  setIncludeGraph,
  selectedHabits,
  handleRemoveHabit,
  handleAddCustomHabit,
  newHabitName,
  setNewHabitName,
  handleSelectSuggestedHabit,
  checkedCells: externalCheckedCells,
  setCheckedCells: externalSetCheckedCells,
  plottedZeroDays: externalPlottedZeroDays,
  setPlottedZeroDays: externalSetPlottedZeroDays,
  onOpenPreview,
}: HabitListProp) {
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [confirmDeleteHabitId, setConfirmDeleteHabitId] = useState<string | null>(null);
  const [internalCheckedCells, setInternalCheckedCells] = useState<Record<string, boolean>>({});
  const [internalPlottedZeroDays, setInternalPlottedZeroDays] = useState<Record<number, boolean>>({});

  const checkedCells = externalCheckedCells ?? internalCheckedCells;
  const setCheckedCells = externalSetCheckedCells ?? setInternalCheckedCells;
  const plottedZeroDays = externalPlottedZeroDays ?? internalPlottedZeroDays;
  const setPlottedZeroDays = externalSetPlottedZeroDays ?? setInternalPlottedZeroDays;

  // Keep only 10 days in desktop sheet view; show "+X more" in the last column when durationDays > 10
  const visibleDayCount = Math.min(10, Math.max(1, durationDays));
  const extraDaysCount = Math.max(0, durationDays - visibleDayCount);
  const daysArray = Array.from({ length: visibleDayCount }, (_, i) => i + 1);

  const toggleCell = (habitId: string, dayNum: number) => {
    const key = `${habitId}-${dayNum}`;
    setCheckedCells((prev) => ({ ...prev, [key]: !prev[key] }));
    setPlottedZeroDays((prev) => {
      if (!prev[dayNum]) return prev;
      const copy = { ...prev };
      delete copy[dayNum];
      return copy;
    });
  };

  const handlePlotPointClick = (dayNum: number, targetCount: number) => {
    let currentCount = 0;
    selectedHabits.forEach((h) => {
      if (checkedCells[`${h.id}-${dayNum}`]) currentCount += 1;
    });

    const isAlreadySameZero = targetCount === 0 && currentCount === 0 && plottedZeroDays[dayNum];
    const isAlreadySameCount = targetCount > 0 && currentCount === targetCount;

    setCheckedCells((prev) => {
      const next = { ...prev };
      selectedHabits.forEach((h, idx) => {
        const key = `${h.id}-${dayNum}`;
        if (isAlreadySameCount || targetCount === 0) {
          delete next[key];
        } else {
          next[key] = idx < targetCount;
        }
      });
      return next;
    });

    setPlottedZeroDays((prev) => {
      const next = { ...prev };
      if (targetCount === 0 && !isAlreadySameZero) {
        next[dayNum] = true;
      } else {
        delete next[dayNum];
      }
      return next;
    });
  };

  const handleClearPoints = () => {
    setCheckedCells({});
    setPlottedZeroDays({});
  };

  const baseDate = parseUtcDate(startDate);
  const formattedStartDate = formatUtcFullDate(baseDate);

  const getDayHeader = (dayNum: number) => {
    if (dayLabelMode === 'numbers') {
      return {
        top: '',
        bottom: String(dayNum),
      };
    }
    const d = addUtcDays(baseDate, dayNum - 1);
    return {
      top: getUtcWeekdayNarrow(d),
      bottom: String(getUtcDayNumber(d)),
    };
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    handleAddCustomHabit(e);
    setIsAddingHabit(false);
  };

  return (
    <div className="space-y-4">
      {/* Interactive Sheet Builder Container */}
      <div
        id="create-tracker-sheet"
        className="no-print rounded-2xl border border-[#dce8df] dark:border-emerald-900/50 bg-white dark:bg-[#081d15] shadow-xs overflow-hidden"
      >
        {/* Sheet Header */}
        <div className="px-4 sm:px-5 py-4 border-b border-slate-200 dark:border-emerald-900/50 bg-[#fafcf9] dark:bg-[#0b241b] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <BrandMark size={30} />
            <div className="min-w-0 space-y-1 flex-1">
              {trackerName.trim() ? (
                <h2 className="font-editorial text-xl sm:text-2xl font-normal text-[#123524] dark:text-white break-words">
                  {trackerName.trim()}
                </h2>
              ) : (
                <div className="flex items-baseline gap-2 pt-0.5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-emerald-300/75 uppercase tracking-wider shrink-0">
                    Sheet Name:
                  </span>
                  <span
                    aria-label="Blank space for manual sheet name"
                    className="inline-block w-36 sm:w-64 border-b border-dashed border-slate-400 dark:border-emerald-700 h-4"
                  />
                </div>
              )}
              <p className="text-xs text-slate-600 dark:text-emerald-300/75 font-mono tabular-nums">
                Start: {formattedStartDate} · {durationDays} Days · {selectedHabits.length} Habits
              </p>
            </div>
          </div>

          {/* Dropdown: No. of Days vs From Date */}
          <div className="no-print flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/70 dark:border-emerald-900/40 shrink-0">
            <span className="text-[11px] font-medium text-slate-500 dark:text-emerald-300/70">
              Day Labels:
            </span>
            <DayLabelDropdown
              id="create-sheet-day-label-mode"
              value={dayLabelMode}
              onChange={setDayLabelMode}
            />
          </div>
        </div>

        {/* MOBILE VIEW (< md): Clean Non-Scrolling Habit List + Preview Buttons */}
        <div className="md:hidden divide-y divide-slate-200/70 dark:divide-emerald-900/30">
          {selectedHabits.map((habit, idx) => (
            <div
              key={habit.id}
              className="px-4 py-3 flex items-center justify-between gap-3 bg-white dark:bg-[#081d15]"
            >
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <span className="font-mono tabular-nums text-xs font-semibold text-slate-400 dark:text-emerald-400/80 min-w-[1.4rem] shrink-0 mt-0.5">
                  {idx + 1}.
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-white break-words leading-snug">
                  {habit.name}
                </span>
              </div>

              {confirmDeleteHabitId === habit.id ? (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteHabitId(null)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-emerald-800 text-[11px] font-medium text-slate-600 dark:text-emerald-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleRemoveHabit(habit.id);
                      setConfirmDeleteHabitId(null);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 text-[11px] font-semibold text-white cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  title={`Remove ${habit.name}`}
                  onClick={() => setConfirmDeleteHabitId(habit.id)}
                  disabled={selectedHabits.length <= 1}
                  aria-label={`Remove ${habit.name}`}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:text-emerald-400/60 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 disabled:opacity-20 disabled:pointer-events-none transition-colors shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* DESKTOP VIEW (md+): Unified Habit + Tracking Grid Table */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar">
          <table
            className="w-full table-fixed text-left border-collapse"
            style={{
              minWidth: `${250 + visibleDayCount * 36 + (extraDaysCount > 0 ? 84 : 0)}px`,
            }}
          >
            <colgroup>
              <col className="w-[250px] sm:w-[300px] lg:w-[340px]" />
              {daysArray.map((dayNum) => (
                <col key={dayNum} />
              ))}
              {extraDaysCount > 0 && <col className="w-[84px]" />}
            </colgroup>
            <thead>
              <tr className="border-b border-slate-200 dark:border-emerald-900/50 bg-slate-50/90 dark:bg-[#0b241b]/70 text-xs text-slate-600 dark:text-emerald-300">
                <th className="py-3 px-5 font-semibold w-[250px] sm:w-[300px] lg:w-[340px] sticky left-0 z-20 bg-slate-50 dark:bg-[#0b241b] border-r border-slate-200 dark:border-emerald-900/50">
                  Habit
                </th>

                {daysArray.map((dayNum) => {
                  const { top, bottom } = getDayHeader(dayNum);
                  return (
                    <th
                      key={dayNum}
                      className="py-2.5 px-1.5 text-center font-mono tabular-nums border-r border-slate-100 dark:border-emerald-900/20 last:border-r-0 align-middle"
                    >
                      {top && (
                        <span className="block text-[9px] uppercase text-slate-400 dark:text-emerald-400/70 leading-none mb-0.5">
                          {top}
                        </span>
                      )}
                      <span className="text-xs font-bold text-slate-800 dark:text-white leading-none block">
                        {bottom}
                      </span>
                    </th>
                  );
                })}

                {extraDaysCount > 0 && (
                  <th className="py-2.5 px-3 text-center font-mono tabular-nums text-[11px] font-semibold text-emerald-700 dark:text-[#2fe196] whitespace-nowrap w-[84px] border-l border-slate-100 dark:border-emerald-900/20">
                    +{extraDaysCount} more
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/80 dark:divide-emerald-900/30 text-xs">
              {selectedHabits.map((habit, idx) => (
                <tr
                  key={habit.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-emerald-950/30 transition-colors group"
                >
                  <td
                    title={habit.name}
                    className="py-3 px-5 w-[250px] sm:w-[300px] lg:w-[340px] sticky left-0 z-10 bg-white group-hover:bg-slate-50/90 dark:bg-[#081d15] dark:group-hover:bg-[#0a2319] border-r border-slate-200 dark:border-emerald-900/50 align-middle"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0 flex-1">
                        <span className="font-mono tabular-nums text-xs font-semibold text-slate-400 dark:text-emerald-400/80 min-w-[1.4rem] shrink-0 mt-0.5">
                          {idx + 1}.
                        </span>
                        <span className="text-[13px] font-medium text-slate-900 dark:text-white whitespace-normal break-words leading-snug">
                          {habit.name}
                        </span>
                      </div>

                      {confirmDeleteHabitId === habit.id ? (
                        <div className="no-print flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteHabitId(null)}
                            className="px-2 py-0.5 rounded-md border border-slate-200 dark:border-emerald-800 text-[11px] font-medium text-slate-600 dark:text-emerald-200 hover:bg-slate-100 dark:hover:bg-emerald-900/40 cursor-pointer whitespace-nowrap"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleRemoveHabit(habit.id);
                              setConfirmDeleteHabitId(null);
                            }}
                            className="px-2 py-0.5 rounded-md bg-rose-600 hover:bg-rose-700 text-[11px] font-semibold text-white cursor-pointer whitespace-nowrap"
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <IconTooltip label={`Remove ${habit.name}`} position="top">
                          <button
                            type="button"
                            title={`Remove ${habit.name}`}
                            onClick={() => setConfirmDeleteHabitId(habit.id)}
                            disabled={selectedHabits.length <= 1}
                            aria-label={`Remove ${habit.name}`}
                            className="no-print p-1 rounded-md text-slate-400 hover:text-rose-600 dark:text-emerald-400/60 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 disabled:opacity-20 disabled:pointer-events-none transition-colors shrink-0 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </IconTooltip>
                      )}
                    </div>
                  </td>

                  {/* Day Check Cells */}
                  {daysArray.map((dayNum) => {
                    const isChecked = Boolean(checkedCells[`${habit.id}-${dayNum}`]);
                    return (
                      <td
                        key={dayNum}
                        className="py-2.5 px-1 text-center border-r border-slate-100/80 dark:border-emerald-900/20 last:border-r-0 align-middle"
                      >
                        <button
                          type="button"
                          title={`Toggle ${habit.name} on day ${dayNum}`}
                          onClick={() => toggleCell(habit.id, dayNum)}
                          aria-label={`Mark ${habit.name} on day ${dayNum}`}
                          className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912] border border-[#183f2e] dark:border-[#2fe196]'
                              : 'border border-slate-300 dark:border-emerald-800/70 hover:border-[#183f2e] dark:hover:border-[#2fe196]'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                      </td>
                    );
                  })}

                  {extraDaysCount > 0 && (
                    <td className="py-2.5 px-3 text-center font-mono text-xs text-slate-400 dark:text-emerald-500/60 align-middle">
                      ···
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Habit & Graph Controls Placed Directly Above Progress Graph */}
        <div className="no-print px-4 sm:px-5 py-3.5 border-t border-slate-200/80 dark:border-emerald-900/40 bg-[#fafcf9]/80 dark:bg-[#091f17]">
          {isAddingHabit ? (
            <div className="p-4 sm:p-5 rounded-2xl border border-[#dce8df] dark:border-emerald-900/50 bg-white dark:bg-emerald-950/30 space-y-4">
              <CustomHabitForm
                handleAddCustomHabit={handleFormSubmit}
                newHabitName={newHabitName}
                setNewHabitName={setNewHabitName}
                onCancel={() => {
                  setNewHabitName('');
                  setIsAddingHabit(false);
                }}
              />

              <QuickSuggestions
                selectedHabits={selectedHabits}
                handleSelectSuggestedHabit={handleSelectSuggestedHabit}
              />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsAddingHabit(true)}
                  className="flex-1 sm:flex-none min-h-[40px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-[#dce8df] dark:border-emerald-800/60 bg-white dark:bg-emerald-950/50 hover:border-[#183f2e] dark:hover:border-[#2fe196] text-xs font-semibold text-[#123524] dark:text-emerald-100 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 text-[#183f2e] dark:text-[#2fe196]" />
                  <span>Add Habit</span>
                </button>

                {!includeGraph && (
                  <button
                    type="button"
                    onClick={() => setIncludeGraph(true)}
                    className="flex-1 sm:flex-none min-h-[40px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-[#dce8df] dark:border-emerald-800/60 bg-white dark:bg-emerald-950/50 hover:border-[#183f2e] dark:hover:border-[#2fe196] text-xs font-semibold text-[#123524] dark:text-emerald-100 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <TrendingUp className="w-4 h-4 text-[#183f2e] dark:text-[#2fe196]" />
                    <span>Add Progress Graph</span>
                  </button>
                )}
              </div>

              <span className="hidden md:inline text-xs text-slate-500 dark:text-emerald-300/70">
                Tip: Toggle cells to preview checkmarks and graph line, or leave blank before downloading.
              </span>
            </div>
          )}
        </div>

        {/* MOBILE VIEW (< md): No horizontally scrolling graph — clean Preview & Graph toggle card instead */}
        <div className="md:hidden px-4 py-4 border-t border-slate-200/80 dark:border-emerald-900/40 bg-[#fafcf9] dark:bg-[#0b241b]/40 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-xs font-semibold text-[#123524] dark:text-white block">
                Printable Sheet &amp; Progress Graph
              </span>
              <span className="text-[11px] text-slate-500 dark:text-emerald-300/75 block">
                {includeGraph
                  ? 'Progress graph is included on your downloaded sheet.'
                  : 'Progress graph is currently excluded.'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIncludeGraph(!includeGraph)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors shrink-0 cursor-pointer ${
                includeGraph
                  ? 'bg-[#eaf3ed] dark:bg-emerald-900/50 border-[#183f2e]/30 dark:border-[#2fe196]/50 text-[#183f2e] dark:text-[#2fe196]'
                  : 'bg-white dark:bg-[#091f17] border-slate-300 dark:border-emerald-800 text-slate-600 dark:text-emerald-200'
              }`}
            >
              {includeGraph ? 'Graph: On' : 'Graph: Off'}
            </button>
          </div>

          {onOpenPreview && (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => onOpenPreview('sheet')}
                className="flex-1 min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-emerald-800/70 bg-white dark:bg-[#091f17] text-xs font-semibold text-[#123524] dark:text-emerald-100 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#183f2e] dark:text-[#2fe196]" />
                <span>Preview Sheet</span>
              </button>

              {includeGraph && (
                <button
                  type="button"
                  onClick={() => onOpenPreview('graph')}
                  className="flex-1 min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-emerald-800/70 bg-white dark:bg-[#091f17] text-xs font-semibold text-[#123524] dark:text-emerald-100 cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-[#183f2e] dark:text-[#2fe196]" />
                  <span>Preview Graph</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* DESKTOP VIEW (md+): Optional Progress Graph Section */}
        {includeGraph && (
          <div className="hidden md:block">
            <HabitProgressGraph
              habits={selectedHabits}
              visibleDayCount={visibleDayCount}
              extraDaysCount={extraDaysCount}
              startDate={startDate}
              dayLabelMode={dayLabelMode}
              checkedCells={checkedCells}
              plottedZeroDays={plottedZeroDays}
              onPlotPointClick={handlePlotPointClick}
              onClearPoints={handleClearPoints}
              onRemoveGraph={() => setIncludeGraph(false)}
            />
          </div>
        )}

        {/* Sheet Footer Notes */}
        <div className="px-4 sm:px-5 py-3 border-t border-slate-200 dark:border-emerald-900/40 bg-[#fafcf9] dark:bg-[#0b241b]/60 flex items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-emerald-300/70">
          <span>Habitora · Daily Consistency Sheet</span>
          <span className="font-mono tabular-nums">
            Score: ____ / {selectedHabits.length * durationDays}
          </span>
        </div>
      </div>
    </div>
  );
}
