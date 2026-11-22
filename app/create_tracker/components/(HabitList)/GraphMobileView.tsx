"use client";
import { Eye, TrendingUp } from "lucide-react";
import React, { useContext } from "react";
import { SheetContext } from "../../context/context";

interface GraphMobileViewProps {
  onOpenPreview?: (mode: "sheet" | "graph") => void;
}

export default function GraphMobileView({
  onOpenPreview,
}: GraphMobileViewProps) {
  const sheetContext = useContext(SheetContext);
  return (
    <div className="md:hidden px-4 py-4 border-t border-slate-200/80 dark:border-emerald-900/40 bg-[#fafcf9] dark:bg-[#0b241b]/40 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-xs font-semibold text-[#123524] dark:text-white block">
            Printable Sheet &amp; Progress Graph
          </span>
          <span className="text-[11px] text-slate-500 dark:text-emerald-300/75 block">
            {sheetContext?.includeGraph
              ? "Progress graph is included on your downloaded sheet."
              : "Progress graph is currently excluded."}
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            sheetContext?.setIncludeGraph(!sheetContext.includeGraph)
          }
          className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors shrink-0 cursor-pointer ${
            sheetContext?.includeGraph
              ? "bg-[#eaf3ed] dark:bg-emerald-900/50 border-[#183f2e]/30 dark:border-[#2fe196]/50 text-[#183f2e] dark:text-[#2fe196]"
              : "bg-white dark:bg-[#091f17] border-slate-300 dark:border-emerald-800 text-slate-600 dark:text-emerald-200"
          }`}
        >
          {sheetContext?.includeGraph ? "Graph: On" : "Graph: Off"}
        </button>
      </div>

      {onOpenPreview && (
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onOpenPreview("sheet")}
            className="flex-1 min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-emerald-800/70 bg-white dark:bg-[#091f17] text-xs font-semibold text-[#123524] dark:text-emerald-100 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#183f2e] dark:text-[#2fe196]" />
            <span>Preview Sheet</span>
          </button>

          {sheetContext?.includeGraph && (
            <button
              type="button"
              onClick={() => onOpenPreview("graph")}
              className="flex-1 min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-emerald-800/70 bg-white dark:bg-[#091f17] text-xs font-semibold text-[#123524] dark:text-emerald-100 cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#183f2e] dark:text-[#2fe196]" />
              <span>Preview Graph</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
