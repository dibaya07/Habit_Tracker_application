import { Habit } from '@/lib/types/tracker';
import { Trash2 } from 'lucide-react';
import React from 'react'


interface HabitListMobileViewProps {
    selectedHabits: Habit[];
    confirmDeleteHabitId: string | null;
    setConfirmDeleteHabitId : (value: string | null)=>void,
    handleRemoveHabit: (id: string) => void;
//   trackerName: string;
//   durationDays: number;
//   startDate: string;
//   dayLabelMode: DayLabelMode;
//   setDayLabelMode: (mode: DayLabelMode) => void;
//   includeGraph: boolean;
//   setIncludeGraph: (value: boolean) => void;
//   handleAddCustomHabit: (e: React.FormEvent) => void;
//   newHabitName: string;
//   setNewHabitName: (name: string) => void;
//   handleSelectSuggestedHabit: (name: string, category: HabitCategory) => void;
//   checkedCells?: Record<string, boolean>;
//   setCheckedCells?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
//   plottedZeroDays?: Record<number, boolean>;
//   setPlottedZeroDays?: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
//   onOpenPreview?: (mode: 'sheet' | 'graph') => void;
}

export default function HabitListMobileView({selectedHabits, confirmDeleteHabitId, setConfirmDeleteHabitId, handleRemoveHabit}: HabitListMobileViewProps) {

    
  return (
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
  )
}
