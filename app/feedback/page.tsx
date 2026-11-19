import type { Metadata } from 'next';
import FeedbackPageClient from './components/FeedbackPageClient';

export const metadata: Metadata = {
  title: 'Feedback & Suggestions',
  description:
    'Share feedback, feature ideas, or suggestions directly with the Habitora team to improve your daily habit tracker.',
  alternates: {
    canonical: '/feedback',
  },
  openGraph: {
    title: 'Feedback & Suggestions | Habitora',
    description:
      'Help shape Habitora by sending product feedback, bug reports, or new habit tracking ideas.',
    url: '/feedback',
  },
};

export default function FeedbackPage() {
  return (
    <main className="flex-1 py-10 sm:py-14 bg-[#fafcf9] dark:bg-[#071912]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[#dce8df] dark:border-emerald-900/40 pb-6 space-y-1.5">
          <span className="text-[11px] font-semibold tracking-[0.2em] text-emerald-700 dark:text-[#2fe196] uppercase block">
            COMMUNITY VOICE
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#123524] dark:text-white leading-tight">
            Share Feedback &amp; Suggestions
          </h1>
          <p className="text-sm text-slate-600 dark:text-emerald-100/75 max-w-2xl">
            Have an idea for a better habit sheet, printable layout, or dashboard tool? Let us know below.
          </p>
        </div>

        <FeedbackPageClient />
      </div>
    </main>
  );
}
