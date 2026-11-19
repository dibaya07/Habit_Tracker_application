'use client';

import React, { useState } from 'react';
import { Calendar, PlusCircle, CheckCircle, Check, ArrowRight } from 'lucide-react';
import { useHabitTracker } from '../lib/context/HabitTrackerContext';

export interface DurationPresetItem {
  days: number;
  label: string;
  description: string;
}

interface HowItWorksInteractiveProps {
  durationPresets: DurationPresetItem[];
}

const STEPS = [
  {
    num: 1,
    title: 'Choose Your Time',
    description: 'Select a preset (like 21, 30, 60 days) or pick a custom date range.',
    icon: Calendar,
  },
  {
    num: 2,
    title: 'Add Your Habits',
    description: 'Add the habits you want to track (e.g. exercise, meditation, reading).',
    icon: PlusCircle,
  },
  {
    num: 3,
    title: 'Track & Grow',
    description: 'Mark your progress, get insights and stay on track.',
    icon: CheckCircle,
  },
];

const CHECKLIST_ITEMS = [
  'Choose your time period',
  'Add your habits',
  'Mark daily progress',
  'View analytics & insights',
];

export default function HowItWorksInteractive({ durationPresets }: HowItWorksInteractiveProps) {
  const { setIsCreateModalOpen } = useHabitTracker();
  const [activeStepTab, setActiveStepTab] = useState<number>(0);

  return (
    <>
      {/* 3 Step Cards */}
      <div className="flex flex-col md:flex-row gap-8 mb-20">
        {STEPS.map((step, idx) => (
          <div
            key={idx}
            onClick={() => setActiveStepTab(idx)}
            className={`w-full md:flex-1 p-7 rounded-2xl border transition-all duration-300 cursor-pointer ${
              activeStepTab === idx
                ? 'border-emerald-500 bg-emerald-50/80 dark:bg-[#0b231b] shadow-lg ring-1 ring-emerald-500/20'
                : 'border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-[#091e17]/40 hover:border-emerald-400'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 rounded-full bg-[#2fe196] text-[#071912] font-bold text-sm flex items-center justify-center shadow-sm">
                {step.num}
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-[#2fe196] flex items-center justify-center">
                <step.icon className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-emerald-100/65 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Interactive "Watch It in Action" Section */}
      <div className="rounded-3xl border border-slate-200 dark:border-emerald-900/30 bg-gradient-to-br from-[#eaf3ec] to-[#f4f7f4] dark:from-[#0a2119] dark:to-[#071912] p-8 sm:p-12 shadow-xl">
        <div className="max-w-2xl mb-8">
          <h3 className="font-editorial text-2xl sm:text-3xl text-slate-900 dark:text-white font-normal mb-2">
            Watch It in Action
          </h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-emerald-100/70">
            See how easy it is to create and follow your habit plan.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Interactive Preview Canvas */}
          <div className="w-full lg:flex-[8] min-w-0 rounded-2xl bg-white dark:bg-[#081b14] border border-slate-200 dark:border-emerald-800/40 p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-emerald-900/50 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40"></span>
                <span className="text-xs text-slate-700 dark:text-emerald-300 font-medium ml-2">
                  Habitora Interactive Canvas
                </span>
              </div>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">
                Step {activeStepTab + 1} of 3
              </span>
            </div>

            {activeStepTab === 0 && (
              <div className="p-4 space-y-4">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  Duration Setup
                </span>
                <p className="text-sm text-slate-800 dark:text-white">
                  Select your challenge length or enter a custom duration:
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {durationPresets.slice(0, 4).map((p, i) => (
                    <div
                      key={i}
                      className={`w-[calc(50%-0.3125rem)] sm:w-[calc((100%-1.875rem)/4)] p-3 rounded-xl border text-center transition-all ${
                        i === 1
                          ? 'bg-[#2fe196]/15 border-[#2fe196] text-slate-900 dark:text-white font-bold'
                          : 'border-slate-200 dark:border-emerald-800/40 text-slate-700 dark:text-emerald-200'
                      }`}
                    >
                      <div className="text-base font-bold">{p.days} Days</div>
                      <div className="text-[10px] text-slate-500 dark:text-emerald-300/70">
                        {p.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeStepTab === 1 && (
              <div className="p-4 space-y-3">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  Habit Selection
                </span>
                <div className="space-y-2">
                  {[
                    { name: 'Morning Workout & Stretch', cat: 'Health', target: '6x / week' },
                    { name: 'Daily Mindfulness Meditation', cat: 'Wellness', target: 'Daily' },
                    { name: 'Read 20 Pages', cat: 'Learning', target: '5x / week' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-800/40 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#2fe196]/20 text-emerald-700 dark:text-[#2fe196] flex items-center justify-center font-bold text-[10px]">
                          ✓
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white block">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-emerald-300/70">
                            {item.cat} · {item.target}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeStepTab === 2 && (
              <div className="p-4 space-y-3">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  Daily Matrix Logging & Growth
                </span>
                <div className="flex gap-1.5 text-center">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div
                      key={i}
                      className="flex-1 min-w-0 p-2 rounded-lg bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800/40"
                    >
                      <span className="text-[10px] text-slate-600 dark:text-emerald-400 block mb-1">
                        {day}
                      </span>
                      <div className="w-6 h-6 mx-auto rounded-full bg-[#2fe196] text-[#071912] font-bold text-xs flex items-center justify-center">
                        ✓
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 text-center">
                  <span className="text-xs text-slate-700 dark:text-emerald-200">
                    Weekly Score: <strong className="text-slate-900 dark:text-white">7/7 Days</strong> · Consistency:{' '}
                    <strong className="text-emerald-700 dark:text-[#2fe196]">100%</strong>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Checklist items on right */}
          <div className="w-full lg:flex-[4] min-w-0 space-y-4">
            <div className="space-y-3">
              {CHECKLIST_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveStepTab(idx % 3)}
                  className="flex items-center gap-3 text-sm text-slate-700 dark:text-emerald-100 hover:text-[#123524] dark:hover:text-white transition-colors cursor-pointer group"
                >
                  <div className="w-5 h-5 rounded-full bg-[#2fe196]/20 border border-[#2fe196]/50 flex items-center justify-center text-[#15803d] dark:text-[#2fe196] group-hover:scale-110 transition-transform">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#2fe196] text-[#071912] hover:bg-[#28cf88] transition-all cursor-pointer"
              >
                <span>Build Your Habit Tracker</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
