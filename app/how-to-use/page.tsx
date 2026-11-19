import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  Clock,
  FileText,
  Layers,
  Plus,
  Printer,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react';
import BrandMark from '@/components/ui/BrandMark';

const HOW_TITLE = 'How to Use Habitora';
const HOW_DESCRIPTION =
  'A simple, visual step-by-step guide to creating custom habit sheets, marking daily check-ins, using the 2-day auto-missed rule, and printing 1-page or 2-page PDFs.';

export const metadata: Metadata = {
  title: HOW_TITLE,
  description: HOW_DESCRIPTION,
  alternates: {
    canonical: '/how-to-use',
  },
  openGraph: {
    type: 'article',
    title: `${HOW_TITLE} | Habitora`,
    description: HOW_DESCRIPTION,
    url: '/how-to-use',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${HOW_TITLE} | Habitora`,
    description: HOW_DESCRIPTION,
  },
};

export default function HowToUsePage() {
  return (
    <main className="flex-1 py-10 sm:py-14 bg-[#fafcf9] dark:bg-[#071912]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Intro */}
        <header className="border-b border-[#dce8df] dark:border-emerald-900/40 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-emerald-700 dark:text-[#2fe196] uppercase block">
              VISUAL GUIDE · 4 QUICK STEPS
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#123524] dark:text-white leading-tight">
              How Habitora Works
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-emerald-100/75">
              Build a custom habit sheet in under a minute, print it cleanly or track daily online with clear analytics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/create_tracker"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] shadow-xs transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Create a Sheet</span>
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 dark:border-emerald-800/70 bg-white dark:bg-[#091f17] text-slate-800 dark:text-emerald-100 hover:border-[#183f2e] dark:hover:border-[#2fe196] transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-[#183f2e] dark:text-[#2fe196]" />
              <span>Browse Templates</span>
            </Link>
          </div>
        </header>

        {/* Visual Flow Steps (Pure Flexbox, 2-column on md+) */}
        <section aria-label="Step by step visual workflow" className="flex flex-wrap gap-6">
          {/* STEP 1 */}
          <article className="w-full md:w-[calc(50%-0.75rem)] rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-[#2fe196]">
                  Step 01 · Build or Pick Template
                </span>
                <FileText className="w-4 h-4 text-[#183f2e] dark:text-[#2fe196]" />
              </div>
              <h2 className="font-editorial text-2xl text-[#123524] dark:text-white">
                Design Your Sheet
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100/75 leading-relaxed">
                Pick a duration (21, 30, or custom days), add habits, or leave the sheet title blank to write by hand after printing.
              </p>
            </div>

            {/* Visual Mockup: Mini Builder Sheet */}
            <div className="rounded-2xl border border-slate-200 dark:border-emerald-900/50 bg-[#fafcf9] dark:bg-[#071912] p-4 space-y-3">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-emerald-900/40 pb-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <BrandMark size={22} />
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[10px] font-semibold uppercase text-slate-400">Name:</span>
                    <span className="inline-block w-24 border-b border-dashed border-slate-400 dark:border-emerald-700 h-3" />
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#eaf3ed] dark:bg-emerald-900/50 text-[#183f2e] dark:text-[#2fe196] font-semibold">
                  30 Days
                </span>
              </div>

              <div className="space-y-2">
                {['Drink 2L Water', 'Read 20 Pages', 'Morning Walk'].map((label, idx) => (
                  <div key={label} className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-slate-700 dark:text-emerald-100 font-medium truncate">
                      {idx + 1}. {label}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {[1, 2, 3, 4, 5].map((d) => (
                        <span
                          key={d}
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            idx === 0 && d <= 2
                              ? 'bg-[#183f2e] dark:bg-[#2fe196] border-[#183f2e] dark:border-[#2fe196] text-white dark:text-[#071912]'
                              : 'border-slate-300 dark:border-emerald-800'
                          }`}
                        >
                          {idx === 0 && d <= 2 && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* STEP 2 */}
          <article className="w-full md:w-[calc(50%-0.75rem)] rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-[#2fe196]">
                  Step 02 · Daily Check-In
                </span>
                <Clock className="w-4 h-4 text-[#183f2e] dark:text-[#2fe196]" />
              </div>
              <h2 className="font-editorial text-2xl text-[#123524] dark:text-white">
                Mark Today — 2-Day Rule
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100/75 leading-relaxed">
                Open your Dashboard each day to tap completed habits. Anything left unmarked for 2+ past days automatically flags as missed.
              </p>
            </div>

            {/* Visual Mockup: 3-State Legend */}
            <div className="rounded-2xl border border-slate-200 dark:border-emerald-900/50 bg-[#fafcf9] dark:bg-[#071912] p-4 space-y-2.5">
              <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-[#eaf3ed] dark:bg-emerald-950/60 border border-[#183f2e]/20 dark:border-[#2fe196]/30">
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-[#123524] dark:text-white block">
                    Completed
                  </span>
                  <span className="text-[11px] text-slate-600 dark:text-emerald-200/70">
                    Counts toward daily score &amp; streak
                  </span>
                </div>
                <span className="w-7 h-7 rounded-full bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912] flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 stroke-[3]" />
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-rose-50/70 dark:bg-rose-950/25 border border-rose-200 dark:border-rose-900/50">
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-rose-700 dark:text-rose-300 block">
                    Auto-Missed (After 2 Days)
                  </span>
                  <span className="text-[11px] text-rose-600/80 dark:text-rose-300/70">
                    Unmarked cells automatically close after 2 days
                  </span>
                </div>
                <span className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <X className="w-4 h-4 stroke-[2.5]" />
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-white dark:bg-[#091f17] border border-slate-200 dark:border-emerald-900/40">
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-700 dark:text-emerald-100 block">
                    Open / Upcoming
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-emerald-300/70">
                    Tap anytime to mark done
                  </span>
                </div>
                <span className="w-7 h-7 rounded-full border-2 border-slate-300 dark:border-emerald-700 shrink-0" />
              </div>
            </div>
          </article>

          {/* STEP 3 */}
          <article className="w-full md:w-[calc(50%-0.75rem)] rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-[#2fe196]">
                  Step 03 · Workspace &amp; Analytics
                </span>
                <Smartphone className="w-4 h-4 text-[#183f2e] dark:text-[#2fe196]" />
              </div>
              <h2 className="font-editorial text-2xl text-[#123524] dark:text-white">
                Mobile Cards, Desktop Grid &amp; Insights
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100/75 leading-relaxed">
                Visit Analytics for the full workspace: touch day cards on mobile, multi-day spreadsheet on desktop, plus streaks and trends.
              </p>
            </div>

            {/* Visual Mockup: Mobile Scroller + Extend Controls */}
            <div className="rounded-2xl border border-slate-200 dark:border-emerald-900/50 bg-[#fafcf9] dark:bg-[#071912] p-4 space-y-3">
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="font-semibold text-[#123524] dark:text-emerald-200 flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-[#183f2e] dark:text-[#2fe196]" />
                  <span>Day Scroller</span>
                </span>
                <div className="flex items-center gap-1">
                  {['+7d', '+15d', '+30d'].map((ext) => (
                    <span
                      key={ext}
                      className="px-1.5 py-0.5 rounded bg-white dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 font-mono text-[10px] text-slate-700 dark:text-emerald-300"
                    >
                      {ext}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {[11, 12, 13, 14, 15].map((d) => (
                  <div
                    key={d}
                    className={`flex-1 py-2 rounded-xl text-center font-mono text-xs ${
                      d === 13
                        ? 'bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912] font-bold'
                        : 'bg-white dark:bg-[#091f17] border border-slate-200 dark:border-emerald-900/50 text-slate-600 dark:text-emerald-200'
                    }`}
                  >
                    D{d}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-emerald-200/80 pt-1">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#183f2e] dark:text-[#2fe196]" />
                  <span>Switch or rename multiple sheets</span>
                </span>
                <span className="font-mono font-bold text-[#183f2e] dark:text-[#2fe196]">
                  86% Rate
                </span>
              </div>
            </div>
          </article>

          {/* STEP 4 */}
          <article className="w-full md:w-[calc(50%-0.75rem)] rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-[#2fe196]">
                  Step 04 · Smart Printing
                </span>
                <Printer className="w-4 h-4 text-[#183f2e] dark:text-[#2fe196]" />
              </div>
              <h2 className="font-editorial text-2xl text-[#123524] dark:text-white">
                1-Page &amp; 2-Page PDF Exports
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100/75 leading-relaxed">
                Sheets up to 30 days fit crisp on one page. Longer sheets (31+ days) automatically split across two balanced printable pages.
              </p>
            </div>

            {/* Visual Mockup: 1-Page vs 2-Page Split */}
            <div className="rounded-2xl border border-slate-200 dark:border-emerald-900/50 bg-[#fafcf9] dark:bg-[#071912] p-4 flex items-stretch gap-3">
              <div className="flex-1 rounded-xl border border-slate-200 dark:border-emerald-800/60 bg-white dark:bg-[#091f17] p-3 flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#123524] dark:text-white">
                    ≤ 30 Days
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-[#2fe196]">
                    1 Sheet
                  </span>
                </div>
                <div className="h-12 rounded-lg border border-dashed border-emerald-500/40 bg-[#eaf3ed]/50 dark:bg-emerald-950/40 flex items-center justify-center text-[10px] font-mono text-slate-600 dark:text-emerald-200">
                  Days 1–30
                </div>
              </div>

              <div className="flex-1 rounded-xl border border-slate-200 dark:border-emerald-800/60 bg-white dark:bg-[#091f17] p-3 flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#123524] dark:text-white">
                    31+ Days
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-[#2fe196]">
                    2 Sheets
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 h-12 rounded-lg border border-dashed border-emerald-500/40 bg-[#eaf3ed]/50 dark:bg-emerald-950/40 flex items-center justify-center text-[10px] font-mono text-slate-600 dark:text-emerald-200">
                    Pg 1
                  </div>
                  <div className="flex-1 h-12 rounded-lg border border-dashed border-emerald-500/40 bg-[#eaf3ed]/50 dark:bg-emerald-950/40 flex items-center justify-center text-[10px] font-mono text-slate-600 dark:text-emerald-200">
                    Pg 2
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* Bottom Next-Step CTA */}
        <section className="rounded-3xl bg-[#183f2e] dark:bg-[#0b241b] border border-emerald-800/60 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 text-white">
          <div className="space-y-1">
            <h2 className="font-editorial text-2xl sm:text-3xl font-normal">
              Ready to start your streak?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80">
              Create your sheet from scratch, start with a template, or open your analytics workspace.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/create_tracker"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#2fe196] hover:bg-[#28cf88] text-[#071912] transition-colors whitespace-nowrap"
            >
              <span>Create Sheet</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/analytics"
              prefetch={false}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-emerald-500/40 text-emerald-100 hover:bg-emerald-900/50 transition-colors whitespace-nowrap"
            >
              <BarChart3 className="w-4 h-4 text-[#2fe196]" />
              <span>Analytics</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
