'use client';

import React, { useState } from 'react';
import { Check, Loader2, Plus, X } from 'lucide-react';
import { useHabitTracker } from '@/lib/context/HabitTrackerContext';
import BrandMark from '@/components/ui/BrandMark';

const QUICK_SUGGESTIONS = [
  '10,000 Steps',
  'Cold Shower',
  'Journaling',
  'No Social Media before 10 AM',
  'Read 15 Pages',
  '8 Hours Sleep',
];

export default function AddHabitModal() {
  const { isCreateModalOpen, setIsCreateModalOpen, tracker, addHabit } = useHabitTracker();
  const [habitName, setHabitName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isCreateModalOpen) return null;

  const existingNames = new Set(
    tracker.habits.map((h) => h.name.trim().toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = habitName.trim();
    if (!trimmed || isSaving) return;

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 150));
      addHabit(trimmed, 'Health');
      setHabitName('');
      setIsCreateModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSuggestion = (name: string) => {
    if (existingNames.has(name.toLowerCase()) || isSaving) return;
    addHabit(name, 'Health');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#091f17] border border-slate-200 dark:border-emerald-800/60 p-6 sm:p-7 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-emerald-900/50 pb-4">
          <div className="flex items-center gap-3">
            <BrandMark size={38} variant="glow" />
            <div>
              <span className="text-[10px] font-semibold tracking-widest text-emerald-700 dark:text-[#2fe196] uppercase block">
                {tracker.name}
              </span>
              <h3 className="font-editorial text-2xl font-normal text-slate-900 dark:text-white leading-tight">
                Add Habit to Sheet
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(false)}
            aria-label="Close add habit modal"
            className="p-2 rounded-full text-slate-400 hover:text-slate-900 dark:text-emerald-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form (No category selector and no days selector for existing sheet) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="add-existing-habit-name"
              className="text-xs font-semibold text-slate-700 dark:text-emerald-200 block mb-1.5 uppercase tracking-wider"
            >
              Habit Name
            </label>
            <input
              id="add-existing-habit-name"
              type="text"
              autoFocus
              disabled={isSaving}
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              placeholder="e.g. Read 20 mins, Morning stretch..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-emerald-950/70 border border-slate-300 dark:border-emerald-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#183f2e] dark:focus:border-[#2fe196] disabled:opacity-60 transition-colors"
            />
          </div>

          {/* Quick Suggestions without categories */}
          <div className="pt-2 border-t border-slate-200 dark:border-emerald-900/40">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-emerald-400 block mb-2 font-semibold">
              Quick Suggestions
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_SUGGESTIONS.map((name) => {
                const isAdded = existingNames.has(name.toLowerCase());
                return (
                  <button
                    key={name}
                    type="button"
                    disabled={isAdded || isSaving}
                    onClick={() => handleAddSuggestion(name)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                      isAdded
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-[#2fe196] opacity-75 cursor-default'
                        : 'bg-slate-50 dark:bg-emerald-950/60 border-slate-200 dark:border-emerald-800/40 text-slate-700 dark:text-emerald-200 hover:border-[#183f2e] dark:hover:border-[#2fe196] cursor-pointer'
                    }`}
                  >
                    {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    <span>{name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-emerald-900/40">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-emerald-200 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              aria-busy={isSaving}
              disabled={isSaving || !habitName.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Habit</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
