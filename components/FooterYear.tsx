'use client';

import React from 'react';
import { useHabitTracker } from '../lib/context/HabitTrackerContext';

export default function FooterYear() {
  const { hasMounted } = useHabitTracker();
  return <>{hasMounted ? new Date().getFullYear() : 2026}</>;
}
