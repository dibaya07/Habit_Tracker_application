'use client';

import React, { useState } from 'react';
import { Check, Edit3, Layers, Trash2, X } from 'lucide-react';
import { HabitTracker } from '@/lib/types/tracker';

interface SheetManagerBarProps {
  savedTrackers: HabitTracker[];
  activeTrackerId: string;
  onSelect: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

const SheetManagerBar = React.memo(function SheetManagerBar({
  savedTrackers,
  activeTrackerId,
  onSelect,
  onRename,
  onDelete,
}: SheetManagerBarProps) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (savedTrackers.length <= 1) return null;

  const startRename = (sheet: HabitTracker) => {
    setConfirmDeleteId(null);
    setRenamingId(sheet.id);
    setRenameValue(sheet.name);
  };

  const submitRename = (id: string) => {
    if (renameValue.trim()) {
      onRename(id, renameValue.trim());
    }
    setRenamingId(null);
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#091f17] border border-slate-200 dark:border-emerald-900/50 p-3.5 sm:px-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-emerald-300/75 mr-1 shrink-0">
          <Layers className="w-3.5 h-3.5 text-[#183f2e] dark:text-[#2fe196]" />
          <span>Manage Sheets ({savedTrackers.length}):</span>
        </span>

        {savedTrackers.map((sheet) => {
          const isActive = sheet.id === activeTrackerId;
          const isRenaming = renamingId === sheet.id;
          const isConfirmingDelete = confirmDeleteId === sheet.id;

          if (isRenaming) {
            return (
              <div
                key={sheet.id}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-xl border border-[#183f2e] dark:border-[#2fe196] bg-[#fafcf9] dark:bg-emerald-950/60"
              >
                <input
                  type="text"
                  autoFocus
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      submitRename(sheet.id);
                    } else if (e.key === 'Escape') {
                      setRenamingId(null);
                    }
                  }}
                  aria-label="Rename habit sheet"
                  className="w-36 bg-transparent text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => submitRename(sheet.id)}
                  title="Save sheet name"
                  aria-label="Save sheet name"
                  className="p-1 rounded-md text-emerald-700 dark:text-[#2fe196] hover:bg-emerald-500/15 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setRenamingId(null)}
                  title="Cancel rename"
                  aria-label="Cancel rename"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          }

          if (isConfirmingDelete) {
            return (
              <div
                key={sheet.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs"
              >
                <span className="text-rose-700 dark:text-rose-300 font-medium truncate max-w-[140px]">
                  Delete {sheet.name}?
                </span>
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-[#091f17] border border-slate-200 dark:border-emerald-800 text-[11px] font-medium text-slate-700 dark:text-emerald-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(sheet.id);
                    setConfirmDeleteId(null);
                  }}
                  className="px-2 py-0.5 rounded-md bg-rose-600 hover:bg-rose-700 text-[11px] font-semibold text-white cursor-pointer"
                >
                  Delete
                </button>
              </div>
            );
          }

          return (
            <div
              key={sheet.id}
              className={`inline-flex items-center rounded-xl border transition-colors ${
                isActive
                  ? 'bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912] border-[#183f2e] dark:border-[#2fe196]'
                  : 'bg-slate-50 dark:bg-emerald-950/50 text-slate-700 dark:text-emerald-100 border-slate-200 dark:border-emerald-800/60 hover:border-[#183f2e] dark:hover:border-[#2fe196]'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(sheet.id)}
                className="px-3 py-1.5 text-xs font-semibold cursor-pointer whitespace-nowrap"
              >
                {sheet.name} ({sheet.durationDays}d)
              </button>

              <div
                className={`flex items-center pr-1.5 border-l ${
                  isActive
                    ? 'border-white/20 dark:border-[#071912]/20'
                    : 'border-slate-200 dark:border-emerald-800/50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => startRename(sheet)}
                  title={`Rename ${sheet.name}`}
                  aria-label={`Rename ${sheet.name}`}
                  className={`p-1 rounded-md transition-colors cursor-pointer ${
                    isActive
                      ? 'text-white/80 hover:text-white dark:text-[#071912]/80 dark:hover:text-[#071912]'
                      : 'text-slate-400 hover:text-[#183f2e] dark:text-emerald-300/60 dark:hover:text-[#2fe196]'
                  }`}
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRenamingId(null);
                    setConfirmDeleteId(sheet.id);
                  }}
                  title={`Delete ${sheet.name}`}
                  aria-label={`Delete ${sheet.name}`}
                  className={`p-1 rounded-md transition-colors cursor-pointer ${
                    isActive
                      ? 'text-white/80 hover:text-rose-200 dark:text-[#071912]/80 dark:hover:text-rose-700'
                      : 'text-slate-400 hover:text-rose-600 dark:text-emerald-300/60 dark:hover:text-rose-400'
                  }`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default SheetManagerBar;
