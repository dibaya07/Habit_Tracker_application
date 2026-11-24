'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AlertCircle, X, LogIn, UserPlus } from 'lucide-react';
import { useHabitTracker } from '../../lib/context/HabitTrackerContext';
import BrandMark from '@/components/ui/BrandMark';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';

export const AuthModal: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    quickSignIn,
    authPromptMessage,
  } = useHabitTracker();
  const [googleError, setGoogleError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setGoogleError(null);
    setIsAuthModalOpen(false);
  };

  const handleSignIn = () => {
    setGoogleError(null);
    try {
      window.sessionStorage.removeItem('habitora_stay_home');
    } catch {
      // Ignore storage access errors
    }
    const handledCustomAction = quickSignIn();
    if (!handledCustomAction && pathname !== '/') {
      router.push('/dashboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#091f17] border border-slate-200 dark:border-emerald-800/60 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-emerald-900/50 pb-4">
          <div className="flex items-center gap-3">
            <BrandMark size={38} variant="glow" />
            <div>
              <span className="text-[10px] font-semibold tracking-widest text-emerald-700 dark:text-[#2fe196] uppercase block">
                QUICK ACCESS
              </span>
              <h3 className="font-editorial text-2xl font-normal text-slate-900 dark:text-white leading-tight">
                Sign In to Habitora
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close sign in dialog"
            className="p-2 rounded-full text-slate-400 hover:text-slate-900 dark:text-emerald-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-emerald-100/80 leading-relaxed">
            {authPromptMessage ||
              'Continue with Google or quick sign-in to access your daily dashboard, mark habits, and manage your saved sheets.'}
          </p>

          {googleError && (
            <div
              role="alert"
              className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-2 text-xs text-rose-700 dark:text-rose-300"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{googleError}</span>
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            <GoogleSignInButton
              label="Continue with Google"
              onSuccess={(handledCustomAction) => {
                if (!handledCustomAction && pathname !== '/') {
                  router.push('/dashboard');
                }
              }}
              onError={(msg) => setGoogleError(msg || null)}
            />

            <button
              type="button"
              onClick={handleSignIn}
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Continue with Quick Access</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-emerald-900/40 flex flex-col sm:flex-row gap-2.5">
            <Link
              href="/signin"
              onClick={handleClose}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-emerald-800/60 text-xs font-semibold text-[#123524] dark:text-emerald-100 hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In Page</span>
            </Link>
            <Link
              href="/signup"
              onClick={handleClose}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-emerald-800/60 text-xs font-semibold text-[#123524] dark:text-emerald-100 hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
