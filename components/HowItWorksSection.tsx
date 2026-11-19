import React from 'react';
import { SITE_CONFIG } from '../lib/data/site-config';
import HowItWorksInteractive from './HowItWorksInteractive';

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 border-t border-emerald-950/20 dark:border-emerald-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest text-emerald-700 dark:text-[#2fe196] uppercase block mb-3">
            SIMPLE STEPS
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-slate-600 dark:text-emerald-100/70 text-base sm:text-lg">
            Get started in just a few simple steps and build better habits.
          </p>
        </div>

        {/* Interactive Step Cards & Preview Canvas */}
        <HowItWorksInteractive durationPresets={SITE_CONFIG.durationPresets} />
      </div>
    </section>
  );
};
