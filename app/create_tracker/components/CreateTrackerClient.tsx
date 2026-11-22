"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, Eye, Loader2, LogIn, Save, TrendingUp } from "lucide-react";
import { useHabitTracker } from "@/lib/context/HabitTrackerContext";
import { DayLabelMode, Habit, HabitCategory } from "@/lib/types/tracker";
import { DEFAULT_DATE_FALLBACK, getLocalTodayYmd } from "@/lib/utils/date";
import IconTooltip from "@/components/ui/IconTooltip";
import dynamic from "next/dynamic";
import TimePeriod from "./TimePeriod";
import HabitList from "./(HabitList)/HabitList";
import PrintableSheetPages from "./PrintableSheetPages";
import HeaderIntro from "./HeaderIntro";
import SheetNameInputArea from "./SheetNameInputArea";
import FooterActions from "./FooterActions";
import SheetHeader from "./(HabitList)/SheetHeader";
import HabitListMobileView from "./(HabitList)/HabitListMobileView";
import DesktopViewHabitList from "./(HabitList)/DesktopViewHabitList";
import AddHabitBtn from "./(HabitList)/AddHabitBtn";
import GraphMobileView from "./(HabitList)/GraphMobileView";
import HabitProgressGraph from "./HabitProgressGraph";
import { SheetContext } from "../context/context";

const SheetPreviewModal = dynamic(() => import("./SheetPreviewModal"), {
  ssr: false,
});

interface CreateTrackerClientProps {
  defaultHabits: Habit[];
  initialName?: string;
  initialDuration?: number;
  // headerIntro: React.ReactNode;
}

export default function CreateTrackerClient({
  defaultHabits,
  // initialName = "",
  initialDuration = 30,
}: CreateTrackerClientProps) {
  const router = useRouter();
  const { createTracker, user, openAuthModal, quickSignIn, hasMounted } =
    useHabitTracker();

  //Context
  const sheetContext = useContext(SheetContext)
   if (!sheetContext){
    throw new Error("something is wrong")
  }
  const {trackerName,customDaysInput,customStartDate, dayLabelMode,includeGraph} = sheetContext

  const isPresetDuration = initialDuration === 21 || initialDuration === 30;
  // const [trackerName, setTrackerName] = useState(initialName);
  // const [trackerName, setTrackerName] = useState("");
  const [selectedDuration, setSelectedDuration] = useState<number>(
    isPresetDuration ? initialDuration : 30,
  );
  const [isCustomDuration, setIsCustomDuration] = useState(!isPresetDuration);
  // const currentDate = new Date().toLocaleDateString("en-CA");
  // const startDate = customStartDate ?? currentDate;

  // (hasMounted ? getLocalTodayYmd() : DEFAULT_DATE_FALLBACK);
  const startDate =
    customStartDate ??
    (hasMounted ? getLocalTodayYmd() : DEFAULT_DATE_FALLBACK);
  // const [dayLabelMode, setDayLabelMode] = useState<DayLabelMode>("numbers");
  // const [includeGraph, setIncludeGraph] = useState(true);
  const [selectedHabits, setSelectedHabits] = useState<Habit[]>(defaultHabits);
  const [newHabitName, setNewHabitName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [previewMode, setPreviewMode] = useState<"sheet" | "graph" | null>(
    null,
  );
  const [confirmDeleteHabitId, setConfirmDeleteHabitId] = useState<
    string | null
  >(null);
  const [checkedCells, setCheckedCells] = useState<Record<string, boolean>>({});
  const [plottedZeroDays, setPlottedZeroDays] = useState<
    Record<number, boolean>
  >({});

  const effectiveDays = isCustomDuration
    ? Math.max(1, Math.min(365, parseInt(customDaysInput, 10) || 30))
    : selectedDuration;

  const handleAddCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const colors = [
      "#2fe196",
      "#38bdf8",
      "#a78bfa",
      "#fbbf24",
      "#f43f5e",
      "#34d399",
    ];
    const newHabit: Habit = {
      id: `custom_${newHabitName.trim().toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
      name: newHabitName.trim(),
      category: "Lifestyle",
      color: colors[selectedHabits.length % colors.length],
      active: true,
      targetPerWeek: 7,
    };

    setSelectedHabits((prev) => [...prev, newHabit]);
    setNewHabitName("");
  };

  const handleRemoveHabit = (id: string) => {
    if (selectedHabits.length <= 1) return;
    setSelectedHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const handleSelectSuggestedHabit = (
    name: string,
    category: HabitCategory,
  ) => {
    if (selectedHabits.some((h) => h.name.toLowerCase() === name.toLowerCase()))
      return;
    const colors = [
      "#2fe196",
      "#38bdf8",
      "#a78bfa",
      "#fbbf24",
      "#f43f5e",
      "#34d399",
    ];
    const newHabit: Habit = {
      id: `sugg_${name.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
      name,
      category,
      color: colors[selectedHabits.length % colors.length],
      active: true,
      targetPerWeek: 7,
    };
    setSelectedHabits((prev) => [...prev, newHabit]);
  };

  const handleDownloadSheet = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const performSave = async () => {
    setIsSubmitting(true);
    const resolvedSaveName = sheetContext?.trackerName.trim() || "Habit Sheet";
    try {
      await fetch("/api/tracker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

    createTracker(
      resolvedSaveName,
      effectiveDays,
      startDate,
      selectedHabits,
      sheetContext.dayLabelMode,
      sheetContext.includeGraph,
    );
    setIsSubmitting(false);
    router.push("/dashboard");
  };

  const handleSaveNow = () => {
    if (!user) {
      setShowSignInPrompt(true);
      openAuthModal(
        "Sign in to Habitora to save your sheet and manage it daily from your personal dashboard.",
        () => {
          setShowSignInPrompt(false);
          void performSave();
        },
      );
      return;
    }

    void performSave();
  };

  return (
    <>
      <main className={`flex-1 py-6 sm:py-12 ${previewMode ? "no-print" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-8">
          {/* Page Header (hidden on print/download) */}
          <HeaderIntro length={selectedHabits.length} days={effectiveDays} />

          {/* Builder Surface */}
          <section className="rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-4 sm:p-8 lg:p-10 shadow-sm space-y-6 sm:space-y-8">
            {/* Step 1: Name + Time Period + Start Date (hidden on print/download) */}
            <div className="no-print flex flex-col lg:flex-row gap-5 sm:gap-6 items-stretch lg:items-end">
              <SheetNameInputArea
                isSubmitting={isSubmitting}
                // trackerName={sheetContext?.trackerName}
                // setTrackerName={sheetContext?.setTrackerName}
                startDate={startDate}
                // setCustomStartDate={setCustomStartDate}
              />
              <div className="w-full lg:flex-[4] min-w-0">
                <TimePeriod
                  selectedDuration={selectedDuration}
                  isCustomDuration={isCustomDuration}
                  setIsCustomDuration={setIsCustomDuration}
                  // customDaysInput={customDaysInput}
                  // setCustomDaysInput={setCustomDaysInput}
                  setSelectedDuration={setSelectedDuration}
                />
              </div>
            </div>

            {/* Unified Habit Sheet (Desktop table + Mobile non-scrolling vertical builder) */}
            <div className="pt-1">
              <div className="space-y-4">
                {/* Interactive Sheet Builder Container */}
                <div
                  id="create-tracker-sheet"
                  className="no-print rounded-2xl border border-[#dce8df] dark:border-emerald-900/50 bg-white dark:bg-[#081d15] shadow-xs overflow-hidden"
                >
                  <SheetHeader
                    // trackerName={sheetContext?.trackerName}
                    // dayLabelMode={dayLabelMode}
                    // setDayLabelMode={setDayLabelMode}
                    startDate={startDate}
                  />
                  <HabitListMobileView
                    selectedHabits={selectedHabits}
                    confirmDeleteHabitId={confirmDeleteHabitId}
                    setConfirmDeleteHabitId={setConfirmDeleteHabitId}
                    handleRemoveHabit={handleRemoveHabit}
                  />
                  <DesktopViewHabitList
                    durationDays={effectiveDays}
                    selectedHabits={selectedHabits}
                    confirmDeleteHabitId={confirmDeleteHabitId}
                    setConfirmDeleteHabitId={setConfirmDeleteHabitId}
                    handleRemoveHabit={handleRemoveHabit}
                    checkedCells={checkedCells}
                    setCheckedCells={setCheckedCells}
                    setPlottedZeroDays={setPlottedZeroDays}
                    // dayLabelMode={dayLabelMode}
                    startDate={startDate}
                  />
                  <AddHabitBtn
                    newHabitName={newHabitName}
                    setNewHabitName={setNewHabitName}
                    handleAddCustomHabit={handleAddCustomHabit}
                    selectedHabits={selectedHabits}
                    handleSelectSuggestedHabit={handleSelectSuggestedHabit}
                    // includeGraph={includeGraph}
                    // setIncludeGraph={setIncludeGraph}
                  />
                  <GraphMobileView
                    // includeGraph={includeGraph}
                    // setIncludeGraph={setIncludeGraph}
                    onOpenPreview={(mode) => setPreviewMode(mode)}
                  />
                  {sheetContext.includeGraph && (
                    <div className="hidden md:block">
                      <HabitProgressGraph
                        habits={selectedHabits}
                        durationDays={effectiveDays}
                        startDate={startDate}
                        // dayLabelMode={sheetContext.dayLabelMode}
                        checkedCells={checkedCells}
                        plottedZeroDays={plottedZeroDays}
                        onRemoveGraph={() => sheetContext.setIncludeGraph(false)}
                        setCheckedCells={setCheckedCells}
                        setPlottedZeroDays={setPlottedZeroDays}
                      />
                    </div>
                  )}
                  <HabitList
                    durationDays={effectiveDays}
                    selectedHabits={selectedHabits}
                    checkedCells={checkedCells}
                    setCheckedCells={setCheckedCells}
                    plottedZeroDays={plottedZeroDays}
                    setPlottedZeroDays={setPlottedZeroDays}
                  />
                </div>
              </div>
            </div>

            {/* Inline Sign-In Prompt if user clicked Save Now while signed out */}
            {!user && showSignInPrompt && (
              <div className="no-print p-4 rounded-2xl bg-[#eaf3ed] dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs sm:text-sm text-[#123524] dark:text-emerald-100 font-medium">
                  Sign in to save your habit sheet and access your daily
                  management dashboard.
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
            <FooterActions
              isSubmitting={isSubmitting}
              setPreviewMode={setPreviewMode}
              includeGraph={includeGraph}
              handleDownloadSheet={handleDownloadSheet}
              handleSaveNow={handleSaveNow}
              selectedHabits={selectedHabits}
            />
          </section>
        </div>
      </main>

      {!previewMode && (
        <div className="hidden print:block">
          <PrintableSheetPages
            // trackerName={trackerName}
            durationDays={effectiveDays}
            startDate={startDate}
            // dayLabelMode={dayLabelMode}
            // includeGraph={includeGraph}
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
