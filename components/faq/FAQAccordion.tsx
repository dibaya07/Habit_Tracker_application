'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQItem[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="space-y-3.5">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;

        return (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 dark:border-emerald-900/40 bg-white dark:bg-[#091f17] overflow-hidden transition-all duration-200 shadow-sm"
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full py-4.5 px-6 flex items-center justify-between text-left text-sm sm:text-base font-semibold text-slate-900 dark:text-white hover:text-emerald-700 dark:hover:text-[#2fe196] transition-colors cursor-pointer"
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 dark:text-emerald-400 shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-emerald-600 dark:text-[#2fe196]' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-emerald-100/75 leading-relaxed border-t border-slate-100 dark:border-emerald-900/30">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
