'use client';

import React, { useContext, useMemo } from 'react';
import { Check } from 'lucide-react';
import { DayLabelMode, Habit } from '@/lib/types/tracker';
import {
  addUtcDays,
  formatUtcFullDate,
  getUtcDayNumber,
  getUtcWeekdayNarrow,
  parseUtcDate,
} from '@/lib/utils/date';
import BrandMark from '@/components/ui/BrandMark';
import HabitProgressGraph from './HabitProgressGraph';
import { SheetContext } from '../context/context';

interface PrintableSheetPagesProps {
  // trackerName: string;
  durationDays: number;
  startDate: string;
  // dayLabelMode: DayLabelMode;
  // includeGraph: boolean;
  selectedHabits: Habit[];
  checkedCells: Record<string, boolean>;
  plottedZeroDays: Record<number, boolean>;
}

interface PageChunk {
  pageNumber: number;
  totalPages: number;
  dayNumbers: number[];
}

export default function PrintableSheetPages({
  // trackerName,
  durationDays,
  startDate,
  // dayLabelMode,
  // includeGraph,
  selectedHabits,
  checkedCells,
  plottedZeroDays,
}: PrintableSheetPagesProps) {
    const sheetContext = useContext(SheetContext)
  const safeDuration = Math.max(1, Math.min(365, durationDays));

  // If durationDays <= 30 -> render everything on 1 single page.
  // If durationDays > 30 -> split cleanly across 2 pages.
  const pages: PageChunk[] = useMemo(() => {
    if (safeDuration <= 30) {
      return [
        {
          pageNumber: 1,
          totalPages: 1,
          dayNumbers: Array.from({ length: safeDuration }, (_, i) => i + 1),
        },
      ];
    }

    const splitDay = Math.ceil(safeDuration / 2);
    return [
      {
        pageNumber: 1,
        totalPages: 2,
        dayNumbers: Array.from({ length: splitDay }, (_, i) => i + 1),
      },
      {
        pageNumber: 2,
        totalPages: 2,
        dayNumbers: Array.from({ length: safeDuration - splitDay }, (_, i) => splitDay + i + 1),
      },
    ];
  }, [safeDuration]);

  const baseDate = useMemo(() => parseUtcDate(startDate), [startDate]);
  const formattedStartDate = formatUtcFullDate(baseDate);

  const getDayHeader = (dayNum: number) => {
    if (sheetContext?.dayLabelMode === 'numbers') {
      return { top: '', bottom: String(dayNum) };
    }
    const d = addUtcDays(baseDate, dayNum - 1);
    return {
      top: getUtcWeekdayNarrow(d),
      bottom: String(getUtcDayNumber(d)),
    };
  };

  return (
    <div className="w-full max-w-6xl space-y-6 print:space-y-0">
      {pages.map((page) => {
        const isCompact = page.dayNumbers.length > 15;
        const leftColClass = isCompact
          ? 'w-[170px] sm:w-[190px]'
          : 'w-[220px] sm:w-[260px]';
        const dayColMinWidthPx = isCompact ? 22 : 34;
        const circleSizeClass = isCompact ? 'w-4 h-4' : 'w-6 h-6';
        const iconSizeClass = isCompact ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5';
        const startDay = page.dayNumbers[0];
        const endDay = page.dayNumbers[page.dayNumbers.length - 1];
        const hasNextPage = page.pageNumber < page.totalPages;

        return (
          <div
            key={page.pageNumber}
            className={`print-container w-full rounded-2xl border border-slate-300 bg-white text-slate-900 shadow-2xl overflow-hidden print:rounded-none print:border-slate-300 print:shadow-none ${
              hasNextPage ? 'print-page-break' : ''
            }`}
          >
            {/* Sheet Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-[#fafcf9] flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0 space-y-1">
                {sheetContext?.trackerName.trim() ? (
                  <h1 className="font-editorial text-xl sm:text-2xl font-normal text-[#123524] break-words">
                    {sheetContext.trackerName.trim()}
                  </h1>
                ) : (
                  <div className="flex items-baseline gap-2.5 pt-1 pb-0.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 shrink-0">
                      Sheet Name:
                    </span>
                    <span className="inline-block w-56 sm:w-80 border-b border-dashed border-slate-400 h-4" />
                  </div>
                )}
                <p className="text-xs text-slate-600 font-mono tabular-nums">
                  Start: {formattedStartDate} · Days {startDay}–{endDay} of {safeDuration} ·{' '}
                  {selectedHabits.length} Habits
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <BrandMark size={30} variant="light-only" />
                <div className="text-right">
                  <span className="font-editorial text-base font-bold text-[#123524] block leading-tight">
                    Habitora
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-500">
                    Page {page.pageNumber} of {page.totalPages}
                  </span>
                </div>
              </div>
            </div>

            {/* Full Day-Spanning Habit Matrix */}
            <div className="overflow-x-auto custom-scrollbar print:overflow-visible">
              <table
                className="w-full table-fixed text-left border-collapse"
                style={{
                  minWidth: `${(isCompact ? 170 : 220) + page.dayNumbers.length * dayColMinWidthPx}px`,
                }}
              >
                <colgroup>
                  <col className={leftColClass} />
                  {page.dayNumbers.map((dayNum) => (
                    <col key={dayNum} />
                  ))}
                </colgroup>
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/90 text-xs text-slate-600">
                    <th
                      className={`py-2.5 px-4 font-semibold ${leftColClass} border-r border-slate-200`}
                    >
                      Habit
                    </th>
                    {page.dayNumbers.map((dayNum) => {
                      const { top, bottom } = getDayHeader(dayNum);
                      return (
                        <th
                          key={dayNum}
                          className="py-2 px-0.5 text-center font-mono tabular-nums border-r border-slate-100 last:border-r-0 align-middle"
                        >
                          {top && (
                            <span className="block text-[8px] uppercase text-slate-400 leading-none mb-0.5">
                              {top}
                            </span>
                          )}
                          <span
                            className={`${
                              isCompact ? 'text-[10px]' : 'text-xs'
                            } font-bold text-slate-800 leading-none block`}
                          >
                            {bottom}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200/80 text-xs">
                  {selectedHabits.map((habit, idx) => (
                    <tr key={habit.id}>
                      <td
                        className={`py-2.5 px-4 ${leftColClass} bg-white border-r border-slate-200 align-middle`}
                      >
                        <div className="flex items-start gap-1.5">
                          <span className="font-mono tabular-nums text-[11px] font-semibold text-slate-400 min-w-[1.25rem] shrink-0 mt-0.5">
                            {idx + 1}.
                          </span>
                          <span className="text-xs font-medium text-slate-900 whitespace-normal break-words leading-snug">
                            {habit.name}
                          </span>
                        </div>
                      </td>

                      {page.dayNumbers.map((dayNum) => {
                        const isChecked = Boolean(checkedCells[`${habit.id}-${dayNum}`]);
                        return (
                          <td
                            key={dayNum}
                            className="py-2 px-0.5 text-center border-r border-slate-100/80 last:border-r-0 align-middle"
                          >
                            <div
                              className={`${circleSizeClass} mx-auto rounded-full flex items-center justify-center ${
                                isChecked
                                  ? 'bg-[#183f2e] text-white border border-[#183f2e]'
                                  : 'border border-slate-300 bg-white'
                              }`}
                            >
                              {isChecked && <Check className={`${iconSizeClass} stroke-[3]`} />}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Optional Progress Graph (Light Paper) */}
            {sheetContext?.includeGraph && (
              <HabitProgressGraph
                habits={selectedHabits}
                visibleDayCount={page.dayNumbers.length}
                dayNumbers={page.dayNumbers}
                extraDaysCount={0}
                startDate={startDate}
                dayLabelMode={dayLabelMode}
                checkedCells={checkedCells}
                plottedZeroDays={plottedZeroDays}
                leftColClassName={leftColClass}
                rightSpacerClassName="w-0"
                dayColMinWidthPx={dayColMinWidthPx}
                forceLight
                hideHint
              />
            )}

            {/* Sheet Footer Notes */}
            <div className="px-5 py-2.5 border-t border-slate-200 bg-[#fafcf9] flex items-center justify-between gap-4 text-[11px] text-slate-500">
              <span>
                Habitora · Daily Consistency Sheet (Page {page.pageNumber}/{page.totalPages})
              </span>
              <span className="font-mono tabular-nums">
                Score: ____ / {selectedHabits.length * page.dayNumbers.length}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
