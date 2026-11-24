'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  LayoutDashboard,
  Lock,
  LogIn,
  Mail,
  User,
  UserPlus,
} from 'lucide-react';
import { useHabitTracker } from '@/lib/context/HabitTrackerContext';
import BrandMark from '@/components/ui/BrandMark';
// import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import { filterEmailInput, validateEmailAddress } from '@/lib/utils/validation';

export default function SignInClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect');
  const safeRedirect =
    rawRedirect && rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')
      ? rawRedirect
      : '/dashboard';

  const { hasMounted, user, signInWithEmail, quickSignIn } = useHabitTracker();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (raw: string) => {
    const { sanitized } = filterEmailInput(raw);
    setEmail(sanitized);
    setError(null);
    if (emailError) {
      const check = validateEmailAddress(sanitized);
      setEmailError(check.valid ? null : check.error || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailCheck = validateEmailAddress(email);
    if (!emailCheck.valid) {
      setEmailError(emailCheck.error || 'Please enter a valid email address.');
      setError(emailCheck.error || 'Please enter a valid email address.');
      return;
    }
    setEmailError(null);

    setIsSubmitting(true);

    try {
      const result = await signInWithEmail({ email: emailCheck.value, password });
      if (!result.ok) {
        setError(result.error || 'Unable to sign in. Please check your details.');
        setIsSubmitting(false);
        return;
      }

      try {
        window.sessionStorage.removeItem('habitora_stay_home');
      } catch {}

      router.push(safeRedirect);
    } catch {
      setError('Something went wrong while signing in. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleQuickAccess = () => {
    try {
      window.sessionStorage.removeItem('habitora_stay_home');
    } catch {}
    const handledCustom = quickSignIn();
    if (!handledCustom) {
      router.push(safeRedirect);
    }
  };

  const signUpHref = rawRedirect
    ? `/signup?redirect=${encodeURIComponent(safeRedirect)}`
    : '/signup';

  if (hasMounted && user) {
    return (
      <section className="w-full max-w-md mx-auto rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-7 sm:p-9 shadow-sm space-y-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#eaf3ed] dark:bg-emerald-500/15 text-[#183f2e] dark:text-[#2fe196] flex items-center justify-center mx-auto">
          <User className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2d6a4f] dark:text-[#2fe196] block">
            Signed In
          </span>
          <h1 className="font-editorial text-3xl font-normal text-[#123524] dark:text-white">
            Welcome back{user.name && user.name !== 'Profile' ? `, ${user.name}` : ''}
          </h1>
          <p className="text-sm text-slate-600 dark:text-emerald-100/75">
            You are already signed in as <span className="font-medium">{user.email}</span>.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-1">
          <Link
            href="/dashboard"
            prefetch={false}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Open Dashboard</span>
          </Link>
          <Link
            href="/profile"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border border-slate-200 dark:border-emerald-800/60 text-slate-700 dark:text-emerald-100 hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors"
          >
            <span>Open Profile</span>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-md mx-auto rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-6 sm:p-9 shadow-sm space-y-6">
      <div className="space-y-3 border-b border-slate-100 dark:border-emerald-900/40 pb-5">
        <div className="flex items-center gap-3">
          <BrandMark size={40} variant="glow" />
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2d6a4f] dark:text-[#2fe196] block">
              Member Sign In
            </span>
            <h1 className="font-editorial text-3xl font-normal text-[#123524] dark:text-white leading-tight">
              Welcome Back
            </h1>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-emerald-100/75 leading-relaxed">
          Sign in to open your habit dashboard, track streaks, and sync your saved sheets.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-2.5 text-xs sm:text-sm text-rose-700 dark:text-rose-300"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label
            htmlFor="signin-email"
            className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-emerald-200/80 block"
          >
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-slate-400 dark:text-emerald-400/60 absolute left-3.5 pointer-events-none" />
            <input
              id="signin-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={() => {
                if (email.trim()) {
                  const check = validateEmailAddress(email);
                  setEmailError(check.valid ? null : check.error || null);
                }
              }}
              aria-invalid={Boolean(emailError)}
              placeholder="you@example.com"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-50/70 dark:bg-emerald-950/40 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-300/40 focus:outline-none focus:ring-2 transition-colors ${
                emailError
                  ? 'border-rose-400 dark:border-rose-500/80 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-slate-200 dark:border-emerald-800/60 focus:ring-[#183f2e]/25 dark:focus:ring-[#2fe196]/35 focus:border-[#183f2e] dark:focus:border-[#2fe196]'
              }`}
            />
          </div>
          {emailError && (
            <p className="text-xs text-rose-600 dark:text-rose-400">{emailError}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="signin-password"
            className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-emerald-200/80 block"
          >
            Password
          </label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-slate-400 dark:text-emerald-400/60 absolute left-3.5 pointer-events-none" />
            <input
              id="signin-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 dark:border-emerald-800/60 bg-slate-50/70 dark:bg-emerald-950/40 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-[#183f2e]/25 dark:focus:ring-[#2fe196]/35 focus:border-[#183f2e] dark:focus:border-[#2fe196] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2.5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-emerald-300/70 dark:hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] shadow-sm transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
        </button>
      </form>

      <div className="relative flex items-center justify-center py-1">
        <div className="w-full border-t border-slate-200 dark:border-emerald-900/50" />
        <span className="px-3 bg-white dark:bg-[#091f17] text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-emerald-400/60 shrink-0">
          Or
        </span>
        <div className="w-full border-t border-slate-200 dark:border-emerald-900/50" />
      </div>

      <div className="flex flex-col gap-2.5">
        {/* <GoogleSignInButton
          label="Continue with Google"
          onSuccess={(handledCustom) => {
            if (!handledCustom) {
              router.push(safeRedirect);
            }
          }}
          onError={(msg) => setError(msg || null)}
        /> */}

        <button
          type="button"
          onClick={handleQuickAccess}
          className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-700/60 bg-white dark:bg-emerald-950/35 text-xs sm:text-sm font-semibold text-[#123524] dark:text-emerald-100 hover:bg-slate-50 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
        >
          <span>Continue with Quick Access Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-emerald-900/40 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-emerald-100/75">
        <span>New to Habitora?</span>
        <Link
          href={signUpHref}
          className="inline-flex items-center gap-1.5 font-semibold text-[#183f2e] dark:text-[#2fe196] hover:underline"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Create an account</span>
        </Link>
      </div>
    </section>
  );
}
