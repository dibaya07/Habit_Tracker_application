'use client';

import React from 'react';
import { LogIn, User } from 'lucide-react';

interface ProfileSignInGateProps {
  onQuickSignIn: () => void;
}

export default function ProfileSignInGate({ onQuickSignIn }: ProfileSignInGateProps) {
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
      <button
        type="button"
        onClick={onQuickSignIn}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] shadow-sm transition-all cursor-pointer whitespace-nowrap"
      >
        <LogIn className="w-4 h-4" />
        <span>Sign In to Habitora</span>
      </button>
    </div>
  );
}
