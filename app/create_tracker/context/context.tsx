"use client";
// import { useContext } from "react";
import { DayLabelMode } from "@/lib/types/tracker";
import { createContext, ReactNode, useContext, useState } from "react";

interface contextType {
  initialValue: string;
  trackerName: string;
  setTrackerName: React.Dispatch<React.SetStateAction<string>>;
  customDaysInput: string;
  setCustomDaysInput: React.Dispatch<React.SetStateAction<string>>;
  customStartDate: string | null;
  setCustomStartDate: React.Dispatch<React.SetStateAction<string | null>>;
  dayLabelMode: DayLabelMode | undefined;
  setDayLabelMode: React.Dispatch<React.SetStateAction<DayLabelMode>>;
  includeGraph: boolean | undefined;
  setIncludeGraph: React.Dispatch<React.SetStateAction<boolean>>;
  visibleDayCount: number;
  extraDaysCount: number;
  effectiveDays: number;
  isCustomDuration: boolean;
  setIsCustomDuration: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDuration: number;
  setSelectedDuration: React.Dispatch<React.SetStateAction<number>>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  confirmDeleteHabitId: string | null;
  setConfirmDeleteHabitId: React.Dispatch<React.SetStateAction<string | null>>;
}

interface sheetContextProviderProps {
  children: ReactNode;
}
export const SheetContext = createContext<contextType | undefined>(undefined);

export const SheetContextProvider = ({
  children,
}: sheetContextProviderProps) => {
  const initialValue = "value";
  const [trackerName, setTrackerName] = useState("");

  const isPresetDuration = true;

  const [isCustomDuration, setIsCustomDuration] = useState(!isPresetDuration);
  const [selectedDuration, setSelectedDuration] = useState<number>(
    isPresetDuration ? 21 : 30,
  );

  const [customDaysInput, setCustomDaysInput] = useState("30");
  const [customStartDate, setCustomStartDate] = useState<string | null>(null);
  const [dayLabelMode, setDayLabelMode] = useState<DayLabelMode>("numbers");
  const [includeGraph, setIncludeGraph] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const effectiveDays = isCustomDuration
    ? Math.max(1, Math.min(365, parseInt(customDaysInput, 10) || 30))
    : selectedDuration;

  const visibleDayCount = Math.min(10, Math.max(1, effectiveDays));
  const extraDaysCount = Math.max(0, effectiveDays - visibleDayCount);

  const [confirmDeleteHabitId, setConfirmDeleteHabitId] = useState<
    string | null
  >(null);

  
  return (
    <SheetContext.Provider
      value={{
        initialValue,
        trackerName,
        setTrackerName,
        customDaysInput,
        setCustomDaysInput,
        customStartDate,
        setCustomStartDate,
        dayLabelMode,
        setDayLabelMode,
        includeGraph,
        setIncludeGraph,
        visibleDayCount,
        extraDaysCount,
        effectiveDays,
        isCustomDuration,
        setIsCustomDuration,
        selectedDuration,
        setSelectedDuration,
        isSubmitting,
        setIsSubmitting,
        confirmDeleteHabitId,
        setConfirmDeleteHabitId,
      }}
    >
      {children}
    </SheetContext.Provider>
  );
};

export const useSheetContext = () => {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("something is wrong");
  }
  return context;
};
