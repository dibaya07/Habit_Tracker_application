"use client";
import React, { useContext, useState } from "react";
import CustomHabitForm from "../CustomHabitForm";
import QuickSuggestions from "../QuickSuggestions";
import { Habit, HabitCategory } from "@/lib/types/tracker";
import { Plus, TrendingUp } from "lucide-react";
import { SheetContext } from "../../context/context";

interface AddHabitBtnProps {
  newHabitName: string;
  setNewHabitName: (value: string) => void;
  // handleAddCustomHabit: (value: React.FormEvent) => void;
  selectedHabits: Habit[];
  setSelectedHabits:React.Dispatch<React.SetStateAction<Habit[]>>;
  handleSelectSuggestedHabit: (name: string, category: HabitCategory) => void;
  // includeGraph: boolean;
  // setIncludeGraph: (value: boolean) => void;
}

export default function AddHabitBtn({
  newHabitName,
  setNewHabitName,
  // handleAddCustomHabit,
  selectedHabits,
  setSelectedHabits,
  handleSelectSuggestedHabit,
  // includeGraph,
  // setIncludeGraph,
}: AddHabitBtnProps) {
  const sheetContext = useContext(SheetContext);
  const [isAddingHabit, setIsAddingHabit] = useState(false);

   const handleAddCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    const newHabit: Habit = {
      name: newHabitName.trim(),
      active: true,
    };

    setSelectedHabits((prev) => [...prev, newHabit]);
    setNewHabitName("");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    handleAddCustomHabit(e);
    setIsAddingHabit(false);
  };
  return (
    <div className="no-print px-4 sm:px-5 py-3.5 border-t border-slate-200/80 dark:border-emerald-900/40 bg-[#fafcf9]/80 dark:bg-[#091f17]">
      {isAddingHabit ? (
        <div className="p-4 sm:p-5 rounded-2xl border border-[#dce8df] dark:border-emerald-900/50 bg-white dark:bg-emerald-950/30 space-y-4">
          <CustomHabitForm
            handleAddCustomHabit={handleFormSubmit}
            newHabitName={newHabitName}
            setNewHabitName={setNewHabitName}
            onCancel={() => {
              setNewHabitName("");
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

            {!sheetContext?.includeGraph && (
              <button
                type="button"
                onClick={() => sheetContext?.setIncludeGraph(true)}
                className="flex-1 sm:flex-none min-h-[40px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-[#dce8df] dark:border-emerald-800/60 bg-white dark:bg-emerald-950/50 hover:border-[#183f2e] dark:hover:border-[#2fe196] text-xs font-semibold text-[#123524] dark:text-emerald-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                <TrendingUp className="w-4 h-4 text-[#183f2e] dark:text-[#2fe196]" />
                <span>Add Progress Graph</span>
              </button>
            )}
          </div>

          <span className="hidden md:inline text-xs text-slate-500 dark:text-emerald-300/70">
            Tip: Toggle cells to preview checkmarks and graph line, or leave
            blank before downloading.
          </span>
        </div>
      )}
    </div>
  );
}
