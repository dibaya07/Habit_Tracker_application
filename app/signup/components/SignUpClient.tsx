'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  LayoutDashboard,
  Lock,
  LogIn,
  Mail,
  Target,
  User,
  UserPlus,
} from 'lucide-react';
import { useHabitTracker } from '@/lib/context/HabitTrackerContext';
import BrandMark from '@/components/ui/BrandMark';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import {
  filterEmailInput,
  filterNameInput,
  validateEmailAddress,
  validatePersonName,
} from '@/lib/utils/validation';

export default function SignUpClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect');
  const safeRedirect =
    rawRedirect && rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')
      ? rawRedirect
      : '/dashboard';

  const { hasMounted, user, signUpWithEmail } = useHabitTracker();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dailyGoal, setDailyGoal] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameNotice, setNameNotice] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (raw: string) => {
    const { sanitized, stripped } = filterNameInput(raw);
    setName(sanitized);
    setError(null);
    if (stripped) {
      setNameNotice('Names only accept letters, spaces, hyphens, and apostrophes.');
    } else {
      setNameNotice(null);
    }
    if (nameError) {
      const check = validatePersonName(sanitized);
      setNameError(check.valid ? null : check.error || null);
    }
  };

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

    const nameCheck = validatePersonName(name);
    if (!nameCheck.valid) {
      setNameError(nameCheck.error || 'Please enter a valid full name.');
      setError(nameCheck.error || 'Please enter a valid full name.');
      return;
    }
    setNameError(null);

    const emailCheck = validateEmailAddress(email);
    if (!emailCheck.valid) {
      setEmailError(emailCheck.error || 'Please enter a valid email address.');
      setError(emailCheck.error || 'Please enter a valid email address.');
      return;
    }
    setEmailError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signUpWithEmail({
        name: nameCheck.value,
        email: emailCheck.value,
        password,
        dailyGoal,
      });

      if (!result.ok) {
        setError(result.error || 'Could not create your account. Please try again.');
        setIsSubmitting(false);
        return;
      }

      try {
        window.sessionStorage.removeItem('habitora_stay_home');
      } catch {}

      router.push(safeRedirect);
    } catch {
      setError('Something went wrong while creating your account.');
      setIsSubmitting(false);
    }
  };

  const signInHref = rawRedirect
    ? `/signin?redirect=${encodeURIComponent(safeRedirect)}`
    : '/signin';

  if (hasMounted && user) {
    return (
      <section className="w-full max-w-md mx-auto rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-7 sm:p-9 shadow-sm space-y-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#eaf3ed] dark:bg-emerald-500/15 text-[#183f2e] dark:text-[#2fe196] flex items-center justify-center mx-auto">
          <Check className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2d6a4f] dark:text-[#2fe196] block">
            Account Active
          </span>
          <h1 className="font-editorial text-3xl font-normal text-[#123524] dark:text-white">
            You Are Already Signed In
          </h1>
          <p className="text-sm text-slate-600 dark:text-emerald-100/75">
            Active session for <span className="font-medium">{user.email}</span>.
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
    <section className="w-full max-w-lg mx-auto rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-6 sm:p-9 shadow-sm space-y-6">
      <div className="space-y-3 border-b border-slate-100 dark:border-emerald-900/40 pb-5">
        <div className="flex items-center gap-3">
          <BrandMark size={40} variant="glow" />
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2d6a4f] dark:text-[#2fe196] block">
              Get Started Free
            </span>
            <h1 className="font-editorial text-3xl font-normal text-[#123524] dark:text-white leading-tight">
              Create Your Account
            </h1>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-emerald-100/75 leading-relaxed">
          Set up your personal Habitora workspace to save habit sheets, track progress analytics, and stay consistent.
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

      <GoogleSignInButton
        label="Sign up with Google"
        onSuccess={(handledCustom) => {
          if (!handledCustom) {
            router.push(safeRedirect);
          }
        }}
        onError={(msg) => setError(msg || null)}
      />

      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-slate-200 dark:border-emerald-900/50" />
        <span className="px-3 bg-white dark:bg-[#091f17] text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-emerald-400/60 shrink-0">
          Or sign up with email
        </span>
        <div className="w-full border-t border-slate-200 dark:border-emerald-900/50" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label
            htmlFor="signup-name"
            className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-emerald-200/80 block"
          >
            Full Name
          </label>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-slate-400 dark:text-emerald-400/60 absolute left-3.5 pointer-events-none" />
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              onBlur={() => {
                if (name.trim()) {
                  const check = validatePersonName(name);
                  setNameError(check.valid ? null : check.error || null);
                }
              }}
              aria-invalid={Boolean(nameError)}
              placeholder="e.g. Alex Rivera"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-50/70 dark:bg-emerald-950/40 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-300/40 focus:outline-none focus:ring-2 transition-colors ${
                nameError
                  ? 'border-rose-400 dark:border-rose-500/80 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-slate-200 dark:border-emerald-800/60 focus:ring-[#183f2e]/25 dark:focus:ring-[#2fe196]/35 focus:border-[#183f2e] dark:focus:border-[#2fe196]'
              }`}
            />
          </div>
          {nameError ? (
            <p className="text-xs text-rose-600 dark:text-rose-400">{nameError}</p>
          ) : nameNotice ? (
            <p className="text-xs text-amber-700 dark:text-amber-300">{nameNotice}</p>
          ) : (
            <p className="text-[11px] text-slate-400 dark:text-emerald-300/55">
              Letters, spaces, hyphens, or apostrophes only.
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="signup-email"
            className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-emerald-200/80 block"
          >
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-slate-400 dark:text-emerald-400/60 absolute left-3.5 pointer-events-none" />
            <input
              id="signup-email"
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

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:flex-1 space-y-1.5">
            <label
              htmlFor="signup-password"
              className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-emerald-200/80 block"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 dark:text-emerald-400/60 absolute left-3.5 pointer-events-none" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-emerald-800/60 bg-slate-50/70 dark:bg-emerald-950/40 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-[#183f2e]/25 dark:focus:ring-[#2fe196]/35 focus:border-[#183f2e] dark:focus:border-[#2fe196] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-emerald-300/70 dark:hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="w-full sm:flex-1 space-y-1.5">
            <label
              htmlFor="signup-confirm-password"
              className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-emerald-200/80 block"
            >
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 dark:text-emerald-400/60 absolute left-3.5 pointer-events-none" />
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-emerald-800/60 bg-slate-50/70 dark:bg-emerald-950/40 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-[#183f2e]/25 dark:focus:ring-[#2fe196]/35 focus:border-[#183f2e] dark:focus:border-[#2fe196] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                className="absolute right-2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-emerald-300/70 dark:hover:text-white transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="signup-goal"
            className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-emerald-200/80 flex items-center justify-between"
          >
            <span>Primary Daily Goal</span>
            <span className="text-[10px] font-normal normal-case text-slate-400 dark:text-emerald-300/60">
              Optional
            </span>
          </label>
          <div className="relative flex items-center">
            <Target className="w-4 h-4 text-slate-400 dark:text-emerald-400/60 absolute left-3.5 pointer-events-none" />
            <input
              id="signup-goal"
              type="text"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value)}
              placeholder="e.g. Complete morning routine before 9 AM"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-emerald-800/60 bg-slate-50/70 dark:bg-emerald-950/40 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-[#183f2e]/25 dark:focus:ring-[#2fe196]/35 focus:border-[#183f2e] dark:focus:border-[#2fe196] transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] shadow-sm transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
        </button>
      </form>

      <div className="pt-2 border-t border-slate-100 dark:border-emerald-900/40 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-emerald-100/75">
        <span>Already have an account?</span>
        <Link
          href={signInHref}
          className="inline-flex items-center gap-1.5 font-semibold text-[#183f2e] dark:text-[#2fe196] hover:underline"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Sign in instead</span>
        </Link>
      </div>
    </section>
  );
}
