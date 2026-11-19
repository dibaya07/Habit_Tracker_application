import React from 'react';
import { Calendar, CheckSquare, BarChart2, Heart } from 'lucide-react';
import { SITE_CONFIG } from '../lib/data/site-config';
import HeroPrimaryActions from './HeroPrimaryActions';
import HeroFloatingElements, { HeroMobileFloatingStrip } from './HeroFloatingElements';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-[#eef7f1] via-[#f7fbf8] to-[#fafcf9] dark:from-[#0a2319] dark:via-[#071b13] dark:to-[#071912]">
      {/* Architectural Dot Matrix Backdrop with Smooth Radial Edge Fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(24,63,46,0.13)_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(rgba(47,225,150,0.14)_1.2px,transparent_1.2px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_85%_72%_at_50%_38%,#000_48%,transparent_100%)] z-0"
      />

      {/* Multi-Layered Luminous Ambient Aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[920px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(47,225,150,0.28)_0%,rgba(16,185,129,0.08)_48%,transparent_72%)] dark:bg-[radial-gradient(circle,rgba(47,225,150,0.2)_0%,rgba(16,185,129,0.06)_50%,transparent_75%)] blur-2xl z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-28 -left-24 w-80 h-80 rounded-full bg-emerald-300/25 dark:bg-emerald-500/12 blur-3xl z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-32 -right-24 w-80 h-80 rounded-full bg-teal-300/25 dark:bg-teal-400/10 blur-3xl z-0"
      />

      {/* Subtle Concentric Orbital Rings Framing Centerpiece */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 w-[560px] sm:w-[760px] h-[560px] sm:h-[760px] rounded-full border border-emerald-600/10 dark:border-emerald-400/10 z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-24 left-1/2 -translate-x-1/2 w-[380px] sm:w-[540px] h-[380px] sm:h-[540px] rounded-full border border-emerald-600/10 dark:border-emerald-400/10 z-0"
      />

      {/* Floating Modern Habit Cards & Micro-Accents */}
      <HeroFloatingElements />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Eyebrow Tag */}
        <div className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full bg-white/75 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-700/40 backdrop-blur-xs shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#2fe196]" />
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-[#183f2e] dark:text-[#2fe196] uppercase">
            {SITE_CONFIG.heroTagline}
          </span>
        </div>

        {/* Serif Headline */}
        <h1 className="font-editorial text-4xl sm:text-6xl md:text-[68px] lg:text-[74px] font-normal tracking-tight text-[#123524] dark:text-white leading-[1.08] mb-6 max-w-4xl mx-auto text-balance">
          Track Your Habits and Improve.
          <br />
          One Day at a Time.
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-emerald-100/80 max-w-xl mx-auto leading-relaxed mb-9 font-normal">
          {SITE_CONFIG.heroDescription}
        </p>

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
