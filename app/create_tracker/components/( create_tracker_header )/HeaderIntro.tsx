import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface HeaderIntroProp {
    length: number,
    days: number
}

export default function HeaderIntro({length,days} : HeaderIntroProp) {
  return (
    <div className="no-print flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#dce8df] dark:border-emerald-900/40 pb-5 sm:pb-6">
           <div className="space-y-2">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-emerald-300 hover:text-[#183f2e] dark:hover:text-[#2fe196] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Overview</span>
      </Link>
      <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#123524] dark:text-white leading-tight text-balance">
        Design Your Habit Challenge
      </h1>
      <p className="text-sm sm:text-base text-slate-600 dark:text-emerald-100/75 max-w-2xl">
        Customize your sheet below. You can download this exact sheet as PDF or
        launch it in your digital tracker.
      </p>
    </div>

            <div className="inline-flex items-center self-start sm:self-auto px-3 py-1.5 rounded-xl bg-[#eaf3ed] dark:bg-emerald-900/40 text-xs text-[#183f2e] dark:text-[#2fe196] font-mono font-semibold tabular-nums whitespace-nowrap shrink-0">
              {length} habits · {days} days
            </div>
          </div>
  )
}
