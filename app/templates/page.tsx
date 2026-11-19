import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Check, Printer, Sparkles } from 'lucide-react';
import { SHEET_TEMPLATES } from '@/lib/data/templates';

const TEMPLATES_TITLE = 'Habit Sheet Templates';
const TEMPLATES_DESCRIPTION =
  'Start faster with curated 21-day, 30-day, and 60-day habit tracker sheet templates for morning routines, fitness, deep work, and reading.';

export const metadata: Metadata = {
  title: TEMPLATES_TITLE,
  description: TEMPLATES_DESCRIPTION,
  alternates: {
    canonical: '/templates',
  },
  openGraph: {
    type: 'website',
    title: `${TEMPLATES_TITLE} | Habitora`,
    description: TEMPLATES_DESCRIPTION,
    url: '/templates',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TEMPLATES_TITLE} | Habitora`,
    description: TEMPLATES_DESCRIPTION,
  },
};

export default function TemplatesPage() {
  return (
    <main className="flex-1 py-10 sm:py-14 bg-[#fafcf9] dark:bg-[#071912]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <header className="border-b border-[#dce8df] dark:border-emerald-900/40 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-emerald-700 dark:text-[#2fe196] uppercase block">
              READY-TO-USE ROUTINES
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#123524] dark:text-white leading-tight">
              Habit Sheet Templates
            </h1>
            <p className="text-sm text-slate-600 dark:text-emerald-100/75">
              Pick a proven routine below to pre-fill the sheet builder, customize any habit, and print or save online.
            </p>
          </div>

          <Link
            href="/create_tracker"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-300 dark:border-emerald-800/70 bg-white dark:bg-[#091f17] text-slate-800 dark:text-emerald-100 hover:border-[#183f2e] dark:hover:border-[#2fe196] transition-colors whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4 text-[#183f2e] dark:text-[#2fe196]" />
            <span>Start Blank Sheet</span>
          </Link>
        </header>

        {/* Templates Flexbox Gallery (zero CSS Grid) */}
        <section aria-label="Curated habit sheet templates" className="flex flex-wrap gap-5">
          {SHEET_TEMPLATES.map((template) => {
            const pageLabel = template.durationDays > 30 ? '2-Page Print PDF' : '1-Page Print PDF';
            return (
              <article
                key={template.slug}
                className="w-full md:w-[calc(50%-0.625rem)] lg:w-[calc((100%-2.5rem)/3)] rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-[#2fe196] font-semibold">
                      <CalendarDays className="w-3.5 h-3.5" />
                      <span>{template.durationDays} Days</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-500 dark:text-emerald-300/70">
                      <Printer className="w-3.5 h-3.5" />
                      <span>{pageLabel}</span>
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="font-editorial text-2xl text-[#123524] dark:text-white leading-snug">
                      {template.title}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-emerald-100/75 leading-relaxed">
                      {template.subtitle}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-2 border-t border-slate-100 dark:border-emerald-900/40">
                    {template.habits.map((habit) => (
                      <li
                        key={habit.id}
                        className="flex items-start gap-2 text-xs text-slate-700 dark:text-emerald-100/90"
                      >
                        <span className="w-4 h-4 rounded-full bg-[#eaf3ed] dark:bg-emerald-900/50 text-[#183f2e] dark:text-[#2fe196] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                        <span className="leading-snug">{habit.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/create_tracker?template=${template.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] transition-colors"
                >
                  <span>Use This Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
