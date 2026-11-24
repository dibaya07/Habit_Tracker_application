import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import SignUpClient from './components/SignUpClient';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your free Habitora account to build habit sheets, track streaks, and review analytics.',
  alternates: {
    canonical: '/signup',
  },
};

export default function SignUpPage() {
  return (
    <main className="flex-1 relative overflow-hidden bg-gradient-to-b from-[#eef7f1] via-[#f7fbf8] to-[#fafcf9] dark:from-[#0a2319] dark:via-[#071b13] dark:to-[#071912] py-10 sm:py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] rounded-full bg-[radial-gradient(circle,rgba(47,225,150,0.22)_0%,transparent_72%)] blur-2xl"
      />
      <div className="relative z-10 w-full">
        <Suspense
          fallback={
            <div className="w-full max-w-lg mx-auto rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-8 text-center text-sm text-slate-500 dark:text-emerald-200/70">
              Loading sign up...
            </div>
          }
        >
          <SignUpClient />
        </Suspense>
      </div>
    </main>
  );
}
