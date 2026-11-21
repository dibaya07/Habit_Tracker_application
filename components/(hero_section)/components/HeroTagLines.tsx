import React from "react";

export default function HeroTagLines() {
  return (
    <>
      {/* Eyebrow Tag */}
      <div className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full bg-white/75 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-700/40 backdrop-blur-xs shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-[#2fe196]" />
        <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-[#183f2e] dark:text-[#2fe196] uppercase">
          {/* {SITE_CONFIG.heroTagline} */}
          SMALL STEPS. BIG CHANGES.
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
        {/* {SITE_CONFIG.heroDescription} */}
        Habitora helps you track your daily habits, stay consistent and achieve
        your goals — with a simple, clean and flexible habit tracker.
      </p>
    </>
  );
}
