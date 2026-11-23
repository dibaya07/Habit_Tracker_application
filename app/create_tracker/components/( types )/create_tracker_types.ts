import { DayLabelMode } from "@/lib/types/tracker";

export interface contextType {
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
