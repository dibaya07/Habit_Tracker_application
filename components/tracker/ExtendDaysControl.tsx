'use client';

import React, { useState } from 'react';
import { CalendarPlus, Check, X } from 'lucide-react';

interface ExtendDaysControlProps {
  currentDuration: number;
  onExtend: (newDuration: number) => void;
}

const PRESET_EXTENSIONS = [7, 15, 30];

const ExtendDaysControl = React.memo(function ExtendDaysControl({
  currentDuration,
  onExtend,
}: ExtendDaysControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customAdd, setCustomAdd] = useState('10');

  if (currentDuration >= 365) return null;

  const applyAddDays = (daysToAdd: number) => {
    const validAdd = Math.max(1, daysToAdd);
    const nextTotal = Math.min(365, currentDuration + validAdd);
    if (nextTotal > currentDuration) {
      onExtend(nextTotal);
    }
    setIsOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customAdd, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      applyAddDays(parsed);
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-emerald-700/60 bg-white dark:bg-[#091f17] text-slate-800 dark:text-emerald-100 hover:border-[#183f2e] dark:hover:border-[#2fe196] transition-colors cursor-pointer whitespace-nowrap"
      >
        <CalendarPlus className="w-3.5 h-3.5 text-[#183f2e] dark:text-[#2fe196]" />
        <span>Extend Days</span>
      </button>
    );
  }

  return (
    <div className="inline-flex flex-wrap items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#091f17] border border-[#183f2e]/40 dark:border-[#2fe196]/50 shadow-sm text-xs">
      <span className="text-[11px] font-semibold text-slate-600 dark:text-emerald-200 px-1">
        Extend ({currentDuration}d):
      </span>

      {PRESET_EXTENSIONS.map((add) => (
        <button
          key={add}
          type="button"
          onClick={() => applyAddDays(add)}
          className="px-2 py-1 rounded-lg bg-[#eaf3ed] dark:bg-emerald-900/50 text-[#183f2e] dark:text-[#2fe196] font-mono font-semibold text-[11px] hover:bg-[#183f2e] hover:text-white dark:hover:bg-[#2fe196] dark:hover:text-[#071912] transition-colors cursor-pointer"
        >
          +{add}d
        </button>
      ))}

      <form onSubmit={handleCustomSubmit} className="inline-flex items-center gap-1">
        <input
          type="number"
          min={1}
          max={Math.max(1, 365 - currentDuration)}
          value={customAdd}
          onChange={(e) => setCustomAdd(e.target.value)}
          aria-label="Custom days to extend"
          className="w-12 px-1.5 py-0.5 rounded-md border border-slate-300 dark:border-emerald-800 bg-slate-50 dark:bg-emerald-950/80 text-center font-mono text-[11px] text-slate-900 dark:text-white focus:outline-none focus:border-[#2fe196]"
        />
        <button
          type="submit"
          aria-label="Apply custom days"
          className="p-1 rounded-md bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912] cursor-pointer"
        >
          <Check className="w-3 h-3 stroke-[2.5]" />
        </button>
      </form>

      <button
        type="button"
        onClick={() => setIsOpen(false)}
        aria-label="Close extend days"
        className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
});

export default ExtendDaysControl;
