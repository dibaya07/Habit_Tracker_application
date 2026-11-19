'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Send,
  Star,
} from 'lucide-react';
import { useHabitTracker } from '@/lib/context/HabitTrackerContext';

export default function FeedbackPageClient() {
  const { submitFeedback, feedbacks, user, hasMounted } = useHabitTracker();

  const [category, setCategory] = useState<'feedback' | 'suggestion' | 'bug' | 'feature'>('suggestion');
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState('');
  const [emailDraft, setEmailDraft] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const emailValue = emailDraft ?? (user?.email || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 250));
      submitFeedback({
        category,
        rating,
        message: message.trim(),
        userEmail: emailValue.trim() || undefined,
      });
      setMessage('');
      setSubmittedNotice(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={hasMounted && user ? '/dashboard' : '/'}
          prefetch={false}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-emerald-300 hover:text-[#183f2e] dark:hover:text-[#2fe196] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{hasMounted && user ? 'Back to Dashboard' : 'Back to Home'}</span>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: Feedback Submission Form */}
        <div className="w-full lg:flex-[7] min-w-0 rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-6 sm:p-8 shadow-sm space-y-6">
          {submittedNotice ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-[#183f2e] dark:text-[#2fe196] border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h2 className="font-editorial text-2xl font-normal text-[#123524] dark:text-white">
                  Thank You for Your Feedback!
                </h2>
                <p className="text-sm text-slate-600 dark:text-emerald-100/80 max-w-md mx-auto">
                  Your message has been saved and recorded in your activity history. Every suggestion helps make Habitora better.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmittedNotice(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] transition-colors cursor-pointer"
                >
                  Send Another Note
                </button>
                <Link
                  href={hasMounted && user ? '/dashboard' : '/'}
                  prefetch={false}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-slate-300 dark:border-emerald-800/70 text-slate-700 dark:text-emerald-100 hover:bg-slate-50 dark:hover:bg-emerald-900/40 transition-colors"
                >
                  Return
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category selection */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200 block mb-2 uppercase tracking-wider">
                  Topic Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'feedback', label: 'Feedback' },
                    { id: 'suggestion', label: 'Suggestion' },
                    { id: 'feature', label: 'Feature Idea' },
                    { id: 'bug', label: 'Bug Report' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() =>
                        setCategory(item.id as 'feedback' | 'suggestion' | 'bug' | 'feature')
                      }
                      className={`w-[calc(50%-0.25rem)] sm:w-[calc((100%-1.5rem)/4)] py-2.5 px-3 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                        category === item.id
                          ? 'bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912] border-[#183f2e] dark:border-[#2fe196]'
                          : 'bg-slate-50 dark:bg-emerald-950/60 border-slate-200 dark:border-emerald-900/40 text-slate-700 dark:text-emerald-200 hover:border-[#183f2e] dark:hover:border-[#2fe196]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Rating */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-emerald-200 block mb-2 uppercase tracking-wider">
                  Experience Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setRating(s)}
                      aria-label={`Rate ${s} stars`}
                      className="p-1 text-slate-300 dark:text-emerald-900 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          s <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-emerald-900'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-slate-600 dark:text-emerald-400 ml-2 font-mono">
                    {rating} / 5 stars
                  </span>
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="feedback-message"
                  className="text-xs font-semibold text-slate-700 dark:text-emerald-200 block mb-1.5 uppercase tracking-wider"
                >
                  Your Message
                </label>
                <textarea
                  id="feedback-message"
                  required
                  disabled={isSubmitting}
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share what is working well, what feels confusing, or features you would love to see..."
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-emerald-950/70 border border-slate-300 dark:border-emerald-800/50 text-slate-900 dark:text-white text-sm leading-relaxed focus:outline-none focus:border-[#183f2e] dark:focus:border-[#2fe196] disabled:opacity-60"
                />
              </div>

              {/* Optional Email */}
              <div>
                <label
                  htmlFor="feedback-email"
                  className="text-xs font-semibold text-slate-700 dark:text-emerald-200 block mb-1.5 uppercase tracking-wider"
                >
                  Email (Optional, for follow-up)
                </label>
                <input
                  id="feedback-email"
                  type="email"
                  disabled={isSubmitting}
                  value={emailValue}
                  onChange={(e) => setEmailDraft(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-emerald-950/70 border border-slate-300 dark:border-emerald-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#183f2e] dark:focus:border-[#2fe196] disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                aria-busy={isSubmitting}
                disabled={isSubmitting || !message.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Feedback...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right: Recent Submitted Notes */}
        <div className="w-full lg:flex-[5] min-w-0 rounded-3xl bg-white dark:bg-[#091f17] border border-[#dce8df] dark:border-emerald-900/50 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-emerald-900/40 pb-3">
            <MessageSquare className="w-4 h-4 text-[#183f2e] dark:text-[#2fe196]" />
            <h2 className="font-editorial text-xl font-normal text-[#123524] dark:text-white">
              Your Recent Submissions ({feedbacks.length})
            </h2>
          </div>

          {feedbacks.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-emerald-300/70 py-4 leading-relaxed">
              No feedback sent yet. Your notes and feature ideas appear here once submitted.
            </p>
          ) : (
            <div className="space-y-3 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-900/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-semibold uppercase tracking-wider text-emerald-700 dark:text-[#2fe196]">
                      {fb.category}
                    </span>
                    <span className="font-mono text-amber-600 dark:text-amber-400">
                      {fb.rating}/5 ★
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-emerald-100 leading-relaxed">
                    {fb.message}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 dark:text-emerald-400/60">
                    {new Date(fb.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
