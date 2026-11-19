import type { Metadata } from 'next';
import DashboardWorkspace from './components/DashboardWorkspace';

export const metadata: Metadata = {
  title: 'Daily Habit Dashboard',
  description:
    'Log daily habit completions, manage active habits, switch saved sheets, and maintain your consistency streaks on Habitora.',
  alternates: {
    canonical: '/dashboard',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <DashboardWorkspace />;
}
