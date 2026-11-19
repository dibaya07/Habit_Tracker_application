'use client';

import React from 'react';
import ProgressLineGraph, { GraphDayPoint } from '@/components/tracker/ProgressLineGraph';
import { DayLabelMode, Habit } from '@/lib/types/tracker';
import { addUtcDays, getUtcDayNumber, getUtcWeekdayNarrow, parseUtcDate } from '@/lib/utils/date';

interface HabitProgressGraphProps {
  habits: Habit[];
  visibleDayCount: number;
  dayNumbers?: number[];
  extraDaysCount: number;
  startDate: string;
  dayLabelMode: DayLabelMode;
  checkedCells: Record<string, boolean>;
  plottedZeroDays?: Record<number, boolean>;
  onPlotPointClick?: (dayNum: number, count: number) => void;
  onClearPoints?: () => void;
  onRemoveGraph?: () => void;
  forceLight?: boolean;
  hideHint?: boolean;
  leftColClassName?: string;
  rightSpacerClassName?: string;
  dayColMinWidthPx?: number;
  rightLabel?: string;
}

export default function HabitProgressGraph({
  habits,
  visibleDayCount,
  dayNumbers,
  extraDaysCount,
  startDate,
  dayLabelMode,
  checkedCells,
  plottedZeroDays = {},
  onPlotPointClick,
  onClearPoints,
  onRemoveGraph,
  forceLight = false,
  hideHint = false,
  leftColClassName = 'w-[250px] sm:w-[300px] lg:w-[340px]',
  rightSpacerClassName = 'w-[84px]',
  dayColMinWidthPx = 36,
  rightLabel,
}: HabitProgressGraphProps) {
  const daysArray =
    dayNumbers && dayNumbers.length > 0
      ? dayNumbers
      : Array.from({ length: visibleDayCount }, (_, i) => i + 1);
  const baseDate = parseUtcDate(startDate);

  const days: GraphDayPoint[] = daysArray.map((dayNum) => {
    let topLabel = '';
    let bottomLabel = String(dayNum);

    if (dayLabelMode === 'dates') {
      const d = addUtcDays(baseDate, dayNum - 1);
      topLabel = getUtcWeekdayNarrow(d);
      bottomLabel = String(getUtcDayNumber(d));
    }

    let count = 0;
    habits.forEach((h) => {
      if (checkedCells[`${h.id}-${dayNum}`]) {
        count += 1;
      }
    });

    const completedCount =
      count > 0
        ? Math.min(habits.length, count)
        : plottedZeroDays[dayNum]
        ? 0
        : null;

    return {
      dayNum,
      topLabel,
      bottomLabel,
      completedCount,
    };
  });

  return (
    <ProgressLineGraph
      title="Progress Graph"
      subtitle={`Left numbers show total habits completed per day (0 to ${Math.max(1, habits.length)})`}
      interactiveHint={hideHint ? undefined : 'Click any grid point or check habits above to auto-connect'}
      maxHabits={Math.max(1, habits.length)}
      days={days}
      extraDaysCount={extraDaysCount}
      rightLabel={rightLabel}
      leftColClassName={leftColClassName}
      rightSpacerClassName={rightSpacerClassName}
      dayColMinWidthPx={dayColMinWidthPx}
      onPointClick={onPlotPointClick}
      onClearPoints={onClearPoints}
      onRemoveGraph={onRemoveGraph}
      forceLight={forceLight}
    />
  );
}
