import IconTooltip from "@/components/ui/IconTooltip";
import { Habit } from "@/lib/types/tracker";
import { Download, Eye, Loader2, Save, TrendingUp } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useSheetContext } from "../context/context";

interface FooterActionsProp {
  isSubmitting: boolean;
  setPreviewMode: (value: "sheet" | "graph" | null) => void;
  // includeGraph: boolean;
  handleDownloadSheet: () => void;
  handleSaveNow: () => void;
  selectedHabits: Habit[];
}

export default function FooterActions({
  isSubmitting,
  setPreviewMode,
  // includeGraph,
  handleDownloadSheet,
  handleSaveNow,
  selectedHabits,
}: FooterActionsProp) {
   const {
      // trackerName,
      // customDaysInput,
      // customStartDate,
      // dayLabelMode,
      includeGraph,
      // setIncludeGraph,
  
    } = useSheetContext();
  return (
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
            onClick={() => setPreviewMode("sheet")}
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
              onClick={() => setPreviewMode("graph")}
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
  );
}
