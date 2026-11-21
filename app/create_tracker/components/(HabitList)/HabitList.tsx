"use client";

import React, { useState } from "react";
import { Check, Eye, Plus, Trash2, TrendingUp } from "lucide-react";
import { DayLabelMode, Habit, HabitCategory } from "@/lib/types/tracker";
import {
  addUtcDays,
  formatUtcFullDate,
  getUtcDayNumber,
  getUtcWeekdayNarrow,
  parseUtcDate,
} from "@/lib/utils/date";
import BrandMark from "@/components/ui/BrandMark";
import IconTooltip from "@/components/ui/IconTooltip";
import DayLabelDropdown from "@/components/tracker/DayLabelDropdown";
import CustomHabitForm from "../CustomHabitForm";
import QuickSuggestions from "../QuickSuggestions";
import HabitProgressGraph from "../HabitProgressGraph";

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
  setCheckedCells?: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  plottedZeroDays?: Record<number, boolean>;
  setPlottedZeroDays?: React.Dispatch<
    React.SetStateAction<Record<number, boolean>>
  >;
  onOpenPreview?: (mode: "sheet" | "graph") => void;
  confirmDeleteHabitId: string | null;
  setConfirmDeleteHabitId: (value: null | string) => void;
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
  confirmDeleteHabitId,
  setConfirmDeleteHabitId,
}: HabitListProp) {
  // const [isAddingHabit, setIsAddingHabit] = useState(false);
  // const [confirmDeleteHabitId, setConfirmDeleteHabitId] = useState<string | null>(null);
  const [internalCheckedCells, setInternalCheckedCells] = useState<
    Record<string, boolean>
  >({});
  const [internalPlottedZeroDays, setInternalPlottedZeroDays] = useState<
    Record<number, boolean>
  >({});

  const checkedCells = externalCheckedCells ?? internalCheckedCells;
  const setCheckedCells = externalSetCheckedCells ?? setInternalCheckedCells;
  const plottedZeroDays = externalPlottedZeroDays ?? internalPlottedZeroDays;
  const setPlottedZeroDays =
    externalSetPlottedZeroDays ?? setInternalPlottedZeroDays;

  // Keep only 10 days in desktop sheet view; show "+X more" in the last column when durationDays > 10
  // const visibleDayCount = Math.min(10, Math.max(1, durationDays));
  // const extraDaysCount = Math.max(0, durationDays - visibleDayCount);
  // const daysArray = Array.from({ length: visibleDayCount }, (_, i) => i + 1);

  // const handlePlotPointClick = (dayNum: number, targetCount: number) => {
  //   let currentCount = 0;
  //   selectedHabits.forEach((h) => {
  //     if (checkedCells[`${h.id}-${dayNum}`]) currentCount += 1;
  //   });

  //   const isAlreadySameZero = targetCount === 0 && currentCount === 0 && plottedZeroDays[dayNum];
  //   const isAlreadySameCount = targetCount > 0 && currentCount === targetCount;

  //   setCheckedCells((prev) => {
  //     const next = { ...prev };
  //     selectedHabits.forEach((h, idx) => {
  //       const key = `${h.id}-${dayNum}`;
  //       if (isAlreadySameCount || targetCount === 0) {
  //         delete next[key];
  //       } else {
  //         next[key] = idx < targetCount;
  //       }
  //     });
  //     return next;
  //   });

  //   setPlottedZeroDays((prev) => {
  //     const next = { ...prev };
  //     if (targetCount === 0 && !isAlreadySameZero) {
  //       next[dayNum] = true;
  //     } else {
  //       delete next[dayNum];
  //     }
  //     return next;
  //   });
  // };

  // const handleClearPoints = () => {
  //   setCheckedCells({});
  //   setPlottedZeroDays({});
  // };

  return (
    <div className="px-4 sm:px-5 py-3 border-t border-slate-200 dark:border-emerald-900/40 bg-[#fafcf9] dark:bg-[#0b241b]/60 flex items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-emerald-300/70">
      <span>Habitora · Daily Consistency Sheet</span>
      <span className="font-mono tabular-nums">
        Score: ____ / {selectedHabits.length * durationDays}
      </span>
    </div>
  );
}
