"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { useHabitTracker } from "@/lib/context/HabitTrackerContext";
import { Habit, HabitCategory } from "@/lib/types/tracker";
import { DEFAULT_DATE_FALLBACK, getLocalTodayYmd } from "@/lib/utils/date";
import dynamic from "next/dynamic";
import TimePeriod from "./( Sheet_name_date_time )/TimePeriod";
import HabitList from "./( sheetFooter_addBtn )/sheetFooter";
import PrintableSheetPages from "./( preview )/PrintableSheetPages";
import HeaderIntro from "./( create_tracker_header )/HeaderIntro";
import SheetNameInputArea from "./( Sheet_name_date_time )/SheetNameInputArea";
import FooterActions from "./( save_download_btn )/FooterActions";
import SheetHeader from "./( sheet_header )/SheetHeader";
import HabitListMobileView from "./(HabitList)/HabitListMobileView";
import DesktopViewHabitList from "./(HabitList)/DesktopViewHabitList";
import AddHabitBtn from "./( sheetFooter_addBtn )/AddHabitBtn";
import GraphMobileView from "./( graph )/GraphMobileView";
import HabitProgressGraph from "./( graph )/HabitProgressGraph";
import { useSheetContext } from "../context/context";

const SheetPreviewModal = dynamic(
  () => import("./( preview )/SheetPreviewModal"),
  {
    ssr: false,
  },
);

interface CreateTrackerClientProps {
  defaultHabits: Habit[];
  initialName?: string;
  initialDuration?: number;
}

export default function CreateTrackerClient({
  defaultHabits,
  // initialName = "",
  // initialDuration = 30,
}: CreateTrackerClientProps) {
  const router = useRouter();
  const { createTracker, user, openAuthModal, quickSignIn, hasMounted } =
    useHabitTracker();
  const {
    trackerName,
    customStartDate,
    dayLabelMode,
    includeGraph,
    setIncludeGraph,
    effectiveDays,
    isSubmitting,
    setIsSubmitting,
  } = useSheetContext();

  const startDate =
    customStartDate ??
    (hasMounted ? getLocalTodayYmd() : DEFAULT_DATE_FALLBACK);
  const [selectedHabits, setSelectedHabits] = useState<Habit[]>(defaultHabits);
  const [newHabitName, setNewHabitName] = useState("");
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [previewMode, setPreviewMode] = useState<"sheet" | "graph" | null>(
    null,
  );

  const [checkedCells, setCheckedCells] = useState<Record<string, boolean>>({});
  const [plottedZeroDays, setPlottedZeroDays] = useState<
    Record<number, boolean>
  >({});
  
  const handleRemoveHabit = (id: string) => {
    if (selectedHabits.length <= 1) return;
    setSelectedHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const handleSelectSuggestedHabit = (name: string) => {
    if (selectedHabits.some((h) => h.name.toLowerCase() === name.toLowerCase()))
      return;
    const newHabit: Habit = {
      id: `sugg_${name.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
      name,
      active: true,
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
    const resolvedSaveName = trackerName.trim() || "Habit Sheet";
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
      dayLabelMode,
      includeGraph,
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
              <SheetNameInputArea startDate={startDate} />
              <div className="w-full lg:flex-[4] min-w-0">
                <TimePeriod />
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
                  <SheetHeader startDate={startDate} />
                  <HabitListMobileView
                    selectedHabits={selectedHabits}
                    handleRemoveHabit={handleRemoveHabit}
                  />
                  <DesktopViewHabitList
                    selectedHabits={selectedHabits}
                    handleRemoveHabit={handleRemoveHabit}
                    checkedCells={checkedCells}
                    setCheckedCells={setCheckedCells}
                    setPlottedZeroDays={setPlottedZeroDays}
                    startDate={startDate}
                  />
                  <AddHabitBtn
                    newHabitName={newHabitName}
                    setNewHabitName={setNewHabitName}
                    // handleAddCustomHabit={handleAddCustomHabit}
                    selectedHabits={selectedHabits}
                    setSelectedHabits={setSelectedHabits}
                    handleSelectSuggestedHabit={handleSelectSuggestedHabit}
                  />
                  <GraphMobileView
                    onOpenPreview={(mode) => setPreviewMode(mode)}
                  />
                  {includeGraph && (
                    <div className="hidden md:block">
                      <HabitProgressGraph
                        habits={selectedHabits}
                        startDate={startDate}
                        checkedCells={checkedCells}
                        plottedZeroDays={plottedZeroDays}
                        onRemoveGraph={() => setIncludeGraph(false)}
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
              // includeGraph={includeGraph}
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
            // durationDays={effectiveDays}
            startDate={startDate}
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
          startDate={startDate}
          selectedHabits={selectedHabits}
          checkedCells={checkedCells}
          plottedZeroDays={plottedZeroDays}
        />
      ) : null}
    </>
  );
}
