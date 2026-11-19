'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Download, Eye, Loader2, LogIn, Save, TrendingUp } from 'lucide-react';
import { useHabitTracker } from '@/lib/context/HabitTrackerContext';
import { DayLabelMode, Habit, HabitCategory } from '@/lib/types/tracker';
import { DEFAULT_DATE_FALLBACK, getLocalTodayYmd } from '@/lib/utils/date';
import IconTooltip from '@/components/ui/IconTooltip';
import dynamic from 'next/dynamic';
import TimePeriod from './TimePeriod';
import HabitList from './HabitList';
import PrintableSheetPages from './PrintableSheetPages';

const SheetPreviewModal = dynamic(() => import('./SheetPreviewModal'), {
  ssr: false,
});

interface CreateTrackerClientProps {
  defaultHabits: Habit[];
  initialName?: string;
  initialDuration?: number;
  headerIntro: React.ReactNode;
}

export default function CreateTrackerClient({
  defaultHabits,
  initialName = '',
  initialDuration = 30,
  headerIntro,
}: CreateTrackerClientProps) {
  const router = useRouter();
  const { createTracker, user, openAuthModal, quickSignIn, hasMounted } = useHabitTracker();

  const isPresetDuration = initialDuration === 21 || initialDuration === 30;
  const [trackerName, setTrackerName] = useState(initialName);
  const [selectedDuration, setSelectedDuration] = useState<number>(isPresetDuration ? initialDuration : 30);
  const [isCustomDuration, setIsCustomDuration] = useState(!isPresetDuration);
  const [customDaysInput, setCustomDaysInput] = useState(String(initialDuration));
  const [customStartDate, setCustomStartDate] = useState<string | null>(null);
  const startDate = customStartDate ?? (hasMounted ? getLocalTodayYmd() : DEFAULT_DATE_FALLBACK);
  const [dayLabelMode, setDayLabelMode] = useState<DayLabelMode>('numbers');
  const [includeGraph, setIncludeGraph] = useState(true);
  const [selectedHabits, setSelectedHabits] = useState<Habit[]>(defaultHabits);
  const [newHabitName, setNewHabitName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [previewMode, setPreviewMode] = useState<'sheet' | 'graph' | null>(null);
  const [checkedCells, setCheckedCells] = useState<Record<string, boolean>>({});
  const [plottedZeroDays, setPlottedZeroDays] = useState<Record<number, boolean>>({});

  const effectiveDays = isCustomDuration
    ? Math.max(1, Math.min(365, parseInt(customDaysInput, 10) || 30))
    : selectedDuration;

  const handleAddCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const colors = ['#2fe196', '#38bdf8', '#a78bfa', '#fbbf24', '#f43f5e', '#34d399'];
    const newHabit: Habit = {
      id: `custom_${newHabitName.trim().toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
      name: newHabitName.trim(),
      category: 'Lifestyle',
      color: colors[selectedHabits.length % colors.length],
      active: true,
      targetPerWeek: 7,
    };

    setSelectedHabits((prev) => [...prev, newHabit]);
    setNewHabitName('');
  };

  const handleRemoveHabit = (id: string) => {
    if (selectedHabits.length <= 1) return;
    setSelectedHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const handleSelectSuggestedHabit = (name: string, category: HabitCategory) => {
    if (selectedHabits.some((h) => h.name.toLowerCase() === name.toLowerCase())) return;
    const colors = ['#2fe196', '#38bdf8', '#a78bfa', '#fbbf24', '#f43f5e', '#34d399'];
    const newHabit: Habit = {
      id: `sugg_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
      name,
      category,
      color: colors[selectedHabits.length % colors.length],
      active: true,
      targetPerWeek: 7,
    };
    setSelectedHabits((prev) => [...prev, newHabit]);
  };

  const handleDownloadSheet = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const performSave = async () => {
    setIsSubmitting(true);
    const resolvedSaveName = trackerName.trim() || 'Habit Sheet';
    try {
      await fetch('/api/tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: resolvedSaveName,
          durationDays: effectiveDays,
          startDate,
          dayLabelMode,
          includeGraph,
          habits: selectedHabits,
        }),
      });
    } catch {
      // Proceed with local state creation even if API call fails offline
    }

    createTracker(resolvedSaveName, effectiveDays, startDate, selectedHabits, dayLabelMode, includeGraph);
    setIsSubmitting(false);
    router.push('/dashboard');
  };

  const handleSaveNow = () => {
    if (!user) {
      setShowSignInPrompt(true);
      openAuthModal(
        'Sign in to Habitora to save your sheet and manage it daily from your personal dashboard.',
        () => {
          setShowSignInPrompt(false);
          void performSave();
        }
      );
      return;
    }

    void performSave();
  };

  return (
    <>
      <main className={`flex-1 py-6 sm:py-12 ${previewMode ? 'no-print' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-8">
          {/* Page Header (hidden on print/download) */}
          <div className="no-print flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#dce8df] dark:border-emerald-900/40 pb-5 sm:pb-6">
            {headerIntro}

            <div className="inline-flex items-center self-start sm:self-auto px-3 py-1.5 rounded-xl bg-[#eaf3ed] dark:bg-emerald-900/40 text-xs text-[#183f2e] dark:text-[#2fe196] font-mono font-semibold tabular-nums whitespace-nowrap shrink-0">
              {selectedHabits.length} habits · {effectiveDays} days
            </div>
          </div>

          {/* Builder Surface */}
          <section className="rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-4 sm:p-8 lg:p-10 shadow-sm space-y-6 sm:space-y-8">
            {/* Step 1: Name + Time Period + Start Date (hidden on print/download) */}
            <div className="no-print flex flex-col lg:flex-row gap-5 sm:gap-6 items-stretch lg:items-end">
              <div className="w-full lg:flex-[5] min-w-0">
                <label
                  htmlFor="trackerName"
                  className="text-xs font-semibold text-slate-600 dark:text-emerald-300/90 block mb-1.5"
                >
                  Sheet Name (optional — leave blank to write manually)
                </label>
                <input
                  id="trackerName"
                  type="text"
                  disabled={isSubmitting}
                  value={trackerName}
                  onChange={(e) => setTrackerName(e.target.value)}
                  placeholder="Leave blank for manual title or type sheet name..."
                  className="w-full px-1 py-2 bg-transparent border-0 border-b-2 border-slate-300 dark:border-emerald-800/70 rounded-none text-slate-900 dark:text-white text-base font-medium placeholder:text-slate-400 dark:placeholder:text-emerald-300/40 focus:outline-none focus:border-[#183f2e] dark:focus:border-[#2fe196] disabled:opacity-60 transition-colors"
                />
              </div>

              <div className="w-full lg:flex-[4] min-w-0">
                <TimePeriod
                  selectedDuration={selectedDuration}
                  isCustomDuration={isCustomDuration}
                  setIsCustomDuration={setIsCustomDuration}
                  customDaysInput={customDaysInput}
                  setCustomDaysInput={setCustomDaysInput}
                  setSelectedDuration={setSelectedDuration}
                />
              </div>

              <div className="w-full lg:flex-[3] min-w-0">
                <label
                  htmlFor="startDate"
                  className="text-xs font-semibold text-slate-600 dark:text-emerald-300/90 block mb-1.5"
                >
                  Starting Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  disabled={isSubmitting}
                  value={startDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="block w-full min-h-[42px] px-3 py-2 rounded-xl bg-[#fafcf9] dark:bg-emerald-950/60 border border-[#dce8df] dark:border-emerald-900/50 text-slate-900 dark:text-white text-sm font-mono tabular-nums focus:outline-none focus:border-[#183f2e] dark:focus:border-[#2fe196] disabled:opacity-60 transition-colors"
                />
              </div>
            </div>

            {/* Unified Habit Sheet (Desktop table + Mobile non-scrolling vertical builder) */}
            <div className="pt-1">
              <HabitList
                trackerName={trackerName}
                durationDays={effectiveDays}
                startDate={startDate}
                dayLabelMode={dayLabelMode}
                setDayLabelMode={setDayLabelMode}
                includeGraph={includeGraph}
                setIncludeGraph={setIncludeGraph}
                selectedHabits={selectedHabits}
                handleRemoveHabit={handleRemoveHabit}
                handleAddCustomHabit={handleAddCustomHabit}
                newHabitName={newHabitName}
                setNewHabitName={setNewHabitName}
                handleSelectSuggestedHabit={handleSelectSuggestedHabit}
                checkedCells={checkedCells}
                setCheckedCells={setCheckedCells}
                plottedZeroDays={plottedZeroDays}
                setPlottedZeroDays={setPlottedZeroDays}
                onOpenPreview={(mode) => setPreviewMode(mode)}
              />
            </div>

            {/* Inline Sign-In Prompt if user clicked Save Now while signed out */}
            {!user && showSignInPrompt && (
              <div className="no-print p-4 rounded-2xl bg-[#eaf3ed] dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs sm:text-sm text-[#123524] dark:text-emerald-100 font-medium">
                  Sign in to save your habit sheet and access your daily management dashboard.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    quickSignIn();
                    setShowSignInPrompt(false);
                    void performSave();
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In to Habitora</span>
                </button>
              </div>
            )}

            {/* Footer Actions: Cleanly aligned on Mobile & Desktop */}
            <div className="no-print pt-6 border-t border-slate-200 dark:border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto min-h-[42px] inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-emerald-900/50 sm:border-transparent text-slate-600 hover:text-slate-900 dark:text-emerald-200 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-emerald-900/40 transition-colors whitespace-nowrap shrink-0"
              >
                Back
              </Link>

              <div className="flex flex-wrap items-center justify-end gap-2.5 w-full sm:w-auto">
                <IconTooltip label="Preview printable sheet layout" position="top">
                  <button
                    type="button"
                    title="Preview Sheet"
                    disabled={isSubmitting}
                    onClick={() => setPreviewMode('sheet')}
                    className="flex-1 sm:flex-none min-w-[130px] min-h-[42px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 dark:border-emerald-700/60 bg-white dark:bg-[#0b241b] text-slate-800 dark:text-emerald-100 hover:bg-slate-50 dark:hover:bg-emerald-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#183f2e] dark:text-[#2fe196]" />
                    <span>Preview Sheet</span>
                  </button>
                </IconTooltip>

                {includeGraph && (
                  <IconTooltip label="Preview progress graph" position="top">
                    <button
                      type="button"
                      title="Preview Progress Graph"
                      disabled={isSubmitting}
                      onClick={() => setPreviewMode('graph')}
                      className="md:hidden flex-1 min-w-[130px] min-h-[42px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-300 dark:border-emerald-700/60 bg-white dark:bg-[#0b241b] text-slate-800 dark:text-emerald-100 hover:bg-slate-50 dark:hover:bg-emerald-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <TrendingUp className="w-4 h-4 text-[#183f2e] dark:text-[#2fe196]" />
                      <span>Preview Graph</span>
                    </button>
                  </IconTooltip>
                )}

                <IconTooltip label="Print or download PDF sheet" position="top">
                  <button
                    type="button"
                    title="Download Sheet as PDF"
                    disabled={isSubmitting}
                    onClick={handleDownloadSheet}
                    className="flex-1 sm:flex-none min-w-[140px] min-h-[42px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 dark:border-emerald-700/60 bg-white dark:bg-[#0b241b] text-slate-800 dark:text-emerald-100 hover:bg-slate-50 dark:hover:bg-emerald-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#183f2e] dark:text-[#2fe196]" />
                    <span>Download Sheet</span>
                  </button>
                </IconTooltip>

                <IconTooltip label="Save sheet & track online" position="top">
                  <button
                    type="button"
                    title="Save Sheet Online"
                    onClick={handleSaveNow}
                    aria-busy={isSubmitting}
                    disabled={isSubmitting || selectedHabits.length === 0}
                    className="flex-1 sm:flex-none min-w-[130px] min-h-[42px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Now</span>
                      </>
                    )}
                  </button>
                </IconTooltip>
              </div>
            </div>
          </section>
        </div>
      </main>

      {!previewMode && (
        <div className="hidden print:block">
          <PrintableSheetPages
            trackerName={trackerName}
            durationDays={effectiveDays}
            startDate={startDate}
            dayLabelMode={dayLabelMode}
            includeGraph={includeGraph}
            selectedHabits={selectedHabits}
            checkedCells={checkedCells}
            plottedZeroDays={plottedZeroDays}
          />
        </div>
      )}

      {previewMode ? (
        <SheetPreviewModal
          isOpen={Boolean(previewMode)}
          initialView={previewMode}
          onClose={() => setPreviewMode(null)}
          onDownload={handleDownloadSheet}
          trackerName={trackerName}
          durationDays={effectiveDays}
          startDate={startDate}
          dayLabelMode={dayLabelMode}
          includeGraph={includeGraph}
          selectedHabits={selectedHabits}
          checkedCells={checkedCells}
          plottedZeroDays={plottedZeroDays}
        />
      ) : null}
    </>
  );
}
