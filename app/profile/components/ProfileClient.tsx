'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Coffee,
  ExternalLink,
  HelpCircle,
  History,
  Layers,
  LayoutTemplate,
  MessageSquare,
  Moon,
  Settings,
  Sun,
  User,
} from 'lucide-react';
import { useHabitTracker } from '@/lib/context/HabitTrackerContext';
import ProfileSignInGate from './ProfileSignInGate';
import ProfileHeader from './ProfileHeader';
import ProfileDetailsForm from './ProfileDetailsForm';
import SheetPreferencesCard from './SheetPreferencesCard';
import SavedSheetsCard from './SavedSheetsCard';
import ActionHistoryCard from './ActionHistoryCard';
import SupportDonationControls from '@/components/support/SupportDonationControls';
import DownloadAppButton from '@/components/pwa/DownloadAppButton';

type ProfileSection = 'menu' | 'account' | 'sheets' | 'settings' | 'history' | 'support';

export default function ProfileClient() {
  const router = useRouter();
  const {
    hasMounted,
    theme,
    toggleTheme,
    user,
    quickSignIn,
    logout,
    updateUserProfile,
    tracker,
    savedTrackers,
    selectTracker,
    deleteSavedTracker,
    setDayLabelMode,
    setIncludeGraph,
    actionHistory,
    clearActionHistory,
  } = useHabitTracker();

  const [activeSection, setActiveSection] = useState<ProfileSection>('menu');

  if (!hasMounted) {
    return <main className="flex-1" />;
  }

  const sectionLabels: Record<Exclude<ProfileSection, 'menu'>, string> = {
    account: 'Account Details',
    sheets: 'Created Habit Sheets',
    settings: 'Settings & Sheet Preferences',
    history: 'Action History',
    support: 'Support Habitora',
  };

  return (
    <main className="flex-1 py-8 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {!user ? (
          <ProfileSignInGate onQuickSignIn={quickSignIn} />
        ) : (
          <>
            <ProfileHeader
              user={user}
              onSignOut={() => {
                logout();
                router.push('/');
              }}
            />

            {activeSection === 'menu' ? (
              <div className="space-y-6">
                {/* Account & Workspace Options */}
                <div className="rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 shadow-sm overflow-hidden">
                  <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-emerald-900/40">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-emerald-300/75">
                      Account &amp; Sheets
                    </h2>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-emerald-900/40">
                    <button
                      type="button"
                      onClick={() => setActiveSection('account')}
                      className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="w-10 h-10 rounded-xl bg-[#eaf3ed] dark:bg-emerald-500/15 text-[#183f2e] dark:text-[#2fe196] flex items-center justify-center shrink-0">
                          <User className="w-5 h-5" />
                        </span>
                        <div className="min-w-0">
                          <span className="text-sm font-semibold text-[#123524] dark:text-white block">
                            Account Details
                          </span>
                          <span className="text-xs text-slate-500 dark:text-emerald-300/70 block truncate">
                            Name, email, daily goal, and personal bio
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 dark:text-emerald-400/70 shrink-0" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSection('sheets')}
                      className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                          <Layers className="w-5 h-5" />
                        </span>
                        <div className="min-w-0">
                          <span className="text-sm font-semibold text-[#123524] dark:text-white block">
                            Created Habit Sheets ({savedTrackers.length})
                          </span>
                          <span className="text-xs text-slate-500 dark:text-emerald-300/70 block truncate">
                            Inspect habits, switch active sheets, or delete old cycles
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 dark:text-emerald-400/70 shrink-0" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSection('settings')}
                      className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                          <Settings className="w-5 h-5" />
                        </span>
                        <div className="min-w-0">
                          <span className="text-sm font-semibold text-[#123524] dark:text-white block">
                            Settings &amp; Sheet Preferences
                          </span>
                          <span className="text-xs text-slate-500 dark:text-emerald-300/70 block truncate">
                            Day labels, progress graph display, and appearance theme
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 dark:text-emerald-400/70 shrink-0" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSection('history')}
                      className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                          <History className="w-5 h-5" />
                        </span>
                        <div className="min-w-0">
                          <span className="text-sm font-semibold text-[#123524] dark:text-white block">
                            Action History ({actionHistory.length})
                          </span>
                          <span className="text-xs text-slate-500 dark:text-emerald-300/70 block truncate">
                            Chronological log of check-ins, sheet updates, and extensions
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 dark:text-emerald-400/70 shrink-0" />
                    </button>
                  </div>
                </div>

                {/* Help, Templates & Support Group */}
                <div className="rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 shadow-sm overflow-hidden">
                  <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-emerald-900/40">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-emerald-300/75">
                      Help, Guides &amp; Feedback
                    </h2>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-emerald-900/40">
                    <Link
                      href="/how-to-use"
                      prefetch={false}
                      className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="w-10 h-10 rounded-xl bg-[#eaf3ed] dark:bg-emerald-500/15 text-[#183f2e] dark:text-[#2fe196] flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5" />
                        </span>
                        <div className="min-w-0">
                          <span className="text-sm font-semibold text-[#123524] dark:text-white block">
                            How to Use Habitora
                          </span>
                          <span className="text-xs text-slate-500 dark:text-emerald-300/70 block truncate">
                            Simple visual guide to tracking, auto-missed rules, and printing
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 dark:text-emerald-400/70 shrink-0" />
                    </Link>

                    <Link
                      href="/templates"
                      prefetch={false}
                      className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-[#2fe196] flex items-center justify-center shrink-0">
                          <LayoutTemplate className="w-5 h-5" />
                        </span>
                        <div className="min-w-0">
                          <span className="text-sm font-semibold text-[#123524] dark:text-white block">
                            Habit Sheet Templates
                          </span>
                          <span className="text-xs text-slate-500 dark:text-emerald-300/70 block truncate">
                            Start faster with curated 21, 30, and 60-day habit routines
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 dark:text-emerald-400/70 shrink-0" />
                    </Link>

                    <Link
                      href="/feedback"
                      prefetch={false}
                      className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                          <MessageSquare className="w-5 h-5" />
                        </span>
                        <div className="min-w-0">
                          <span className="text-sm font-semibold text-[#123524] dark:text-white block">
                            Feedback &amp; Suggestions
                          </span>
                          <span className="text-xs text-slate-500 dark:text-emerald-300/70 block truncate">
                            Share feature ideas, suggestions, or report an issue
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 dark:text-emerald-400/70 shrink-0" />
                    </Link>

                    <Link
                      href="/#faq"
                      prefetch={false}
                      onClick={() => {
                        try {
                          sessionStorage.setItem('habitora_stay_home', '1');
                        } catch {}
                      }}
                      className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-emerald-900/50 text-slate-700 dark:text-emerald-200 flex items-center justify-center shrink-0">
                          <HelpCircle className="w-5 h-5" />
                        </span>
                        <div className="min-w-0">
                          <span className="text-sm font-semibold text-[#123524] dark:text-white block">
                            Help &amp; FAQ
                          </span>
                          <span className="text-xs text-slate-500 dark:text-emerald-300/70 block truncate">
                            Common answers on data privacy, offline printing, and sheets
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 dark:text-emerald-400/70 shrink-0" />
                    </Link>

                    <DownloadAppButton variant="profile" />

                    <button
                      type="button"
                      onClick={() => setActiveSection('support')}
                      className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                          <Coffee className="w-5 h-5" />
                        </span>
                        <div className="min-w-0">
                          <span className="text-sm font-semibold text-[#123524] dark:text-white block">
                            Buy Us a Coffee
                          </span>
                          <span className="text-xs text-slate-500 dark:text-emerald-300/70 block truncate">
                            Support Habitora with a QR contribution
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 dark:text-emerald-400/70 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Back to Profile Options Menu */}
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveSection('menu')}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-emerald-800/70 bg-white dark:bg-[#091f17] text-xs font-semibold text-slate-700 dark:text-emerald-100 hover:border-[#183f2e] dark:hover:border-[#2fe196] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Profile Options</span>
                  </button>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-[#2fe196]">
                    {sectionLabels[activeSection]}
                  </span>
                </div>

                {activeSection === 'account' && (
                  <ProfileDetailsForm
                    user={user}
                    onSaveProfile={updateUserProfile}
                  />
                )}

                {activeSection === 'sheets' && (
                  <SavedSheetsCard
                    savedTrackers={savedTrackers}
                    activeTrackerId={tracker.id}
                    onSelectSheet={(sheetId) => {
                      selectTracker(sheetId);
                      router.push('/dashboard');
                    }}
                    onDeleteSheet={deleteSavedTracker}
                  />
                )}

                {activeSection === 'settings' && (
                  <div className="space-y-6">
                    <SheetPreferencesCard
                      dayLabelMode={tracker.dayLabelMode || 'dates'}
                      includeGraph={tracker.includeGraph !== false}
                      onChangeDayLabelMode={setDayLabelMode}
                      onChangeIncludeGraph={setIncludeGraph}
                    />

                    <div className="rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-6 sm:p-8 shadow-sm flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="font-editorial text-xl font-normal text-[#123524] dark:text-white">
                          Appearance Theme
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-0.5">
                          Switch between crisp Light paper mode and Dark forest focus mode.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={toggleTheme}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-800/70 bg-slate-50 dark:bg-emerald-950/60 text-xs font-semibold text-slate-800 dark:text-emerald-100 hover:border-[#183f2e] dark:hover:border-[#2fe196] transition-colors cursor-pointer"
                      >
                        {theme === 'dark' ? (
                          <>
                            <Sun className="w-4 h-4 text-amber-300" />
                            <span>Switch to Light Mode</span>
                          </>
                        ) : (
                          <>
                            <Moon className="w-4 h-4 text-[#183f2e]" />
                            <span>Switch to Dark Mode</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {activeSection === 'history' && (
                  <ActionHistoryCard
                    entries={actionHistory}
                    onClearHistory={clearActionHistory}
                  />
                )}

                {activeSection === 'support' && (
                  <div className="rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-6 sm:p-10 shadow-sm text-center space-y-5">
                    <div className="space-y-1.5">
                      <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-[#123524] dark:text-white">
                        Support Habitora
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100/75 max-w-md mx-auto">
                        Select an amount below to view the support QR code and help keep Habitora distraction-free.
                      </p>
                    </div>
                    <SupportDonationControls amounts={[3, 5, 10]} />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
