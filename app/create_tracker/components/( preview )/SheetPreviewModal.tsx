"use client";

import React, { useState } from "react";
import { Download, Eye, FileSpreadsheet, TrendingUp, X } from "lucide-react";
import { Habit } from "@/lib/types/tracker";
import { useSheetContext } from "../../context/context";
import HabitProgressGraph from "../( graph )/HabitProgressGraph";
import PrintableSheetPages from "./PrintableSheetPages";

interface SheetPreviewModalProps {
  isOpen: boolean;
  initialView?: "sheet" | "graph";
  onClose: () => void;
  onDownload: () => void;
  startDate: string;
  selectedHabits: Habit[];
  checkedCells: Record<string, boolean>;
  plottedZeroDays: Record<number, boolean>;
}

export default function SheetPreviewModal({
  isOpen,
  initialView = "sheet",
  onClose,
  onDownload,
  startDate,
  selectedHabits,
  checkedCells,
  plottedZeroDays,
}: SheetPreviewModalProps) {
  const [activeView, setActiveView] = useState<"sheet" | "graph">(initialView);
  const {

    includeGraph,
    effectiveDays,
  } = useSheetContext();

  if (!isOpen) return null;

  const pageCountLabel =
    effectiveDays > 30 ? "2 Pages (A4 Landscape)" : "1 Page (A4 Landscape)";
  const effectiveView = includeGraph ? activeView : "sheet";
  const visibleGraphDays = Math.min(10, Math.max(1, effectiveDays));
  const extraGraphDays = Math.max(0, effectiveDays - visibleGraphDays);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start p-3 sm:p-6 lg:p-8 overflow-y-auto bg-black/75 backdrop-blur-sm print:static print:inset-auto print:p-0 print:bg-transparent print:backdrop-blur-none print:block">
      {/* Preview Toolbar (hidden when printing/downloading) */}
      <div className="no-print w-full max-w-6xl mb-4 rounded-2xl bg-white dark:bg-[#091f17] border border-slate-200 dark:border-emerald-800/60 p-4 sm:px-5 sm:py-3.5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#eaf3ed] dark:bg-emerald-500/15 text-[#183f2e] dark:text-[#2fe196] flex items-center justify-center shrink-0">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-editorial text-lg sm:text-xl font-normal text-[#123524] dark:text-white leading-tight">
              {effectiveView === "graph"
                ? "Progress Graph Preview"
                : `Sheet Preview · ${pageCountLabel}`}
            </h2>
            <p className="text-xs text-slate-500 dark:text-emerald-300/75">
              This is how your sheet will look when printed or downloaded as
              PDF.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2">
          {includeGraph && (
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-800/50">
              <button
                type="button"
                onClick={() => setActiveView("sheet")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  effectiveView === "sheet"
                    ? "bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912]"
                    : "text-slate-600 dark:text-emerald-200"
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Full Sheet</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView("graph")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  effectiveView === "graph"
                    ? "bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912]"
                    : "text-slate-600 dark:text-emerald-200"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Graph</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-emerald-700/60 text-slate-700 dark:text-emerald-100 hover:bg-slate-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close</span>
            </button>

            <button
              type="button"
              onClick={onDownload}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {effectiveView === "graph" ? (
        <div className="w-full max-w-6xl rounded-2xl bg-white text-[#123524] border border-slate-200 shadow-2xl overflow-x-auto custom-scrollbar">
          <HabitProgressGraph
            habits={selectedHabits}
            startDate={startDate}
            checkedCells={checkedCells}
            plottedZeroDays={plottedZeroDays}
            forceLight={true}
            hideHint={true}
          />
        </div>
      ) : (
        <PrintableSheetPages
          startDate={startDate}
          selectedHabits={selectedHabits}
          checkedCells={checkedCells}
          plottedZeroDays={plottedZeroDays}
        />
      )}
    </div>
  );
}
