'use client';

import dynamic from 'next/dynamic';
import { useHabitTracker } from '@/lib/context/HabitTrackerContext';

const AuthModal = dynamic(
  () => import('./AuthModal').then((mod) => mod.AuthModal),
  { ssr: false }
);

export default function GlobalModals() {
  const { isAuthModalOpen } = useHabitTracker();

  return <>{isAuthModalOpen ? <AuthModal /> : null}</>;
}
