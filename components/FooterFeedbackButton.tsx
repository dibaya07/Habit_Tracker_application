import React from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

export default function FooterFeedbackButton() {
  return (
    <Link
      href="/feedback"
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border border-slate-300 dark:border-emerald-800/40 text-slate-700 dark:text-emerald-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-emerald-900/30 transition-colors"
    >
      <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-[#2fe196]" />
      <span>Send Feedback or Suggestion</span>
    </Link>
  );
}
