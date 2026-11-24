'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, LogIn, User, UserPlus } from 'lucide-react';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';

interface ProfileSignInGateProps {
  onQuickSignIn: () => void;
}

export default function ProfileSignInGate({ onQuickSignIn }: ProfileSignInGateProps) {
  const [googleError, setGoogleError] = useState<string | null>(null);

  return (
    <div className="max-w-lg mx-auto rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-8 sm:p-10 text-center shadow-sm space-y-5">
      <div className="w-12 h-12 rounded-2xl bg-[#eaf3ed] dark:bg-emerald-500/15 text-[#183f2e] dark:text-[#2fe196] flex items-center justify-center mx-auto">
        <User className="w-6 h-6" />
      </div>
      <div className="space-y-2">
        <h1 className="font-editorial text-3xl font-normal text-[#123524] dark:text-white text-balance">
          Sign In to View Your Profile
        </h1>
        <p className="text-sm text-slate-600 dark:text-emerald-100/75">
          Access your account details, habit performance summary, and saved sheets.
        </p>
      </div>

      {googleError && (
        <div
          role="alert"
          className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-2 text-left text-xs text-rose-700 dark:text-rose-300"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{googleError}</span>
        </div>
      )}

      <GoogleSignInButton
        label="Continue with Google"
        onError={(msg) => setGoogleError(msg || null)}
      />

      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <Link
          href="/signin?redirect=/profile"
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] shadow-sm transition-all whitespace-nowrap"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In</span>
        </Link>

        <Link
          href="/signup?redirect=/profile"
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-slate-300 dark:border-emerald-800/60 bg-white dark:bg-emerald-950/30 text-[#123524] dark:text-emerald-100 hover:bg-slate-50 dark:hover:bg-emerald-900/40 transition-colors whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create Account</span>
        </Link>
      </div>

      <button
        type="button"
        onClick={onQuickSignIn}
        className="w-full py-2 text-xs font-medium text-slate-500 dark:text-emerald-300/75 hover:text-[#183f2e] dark:hover:text-[#2fe196] transition-colors cursor-pointer"
      >
        Or continue with Quick Access workspace
      </button>
    </div>
  );
}
