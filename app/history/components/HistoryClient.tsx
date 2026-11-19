'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useHabitTracker } from '@/lib/context/HabitTrackerContext';
import ActionHistoryCard from '@/app/profile/components/ActionHistoryCard';

export default function HistoryClient() {
  const { hasMounted, actionHistory, clearActionHistory, user } = useHabitTracker();

  if (!hasMounted) {
    return <div className="py-12" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={user ? '/dashboard' : '/'}
          prefetch={false}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-emerald-300 hover:text-[#183f2e] dark:hover:text-[#2fe196] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{user ? 'Back to Dashboard' : 'Back to Home'}</span>
        </Link>

        {user && (
          <Link
            href="/profile"
            className="text-xs font-semibold text-[#183f2e] dark:text-[#2fe196] hover:underline"
          >
            View Created Sheets &amp; Profile
          </Link>
        )}
      </div>

      <ActionHistoryCard
        entries={actionHistory}
        onClearHistory={clearActionHistory}
      />
    </div>
  );
}
