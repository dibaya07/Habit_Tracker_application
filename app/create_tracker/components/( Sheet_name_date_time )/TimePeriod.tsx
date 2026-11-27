"use client";

import React, { useContext } from "react";
import { Calendar } from "lucide-react";
import {  useSheetContext } from "../../context/context";

const DURATION_OPTIONS = [
  { days: 21, label: "21 Days" },
  { days: 30, label: "30 Days" },
];

export default function TimePeriod() {
  const {
    customDaysInput,
    setCustomDaysInput,
    isCustomDuration,
    setIsCustomDuration,
    selectedDuration,
    setSelectedDuration,
  } = useSheetContext();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-semibold text-slate-600 dark:text-emerald-300/90 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#2d6a4f] dark:text-[#2fe196]" />
          <span>Time Period</span>
        </label>
        {isCustomDuration && (
          <span className="text-[11px] text-slate-500 dark:text-emerald-300/70 font-mono tabular-nums">
            1–365 days
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#fafcf9] dark:bg-emerald-950/60 border border-[#dce8df] dark:border-emerald-900/50">
        {DURATION_OPTIONS.map((option) => {
          const isActive =
            isCustomDuration == false && selectedDuration === option.days;
          return (
            <button
              key={option.days}
              type="button"
              onClick={() => {
                setSelectedDuration(option.days);
                setIsCustomDuration(false);
              }}
              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912] shadow-2xs"
                  : "text-slate-600 dark:text-emerald-200/80 hover:text-[#123524] dark:hover:text-white"
              }`}
            >
              <span className="font-mono tabular-nums">{option.label}</span>
            </button>
          );
        })}

        {isCustomDuration ? (
          <div className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded-lg bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912] shadow-2xs">
            <input
              id="customDaysInput"
              type="number"
              min={1}
              max={365}
              value={customDaysInput}
              onChange={(e) => setCustomDaysInput(e.target.value)}
              aria-label="Custom number of days"
              autoFocus
              className="w-12 bg-transparent border-b border-white/60 dark:border-[#071912]/60 text-center text-xs font-mono font-bold tabular-nums focus:outline-none"
            />
            <span className="text-[11px] font-medium whitespace-nowrap">
              days
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsCustomDuration(true)}
            className="flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-emerald-200/80 hover:text-[#123524] dark:hover:text-white transition-all cursor-pointer whitespace-nowrap"
          >
            Custom
          </button>
        )}
      </div>
    </div>
  );
}
