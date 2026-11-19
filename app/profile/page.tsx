import type { Metadata } from 'next';
import ProfileClient from './components/ProfileClient';

export const metadata: Metadata = {
  title: 'Profile & Saved Habit Sheets',
  description:
    'Manage your Habitora profile details, habit preferences, consistency progress snapshot, and saved habit tracker sheets.',
  alternates: {
    canonical: '/profile',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return <ProfileClient />;
}
