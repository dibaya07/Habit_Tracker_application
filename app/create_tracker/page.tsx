import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/data/site-config';
import { getTemplateBySlug } from '@/lib/data/templates';
import CreateTrackerClient from './components/CreateTrackerClient';

const CREATE_TITLE = 'Create Habit Tracker Sheet';
const CREATE_DESCRIPTION =
  'Design your custom 21, 30, 60, 90, or 365-day habit challenge. Choose habits, customize labels, preview sheets, and download PDFs or track online.';

export const metadata: Metadata = {
  title: CREATE_TITLE,
  description: CREATE_DESCRIPTION,
  alternates: {
    canonical: '/create_tracker',
  },
  openGraph: {
    type: 'website',
    title: `${CREATE_TITLE} | Habitora`,
    description: CREATE_DESCRIPTION,
    url: '/create_tracker',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${CREATE_TITLE} | Habitora`,
    description: CREATE_DESCRIPTION,
  },
};

export default async function CreateTrackerPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template: templateSlug } = await searchParams;
  const matchedTemplate = getTemplateBySlug(templateSlug);

  const headerIntro = (
    <div className="space-y-2">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-emerald-300 hover:text-[#183f2e] dark:hover:text-[#2fe196] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Overview</span>
      </Link>
      <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#123524] dark:text-white leading-tight text-balance">
        Design Your Habit Challenge
      </h1>
      <p className="text-sm sm:text-base text-slate-600 dark:text-emerald-100/75 max-w-2xl">
        Customize your sheet below. You can download this exact sheet as PDF or launch it in your digital tracker.
      </p>
    </div>
  );

  return (
    <CreateTrackerClient
      defaultHabits={matchedTemplate ? matchedTemplate.habits : SITE_CONFIG.defaultHabits}
      initialName={matchedTemplate ? matchedTemplate.title : ''}
      initialDuration={matchedTemplate ? matchedTemplate.durationDays : 30}
      headerIntro={headerIntro}
    />
  );
}
