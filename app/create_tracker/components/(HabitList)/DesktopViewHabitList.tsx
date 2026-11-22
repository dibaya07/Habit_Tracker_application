"use client";
import IconTooltip from "@/components/ui/IconTooltip";
import { DayLabelMode, Habit } from "@/lib/types/tracker";
import {
  addUtcDays,
  getUtcDayNumber,
  getUtcWeekdayNarrow,
  parseUtcDate,
} from "@/lib/utils/date";
import { Check, Trash2 } from "lucide-react";
import React, { useContext, useState } from "react";
import { SheetContext } from "../../context/context";

interface DesktopViewHabitListProps {
  //   trackerName: string;
  durationDays: number;
  startDate: string;
  // dayLabelMode: DayLabelMode;
  //   setDayLabelMode: (mode: DayLabelMode) => void;
  //   includeGraph: boolean;
  //   setIncludeGraph: (value: boolean) => void;
  selectedHabits: Habit[];
  handleRemoveHabit: (id: string) => void;
  //   handleAddCustomHabit: (e: React.FormEvent) => void;
  //   newHabitName: string;
  //   setNewHabitName: (name: string) => void;
  //   handleSelectSuggestedHabit: (name: string, category: HabitCategory) => void;
  checkedCells?: Record<string, boolean>;
  setCheckedCells?: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  //   plottedZeroDays?: Record<number, boolean>;
  setPlottedZeroDays?: React.Dispatch<
    React.SetStateAction<Record<number, boolean>>
  >;
  //   onOpenPreview?: (mode: 'sheet' | 'graph') => void;
  confirmDeleteHabitId: string | null;
  setConfirmDeleteHabitId: (value: null | string) => void;
}

export default function DesktopViewHabitList({
  durationDays,
  selectedHabits,
  confirmDeleteHabitId,
  setConfirmDeleteHabitId,
  handleRemoveHabit,
  checkedCells: externalCheckedCells,
  setCheckedCells: externalSetCheckedCells,
  setPlottedZeroDays: externalSetPlottedZeroDays,
  // dayLabelMode,
  startDate,
}: DesktopViewHabitListProps) {

     const sheetContext = useContext(SheetContext)
  const visibleDayCount = Math.min(10, Math.max(1, durationDays));
  const extraDaysCount = Math.max(0, durationDays - visibleDayCount);

  const daysArray = Array.from({ length: visibleDayCount }, (_, i) => i + 1);

  const [internalCheckedCells, setInternalCheckedCells] = useState<
    Record<string, boolean>
  >({});
  const [internalPlottedZeroDays, setInternalPlottedZeroDays] = useState<
    Record<number, boolean>
  >({});
  const checkedCells = externalCheckedCells ?? internalCheckedCells;

  const setCheckedCells = externalSetCheckedCells ?? setInternalCheckedCells;
  const setPlottedZeroDays =
    externalSetPlottedZeroDays ?? setInternalPlottedZeroDays;

  const baseDate = parseUtcDate(startDate);
  // const formattedStartDate = formatUtcFullDate(baseDate);

  const getDayHeader = (dayNum: number) => {
    if (sheetContext?.dayLabelMode === "numbers") {
      return {
        top: "",
        bottom: String(dayNum),
      };
    }
    const d = addUtcDays(baseDate, dayNum - 1);
    return {
      top: getUtcWeekdayNarrow(d),
      bottom: String(getUtcDayNumber(d)),
    };
  };

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

  return (
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
                const isChecked = Boolean(
                  checkedCells[`${habit.id}-${dayNum}`],
                );
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
                          ? "bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912] border border-[#183f2e] dark:border-[#2fe196]"
                          : "border border-slate-300 dark:border-emerald-800/70 hover:border-[#183f2e] dark:hover:border-[#2fe196]"
                      }`}
                    >
                      {isChecked && (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      )}
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
  );
}
