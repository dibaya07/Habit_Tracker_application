'use client';

import React, { useContext, useState } from 'react';
import ProgressLineGraph, { GraphDayPoint } from '@/components/tracker/ProgressLineGraph';
import { DayLabelMode, Habit } from '@/lib/types/tracker';
import { addUtcDays, getUtcDayNumber, getUtcWeekdayNarrow, parseUtcDate } from '@/lib/utils/date';
import { SheetContext } from '../context/context';

interface HabitProgressGraphProps {
  habits: Habit[];
  durationDays: number;
  // habits: Habit[];
  // visibleDayCount: number;
  dayNumbers?: number[];
  // extraDaysCount: number;
  startDate: string;
  // dayLabelMode: DayLabelMode;
  checkedCells: Record<string, boolean>;
  plottedZeroDays?: Record<number, boolean>;
  // onPlotPointClick?: (dayNum: number, count: number) => void;
  // onClearPoints?: () => void;
  onRemoveGraph?: () => void;
  forceLight?: boolean;
  hideHint?: boolean;
  leftColClassName?: string;
  rightSpacerClassName?: string;
  dayColMinWidthPx?: number;
  rightLabel?: string;
   setCheckedCells?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    setPlottedZeroDays?: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}

export default function HabitProgressGraph({
  habits,
  durationDays,
  // visibleDayCount,
  dayNumbers,
  // extraDaysCount,
  startDate,
  // dayLabelMode,
  checkedCells,
  plottedZeroDays = {},
  // onPlotPointClick,
  // onClearPoints,
  onRemoveGraph,
  forceLight = false,
  hideHint = false,
  leftColClassName = 'w-[250px] sm:w-[300px] lg:w-[340px]',
  rightSpacerClassName = 'w-[84px]',
  dayColMinWidthPx = 36,
  rightLabel,
   setCheckedCells: externalSetCheckedCells,
  setPlottedZeroDays: externalSetPlottedZeroDays,
}: HabitProgressGraphProps) {
  const sheetContext = useContext(SheetContext)

  const visibleDayCount = Math.min(10, Math.max(1, durationDays));
  const extraDaysCount = Math.max(0, durationDays - visibleDayCount);
  const [internalCheckedCells, setInternalCheckedCells] = useState<Record<string, boolean>>({});
    const [internalPlottedZeroDays, setInternalPlottedZeroDays] = useState<Record<number, boolean>>({});

  const setCheckedCells = externalSetCheckedCells ?? setInternalCheckedCells;
  const setPlottedZeroDays = externalSetPlottedZeroDays ?? setInternalPlottedZeroDays;

  const daysArray =
    dayNumbers && dayNumbers.length > 0
      ? dayNumbers
      : Array.from({ length: visibleDayCount }, (_, i) => i + 1);
  const baseDate = parseUtcDate(startDate);

  const days: GraphDayPoint[] = daysArray.map((dayNum) => {
    let topLabel = '';
    let bottomLabel = String(dayNum);

    if (sheetContext?.dayLabelMode === 'dates') {
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

   const onPlotPointClick = (dayNum: number, targetCount: number) => {
    let currentCount = 0;
    habits.forEach((h) => {
      if (checkedCells[`${h.id}-${dayNum}`]) currentCount += 1;
    });

    const isAlreadySameZero = targetCount === 0 && currentCount === 0 && plottedZeroDays[dayNum];
    const isAlreadySameCount = targetCount > 0 && currentCount === targetCount;

    setCheckedCells((prev) => {
      const next = { ...prev };
      habits.forEach((h, idx) => {
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

   const onClearPoints = () => {
    setCheckedCells({});
    setPlottedZeroDays({});
  };

  

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
