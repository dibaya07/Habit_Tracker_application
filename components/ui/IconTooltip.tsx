import React from 'react';

interface IconTooltipProps {
  label: string;
  position?: 'top' | 'bottom';
  children: React.ReactNode;
}

export default function IconTooltip({
  label,
  position = 'bottom',
  children,
}: IconTooltipProps) {
  const posClasses =
    position === 'top'
      ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
      : 'top-full mt-2 left-1/2 -translate-x-1/2';

  return (
    <span className="relative inline-flex items-center justify-center group/tip">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none hidden md:group-hover/tip:block md:group-focus-within/tip:block absolute ${posClasses} z-50 px-2.5 py-1 rounded-lg bg-[#123524] dark:bg-[#2fe196] text-white dark:text-[#071912] text-[11px] font-medium whitespace-nowrap shadow-md`}
      >
        {label}
      </span>
    </span>
  );
}
