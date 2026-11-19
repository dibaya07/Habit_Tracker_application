'use client';

import React from 'react';
import { Eraser, X } from 'lucide-react';
import { DayLabelMode } from '@/lib/types/tracker';

export interface GraphDayPoint {
  dayNum: number;
  topLabel?: string;
  bottomLabel: string;
  completedCount: number | null; // null = not yet tracked (not plotted)
}

interface ProgressLineGraphProps {
  title?: string;
  subtitle?: string;
  maxHabits: number;
  days: GraphDayPoint[];
  extraDaysCount?: number;
  rightLabel?: string;
  leftColClassName?: string;
  rightSpacerClassName?: string;
  dayColMinWidthPx?: number;
  minTableWidth?: number;
  dayLabelMode?: DayLabelMode;
  onPointClick?: (dayNum: number, value: number) => void;
  onClearPoints?: () => void;
  onRemoveGraph?: () => void;
  interactiveHint?: string;
  forceLight?: boolean;
}

export default function ProgressLineGraph({
  title = 'Progress Graph',
  subtitle,
  maxHabits,
  days,
  extraDaysCount = 0,
  rightLabel,
  leftColClassName = 'w-[250px] sm:w-[300px] lg:w-[340px]',
  rightSpacerClassName = 'w-[84px]',
  dayColMinWidthPx = 36,
  minTableWidth,
  onPointClick,
  onClearPoints,
  onRemoveGraph,
  interactiveHint,
  forceLight = false,
}: ProgressLineGraphProps) {
  const gradId = React.useId();
  const maxY = Math.max(1, maxHabits);
  const yTicks = Array.from({ length: maxY + 1 }, (_, i) => maxY - i); // N down to 0
  const visibleDayCount = Math.max(1, days.length);

  // Graph coordinate geometry: each integer step gets crisp vertical spacing
  const stepPx = maxY <= 6 ? 30 : maxY <= 10 ? 24 : 20;
  const padY = 14;
  const innerHeight = maxY * stepPx;
  const totalHeight = innerHeight + padY * 2;

  const getYPx = (value: number) => {
    const clamped = Math.max(0, Math.min(maxY, value));
    return padY + (maxY - clamped) * stepPx;
  };

  // Collect plotted points in chronological day order
  const plottedPoints = days
    .map((d, dayIdx) => ({
      ...d,
      dayIdx,
    }))
    .filter((d): d is GraphDayPoint & { dayIdx: number; completedCount: number } =>
      d.completedCount !== null && d.completedCount !== undefined
    );

  // SVG viewBox uses 1000 horizontal units and totalHeight vertical units
  const svgWidth = 1000;
  const polylinePoints = plottedPoints
    .map((pt) => {
      const x = ((pt.dayIdx + 0.5) / visibleDayCount) * svgWidth;
      const y = getYPx(pt.completedCount);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  const baselineY = getYPx(0);
  const areaPolygonPoints =
    plottedPoints.length >= 2
      ? `${(((plottedPoints[0].dayIdx + 0.5) / visibleDayCount) * svgWidth).toFixed(2)},${baselineY.toFixed(2)} ${polylinePoints} ${(((plottedPoints[plottedPoints.length - 1].dayIdx + 0.5) / visibleDayCount) * svgWidth).toFixed(2)},${baselineY.toFixed(2)}`
      : '';

  const effectiveRightLabel =
    rightLabel !== undefined
      ? rightLabel
      : extraDaysCount > 0
      ? `+${extraDaysCount} more`
      : undefined;

  const hasRightCol = effectiveRightLabel !== undefined;
  const computedMinWidth =
    minTableWidth ?? 250 + visibleDayCount * dayColMinWidthPx + (hasRightCol ? 84 : 0);

  return (
    <div
      className={`border-t-2 border-slate-200 bg-white ${
        forceLight ? '' : 'dark:border-emerald-900/50 dark:bg-[#081d15]'
      }`}
    >
      {/* Graph Header */}
      <div
        className={`px-5 py-3 border-b border-slate-200 bg-[#fafcf9] flex flex-wrap items-center justify-between gap-3 ${
          forceLight ? '' : 'dark:border-emerald-900/50 dark:bg-[#0b241b]/70'
        }`}
      >
        <div className="flex flex-wrap items-baseline gap-2.5">
          <h3
            className={`font-editorial text-base sm:text-lg font-normal text-[#123524] ${
              forceLight ? '' : 'dark:text-white'
            }`}
          >
            {title}
          </h3>
          <span
            className={`text-[11px] text-slate-500 ${
              forceLight ? '' : 'dark:text-emerald-300/75'
            }`}
          >
            {subtitle || `Left axis shows number of habits completed each day (0 to ${maxY})`}
          </span>
          {interactiveHint && (
            <span
              className={`no-print text-[11px] text-slate-400 hidden md:inline ${
                forceLight ? '' : 'dark:text-emerald-400/60'
              }`}
            >
              · {interactiveHint}
            </span>
          )}
        </div>

        <div className="no-print flex items-center gap-2">
          {onClearPoints && plottedPoints.length > 0 && (
            <button
              type="button"
              onClick={onClearPoints}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-emerald-300/70 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Clear Graph</span>
            </button>
          )}

          {onRemoveGraph && (
            <button
              type="button"
              onClick={onRemoveGraph}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-rose-600 dark:text-emerald-300/70 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer whitespace-nowrap"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove Graph</span>
            </button>
          )}
        </div>
      </div>

      {/* Coordinate Graph Body */}
      <div className="overflow-x-auto custom-scrollbar">
        <div className="w-full" style={{ minWidth: `${computedMinWidth}px` }}>
          {/* X-Axis Day Header Row */}
          <div
            className={`flex border-b border-slate-200 bg-slate-50/90 text-xs ${
              forceLight ? '' : 'dark:border-emerald-900/50 dark:bg-[#0b241b]/50'
            }`}
          >
            <div
              className={`${leftColClassName} shrink-0 py-2 px-5 border-r-2 border-slate-300 flex items-center justify-end font-semibold text-slate-700 sticky left-0 z-20 bg-slate-50 ${
                forceLight
                  ? ''
                  : 'dark:border-emerald-800/80 dark:text-emerald-200 dark:bg-[#0b241b]'
              }`}
            >
              <span
                className={`text-[11px] font-semibold text-slate-700 text-right ${
                  forceLight ? '' : 'dark:text-emerald-100'
                }`}
              >
                Habits Completed (Per Day)
              </span>
            </div>

            <div className="flex-1 flex">
              {days.map((d) => (
                <div
                  key={d.dayNum}
                  style={{ minWidth: `${dayColMinWidthPx}px` }}
                  className={`flex-1 py-2 px-1 text-center font-mono tabular-nums border-r border-slate-100/80 last:border-r-0 ${
                    forceLight ? '' : 'dark:border-emerald-900/20'
                  }`}
                >
                  {d.topLabel && (
                    <span
                      className={`block text-[9px] uppercase text-slate-400 leading-none mb-0.5 ${
                        forceLight ? '' : 'dark:text-emerald-400/70'
                      }`}
                    >
                      {d.topLabel}
                    </span>
                  )}
                  <span
                    className={`text-xs font-bold text-slate-700 leading-none block ${
                      forceLight ? '' : 'dark:text-white'
                    }`}
                  >
                    {d.bottomLabel}
                  </span>
                </div>
              ))}
            </div>

            {hasRightCol && (
              <div
                className={`${rightSpacerClassName} shrink-0 py-2 px-2 text-center font-mono tabular-nums text-[11px] font-semibold text-emerald-700 border-l border-slate-200 whitespace-nowrap flex items-center justify-center ${
                  forceLight ? '' : 'dark:text-[#2fe196] dark:border-emerald-900/30'
                }`}
              >
                {effectiveRightLabel}
              </div>
            )}
          </div>

          {/* XY Coordinate Canvas Row */}
          <div className="flex">
            {/* Y-Axis Scale Numbers aligned directly on Horizontal Gridlines */}
            <div
              className={`${leftColClassName} shrink-0 border-r-2 border-slate-300 sticky left-0 z-10 bg-white relative select-none ${
                forceLight ? '' : 'dark:border-emerald-800/80 dark:bg-[#081d15]'
              }`}
              style={{ height: `${totalHeight}px` }}
            >
              {yTicks.map((val) => {
                const topPx = getYPx(val);
                return (
                  <div
                    key={val}
                    style={{ top: `${topPx}px` }}
                    className="absolute right-0 left-0 -translate-y-1/2 flex items-center justify-end pr-3 pl-5"
                  >
                    <span
                      className={`font-mono tabular-nums text-[11px] leading-none ${
                        val === maxY || val === 0
                          ? `font-bold text-slate-800 ${forceLight ? '' : 'dark:text-emerald-100'}`
                          : `font-medium text-slate-500 ${forceLight ? '' : 'dark:text-emerald-300/75'}`
                      }`}
                    >
                      {val}
                    </span>
                    {/* Axis Tick Mark */}
                    <span
                      className={`ml-2 w-2 h-px bg-slate-400 ${
                        forceLight ? '' : 'dark:bg-emerald-600'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Graph Plotting Area */}
            <div
              className={`relative flex-1 bg-[linear-gradient(to_bottom,transparent_0%,rgba(248,250,252,0.45)_100%)] ${
                forceLight
                  ? ''
                  : 'dark:bg-[linear-gradient(to_bottom,transparent_0%,rgba(6,30,21,0.35)_100%)]'
              }`}
              style={{ height: `${totalHeight}px` }}
            >
              {/* Horizontal Graph Gridlines (from maxY down to 0 baseline) */}
              {yTicks.map((val) => {
                const topPx = getYPx(val);
                const isBaseline = val === 0;
                return (
                  <div
                    key={val}
                    style={{ top: `${topPx}px` }}
                    className={`pointer-events-none absolute left-0 right-0 ${
                      isBaseline
                        ? `border-t-2 border-slate-300 ${forceLight ? '' : 'dark:border-emerald-700/80'}`
                        : `border-t border-dashed border-slate-200 ${forceLight ? '' : 'dark:border-emerald-900/45'}`
                    }`}
                  />
                );
              })}

              {/* Vertical Day Axis Gridlines centered under each Day label */}
              {days.map((d, dayIdx) => {
                const leftPct = ((dayIdx + 0.5) / visibleDayCount) * 100;
                return (
                  <div
                    key={d.dayNum}
                    style={{ left: `${leftPct}%`, top: `${padY}px`, height: `${innerHeight}px` }}
                    className={`pointer-events-none absolute border-l border-slate-200/85 ${
                      forceLight ? '' : 'dark:border-emerald-900/35'
                    }`}
                  />
                );
              })}

              {/* Coordinate Intersection Guides (great for paper pen-plotting & interactive point clicks) */}
              {days.map((d, dayIdx) => {
                const leftPct = ((dayIdx + 0.5) / visibleDayCount) * 100;
                return yTicks.map((val) => {
                  const topPx = getYPx(val);
                  const isPlottedHere = d.completedCount === val;
                  return onPointClick ? (
                    <button
                      key={`${d.dayNum}-${val}`}
                      type="button"
                      onClick={() => onPointClick(d.dayNum, val)}
                      aria-label={`Day ${d.bottomLabel}: ${val} habits done`}
                      title={`Day ${d.bottomLabel}: mark ${val} done`}
                      style={{ left: `${leftPct}%`, top: `${topPx}px` }}
                      className="group/pt absolute -translate-x-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center cursor-pointer z-10 focus:outline-none"
                    >
                      <span
                        className={`rounded-full transition-all ${
                          isPlottedHere
                            ? 'w-1.5 h-1.5 bg-transparent'
                            : 'w-1.5 h-1.5 bg-slate-300/75 dark:bg-emerald-800/75 group-hover/pt:w-2.5 group-hover/pt:h-2.5 group-hover/pt:bg-[#e07a38]/70'
                        }`}
                      />
                    </button>
                  ) : (
                    <span
                      key={`${d.dayNum}-${val}`}
                      style={{ left: `${leftPct}%`, top: `${topPx}px` }}
                      className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-slate-300/80 ${
                        forceLight ? '' : 'dark:bg-emerald-800/70'
                      }`}
                    />
                  );
                });
              })}

              {/* SVG Area Fill + Connected Line */}
              {plottedPoints.length >= 2 && (
                <svg
                  className="pointer-events-none absolute inset-0 w-full h-full z-10"
                  viewBox={`0 0 ${svgWidth} ${totalHeight}`}
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e07a38" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#e07a38" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  <polygon fill={`url(#${gradId})`} points={areaPolygonPoints} />
                  <polyline
                    fill="none"
                    stroke="#e07a38"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    points={polylinePoints}
                  />
                </svg>
              )}

              {/* Crisp Circular Data Points */}
              {plottedPoints.map((pt) => {
                const leftPct = ((pt.dayIdx + 0.5) / visibleDayCount) * 100;
                const topPx = getYPx(pt.completedCount);
                return (
                  <div
                    key={pt.dayNum}
                    title={`Day ${pt.bottomLabel}: ${pt.completedCount}/${maxY} completed`}
                    style={{ left: `${leftPct}%`, top: `${topPx}px` }}
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
                  >
                    <span
                      className={`w-3 h-3 rounded-full bg-[#e07a38] border-2 border-white shadow-xs block ${
                        forceLight ? '' : 'dark:border-[#081d15]'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {hasRightCol && (
              <div
                className={`${rightSpacerClassName} shrink-0 border-l border-slate-200 flex items-center justify-center font-mono text-xs text-slate-300 ${
                  forceLight ? '' : 'dark:border-emerald-900/30 dark:text-emerald-800/70'
                }`}
                style={{ height: `${totalHeight}px` }}
              >
                ···
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
