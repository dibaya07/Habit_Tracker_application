import type { Metadata } from 'next';
import AnalyticsWorkspace from './components/AnalyticsWorkspace';

const ANALYTICS_TITLE = 'Habit Progress Analytics';
const ANALYTICS_DESCRIPTION =
  'Analyze your habit completion rate, active streaks, weekly performance trends, category distribution, and personalized consistency insights.';

export const metadata: Metadata = {
  title: ANALYTICS_TITLE,
  description: ANALYTICS_DESCRIPTION,
  alternates: {
    canonical: '/analytics',
  },
  openGraph: {
    type: 'website',
    title: `${ANALYTICS_TITLE} | Habitora`,
    description: ANALYTICS_DESCRIPTION,
    url: '/analytics',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${ANALYTICS_TITLE} | Habitora`,
    description: ANALYTICS_DESCRIPTION,
  },
};

export default function AnalyticsPage() {
  return <AnalyticsWorkspace />;
}
