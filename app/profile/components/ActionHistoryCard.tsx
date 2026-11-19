'use client';

import React, { useMemo, useState } from 'react';
import {
  CalendarPlus,
  Check,
  Coffee,
  Edit3,
  FilePlus,
  History,
  MessageSquare,
  Plus,
  RotateCcw,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { ActionHistoryEntry, ActionHistoryType } from '@/lib/types/tracker';

interface ActionHistoryCardProps {
  entries: ActionHistoryEntry[];
  onClearHistory: () => void;
}

type FilterScope = 'all' | 'habits' | 'sheets' | 'account';

function getActionBadge(type: ActionHistoryType) {
  switch (type) {
    case 'habit_completed':
      return {
        icon: Check,
        className: 'bg-emerald-500/15 text-emerald-700 dark:text-[#2fe196]',
      };
    case 'habit_missed':
      return {
        icon: X,
        className: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
      };
    case 'habit_added':
      return {
        icon: Plus,
        className: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
      };
    case 'habit_edited':
    case 'sheet_renamed':
      return {
        icon: Edit3,
        className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
      };
    case 'habit_deleted':
    case 'sheet_deleted':
      return {
        icon: Trash2,
        className: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
      };
    case 'sheet_created':
      return {
        icon: FilePlus,
        className: 'bg-emerald-500/15 text-emerald-700 dark:text-[#2fe196]',
      };
    case 'sheet_extended':
      return {
        icon: CalendarPlus,
        className: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
      };
    case 'sheet_reset':
    case 'habit_cleared':
      return {
        icon: RotateCcw,
        className: 'bg-slate-200 dark:bg-emerald-900/60 text-slate-600 dark:text-emerald-300',
      };
    case 'feedback_submitted':
      return {
        icon: MessageSquare,
        className: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
      };
    case 'support_coffee':
      return {
        icon: Coffee,
        className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
      };
    default:
      return {
        icon: User,
        className: 'bg-emerald-500/15 text-emerald-700 dark:text-[#2fe196]',
      };
  }
}

export default function ActionHistoryCard({
  entries,
  onClearHistory,
}: ActionHistoryCardProps) {
  const [filter, setFilter] = useState<FilterScope>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  const filteredEntries = useMemo(() => {
    if (filter === 'all') return entries;
    return entries.filter((entry) => {
      if (filter === 'habits') return entry.type.startsWith('habit_');
      if (filter === 'sheets') return entry.type.startsWith('sheet_');
      return (
        entry.type === 'profile_updated' ||
        entry.type === 'feedback_submitted' ||
        entry.type === 'support_coffee'
      );
    });
  }, [entries, filter]);

  return (
    <section
      id="history"
      className="rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-6 shadow-sm space-y-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-emerald-900/40 pb-4">
        <div className="space-y-0.5">
          <h2 className="font-editorial text-xl sm:text-2xl font-normal text-[#123524] dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-[#183f2e] dark:text-[#2fe196]" />
            <span>Action History ({filteredEntries.length})</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-emerald-300/75">
            Recorded habit updates, sheet extensions, creations, and account actions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-emerald-950/70 border border-slate-200 dark:border-emerald-800/50">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'habits', label: 'Habits' },
                { id: 'sheets', label: 'Sheets' },
                { id: 'account', label: 'Account' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  filter === tab.id
                    ? 'bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912]'
                    : 'text-slate-600 dark:text-emerald-200/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {entries.length > 0 && (
            confirmClear ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs">
                <span className="text-rose-700 dark:text-rose-300 font-medium">
                  Clear history?
                </span>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="px-2 py-0.5 rounded bg-white dark:bg-[#091f17] border border-slate-200 dark:border-emerald-800 text-slate-700 dark:text-emerald-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClearHistory();
                    setConfirmClear(false);
                  }}
                  className="px-2 py-0.5 rounded bg-rose-600 text-white font-semibold cursor-pointer"
                >
                  Clear
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="px-3 py-1.5 rounded-xl text-[11px] font-semibold border border-slate-200 dark:border-emerald-800/60 text-slate-600 dark:text-emerald-200 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 transition-colors cursor-pointer"
              >
                Clear Log
              </button>
            )
          )}
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500 dark:text-emerald-300/70">
          No recorded actions yet. Complete a habit, extend a sheet, or create a new sheet to see your activity log here.
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
          {filteredEntries.map((entry) => {
            const { icon: Icon, className } = getActionBadge(entry.type);
            return (
              <div
                key={entry.id}
                className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-emerald-950/35 border border-slate-200/80 dark:border-emerald-900/40 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${className}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">
                        {entry.title}
                      </span>
                      {entry.sheetName && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white dark:bg-[#081d15] border border-slate-200 dark:border-emerald-800/60 text-slate-600 dark:text-emerald-200">
                          {entry.sheetName}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-emerald-200/75 mt-0.5 break-words">
                      {entry.detail}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono tabular-nums text-slate-400 dark:text-emerald-400/65 shrink-0 whitespace-nowrap">
                  {new Date(entry.timestamp).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
