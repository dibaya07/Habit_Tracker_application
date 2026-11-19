import React from 'react';
import { SITE_CONFIG } from '../../lib/data/site-config';
import FAQAccordion from './FAQAccordion';

export const FAQSection: React.FC = () => {
  return (
    <section id="faq" className="py-20 border-t border-emerald-950/20 dark:border-emerald-900/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-semibold tracking-widest text-emerald-700 dark:text-[#2fe196] uppercase block mb-2">
            GOT QUESTIONS?
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Interactive Accordions */}
        <FAQAccordion faqs={SITE_CONFIG.faqs} />
      </div>
    </section>
  );
};
