'use client';

import React from 'react';
import { Check, Plus } from 'lucide-react';
import { Habit, HabitCategory } from '@/lib/types/tracker';

interface QuickSuggestionProps {
  selectedHabits: Habit[];
  handleSelectSuggestedHabit: (name: string, category: HabitCategory) => void;
}

const SUGGESTIONS: Array<{ name: string; cat: HabitCategory }> = [
  { name: '10,000 Steps', cat: 'Health' },
  { name: 'Cold Shower', cat: 'Wellness' },
  { name: 'Journaling', cat: 'Wellness' },
  { name: 'No Social Media before 10 AM', cat: 'Productivity' },
  { name: 'Read 15 Pages', cat: 'Learning' },
  { name: '8 Hours Sleep', cat: 'Health' },
];

export default function QuickSuggestions({
  selectedHabits,
  handleSelectSuggestedHabit,
}: QuickSuggestionProps) {
  return (
    <div className="pt-4 border-t border-slate-200 dark:border-emerald-900/40">
      <span className="text-xs font-semibold text-slate-600 dark:text-emerald-300 block mb-2.5">
        Quick Suggestions
      </span>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((sugg) => {
          const isAdded = selectedHabits.some(
            (h) => h.name.toLowerCase() === sugg.name.toLowerCase()
          );

          return (
            <button
              key={sugg.name}
              type="button"
              disabled={isAdded}
              onClick={() => handleSelectSuggestedHabit(sugg.name, sugg.cat)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                isAdded
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-[#2fe196] opacity-80 cursor-default'
                  : 'bg-[#fafcf9] dark:bg-emerald-950/60 border-slate-200 dark:border-emerald-800/50 text-slate-700 dark:text-emerald-100 hover:border-[#183f2e] dark:hover:border-[#2fe196] hover:text-[#123524] dark:hover:text-white cursor-pointer'
              }`}
            >
              {isAdded ? (
                <Check className="w-3 h-3 stroke-[2.5]" />
              ) : (
                <Plus className="w-3 h-3 stroke-[2.5]" />
              )}
              <span>{sugg.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
