import React from 'react';
import { Coffee } from 'lucide-react';
import { SITE_CONFIG } from '../../lib/data/site-config';
import SupportDonationControls from './SupportDonationControls';

export const SupportDonationSection: React.FC = () => {
  return (
    <section className="py-16 border-t border-slate-200 dark:border-emerald-900/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#091f17]/60 border border-slate-200 dark:border-emerald-900/40 shadow-sm relative overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-[#2fe196] flex items-center justify-center mx-auto mb-4">
            <Coffee className="w-5 h-5" />
          </div>

          <h3 className="font-editorial text-2xl sm:text-3xl text-slate-900 dark:text-white font-normal mb-2">
            Enjoying Habitora?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100/70 max-w-md mx-auto mb-6">
            Support the independent development of Habitora and help us keep the core habit tracker clean, private, and ad-free.
          </p>

          <SupportDonationControls amounts={SITE_CONFIG.donationAmounts} />
        </div>
      </div>
    </section>
  );
};
