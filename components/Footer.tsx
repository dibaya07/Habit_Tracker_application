import React from 'react';
import Link from 'next/link';
import { SITE_CONFIG } from '../lib/data/site-config';
import FooterFeedbackButton from './FooterFeedbackButton';
import FooterYear from './FooterYear';
import BrandMark from './ui/BrandMark';
import DownloadAppButton from './pwa/DownloadAppButton';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-emerald-900/30 bg-slate-50 dark:bg-[#06150f] text-slate-600 dark:text-slate-400 text-xs py-14 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-10 pb-12 border-b border-slate-200 dark:border-emerald-900/30">
          {/* Brand Info (Span 4) */}
          <div className="w-full md:flex-[4] min-w-0 space-y-4">
            <div className="flex items-center gap-2.5">
              <BrandMark size={32} variant="glow" />
              <span className="text-lg font-bold text-slate-900 dark:text-white font-sans">Habitora</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-emerald-200/60 max-w-sm leading-relaxed">
              {SITE_CONFIG.tagline} Simple, distraction-free habit tracking designed for clarity, consistency, and sustained progress.
            </p>

            <div>
              <FooterFeedbackButton />
            </div>
          </div>

          {/* Links Columns (Span 8) */}
          <div className="w-full md:flex-[8] min-w-0 flex flex-wrap gap-8">
            <div className="w-[calc(50%-1rem)] sm:w-[calc((100%-4rem)/3)] space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-emerald-300">
                Product
              </h4>
              <ul className="space-y-2 text-slate-600 dark:text-emerald-100/70">
                <li><Link href="/dashboard" prefetch={false} className="hover:text-emerald-700 dark:hover:text-[#2fe196] transition-colors">Dashboard</Link></li>
                <li><Link href="/create_tracker" className="hover:text-emerald-700 dark:hover:text-[#2fe196] transition-colors">Create &amp; Download Sheet</Link></li>
                <li><Link href="/templates" className="hover:text-emerald-700 dark:hover:text-[#2fe196] transition-colors">Sheet Templates</Link></li>
                <li><Link href="/analytics" prefetch={false} className="hover:text-emerald-700 dark:hover:text-[#2fe196] transition-colors">Progress Analytics</Link></li>
                <li><Link href="/history" className="hover:text-emerald-700 dark:hover:text-[#2fe196] transition-colors">Action History</Link></li>
                <li><DownloadAppButton variant="footer" /></li>
              </ul>
            </div>

            <div className="w-[calc(50%-1rem)] sm:w-[calc((100%-4rem)/3)] space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-emerald-300">
                Resources
              </h4>
              <ul className="space-y-2 text-slate-600 dark:text-emerald-100/70">
                <li><Link href="/" className="hover:text-emerald-700 dark:hover:text-[#2fe196] transition-colors">Home</Link></li>
                <li><Link href="/how-to-use" className="hover:text-emerald-700 dark:hover:text-[#2fe196] transition-colors">How to Use</Link></li>
                <li><Link href="/#features" className="hover:text-emerald-700 dark:hover:text-[#2fe196] transition-colors">Core Features</Link></li>
                <li><Link href="/feedback" className="hover:text-emerald-700 dark:hover:text-[#2fe196] transition-colors">Send Feedback</Link></li>
                <li><Link href="/#faq" className="hover:text-emerald-700 dark:hover:text-[#2fe196] transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div className="w-[calc(50%-1rem)] sm:w-[calc((100%-4rem)/3)] space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-emerald-300">
                Habitora
              </h4>
              <ul className="space-y-2 text-slate-600 dark:text-emerald-100/70">
                <li><span className="cursor-default">Privacy Centric</span></li>
                <li><span className="cursor-default">Offline-Friendly</span></li>
                <li><span className="cursor-default">No Telemetry / No Ads</span></li>
                <li><span className="cursor-default">Made with Care</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 dark:text-emerald-300/60 text-[11px]">
          <p>
            © <FooterYear /> Habitora. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Built for mindful productivity and daily consistency.
          </p>
        </div>
      </div>
    </footer>
  );
};
