export type HabitCategory = 'Health' | 'Wellness' | 'Learning' | 'Productivity' | 'Lifestyle';

export type TrackingStatus = 'completed' | 'failed' | 'empty';

export type DayLabelMode = 'numbers' | 'dates';

export interface Habit {
  id?: string;
  name: string;
  // category?: HabitCategory;
  // color?: string;
  // targetPerWeek?: number;
  // active: boolean;
}

export interface DayTracking {
  [dayIndex: number]: TrackingStatus;
}

export interface HabitTrackingMap {
  [habitId: string]: DayTracking;
}

export interface HabitTracker {
  id: string;
  name: string;
  startDate: string; // ISO date string YYYY-MM-DD
  durationDays: number;
  dayLabelMode?: DayLabelMode;
  includeGraph?: boolean;
  habits: Habit[];
  tracking: HabitTrackingMap;
  notes?: string;
}

export interface UserAccount {
  email: string;
  name: string;
  isVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
  memberTier: 'Free' | 'Pro' | 'Premium';
  dailyGoal?: string;
  bio?: string;
}

export interface AnalyticsData {
  totalHabits: number;
  totalCompleted: number;
  totalPossible: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  bestPerformingHabit: { name: string; rate: number } | null;
  weakestPerformingHabit: { name: string; rate: number } | null;
  dailyScores: { day: number; dateStr: string; completed: number; total: number; percentage: number }[];
  categoryBreakdown: { category: HabitCategory; count: number; percentage: number }[];
  weeklyAverages: { dayName: string; completed: number; total: number; percentage: number }[];
  smartSuggestions: string[];
}

export interface FeedbackSubmission {
  id: string;
  category: 'feedback' | 'suggestion' | 'bug' | 'feature';
  rating: number;
  message: string;
  userEmail?: string;
  createdAt: string;
}

export type ActionHistoryType =
  | 'habit_completed'
  | 'habit_missed'
  | 'habit_cleared'
  | 'habit_added'
  | 'habit_edited'
  | 'habit_deleted'
  | 'sheet_created'
  | 'sheet_renamed'
  | 'sheet_extended'
  | 'sheet_deleted'
  | 'sheet_reset'
  | 'profile_updated'
  | 'feedback_submitted'
  | 'support_coffee';

export interface ActionHistoryEntry {
  id: string;
  type: ActionHistoryType;
  title: string;
  detail: string;
  sheetName?: string;
  timestamp: string;
}
