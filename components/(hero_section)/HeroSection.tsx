import React from 'react';
import { Calendar, CheckSquare, BarChart2, Heart } from 'lucide-react';
import { SITE_CONFIG } from '../../lib/data/site-config';
import HeroPrimaryActions from './components/HeroPrimaryActions';
import HeroFloatingElements, { HeroMobileFloatingStrip } from './components/HeroFloatingElements';
import BackgroundGraphics from './components/BackgroundGraphics';
import HeroTagLines from './components/HeroTagLines';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-[#eef7f1] via-[#f7fbf8] to-[#fafcf9] dark:from-[#0a2319] dark:via-[#071b13] dark:to-[#071912]">
    <BackgroundGraphics/>

      {/* Floating Modern Habit Cards & Micro-Accents */}
      <HeroFloatingElements />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
       <HeroTagLines/>

        {/* CTA Buttons */}
        <div className="relative inline-flex flex-col items-center">
          <HeroPrimaryActions />

          <div className="mt-4 sm:mt-3 font-script text-base sm:text-lg text-[#2d6a4f] dark:text-[#2fe196] select-none pointer-events-none">
            Less stress, more progress.
          </div>
        </div>

        {/* Mobile / Tablet Floating Cards Strip */}
        <HeroMobileFloatingStrip />

        {/* 4 Feature Highlights Row */}
        <div className="flex flex-wrap gap-6 sm:gap-6 mt-14 sm:mt-20 text-left">
          {/* 1. Custom Time Periods */}
          <div className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc((100%-4.5rem)/4)] rounded-2xl bg-white/70 dark:bg-[#091f17]/75 backdrop-blur-xs border border-emerald-100/90 dark:border-emerald-900/50 p-4 space-y-2.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#eaf3ed] dark:bg-emerald-950/70 border border-emerald-200/70 dark:border-emerald-800/40 flex items-center justify-center text-[#2d6a4f] dark:text-[#2fe196]">
              <Calendar className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="font-bold text-[#123524] dark:text-white text-base">
              Custom Time Periods
            </h3>
            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-emerald-100/70 leading-relaxed">
              Choose from preset options or set your own date range.
            </p>
          </div>

          {/* 2. Track Your Habits */}
          <div className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc((100%-4.5rem)/4)] rounded-2xl bg-white/70 dark:bg-[#091f17]/75 backdrop-blur-xs border border-emerald-100/90 dark:border-emerald-900/50 p-4 space-y-2.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#eaf3ed] dark:bg-emerald-950/70 border border-emerald-200/70 dark:border-emerald-800/40 flex items-center justify-center text-[#2d6a4f] dark:text-[#2fe196]">
              <CheckSquare className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="font-bold text-[#123524] dark:text-white text-base">
              Track Your Habits
            </h3>
            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-emerald-100/70 leading-relaxed">
              Mark your daily progress with a simple, clean interface.
            </p>
          </div>

          {/* 3. Get Insights */}
          <div className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc((100%-4.5rem)/4)] rounded-2xl bg-white/70 dark:bg-[#091f17]/75 backdrop-blur-xs border border-emerald-100/90 dark:border-emerald-900/50 p-4 space-y-2.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#eaf3ed] dark:bg-emerald-950/70 border border-emerald-200/70 dark:border-emerald-800/40 flex items-center justify-center text-[#2d6a4f] dark:text-[#2fe196]">
              <BarChart2 className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="font-bold text-[#123524] dark:text-white text-base">
              Get Insights
            </h3>
            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-emerald-100/70 leading-relaxed">
              See your progress with beautiful charts and analytics.
            </p>
          </div>

          {/* 4. Stay Motivated */}
          <div className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc((100%-4.5rem)/4)] rounded-2xl bg-white/70 dark:bg-[#091f17]/75 backdrop-blur-xs border border-emerald-100/90 dark:border-emerald-900/50 p-4 space-y-2.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#eaf3ed] dark:bg-emerald-950/70 border border-emerald-200/70 dark:border-emerald-800/40 flex items-center justify-center text-[#2d6a4f] dark:text-[#2fe196]">
              <Heart className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="font-bold text-[#123524] dark:text-white text-base">
              Stay Motivated
            </h3>
            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-emerald-100/70 leading-relaxed">
              Build consistency and reach your goals faster.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
