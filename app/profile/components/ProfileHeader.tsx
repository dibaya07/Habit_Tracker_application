'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, LogOut } from 'lucide-react';
import { UserAccount } from '@/lib/types/tracker';

interface ProfileHeaderProps {
  user: UserAccount;
  onSignOut: () => void;
}

export default function ProfileHeader({ user, onSignOut }: ProfileHeaderProps) {
  const joinedLabel = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#dce8df] dark:border-emerald-900/40 pb-6">
      <div className="space-y-2">
        <Link
          href="/dashboard"
          prefetch={false}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-emerald-300 hover:text-[#183f2e] dark:hover:text-[#2fe196] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-4 pt-1">
          <div className="w-14 h-14 rounded-2xl bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912] font-editorial text-2xl flex items-center justify-center shrink-0">
            {(user.name || 'P').charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#123524] dark:text-white leading-tight">
              {!user.name || user.name === 'Habitora Member' ? 'Profile' : user.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-300/80 flex flex-wrap items-center gap-2 mt-0.5">
              <span>{user.email}</span>
              <span aria-hidden="true">·</span>
              <span>Joined {joinedLabel}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={onSignOut}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-emerald-800/70 bg-white dark:bg-[#091f17] text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
