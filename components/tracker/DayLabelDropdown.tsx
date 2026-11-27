'use client';

import React from 'react';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { DayLabelMode } from '@/lib/types/tracker';
import { useSheetContext } from '@/app/create_tracker/context/context';

// interface DayLabelDropdownProps {
//   value: DayLabelMode | undefined;
//   onChange: (mode: DayLabelMode) => void;
//   id?: string;
// }

export default function DayLabelDropdown() {
   const {dayLabelMode,setDayLabelMode } = useSheetContext()
  return (
    <div className="relative inline-flex items-center">
      <CalendarDays
        className="w-3.5 h-3.5 text-[#183f2e] dark:text-[#2fe196] absolute left-3 pointer-events-none"
        aria-hidden="true"
      />
      <select
        // id={id}
        aria-label="Day column label format"
        value={dayLabelMode}
        onChange={(e) => setDayLabelMode(e.target.value)}
        className="appearance-none pl-8 pr-8 py-1.5 rounded-xl bg-slate-50 dark:bg-emerald-950/80 border border-slate-200 dark:border-emerald-800/60 text-xs font-semibold text-slate-800 dark:text-emerald-100 hover:border-[#183f2e] dark:hover:border-[#2fe196] focus:outline-none focus:ring-2 focus:ring-[#2fe196]/40 transition-colors cursor-pointer"
      >
        <option value="numbers">No. of Days (1, 2, 3)</option>
        <option value="dates">From Date</option>
      </select>
      <ChevronDown
        className="w-3.5 h-3.5 text-slate-500 dark:text-emerald-300/80 absolute right-2.5 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
