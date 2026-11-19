'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Check, Flame, Sparkles, Target, TrendingUp } from 'lucide-react';
import BrandMark from '@/components/ui/BrandMark';

const SPARK_BARS = [42, 58, 52, 74, 68, 86, 94];

export default function HeroFloatingElements() {
  return (
    <div aria-hidden="true" className="pointer-events-none select-none">
      {/* Subtle Ambient Floating Geometric Accents (All Breakpoints, safely behind content) */}
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 left-[6%] w-11 h-11 rounded-2xl border border-emerald-400/35 dark:border-emerald-400/20 bg-white/55 dark:bg-emerald-900/20 backdrop-blur-sm shadow-sm flex items-center justify-center z-0 lg:hidden"
      >
        <Check className="w-4 h-4 text-[#183f2e] dark:text-[#2fe196] stroke-[2.5]" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-12 right-[6%] w-11 h-11 rounded-full border border-amber-400/35 dark:border-amber-400/20 bg-white/55 dark:bg-emerald-900/20 backdrop-blur-sm shadow-sm flex items-center justify-center z-0 lg:hidden"
      >
        <Flame className="w-4 h-4 text-amber-500 dark:text-amber-400" />
      </motion.div>

      {/* Desktop Floating Modern Glassmorphic Cards (lg+) */}
      <div className="hidden lg:block absolute inset-0 overflow-hidden z-0">
        {/* Top-Left: Streak & 7-Day Dots */}
        <motion.div
          animate={{ y: [0, -11, 0], rotate: [-1.5, 0.5, -1.5] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 left-5 xl:left-12 w-56 rounded-2xl bg-white/85 dark:bg-[#0b241b]/85 backdrop-blur-md border border-emerald-200/80 dark:border-emerald-700/45 p-3.5 shadow-[0_14px_34px_-12px_rgba(18,53,36,0.18)] space-y-2.5"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div className="text-left min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-emerald-300/75 block">
                Active Streak
              </span>
              <span className="font-mono text-sm font-bold text-[#123524] dark:text-white">
                14 Days Straight
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-100 dark:border-emerald-900/40">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
              <div key={`${day}-${idx}`} className="flex flex-col items-center gap-1">
                <span className="text-[8px] font-mono text-slate-400 dark:text-emerald-400/60">
                  {day}
                </span>
                <span className="w-4 h-4 rounded-full bg-[#183f2e] dark:bg-[#2fe196] text-white dark:text-[#071912] flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top-Right: Today's Checklist Glass Card */}
        <motion.div
          animate={{ y: [0, 12, 0], rotate: [1.5, -0.5, 1.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          className="absolute top-12 right-5 xl:right-12 w-58 rounded-2xl bg-white/85 dark:bg-[#0b241b]/85 backdrop-blur-md border border-emerald-200/80 dark:border-emerald-700/45 p-3.5 shadow-[0_14px_34px_-12px_rgba(18,53,36,0.18)] space-y-2.5 text-left"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-[#2fe196]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2fe196]" />
              <span>Today&apos;s Sheet</span>
            </span>
            <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-emerald-300/80">
              3 / 3 Done
            </span>
          </div>

          <div className="space-y-1.5">
            {['Morning Run', 'Read 20 Pages', 'Hydrate 2.5L'].map((item) => (
              <div key={item} className="flex items-center justify-between text-xs">
                <span className="text-slate-700 dark:text-emerald-100 font-medium">{item}</span>
                <span className="w-4 h-4 rounded-full bg-[#2fe196] text-[#071912] flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mid-Left: Weekly Trend Spark Card */}
        <motion.div
          animate={{ y: [0, 9, 0], rotate: [1, -1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          className="absolute top-68 left-8 xl:left-20 w-52 rounded-2xl bg-white/85 dark:bg-[#0b241b]/85 backdrop-blur-md border border-emerald-200/80 dark:border-emerald-700/45 p-3.5 shadow-[0_14px_34px_-12px_rgba(18,53,36,0.18)] space-y-2.5"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-[#183f2e] dark:text-[#2fe196] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-emerald-300/75 block">
                  Consistency
                </span>
                <span className="font-mono text-sm font-bold text-[#123524] dark:text-white">
                  94% On Track
                </span>
              </div>
            </div>
          </div>

          {/* Pure Flexbox Sparkline Bars */}
          <div className="h-8 flex items-end gap-1.5 pt-1">
            {SPARK_BARS.map((height, idx) => (
              <div
                key={idx}
                className={`flex-1 rounded-t-md ${
                  idx === SPARK_BARS.length - 1
                    ? 'bg-[#183f2e] dark:bg-[#2fe196]'
                    : 'bg-emerald-500/25 dark:bg-emerald-500/30'
                }`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </motion.div>

        {/* Mid-Right: Printable A4/A5 Card */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [-1, 1, -1] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
          className="absolute top-68 right-8 xl:right-20 rounded-2xl bg-white/85 dark:bg-[#0b241b]/85 backdrop-blur-md border border-emerald-200/80 dark:border-emerald-700/45 px-4 py-3.5 shadow-[0_14px_34px_-12px_rgba(18,53,36,0.18)] flex items-center gap-3"
        >
          <BrandMark size={32} variant="glow" />
          <div className="text-left">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-emerald-300/75 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#183f2e] dark:text-[#2fe196]" />
              <span>Printable PDF</span>
            </span>
            <span className="font-mono text-xs font-bold text-[#123524] dark:text-white block">
              A4 / A5 · 30-Day Sheet
            </span>
          </div>
        </motion.div>

        {/* Floating Subtle Micro-Ring Accents */}
        <motion.div
          animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-48 left-[18%] w-9 h-9 rounded-full border border-emerald-400/35 dark:border-emerald-400/20 bg-white/50 dark:bg-emerald-950/40 backdrop-blur-xs flex items-center justify-center"
        >
          <Target className="w-4 h-4 text-emerald-700/70 dark:text-[#2fe196]/70" />
        </motion.div>
      </div>
    </div>
  );
}

export function HeroMobileFloatingStrip() {
  return (
    <div
      aria-hidden="true"
      className="lg:hidden mt-10 flex flex-wrap items-center justify-center gap-3 pointer-events-none select-none"
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="rounded-2xl bg-white/85 dark:bg-[#0b241b]/85 backdrop-blur-md border border-emerald-200/80 dark:border-emerald-700/45 px-3.5 py-2.5 shadow-md flex items-center gap-2.5"
      >
        <span className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <Flame className="w-3.5 h-3.5" />
        </span>
        <div className="text-left">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-emerald-300/70 block">
            Streak
          </span>
          <span className="font-mono text-xs font-bold text-[#123524] dark:text-white">
            14 Days
          </span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        className="rounded-2xl bg-white/85 dark:bg-[#0b241b]/85 backdrop-blur-md border border-emerald-200/80 dark:border-emerald-700/45 px-3.5 py-2.5 shadow-md flex items-center gap-2.5"
      >
        <span className="w-7 h-7 rounded-lg bg-[#2fe196] text-[#071912] flex items-center justify-center shrink-0">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </span>
        <div className="text-left">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-emerald-300/70 block">
            Daily Sheet
          </span>
          <span className="font-mono text-xs font-bold text-[#123524] dark:text-white">
            3 / 3 Done
          </span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="rounded-2xl bg-white/85 dark:bg-[#0b241b]/85 backdrop-blur-md border border-emerald-200/80 dark:border-emerald-700/45 px-3.5 py-2.5 shadow-md flex items-center gap-2.5"
      >
        <span className="w-7 h-7 rounded-lg bg-emerald-500/15 text-[#183f2e] dark:text-[#2fe196] flex items-center justify-center shrink-0">
          <TrendingUp className="w-3.5 h-3.5" />
        </span>
        <div className="text-left">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-emerald-300/70 block">
            Rate
          </span>
          <span className="font-mono text-xs font-bold text-[#123524] dark:text-white">
            94% Tracked
          </span>
        </div>
      </motion.div>
    </div>
  );
}
