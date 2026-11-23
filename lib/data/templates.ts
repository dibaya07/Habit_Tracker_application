import { Habit } from '@/lib/types/tracker';

export interface SheetTemplate {
  slug: string;
  title: string;
  subtitle: string;
  durationDays: number;
  habits: Habit[];
}

export const SHEET_TEMPLATES: SheetTemplate[] = [
  {
    slug: 'morning-focus',
    title: 'Morning Focus & Energy',
    subtitle: 'Build a calm, screen-free first hour before opening work messages.',
    durationDays: 30,
    habits: [
      { id: 'tmpl_mf_1', name: 'Drink 500ml water on wake-up', category: 'Health', color: '#2fe196', active: true, targetPerWeek: 7 },
      { id: 'tmpl_mf_2', name: '15 min sunlight & stretch', category: 'Wellness', color: '#38bdf8', active: true, targetPerWeek: 7 },
      { id: 'tmpl_mf_3', name: 'No social media first 45 min', category: 'Productivity', color: '#a78bfa', active: true, targetPerWeek: 7 },
      { id: 'tmpl_mf_4', name: 'Write top 3 daily priorities', category: 'Productivity', color: '#fbbf24', active: true, targetPerWeek: 7 },
    ],
  },
  {
    slug: 'fitness-hydration',
    title: '30-Day Fitness & Hydration',
    subtitle: 'Track daily movement, steps, protein, and hydration in one printable grid.',
    durationDays: 30,
    habits: [ 
      { id: 'tmpl_fh_1', name: '30 min workout or brisk walk', category: 'Health', color: '#2fe196', active: true, targetPerWeek: 6 },
      { id: 'tmpl_fh_2', name: '8,000+ daily steps', category: 'Health', color: '#38bdf8', active: true, targetPerWeek: 7 },
      { id: 'tmpl_fh_3', name: 'Drink 2.5L water', category: 'Health', color: '#34d399', active: true, targetPerWeek: 7 },
      { id: 'tmpl_fh_4', name: '10 min mobility & stretching', category: 'Wellness', color: '#fbbf24', active: true, targetPerWeek: 7 },
      { id: 'tmpl_fh_5', name: 'Sleep 7.5+ hours', category: 'Wellness', color: '#a78bfa', active: true, targetPerWeek: 7 },
    ],
  },
  {
    slug: 'deep-work-study',
    title: 'Deep Work & Study Sprint',
    subtitle: 'A structured 21-day cycle for students, builders, and exam prep.',
    durationDays: 21,
    habits: [
      { id: 'tmpl_dw_1', name: '90 min uninterrupted deep work', category: 'Productivity', color: '#2fe196', active: true, targetPerWeek: 6 },
      { id: 'tmpl_dw_2', name: 'Read 20 pages of non-fiction', category: 'Learning', color: '#38bdf8', active: true, targetPerWeek: 7 },
      { id: 'tmpl_dw_3', name: 'Review daily notes & flashcards', category: 'Learning', color: '#a78bfa', active: true, targetPerWeek: 6 },
      { id: 'tmpl_dw_4', name: 'Clear desk before shutdown', category: 'Lifestyle', color: '#fbbf24', active: true, targetPerWeek: 7 },
    ],
  },
  {
    slug: 'mindful-evening',
    title: 'Mindful Evening Wind-Down',
    subtitle: 'Improve sleep quality and close every day with gratitude and calm.',
    durationDays: 30,
    habits: [
      { id: 'tmpl_me_1', name: 'No screens 45 min before bed', category: 'Wellness', color: '#2fe196', active: true, targetPerWeek: 7 },
      { id: 'tmpl_me_2', name: '10 min gratitude journaling', category: 'Wellness', color: '#38bdf8', active: true, targetPerWeek: 7 },
      { id: 'tmpl_me_3', name: 'Prepare tomorrow clothes & bag', category: 'Lifestyle', color: '#fbbf24', active: true, targetPerWeek: 7 },
      { id: 'tmpl_me_4', name: 'Read 15 min fiction or calm book', category: 'Learning', color: '#a78bfa', active: true, targetPerWeek: 7 },
    ],
  },
  {
    slug: 'reading-60',
    title: '60-Day Reading & Learning',
    subtitle: 'Two-page printable sheet designed for sustained long-cycle mastery.',
    durationDays: 60,
    habits: [
      { id: 'tmpl_r60_1', name: 'Read 25 pages daily', category: 'Learning', color: '#2fe196', active: true, targetPerWeek: 7 },
      { id: 'tmpl_r60_2', name: 'Write 3 key takeaways', category: 'Learning', color: '#38bdf8', active: true, targetPerWeek: 6 },
      { id: 'tmpl_r60_3', name: 'Practice skill 30 min', category: 'Productivity', color: '#a78bfa', active: true, targetPerWeek: 6 },
    ],
  },
];

export function getTemplateBySlug(slug?: string): SheetTemplate | undefined {
  if (!slug) return undefined;
  return SHEET_TEMPLATES.find((t) => t.slug === slug);
}
