'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Loader2,
  Mail,
  Save,
  ShieldCheck,
  Target,
  User,
} from 'lucide-react';
import { UserAccount } from '@/lib/types/tracker';
import {
  filterEmailInput,
  filterNameInput,
  validateEmailAddress,
  validatePersonName,
} from '@/lib/utils/validation';

interface ProfileDetailsFormProps {
  user: UserAccount;
  onSaveProfile: (updates: Partial<UserAccount>) => Promise<void> | void;
}

export default function ProfileDetailsForm({
  user,
  onSaveProfile,
}: ProfileDetailsFormProps) {
  const [nameDraft, setNameDraft] = useState<string | null>(null);
  const [emailDraft, setEmailDraft] = useState<string | null>(null);
  const [dailyGoalDraft, setDailyGoalDraft] = useState<string | null>(null);
  const [bioDraft, setBioDraft] = useState<string | null>(null);
  const [nameNotice, setNameNotice] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const nameInput = nameDraft ?? (user.name || '');
  const emailInput = emailDraft ?? (user.email || '');
  const dailyGoalInput = dailyGoalDraft ?? (user.dailyGoal || '');
  const bioInput = bioDraft ?? (user.bio || '');

  const hasChanges =
    nameDraft !== null ||
    emailDraft !== null ||
    dailyGoalDraft !== null ||
    bioDraft !== null;

  const nameValidation = validatePersonName(nameInput);
  const emailValidation = validateEmailAddress(emailInput);
  const isValid = nameValidation.valid && emailValidation.valid;

  const isSubmitDisabled = isSaving || !isValid || !hasChanges;

  const handleNameChange = (raw: string) => {
    const { sanitized, stripped } = filterNameInput(raw);
    setNameDraft(sanitized);
    setNameNotice(
      stripped ? 'Display name only allows letters, spaces, hyphens, and apostrophes.' : null
    );
  };

  const handleEmailChange = (raw: string) => {
    const { sanitized } = filterEmailInput(raw);
    setEmailDraft(sanitized);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    setIsSaving(true);
    setSavedNotice(false);
    try {
      await Promise.resolve(
        onSaveProfile({
          name: nameValidation.value,
          email: emailValidation.value,
          dailyGoal: dailyGoalInput.trim(),
          bio: bioInput.trim(),
        })
      );
      // Brief visual settle so user clearly sees loading -> saved transition
      await new Promise((resolve) => setTimeout(resolve, 350));
      setNameDraft(null);
      setEmailDraft(null);
      setDailyGoalDraft(null);
      setBioDraft(null);
      setNameNotice(null);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={isSaving}
      noValidate
      className="rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-6 sm:p-8 shadow-sm space-y-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-emerald-900/40 pb-4">
        <div>
          <h2 className="font-editorial text-2xl font-normal text-[#123524] dark:text-white">
            Important Profile Details
          </h2>
          <p className="text-xs text-slate-500 dark:text-emerald-300/75 mt-0.5">
            Update your identity details and daily habit focus.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-[#2fe196] whitespace-nowrap">
          <ShieldCheck className="w-4 h-4" />
          <span>Active Session</span>
        </span>
      </div>

      {/* Display Name + Email in Flexbox row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:flex-1 min-w-0">
          <label
            htmlFor="profileName"
            className="text-xs font-semibold text-slate-600 dark:text-emerald-300/90 block mb-1.5"
          >
            Display Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 dark:text-emerald-400/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="profileName"
              type="text"
              required
              disabled={isSaving}
              value={nameInput}
              onChange={(e) => handleNameChange(e.target.value)}
              aria-invalid={!nameValidation.valid}
              className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-emerald-950/50 border text-sm text-slate-900 dark:text-white focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-colors ${
                !nameValidation.valid
                  ? 'border-rose-400 dark:border-rose-500/80 focus:border-rose-500'
                  : 'border-slate-200 dark:border-emerald-800/60 focus:border-[#183f2e] dark:focus:border-[#2fe196]'
              }`}
            />
          </div>
          {!nameValidation.valid ? (
            <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">
              {nameValidation.error}
            </p>
          ) : nameNotice ? (
            <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1">
              {nameNotice}
            </p>
          ) : null}
        </div>

        <div className="w-full sm:flex-1 min-w-0">
          <label
            htmlFor="profileEmail"
            className="text-xs font-semibold text-slate-600 dark:text-emerald-300/90 block mb-1.5"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 dark:text-emerald-400/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="profileEmail"
              type="email"
              required
              disabled={isSaving}
              value={emailInput}
              onChange={(e) => handleEmailChange(e.target.value)}
              aria-invalid={!emailValidation.valid}
              className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-emerald-950/50 border text-sm text-slate-900 dark:text-white focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-colors ${
                !emailValidation.valid
                  ? 'border-rose-400 dark:border-rose-500/80 focus:border-rose-500'
                  : 'border-slate-200 dark:border-emerald-800/60 focus:border-[#183f2e] dark:focus:border-[#2fe196]'
              }`}
            />
          </div>
          {!emailValidation.valid && (
            <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">
              {emailValidation.error}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="profileGoal"
          className="text-xs font-semibold text-slate-600 dark:text-emerald-300/90 block mb-1.5"
        >
          Daily Focus / Goal
        </label>
        <div className="relative">
          <Target className="w-4 h-4 text-slate-400 dark:text-emerald-400/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="profileGoal"
            type="text"
            disabled={isSaving}
            value={dailyGoalInput}
            onChange={(e) => setDailyGoalDraft(e.target.value)}
            placeholder="e.g. Never miss twice — complete morning routine daily"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#183f2e] dark:focus:border-[#2fe196] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="profileBio"
          className="text-xs font-semibold text-slate-600 dark:text-emerald-300/90 block mb-1.5"
        >
          Personal Note / Motivation
        </label>
        <textarea
          id="profileBio"
          rows={3}
          disabled={isSaving}
          value={bioInput}
          onChange={(e) => setBioDraft(e.target.value)}
          placeholder="Why you started tracking..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800/60 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#183f2e] dark:focus:border-[#2fe196] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {isSaving ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-emerald-200">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#183f2e] dark:text-[#2fe196]" />
            <span>Saving profile changes...</span>
          </span>
        ) : savedNotice ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-[#2fe196]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile details updated</span>
          </span>
        ) : !isValid ? (
          <span className="text-xs text-rose-600 dark:text-rose-400">
            {nameValidation.error || emailValidation.error || 'Please enter a valid display name and email address.'}
          </span>
        ) : (
          <span className="text-xs text-slate-400 dark:text-emerald-400/60">
            {hasChanges ? 'Unsaved changes ready to save.' : 'All profile details are up to date.'}
          </span>
        )}

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
