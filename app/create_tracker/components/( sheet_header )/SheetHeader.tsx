import DayLabelDropdown from "@/components/tracker/DayLabelDropdown";
import BrandMark from "@/components/ui/BrandMark";
import { DayLabelMode } from "@/lib/types/tracker";
import { formatUtcFullDate, parseUtcDate } from "@/lib/utils/date";
import React, { useContext } from "react";
import { SheetContext, useSheetContext } from "../../context/context";

// interface SheetHeaderProps {
//   startDate: string;
// }

export default function SheetHeader() {


  //  const sheetContext = useContext(SheetContext)
   const {trackerName, customStartDate } = useSheetContext()

   const date = new Date(customStartDate)


  // const baseDate = parseUtcDate(startDate);
  const formattedStartDate = date.toLocaleDateString("en-GB",{
    day:'numeric',
    month:'short',
    year:'numeric'
  });

  return (
    <div className="px-4 sm:px-5 py-4 border-b border-slate-200 dark:border-emerald-900/50 bg-[#fafcf9] dark:bg-[#0b241b] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        <BrandMark size={30} />
        <div className="min-w-0 space-y-1 flex-1">
          {trackerName.trim() ? (
            <h2 className="font-editorial text-xl sm:text-2xl font-normal text-[#123524] dark:text-white break-words">
              {trackerName.trim()}
            </h2>
          ) : (
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-emerald-300/75 uppercase tracking-wider shrink-0">
                Sheet Name:
              </span>
              <span
                aria-label="Blank space for manual sheet name"
                className="inline-block w-36 sm:w-64 border-b border-dashed border-slate-400 dark:border-emerald-700 h-4"
              />
            </div>
          )}
          <p className="text-xs text-slate-600 dark:text-emerald-300/75 font-mono tabular-nums">
            Start: {formattedStartDate} 
          </p>
        </div>
      </div>

      {/* Dropdown: No. of Days vs From Date */}
      <div className="no-print flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/70 dark:border-emerald-900/40 shrink-0">
        <span className="text-[11px] font-medium text-slate-500 dark:text-emerald-300/70">
          Day Labels:
        </span>
        <DayLabelDropdown
          // id="create-sheet-day-label-mode"
          // value={dayLabelMode}
          // onChange={setDayLabelMode}
        />
      </div>
    </div>
  );
}
