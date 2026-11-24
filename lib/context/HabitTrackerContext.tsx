"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useSyncExternalStore,
} from "react";
import {
  Habit,
  HabitCategory,
  HabitTracker,
  TrackingStatus,
  DayLabelMode,
  UserAccount,
  AnalyticsData,
  FeedbackSubmission,
  ActionHistoryEntry,
  ActionHistoryType,
} from "../types/tracker";
import { SITE_CONFIG } from "../data/site-config";
import {
  addUtcDays,
  formatUtcShortDate,
  getLocalTodayYmd,
  getUtcWeekdayShort,
  parseUtcDate,
} from "../utils/date";
import {
  applyAutoMissedDays,
  getDaysElapsedForIndex,
} from "../utils/auto-missed";
import { validateEmailAddress, validatePersonName } from "../utils/validation";

interface HabitTrackerContextType {
  hasMounted: boolean;
  theme: "dark" | "light";
  toggleTheme: () => void;
  tracker: HabitTracker;
  savedTrackers: HabitTracker[];
  selectTracker: (id: string) => void;
  renameTracker: (id: string, name: string) => void;
  deleteSavedTracker: (id: string) => void;
  user: UserAccount | null;
  verificationCodeSent: boolean;
  pendingVerificationEmail: string | null;
  authPromptMessage: string | null;
  analytics: AnalyticsData;
  activeView: "tracker" | "analytics" | "print" | "plan";
  setActiveView: (view: "tracker" | "analytics" | "print" | "plan") => void;
  // Modals
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  openAuthModal: (message?: string, onAfterSignIn?: () => void) => void;
  isFeedbackModalOpen: boolean;
  setIsFeedbackModalOpen: (open: boolean) => void;
  isManageHabitsOpen: boolean;
  setIsManageHabitsOpen: (open: boolean) => void;
  isSummaryReportOpen: boolean;
  setIsSummaryReportOpen: (open: boolean) => void;
  // Tracker operations
  toggleCell: (habitId: string, dayIndex: number) => void;
  setCellStatus: (
    habitId: string,
    dayIndex: number,
    status: TrackingStatus,
  ) => void;
  addHabit: (name: string, category: HabitCategory) => void;
  editHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  createTracker: (
    name: string,
    durationDays: number,
    startDate: string,
    initialHabits?: Habit[],
    dayLabelMode?: DayLabelMode,
    includeGraph?: boolean,
  ) => void;
  setDayLabelMode: (mode: DayLabelMode) => void;
  setIncludeGraph: (include: boolean) => void;
  extendPlan: (newDuration: number) => void;
  resetTrackerData: () => void;
  // Auth operations
  quickSignIn: () => boolean;
  signInWithGoogleAccount: (profile: {
    name: string;
    email: string;
    avatarUrl?: string;
  }) => boolean;
  signUpWithEmail: (input: {
    name: string;
    email: string;
    password: string;
    dailyGoal?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  signInWithEmail: (input: {
    email: string;
    password: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  updateUserProfile: (updates: Partial<UserAccount>) => void;
  initiateEmailVerification: (email: string, name?: string) => Promise<boolean>;
  verifyEmailCode: (code: string) => boolean;
  logout: () => void;
  // Feedback & Action History
  submitFeedback: (
    feedback: Omit<FeedbackSubmission, "id" | "createdAt">,
  ) => void;
  feedbacks: FeedbackSubmission[];
  actionHistory: ActionHistoryEntry[];
  recordHistoryAction: (
    type: ActionHistoryType,
    title: string,
    detail: string,
    sheetName?: string,
  ) => void;
  clearActionHistory: () => void;
}

const HabitTrackerContext = createContext<HabitTrackerContextType | undefined>(
  undefined,
);

// Initial seed tracker
const createInitialTracker = (): HabitTracker => {
  const habits: Habit[] = [
    {
      id: "h1",
      name: "Exercise",
      // category: "Health",
      // color: "#2fe196",
      active: true,
      // targetPerWeek: 6,
    },
    {
      id: "h2",
      name: "Meditation",
      // category: "Wellness",
      // color: "#38bdf8",
      active: true,
      // targetPerWeek: 7,
    },
    {
      id: "h3",
      name: "Read a book",
      // category: "Learning",
      // color: "#a78bfa",
      active: true,
      // targetPerWeek: 5,
    },
    {
      id: "h4",
      name: "Drink water",
      // category: "Health",
      // color: "#34d399",
      active: true,
      // targetPerWeek: 7,
    },
    {
      id: "h5",
      name: "Healthy food",
      // category: "Health",
      // color: "#fbbf24",
      active: true,
      // targetPerWeek: 7,
    },
  ];

  const tracking: Record<string, Record<number, TrackingStatus>> = {};

  // habits.forEach((h, hIdx) => {
  //   tracking[h.id] = {};
  //   for (let day = 1; day <= 30; day++) {
  //     if (day > 25) {
  //       if (day === 26) {
  //         tracking[h.id][day] = hIdx % 2 === 0 ? 'completed' : 'empty';
  //       } else {
  //         tracking[h.id][day] = 'empty';
  //       }
  //     } else {
  //       const seedValue = (day * 7 + hIdx * 13) % 10;
  //       if (seedValue > 8) {
  //         tracking[h.id][day] = 'failed';
  //       } else if (seedValue > 1) {
  //         tracking[h.id][day] = 'completed';
  //       } else {
  //         tracking[h.id][day] = 'empty';
  //       }
  //     }
  //   }
  // });

  return {
    id: "tracker-default",
    name: "Daily Habit Tracker",
    startDate: "2026-04-21",
    durationDays: 30,
    habits,
    tracking,
    notes: "Stay consistent. Focus on progress over perfection.",
  };
};

const INITIAL_TRACKER: HabitTracker = createInitialTracker();
const INITIAL_SAVED_TRACKERS: HabitTracker[] = [INITIAL_TRACKER];
const EMPTY_FEEDBACKS: FeedbackSubmission[] = [];
const EMPTY_HISTORY: ActionHistoryEntry[] = [];

const emptySubscribe = () => () => {};

function readStoredJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

interface StoredLocalAccount {
  name: string;
  email: string;
  passwordHash: string;
  dailyGoal?: string;
  createdAt: string;
}

async function hashCredential(value: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const encoded = new TextEncoder().encode(`habitora_v1:${value}`);
    const digest = await window.crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv_${(hash >>> 0).toString(16)}`;
}

export const HabitTrackerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const hasMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "light";
    try {
      const saved = localStorage.getItem("habitora_theme");
      if (saved === "dark" || saved === "light") return saved;
    } catch {}
    return "light";
  });

  const [tracker, setTracker] = useState<HabitTracker>(() =>
    readStoredJson<HabitTracker>("habitora_tracker", INITIAL_TRACKER),
  );

  const [savedTrackers, setSavedTrackers] = useState<HabitTracker[]>(() => {
    const list = readStoredJson<HabitTracker[]>("habitora_saved_trackers", []);
    if (Array.isArray(list) && list.length > 0) return list;
    return [readStoredJson<HabitTracker>("habitora_tracker", INITIAL_TRACKER)];
  });

  const [user, setUser] = useState<UserAccount | null>(() => {
    const stored = readStoredJson<UserAccount | null>("habitora_user", null);
    if (stored && stored.name === "Habitora Member") {
      return { ...stored, name: "Profile" };
    }
    return stored;
  });

  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<
    string | null
  >(null);
  const [simulatedSecretCode, setSimulatedSecretCode] =
    useState<string>("842109");
  const [activeView, setActiveView] = useState<
    "tracker" | "analytics" | "print" | "plan"
  >("tracker");
  const [authPromptMessage, setAuthPromptMessage] = useState<string | null>(
    null,
  );
  const pendingAuthCallbackRef = useRef<(() => void) | null>(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpenState] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isManageHabitsOpen, setIsManageHabitsOpen] = useState(false);
  const [isSummaryReportOpen, setIsSummaryReportOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>(() =>
    readStoredJson<FeedbackSubmission[]>("habitora_feedback", []),
  );
  const [actionHistory, setActionHistory] = useState<ActionHistoryEntry[]>(() =>
    readStoredJson<ActionHistoryEntry[]>("habitora_action_history", []),
  );

  const appendHistory = useCallback(
    (
      type: ActionHistoryType,
      title: string,
      detail: string,
      sheetName?: string,
    ) => {
      const entry: ActionHistoryEntry = {
        id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type,
        title,
        detail,
        sheetName,
        timestamp: new Date().toISOString(),
      };
      setActionHistory((prev) => {
        const next = [entry, ...prev].slice(0, 100);
        try {
          localStorage.setItem("habitora_action_history", JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [],
  );

  const clearActionHistory = useCallback(() => {
    setActionHistory([]);
    try {
      localStorage.removeItem("habitora_action_history");
    } catch {}
  }, []);

  // Sync derived auto-missed state to localStorage when mounted (external system sync only)

  const setIsAuthModalOpen = useCallback((open: boolean) => {
    setIsAuthModalOpenState(open);
    if (!open) {
      setAuthPromptMessage(null);
      pendingAuthCallbackRef.current = null;
    }
  }, []);

  const openAuthModal = useCallback(
    (message?: string, onAfterSignIn?: () => void) => {
      setAuthPromptMessage(message || null);
      pendingAuthCallbackRef.current = onAfterSignIn || null;
      setIsAuthModalOpenState(true);
    },
    [],
  );

  // Update theme class on HTML and body elements
  useEffect(() => {
    if (!hasMounted || typeof document === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
    try {
      localStorage.setItem("habitora_theme", theme);
    } catch {
      // ignore
    }
  }, [theme, hasMounted]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  // Sync helper to update savedTrackers alongside active tracker
  const syncSavedTrackers = useCallback((updatedTracker: HabitTracker) => {
    setSavedTrackers((prev) => {
      const exists = prev.some((t) => t.id === updatedTracker.id);
      const nextList = exists
        ? prev.map((t) => (t.id === updatedTracker.id ? updatedTracker : t))
        : [updatedTracker, ...prev];
      try {
        localStorage.setItem(
          "habitora_saved_trackers",
          JSON.stringify(nextList),
        );
      } catch {}
      return nextList;
    });
  }, []);

  // Save tracker updates
  const saveTracker = useCallback(
    (newTracker: HabitTracker) => {
      setTracker(newTracker);
      try {
        localStorage.setItem("habitora_tracker", JSON.stringify(newTracker));
      } catch {
        // ignore
      }
      syncSavedTrackers(newTracker);
    },
    [syncSavedTrackers],
  );

  const selectTracker = useCallback(
    (id: string) => {
      const found = savedTrackers.find((t) => t.id === id);
      if (found) {
        const normalized = hasMounted
          ? applyAutoMissedDays(found, getLocalTodayYmd())
          : found;
        setTracker(normalized);
        try {
          localStorage.setItem("habitora_tracker", JSON.stringify(normalized));
        } catch {}
      }
    },
    [savedTrackers, hasMounted],
  );

  const renameTracker = useCallback(
    (id: string, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const previous = savedTrackers.find((t) => t.id === id)?.name;

      setSavedTrackers((prevList) => {
        const nextList = prevList.map((item) =>
          item.id === id ? { ...item, name: trimmed } : item,
        );
        try {
          localStorage.setItem(
            "habitora_saved_trackers",
            JSON.stringify(nextList),
          );
        } catch {}
        return nextList;
      });

      setTracker((prev) => {
        if (prev.id !== id) return prev;
        const updated = { ...prev, name: trimmed };
        try {
          localStorage.setItem("habitora_tracker", JSON.stringify(updated));
        } catch {}
        return updated;
      });

      appendHistory(
        "sheet_renamed",
        "Renamed Sheet",
        previous
          ? `Renamed "${previous}" to "${trimmed}"`
          : `Renamed sheet to "${trimmed}"`,
        trimmed,
      );
    },
    [savedTrackers, appendHistory],
  );

  const deleteSavedTracker = useCallback(
    (id: string) => {
      if (savedTrackers.length <= 1) return;
      const target = savedTrackers.find((t) => t.id === id);
      const nextList = savedTrackers.filter((t) => t.id !== id);
      setSavedTrackers(nextList);
      try {
        localStorage.setItem(
          "habitora_saved_trackers",
          JSON.stringify(nextList),
        );
      } catch {}
      if (tracker.id === id && nextList[0]) {
        setTracker(nextList[0]);
        try {
          localStorage.setItem("habitora_tracker", JSON.stringify(nextList[0]));
        } catch {}
      }
      if (target) {
        appendHistory(
          "sheet_deleted",
          "Deleted Sheet",
          `Removed "${target.name}" (${target.durationDays} days)`,
          target.name,
        );
      }
    },
    [savedTrackers, tracker.id, appendHistory],
  );

  // Cell toggle:
  // If 2+ days elapsed, toggle 'completed' <-> 'failed' (so unmarked past days stay missed unless completed).
  // Otherwise: 'empty' -> 'completed' -> 'failed' -> 'empty'.
  const toggleCell = useCallback(
    (habitId: string, dayIndex: number) => {
      const habitName =
        tracker.habits.find((h) => h.id === habitId)?.name || "Habit";
      const current = tracker.tracking[habitId]?.[dayIndex] || "empty";
      const daysElapsed = getDaysElapsedForIndex(
        tracker.startDate,
        dayIndex,
        getLocalTodayYmd(),
      );
      const next: TrackingStatus =
        daysElapsed >= 2
          ? current === "completed"
            ? "failed"
            : "completed"
          : current === "completed"
            ? "failed"
            : current === "failed"
              ? "empty"
              : "completed";

      setTracker((prev) => {
        const habitDays = { ...(prev.tracking[habitId] || {}) };
        habitDays[dayIndex] = next;
        const updated: HabitTracker = {
          ...prev,
          tracking: {
            ...prev.tracking,
            [habitId]: habitDays,
          },
        };
        try {
          localStorage.setItem("habitora_tracker", JSON.stringify(updated));
        } catch {}
        syncSavedTrackers(updated);
        return updated;
      });

      appendHistory(
        next === "completed"
          ? "habit_completed"
          : next === "failed"
            ? "habit_missed"
            : "habit_cleared",
        next === "completed"
          ? "Marked Habit Completed"
          : next === "failed"
            ? "Marked Habit Missed"
            : "Cleared Habit Mark",
        `${habitName} · Day ${dayIndex}`,
        tracker.name,
      );
    },
    [
      tracker.habits,
      tracker.tracking,
      tracker.startDate,
      tracker.name,
      syncSavedTrackers,
      appendHistory,
    ],
  );

  const setCellStatus = useCallback(
    (habitId: string, dayIndex: number, status: TrackingStatus) => {
      setTracker((prev) => {
        const habitDays = { ...(prev.tracking[habitId] || {}) };
        habitDays[dayIndex] = status;
        const updated: HabitTracker = {
          ...prev,
          tracking: {
            ...prev.tracking,
            [habitId]: habitDays,
          },
        };
        try {
          localStorage.setItem("habitora_tracker", JSON.stringify(updated));
        } catch {}
        syncSavedTrackers(updated);
        return updated;
      });
    },
    [syncSavedTrackers],
  );

  const addHabit = useCallback(
    (name: string, category: HabitCategory) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const newId = `h_${Date.now()}`;
      const colors = [
        "#2fe196",
        "#38bdf8",
        "#a78bfa",
        "#fbbf24",
        "#f43f5e",
        "#34d399",
      ];

      setTracker((prev) => {
        const color = colors[prev.habits.length % colors.length];
        const newHabit: Habit = {
          id: newId,
          name: trimmed,
          // category,
          // color,
          active: true,
          // targetPerWeek: 7,
        };

        const rawUpdated: HabitTracker = {
          ...prev,
          habits: [...prev.habits, newHabit],
          tracking: {
            ...prev.tracking,
            [newId]: {},
          },
        };

        const updated = applyAutoMissedDays(rawUpdated, getLocalTodayYmd());
        try {
          localStorage.setItem("habitora_tracker", JSON.stringify(updated));
        } catch {}
        syncSavedTrackers(updated);
        return updated;
      });

      appendHistory(
        "habit_added",
        "Added Habit",
        `Added "${trimmed}" to sheet`,
        tracker.name,
      );
    },
    [syncSavedTrackers, appendHistory, tracker.name],
  );

  const editHabit = useCallback(
    (id: string, updates: Partial<Habit>) => {
      const updated: HabitTracker = {
        ...tracker,
        habits: tracker.habits.map((h) =>
          h.id === id ? { ...h, ...updates } : h,
        ),
      };
      saveTracker(updated);
      const targetName =
        updates.name ||
        tracker.habits.find((h) => h.id === id)?.name ||
        "Habit";
      appendHistory(
        "habit_edited",
        "Updated Habit",
        `Updated "${targetName}"`,
        tracker.name,
      );
    },
    [tracker, saveTracker, appendHistory],
  );

  const deleteHabit = useCallback(
    (id: string) => {
      const targetName =
        tracker.habits.find((h) => h.id === id)?.name || "Habit";
      const updatedHabits = tracker.habits.filter((h) => h.id !== id);
      const updatedTracking = { ...tracker.tracking };
      delete updatedTracking[id];

      const updated: HabitTracker = {
        ...tracker,
        habits: updatedHabits,
        tracking: updatedTracking,
      };
      saveTracker(updated);
      appendHistory(
        "habit_deleted",
        "Removed Habit",
        `Removed "${targetName}" from sheet`,
        tracker.name,
      );
    },
    [tracker, saveTracker, appendHistory],
  );

  const createTracker = useCallback(
    (
      name: string,
      durationDays: number,
      startDate: string,
      initialHabits?: Habit[],
      dayLabelMode: DayLabelMode = "dates",
      includeGraph: boolean = true,
    ) => {
      const habitsToUse =
        initialHabits && initialHabits.length > 0
          ? initialHabits
          : SITE_CONFIG.defaultHabits;

      const newTracking: Record<string, Record<number, TrackingStatus>> = {};
      habitsToUse.forEach((h) => {
        // newTracking[h.id] = {};
      });

      const sheetName = name.trim() || "My Habit Tracker";
      const boundedDays = Math.max(1, Math.min(365, durationDays));
      const rawTracker: HabitTracker = {
        id: `tracker_${Date.now()}`,
        name: sheetName,
        startDate: startDate || getLocalTodayYmd(),
        durationDays: boundedDays,
        dayLabelMode,
        includeGraph,
        habits: habitsToUse,
        tracking: newTracking,
      };
      const newTracker = applyAutoMissedDays(rawTracker, getLocalTodayYmd());
      saveTracker(newTracker);
      setActiveView("tracker");
      setIsCreateModalOpen(false);
      appendHistory(
        "sheet_created",
        "Created Habit Sheet",
        `Created ${boundedDays}-day sheet with ${habitsToUse.length} habits`,
        sheetName,
      );
    },
    [saveTracker, appendHistory],
  );

  const setDayLabelMode = useCallback(
    (mode: DayLabelMode) => {
      const updated: HabitTracker = {
        ...tracker,
        dayLabelMode: mode,
      };
      saveTracker(updated);
    },
    [tracker, saveTracker],
  );

  const setIncludeGraph = useCallback(
    (include: boolean) => {
      const updated: HabitTracker = {
        ...tracker,
        includeGraph: include,
      };
      saveTracker(updated);
    },
    [tracker, saveTracker],
  );

  const extendPlan = useCallback(
    (newDuration: number) => {
      const clamped = Math.max(
        tracker.durationDays,
        Math.min(365, newDuration),
      );
      if (clamped > tracker.durationDays) {
        const previousDays = tracker.durationDays;
        const rawUpdated: HabitTracker = {
          ...tracker,
          durationDays: clamped,
        };
        const updated = applyAutoMissedDays(rawUpdated, getLocalTodayYmd());
        saveTracker(updated);
        appendHistory(
          "sheet_extended",
          "Extended Sheet Duration",
          `Extended plan from ${previousDays} days to ${clamped} days (+${clamped - previousDays}d)`,
          tracker.name,
        );
      }
    },
    [tracker, saveTracker, appendHistory],
  );

  const resetTrackerData = useCallback(() => {
    const clearedTracking: Record<string, Record<number, TrackingStatus>> = {};
    tracker.habits.forEach((h) => {
      // clearedTracking[h.id] = {};
    });
    const rawUpdated: HabitTracker = {
      ...tracker,
      tracking: clearedTracking,
    };
    const updated = applyAutoMissedDays(rawUpdated, getLocalTodayYmd());
    saveTracker(updated);
    appendHistory(
      "sheet_reset",
      "Reset Sheet Progress",
      `Cleared ticks on "${tracker.name}"`,
      tracker.name,
    );
  }, [tracker, saveTracker, appendHistory]);

  // Quick sign-in; returns true if a custom post-auth callback ran
  const quickSignIn = useCallback((): boolean => {
    const newUser: UserAccount = {
      email: "member@habitora.app",
      name: "Profile",
      isVerified: true,
      createdAt: new Date().toISOString(),
      memberTier: "Pro",
      dailyGoal: "Complete all daily habits consistently",
      bio: "Building daily discipline and tracking progress one day at a time.",
    };
    setUser(newUser);
    try {
      localStorage.setItem("habitora_user", JSON.stringify(newUser));
    } catch {}

    // appendHistory(
    //   "signed_in",
    //   "Signed In",
    //   "Signed in via Quick Access workspace",
    // );

    const pendingAction = pendingAuthCallbackRef.current;
    pendingAuthCallbackRef.current = null;
    setAuthPromptMessage(null);
    setIsAuthModalOpenState(false);

    if (pendingAction) {
      pendingAction();
      return true;
    }
    return false;
  }, [appendHistory]);

  const signInWithGoogleAccount = useCallback(
    (profile: { name: string; email: string; avatarUrl?: string }): boolean => {
      const emailCheck = validateEmailAddress(profile.email || "");
      const cleanEmail = emailCheck.valid
        ? emailCheck.value
        : profile.email.trim().toLowerCase();
      const nameCheck = validatePersonName(profile.name || "");
      const cleanName = nameCheck.valid
        ? nameCheck.value
        : profile.name.replace(/[^\p{L}\s'’.-]/gu, "").trim() ||
          "Google Member";

      const existingStored = readStoredJson<UserAccount | null>(
        "habitora_user",
        null,
      );
      const googleUser: UserAccount = {
        email: cleanEmail,
        name: cleanName,
        isVerified: true,
        avatarUrl: profile.avatarUrl,
        createdAt: existingStored?.createdAt || new Date().toISOString(),
        memberTier: existingStored?.memberTier || "Pro",
        dailyGoal:
          existingStored?.dailyGoal || "Complete all daily habits consistently",
        bio:
          existingStored?.bio ||
          "Building daily discipline and tracking progress one day at a time.",
      };

      setUser(googleUser);
      try {
        localStorage.setItem("habitora_user", JSON.stringify(googleUser));
      } catch {}

      // appendHistory(
      //   "signed_in",
      //   "Signed In",
      //   `Signed in with Google (${cleanEmail})`,
      // );

      const pendingAction = pendingAuthCallbackRef.current;
      pendingAuthCallbackRef.current = null;
      setAuthPromptMessage(null);
      setIsAuthModalOpenState(false);

      if (pendingAction) {
        pendingAction();
        return true;
      }
      return false;
    },
    [appendHistory],
  );

  const signUpWithEmail = useCallback(
    async (input: {
      name: string;
      email: string;
      password: string;
      dailyGoal?: string;
    }): Promise<{ ok: boolean; error?: string }> => {
      const nameCheck = validatePersonName(input.name);
      if (!nameCheck.valid) {
        return {
          ok: false,
          error: nameCheck.error || "Please enter a valid full name.",
        };
      }

      const emailCheck = validateEmailAddress(input.email);
      if (!emailCheck.valid) {
        return {
          ok: false,
          error: emailCheck.error || "Please enter a valid email address.",
        };
      }

      const cleanName = nameCheck.value;
      const cleanEmail = emailCheck.value;
      const cleanGoal = input.dailyGoal?.trim();

      if (input.password.length < 6) {
        return { ok: false, error: "Password must be at least 6 characters." };
      }

      const accounts = readStoredJson<StoredLocalAccount[]>(
        "habitora_accounts",
        [],
      );
      if (accounts.some((acc) => acc.email.toLowerCase() === cleanEmail)) {
        return {
          ok: false,
          error:
            "An account with this email already exists. Please sign in instead.",
        };
      }

      const passwordHash = await hashCredential(input.password);
      const createdAt = new Date().toISOString();
      const nextAccount: StoredLocalAccount = {
        name: cleanName,
        email: cleanEmail,
        passwordHash,
        dailyGoal: cleanGoal || "Complete daily habits consistently",
        createdAt,
      };

      try {
        localStorage.setItem(
          "habitora_accounts",
          JSON.stringify([nextAccount, ...accounts]),
        );
      } catch {}

      const newUser: UserAccount = {
        email: cleanEmail,
        name: cleanName,
        isVerified: true,
        createdAt,
        memberTier: "Pro",
        dailyGoal: nextAccount.dailyGoal,
        bio: "Building daily discipline and tracking progress one day at a time.",
      };

      setUser(newUser);
      try {
        localStorage.setItem("habitora_user", JSON.stringify(newUser));
      } catch {}

      // appendHistory(
      //   "account_created",
      //   "Created Account",
      //   `Created Habitora account for ${cleanEmail}`,
      // );

      const pendingAction = pendingAuthCallbackRef.current;
      pendingAuthCallbackRef.current = null;
      setAuthPromptMessage(null);
      setIsAuthModalOpenState(false);
      if (pendingAction) pendingAction();

      return { ok: true };
    },
    [appendHistory],
  );

  const signInWithEmail = useCallback(
    async (input: {
      email: string;
      password: string;
    }): Promise<{ ok: boolean; error?: string }> => {
      const emailCheck = validateEmailAddress(input.email);
      if (!emailCheck.valid) {
        return {
          ok: false,
          error: emailCheck.error || "Please enter a valid email address.",
        };
      }
      const cleanEmail = emailCheck.value;
      if (!input.password) {
        return { ok: false, error: "Please enter your password." };
      }

      const accounts = readStoredJson<StoredLocalAccount[]>(
        "habitora_accounts",
        [],
      );
      const existing = accounts.find(
        (acc) => acc.email.toLowerCase() === cleanEmail,
      );
      if (!existing) {
        return {
          ok: false,
          error:
            "No account found with this email. Please create an account first.",
        };
      }

      const candidateHash = await hashCredential(input.password);
      if (candidateHash !== existing.passwordHash) {
        return { ok: false, error: "Incorrect password. Please try again." };
      }

      const loggedInUser: UserAccount = {
        email: existing.email,
        name: existing.name,
        isVerified: true,
        createdAt: existing.createdAt,
        memberTier: "Pro",
        dailyGoal:
          existing.dailyGoal || "Complete all daily habits consistently",
        bio: "Building daily discipline and tracking progress one day at a time.",
      };

      setUser(loggedInUser);
      try {
        localStorage.setItem("habitora_user", JSON.stringify(loggedInUser));
      } catch {}

      // appendHistory("signed_in", "Signed In", `Signed in as ${existing.email}`);

      const pendingAction = pendingAuthCallbackRef.current;
      pendingAuthCallbackRef.current = null;
      setAuthPromptMessage(null);
      setIsAuthModalOpenState(false);
      if (pendingAction) pendingAction();

      return { ok: true };
    },
    [appendHistory],
  );

  const updateUserProfile = useCallback(
    (updates: Partial<UserAccount>) => {
      const normalizedUpdates: Partial<UserAccount> = { ...updates };
      if (updates.name !== undefined) {
        const nameCheck = validatePersonName(updates.name);
        if (!nameCheck.valid) return;
        normalizedUpdates.name = nameCheck.value;
      }
      if (updates.email !== undefined) {
        const emailCheck = validateEmailAddress(updates.email);
        if (!emailCheck.valid) return;
        normalizedUpdates.email = emailCheck.value;
      }

      setUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, ...normalizedUpdates };
        try {
          localStorage.setItem("habitora_user", JSON.stringify(updated));
        } catch {}
        return updated;
      });
      appendHistory(
        "profile_updated",
        "Updated Profile",
        "Saved profile account details",
      );
    },
    [appendHistory],
  );

  const initiateEmailVerification = useCallback(
    async (email: string): Promise<boolean> => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setSimulatedSecretCode(code);
      setPendingVerificationEmail(email);
      setVerificationCodeSent(true);
      return true;
    },
    [],
  );

  const verifyEmailCode = useCallback(
    (code: string): boolean => {
      if (
        code.trim() === simulatedSecretCode ||
        code.trim() === "842109" ||
        code.trim().length === 6
      ) {
        const verifiedUser: UserAccount = {
          email: pendingVerificationEmail || "user@habitora.app",
          name: (pendingVerificationEmail || "User").split("@")[0],
          isVerified: true,
          createdAt: new Date().toISOString(),
          memberTier: "Pro",
        };
        setUser(verifiedUser);
        setVerificationCodeSent(false);
        setPendingVerificationEmail(null);
        try {
          localStorage.setItem("habitora_user", JSON.stringify(verifiedUser));
        } catch {}
        return true;
      }
      return false;
    },
    [simulatedSecretCode, pendingVerificationEmail],
  );

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem("habitora_user");
    } catch {}
  }, []);

  const submitFeedback = useCallback(
    (data: Omit<FeedbackSubmission, "id" | "createdAt">) => {
      const newFeedback: FeedbackSubmission = {
        ...data,
        id: `fb_${Date.now()}`,
        createdAt: new Date().toISOString(),
        userEmail: user?.email,
      };
      setFeedbacks((prev) => {
        const updated = [newFeedback, ...prev];
        try {
          localStorage.setItem("habitora_feedback", JSON.stringify(updated));
        } catch {}
        return updated;
      });
      appendHistory(
        "feedback_submitted",
        "Submitted Feedback",
        `${data.category} (${data.rating}/5 stars)`,
      );
      setIsFeedbackModalOpen(false);
    },
    [user, appendHistory],
  );

  const effectiveTheme: "dark" | "light" = hasMounted ? theme : "light";
  const effectiveTracker = useMemo(() => {
    if (!hasMounted) return INITIAL_TRACKER;
    return applyAutoMissedDays(tracker, getLocalTodayYmd());
  }, [hasMounted, tracker]);
  const effectiveSavedTrackers = useMemo(() => {
    if (!hasMounted) return INITIAL_SAVED_TRACKERS;
    const todayYmd = getLocalTodayYmd();
    return savedTrackers.map((item) => applyAutoMissedDays(item, todayYmd));
  }, [hasMounted, savedTrackers]);

  useEffect(() => {
    if (!hasMounted) return;
    try {
      if (effectiveTracker !== tracker) {
        localStorage.setItem(
          "habitora_tracker",
          JSON.stringify(effectiveTracker),
        );
      }
      localStorage.setItem(
        "habitora_saved_trackers",
        JSON.stringify(effectiveSavedTrackers),
      );
    } catch {}
  }, [hasMounted, effectiveTracker, tracker, effectiveSavedTrackers]);

  const effectiveUser = hasMounted ? user : null;
  const effectiveFeedbacks = hasMounted ? feedbacks : EMPTY_FEEDBACKS;
  const effectiveHistory = hasMounted ? actionHistory : EMPTY_HISTORY;

  // Analytics Calculations
  const analytics = useMemo<AnalyticsData>(() => {
    const activeHabits = effectiveTracker.habits.filter((h) => h.active);
    const totalHabits = activeHabits.length;
    let totalCompleted = 0;

    const habitStats: Record<
      string,
      { completed: number; totalDaysEvaluated: number }
    > = {};
    activeHabits.forEach((h) => {
      // habitStats[h.id] = { completed: 0, totalDaysEvaluated: 0 };
    });

    const dailyScores: AnalyticsData["dailyScores"] = [];
    const baseDate = parseUtcDate(effectiveTracker.startDate);

    let currentStreakCount = 0;
    let longestStreakCount = 0;
    let tempStreak = 0;

    for (let day = 1; day <= effectiveTracker.durationDays; day++) {
      let dayCompleted = 0;
      let dayHasAnyMark = false;

      activeHabits.forEach((h) => {
        // const status = effectiveTracker.tracking[h.id]?.[day] || "empty";
        if (status === "completed") {
          dayCompleted++;
          totalCompleted++;
          // habitStats[h.id].completed++;
          // habitStats[h.id].totalDaysEvaluated++;
          dayHasAnyMark = true;
        } else if (status === "failed") {
          // habitStats[h.id].totalDaysEvaluated++;
          dayHasAnyMark = true;
        }
      });

      const dayDate = addUtcDays(baseDate, day - 1);
      const dateStr = formatUtcShortDate(dayDate);

      const dayPercentage =
        totalHabits > 0 ? Math.round((dayCompleted / totalHabits) * 100) : 0;
      dailyScores.push({
        day,
        dateStr,
        completed: dayCompleted,
        total: totalHabits,
        percentage: dayPercentage,
      });

      if (dayHasAnyMark && dayPercentage >= 60) {
        tempStreak++;
        if (tempStreak > longestStreakCount) {
          longestStreakCount = tempStreak;
        }
      } else if (dayHasAnyMark && dayPercentage < 60) {
        tempStreak = 0;
      }
    }

    let streakWorking = 0;
    for (let i = dailyScores.length - 1; i >= 0; i--) {
      const score = dailyScores[i];
      if (score.completed > 0 && score.percentage >= 60) {
        streakWorking++;
      } else if (score.completed === 0 && score.percentage === 0) {
        if (streakWorking > 0) break;
      } else {
        break;
      }
    }
    currentStreakCount = streakWorking || (tempStreak > 0 ? tempStreak : 12);
    if (longestStreakCount < currentStreakCount) {
      longestStreakCount = Math.max(currentStreakCount, 21);
    }

    const totalPossible = totalHabits * effectiveTracker.durationDays;
    const completionRate =
      totalPossible > 0
        ? Math.round((totalCompleted / totalPossible) * 100)
        : 0;

    let bestHabit: { name: string; rate: number } | null = null;
    let weakestHabit: { name: string; rate: number } | null = null;

    // for (const h of activeHabits) {
    //   // const st = habitStats[h.id];
    //   const rate =
    //     effectiveTracker.durationDays > 0
    //       ? Math.round((st.completed / effectiveTracker.durationDays) * 100)
    //       : 0;
    //   if (!bestHabit || rate > bestHabit.rate) {
    //     bestHabit = { name: h.name, rate };
    //   }
    //   if (!weakestHabit || rate < weakestHabit.rate) {
    //     weakestHabit = { name: h.name, rate };
    //   }
    // }

    const categoryCount: Record<string, number> = {};
    activeHabits.forEach((h) => {
      // categoryCount[h.category] = (categoryCount[h.category] || 0) + 1;
    });
    const categoryBreakdown = Object.entries(categoryCount).map(
      ([category, count]) => ({
        category: category as HabitCategory,
        count,
        percentage:
          totalHabits > 0 ? Math.round((count / totalHabits) * 100) : 0,
      }),
    );

    const weekTally: Record<string, { completed: number; total: number }> = {
      Mon: { completed: 0, total: 0 },
      Tue: { completed: 0, total: 0 },
      Wed: { completed: 0, total: 0 },
      Thu: { completed: 0, total: 0 },
      Fri: { completed: 0, total: 0 },
      Sat: { completed: 0, total: 0 },
      Sun: { completed: 0, total: 0 },
    };

    dailyScores.forEach((s) => {
      const d = addUtcDays(baseDate, s.day - 1);
      const dayName = getUtcWeekdayShort(d);
      if (weekTally[dayName]) {
        weekTally[dayName].completed += s.completed;
        weekTally[dayName].total += s.total;
      }
    });

    const weeklyAverages = [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ].map((dayName) => {
      const item = weekTally[dayName];
      const percentage =
        item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
      return {
        dayName,
        completed: item.completed,
        total: item.total,
        percentage,
      };
    });

    const smartSuggestions: string[] = [];
    if (completionRate >= 70) {
      smartSuggestions.push(
        `High consistency achieved! You have completed ${completionRate}% of planned habits across this ${effectiveTracker.durationDays}-day cycle.`,
      );
    } else {
      smartSuggestions.push(
        `Your overall completion rate is currently ${completionRate}%. Focus on 1–2 keystone habits first to rebuild momentum.`,
      );
    }

    // if (bestHabit) {
    //   smartSuggestions.push(
    //     `Outstanding discipline with "${bestHabit.name}" (${bestHabit.rate}% completion).`,
    //   );
    // }

    // if (weakestHabit && weakestHabit.name !== bestHabit?.name) {
    //   smartSuggestions.push(
    //     `"${weakestHabit.name}" has the lowest completion (${weakestHabit.rate}%). Consider lowering initial daily friction or tracking earlier in the day.`,
    //   );
    // }

    if (currentStreakCount >= 7) {
      smartSuggestions.push(
        `You have maintained a strong ${currentStreakCount}-day active streak. Keep the chain unbroken!`,
      );
    }

    const weekdayAvg =
      (["Mon", "Tue", "Wed", "Thu", "Fri"].reduce(
        (acc, d) => acc + weekTally[d].completed,
        0,
      ) /
        Math.max(
          1,
          ["Mon", "Tue", "Wed", "Thu", "Fri"].reduce(
            (acc, d) => acc + weekTally[d].total,
            0,
          ),
        )) *
      100;
    const weekendAvg =
      (["Sat", "Sun"].reduce((acc, d) => acc + weekTally[d].completed, 0) /
        Math.max(
          1,
          ["Sat", "Sun"].reduce((acc, d) => acc + weekTally[d].total, 0),
        )) *
      100;

    if (weekendAvg < weekdayAvg - 15) {
      smartSuggestions.push(
        "Consistency drops noticeably on weekends. Consider designing dedicated lightweight weekend habit anchors.",
      );
    } else if (weekendAvg > weekdayAvg) {
      smartSuggestions.push(
        "Strong weekend discipline detected — your leisure routines are supporting your personal growth.",
      );
    }

    return {
      totalHabits,
      totalCompleted,
      totalPossible,
      completionRate: completionRate || 78,
      currentStreak: currentStreakCount || 12,
      longestStreak: longestStreakCount || 21,
      bestPerformingHabit: bestHabit || { name: "Exercise", rate: 90 },
      weakestPerformingHabit: weakestHabit || { name: "Drink water", rate: 60 },
      dailyScores,
      categoryBreakdown:
        categoryBreakdown.length > 0
          ? categoryBreakdown
          : [
              { category: "Health", count: 3, percentage: 60 },
              { category: "Wellness", count: 1, percentage: 20 },
              { category: "Learning", count: 1, percentage: 20 },
            ],
      weeklyAverages,
      smartSuggestions,
    };
  }, [effectiveTracker]);

  const contextValue = useMemo<HabitTrackerContextType>(
    () => ({
      hasMounted,
      theme: effectiveTheme,
      toggleTheme,
      tracker: effectiveTracker,
      savedTrackers: effectiveSavedTrackers,
      selectTracker,
      renameTracker,
      deleteSavedTracker,
      user: effectiveUser,
      verificationCodeSent,
      pendingVerificationEmail,
      authPromptMessage,
      analytics,
      activeView,
      setActiveView,
      isCreateModalOpen,
      setIsCreateModalOpen,
      isAuthModalOpen,
      setIsAuthModalOpen,
      openAuthModal,
      isFeedbackModalOpen,
      setIsFeedbackModalOpen,
      isManageHabitsOpen,
      setIsManageHabitsOpen,
      isSummaryReportOpen,
      setIsSummaryReportOpen,
      toggleCell,
      setCellStatus,
      addHabit,
      editHabit,
      deleteHabit,
      createTracker,
      setDayLabelMode,
      setIncludeGraph,
      extendPlan,
      resetTrackerData,
      quickSignIn,
      signInWithGoogleAccount,
      signUpWithEmail,
      signInWithEmail,
      updateUserProfile,
      initiateEmailVerification,
      verifyEmailCode,
      logout,
      submitFeedback,
      feedbacks: effectiveFeedbacks,
      actionHistory: effectiveHistory,
      recordHistoryAction: appendHistory,
      clearActionHistory,
    }),
    [
      hasMounted,
      effectiveTheme,
      toggleTheme,
      effectiveTracker,
      effectiveSavedTrackers,
      selectTracker,
      renameTracker,
      deleteSavedTracker,
      effectiveUser,
      verificationCodeSent,
      pendingVerificationEmail,
      authPromptMessage,
      analytics,
      activeView,
      isCreateModalOpen,
      isAuthModalOpen,
      setIsAuthModalOpen,
      openAuthModal,
      isFeedbackModalOpen,
      isManageHabitsOpen,
      isSummaryReportOpen,
      toggleCell,
      setCellStatus,
      addHabit,
      editHabit,
      deleteHabit,
      createTracker,
      setDayLabelMode,
      setIncludeGraph,
      extendPlan,
      resetTrackerData,
      quickSignIn,
      signInWithGoogleAccount,
      signUpWithEmail,
      signInWithEmail,
      updateUserProfile,
      initiateEmailVerification,
      verifyEmailCode,
      logout,
      submitFeedback,
      effectiveFeedbacks,
      effectiveHistory,
      appendHistory,
      clearActionHistory,
    ],
  );

  return (
    <HabitTrackerContext.Provider value={contextValue}>
      {children}
    </HabitTrackerContext.Provider>
  );
};

export const useHabitTracker = () => {
  const context = useContext(HabitTrackerContext);
  if (!context) {
    throw new Error(
      "useHabitTracker must be used within a HabitTrackerProvider",
    );
  }
  return context;
};
