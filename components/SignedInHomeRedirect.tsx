'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useHabitTracker } from '@/lib/context/HabitTrackerContext';

export default function SignedInHomeRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { hasMounted, user } = useHabitTracker();
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (!hasMounted) return;
    if (!user) {
      try {
        sessionStorage.removeItem('habitora_stay_home');
      } catch {}
      return;
    }

    let stayHome = false;
    try {
      stayHome = sessionStorage.getItem('habitora_stay_home') === '1';
    } catch {}

    if (stayHome || pathname !== '/' || redirectedRef.current) return;

    const timer = window.setTimeout(() => {
      redirectedRef.current = true;
      router.replace('/dashboard');
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [hasMounted, user, pathname, router]);

  return null;
}
