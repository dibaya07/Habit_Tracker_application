'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, LayoutDashboard, LogIn } from 'lucide-react';
import { useHabitTracker } from '@/lib/context/HabitTrackerContext';
import DashboardOverview from '@/components/dashboard/DashboardOverview';

const AddHabitModal = dynamic(
  () => import('@/components/modals/AddHabitModal'),
  { ssr: false }
);

export default function DashboardWorkspace() {
  const { hasMounted, user, quickSignIn, isCreateModalOpen } = useHabitTracker();

  if (!hasMounted) {
    return <main className="flex-1 bg-[#fafcf9] dark:bg-[#071912]" />;
  }

  return (
    <main className="flex-1 bg-[#fafcf9] dark:bg-[#071912] text-[#123524] dark:text-slate-100 transition-colors duration-200">
      {!user ? (
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-8 sm:p-10 text-center shadow-sm space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-[#eaf3ed] dark:bg-emerald-500/15 text-[#183f2e] dark:text-[#2fe196] flex items-center justify-center mx-auto">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h1 className="font-editorial text-3xl font-normal text-[#123524] dark:text-white">
                Sign In to Open Your Dashboard
              </h1>
              <p className="text-sm text-slate-600 dark:text-emerald-100/75">
                Access your daily habit check-ins, active streaks, and saved habit sheets.
              </p>
            </div>
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={quickSignIn}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] shadow-sm transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Habitora</span>
              </button>
              <Link
                href="/create_tracker"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-slate-300 dark:border-emerald-800/70 bg-white dark:bg-[#091f17] text-slate-800 dark:text-emerald-100 hover:border-[#183f2e] dark:hover:border-[#2fe196] transition-colors"
              >
                <span>Or Create a Habit Sheet</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <DashboardOverview />
      )}

      {isCreateModalOpen ? <AddHabitModal /> : null}
    </main>
  );
}
