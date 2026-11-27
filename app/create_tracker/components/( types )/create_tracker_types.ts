import { DayLabelMode, Habit } from "@/lib/types/tracker";

export interface contextType {
  trackerName: string;
  setTrackerName: React.Dispatch<React.SetStateAction<string>>;
  customDaysInput: string;
  setCustomDaysInput: React.Dispatch<React.SetStateAction<string>>;
  customStartDate: string ;
  setCustomStartDate: React.Dispatch<React.SetStateAction<string>>;
  dayLabelMode: string;
  setDayLabelMode: React.Dispatch<React.SetStateAction<string>>;
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
  confirmDeleteHabitId: string | null | undefined;
  setConfirmDeleteHabitId: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  selectedHabits : Habit[]
  setSelectedHabits : React.Dispatch<React.SetStateAction<Habit[]>>;
  checkedCells: Record<string, boolean>
  setCheckedCells : React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  newHabitName : string
  setNewHabitName : React.Dispatch<React.SetStateAction<string>>
}
