"use client";
import React, { useContext, useEffect } from "react";
import TimePeriod from "./TimePeriod";
import { SheetContext, useSheetContext } from "../context/context";

interface SheetNameInputAreaProp {
  startDate: string;
}

export default function SheetNameInputArea({startDate}: SheetNameInputAreaProp) {
  const {
    trackerName,
    setTrackerName,
    setCustomStartDate,
    isSubmitting,
  } = useSheetContext();
  return (
    <>
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
    </>
  );
}
