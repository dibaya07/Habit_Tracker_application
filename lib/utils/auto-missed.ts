import { HabitTracker, TrackingStatus } from '@/lib/types/tracker';
import { addUtcDays, parseUtcDate } from '@/lib/utils/date';

/**
 * Returns how many calendar days have elapsed since the given dayIndex in the tracker.
 * Positive means the day is in the past; 0 means today; negative means future.
 */
export function getDaysElapsedForIndex(
  startDate: string,
  dayIndex: number,
  todayYmd: string
): number {
  const baseUtc = parseUtcDate(startDate);
  const dayUtc = addUtcDays(baseUtc, dayIndex - 1);
  const todayUtc = parseUtcDate(todayYmd);
  return Math.floor((todayUtc.getTime() - dayUtc.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Marks any active habit cell that has remained unmarked ('empty' or undefined)
 * for 2 or more days as 'failed' (missed). Returns the original object reference
 * if no cells changed.
 */
export function applyAutoMissedDays(
  tracker: HabitTracker,
  todayYmd: string
): HabitTracker {
  const baseUtc = parseUtcDate(tracker.startDate);
  const todayUtc = parseUtcDate(todayYmd);

  let hasChanges = false;
  const nextTracking: Record<string, Record<number, TrackingStatus>> = {
    ...tracker.tracking,
  };

  for (const habit of tracker.habits) {
    if (!habit.active) continue;
    const currentHabitDays = tracker.tracking[habit.id] || {};
    let habitChanged = false;
    let updatedHabitDays: Record<number, TrackingStatus> | null = null;

    for (let dayIndex = 1; dayIndex <= tracker.durationDays; dayIndex++) {
      const dayUtc = addUtcDays(baseUtc, dayIndex - 1);
      const daysElapsed = Math.floor(
        (todayUtc.getTime() - dayUtc.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysElapsed >= 2) {
        const status = currentHabitDays[dayIndex];
        if (!status || status === 'empty') {
          if (!updatedHabitDays) {
            updatedHabitDays = { ...currentHabitDays };
          }
          updatedHabitDays[dayIndex] = 'failed';
          habitChanged = true;
        }
      }
    }

    if (habitChanged && updatedHabitDays) {
      nextTracking[habit.id] = updatedHabitDays;
      hasChanges = true;
    }
  }

  if (!hasChanges) {
    return tracker;
  }

  return {
    ...tracker,
    tracking: nextTracking,
  };
}
