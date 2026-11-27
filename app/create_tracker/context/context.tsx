"use client";
import { DayLabelMode, Habit } from "@/lib/types/tracker";
import { createContext, ReactNode, useContext, useState } from "react";
import { contextType } from "../components/( types )/create_tracker_types";
import { getLocalTodayYmd } from "@/lib/utils/date";



interface sheetContextProviderProps {
  children: ReactNode;
}
export const SheetContext = createContext<contextType | undefined>(undefined);


const defaultHabits = [
    { id: 'h1', name: 'Exercise', },
    { id: 'h2', name: 'Meditation', },
    { id: 'h3', name: 'Read a book', },
    { id: 'h4', name: 'Drink water', },
    { id: 'h5', name: 'Healthy food', },
  ]

export const SheetContextProvider = ({
  children,
}: sheetContextProviderProps) => {
  const [trackerName, setTrackerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<string>(getLocalTodayYmd());
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [customDaysInput, setCustomDaysInput] = useState("21");
  const [dayLabelMode, setDayLabelMode] = useState<string>("numbers");
  // const isPresetDuration = true;
  const effectiveDays = isCustomDuration
    ? Math.max(1, Math.min(365, parseInt(customDaysInput, 10) || 30))
    : selectedDuration;
  const visibleDayCount = Math.min(10, Math.max(1, effectiveDays));
  const extraDaysCount = Math.max(0, effectiveDays - visibleDayCount);

  const [selectedHabits, setSelectedHabits] = useState<Habit[]>(defaultHabits);
  const [newHabitName, setNewHabitName] = useState("");

  const [includeGraph, setIncludeGraph] = useState(true);



  const [confirmDeleteHabitId, setConfirmDeleteHabitId] = useState<
    string | null | undefined
  >(null);

   const [checkedCells, setCheckedCells] = useState<Record<string, boolean>>({});
  
  return (
    <SheetContext.Provider
      value={{
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
        setConfirmDeleteHabitId,selectedHabits, setSelectedHabits, checkedCells, setCheckedCells, newHabitName, setNewHabitName
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
