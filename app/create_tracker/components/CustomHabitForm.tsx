'use client';

import React from 'react';
import { Plus, X } from 'lucide-react';

interface CustomHabitFormProps {
  handleAddCustomHabit: (e: React.FormEvent) => void;
  newHabitName: string;
  setNewHabitName: (name: string) => void;
  onCancel: () => void;
}

export default function CustomHabitForm({
  handleAddCustomHabit,
  newHabitName,
  setNewHabitName,
  onCancel,
}: CustomHabitFormProps) {
  return (
    <form
      onSubmit={handleAddCustomHabit}
      className="flex flex-col sm:flex-row sm:items-end gap-3"
    >
      <div className="flex-1">
        <label
          htmlFor="newHabitInput"
          className="text-xs font-medium text-slate-600 dark:text-emerald-300/80 block mb-1"
        >
          New Habit Name
        </label>
        <input
          id="newHabitInput"
          type="text"
          autoFocus
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onCancel();
            }
          }}
          placeholder="Write habit name (e.g. Read 20 mins)..."
          className="w-full px-1 py-2 bg-transparent border-0 border-b-2 border-slate-300 dark:border-emerald-800/70 rounded-none text-slate-900 dark:text-white text-sm font-medium placeholder:text-slate-400 dark:placeholder:text-emerald-300/40 focus:outline-none focus:border-[#183f2e] dark:focus:border-[#2fe196] transition-colors"
        />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="submit"
          disabled={!newHabitName.trim()}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] font-semibold text-xs disabled:opacity-40 transition-all whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add</span>
        </button>

        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel adding habit"
          className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-emerald-800/60 text-slate-600 dark:text-emerald-200 hover:bg-slate-100 dark:hover:bg-emerald-900/40 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>Cancel</span>
        </button>
      </div>
    </form>
  );
}
