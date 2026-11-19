import type { Metadata } from 'next';
import HistoryClient from './components/HistoryClient';

export const metadata: Metadata = {
  title: 'Action History',
  description:
    'Review your full record of habit check-ins, created habit sheets, extended plans, and account actions.',
  alternates: {
    canonical: '/history',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function HistoryPage() {
  return (
    <main className="flex-1 py-10 sm:py-14 bg-[#fafcf9] dark:bg-[#071912]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-[#dce8df] dark:border-emerald-900/40 pb-5 space-y-1">
          <span className="text-[11px] font-semibold tracking-[0.2em] text-emerald-700 dark:text-[#2fe196] uppercase block">
            ACTIVITY RECORDS
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#123524] dark:text-white leading-tight">
            Action History
          </h1>
          <p className="text-sm text-slate-600 dark:text-emerald-100/75">
            Every habit check-in, created sheet, and plan extension recorded cleanly in chronological order.
          </p>
        </div>

        <HistoryClient />
      </div>
    </main>
  );
}
