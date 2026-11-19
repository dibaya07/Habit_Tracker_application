'use client';

import React from 'react';
import Link from 'next/link';
import IconTooltip from '@/components/ui/IconTooltip';

interface BrandLogoProps {
  logoMark: React.ReactNode;
}

export default function BrandLogoClient({ logoMark }: BrandLogoProps) {
  const handleBrandClick = () => {
    try {
      sessionStorage.setItem('habitora_stay_home', '1');
    } catch {}
  };

  return (
    <IconTooltip label="Go to Habitora Home" position="bottom">
      <Link
        href="/"
        onClick={handleBrandClick}
        title="Go to Habitora Home"
        className="flex items-center gap-2.5 group whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#2fe196] rounded-lg px-1"
      >
        {/* Hide logo icon in small view so only centered software name shows */}
        <span className="hidden md:inline-flex shrink-0">{logoMark}</span>
        <span className="text-xl font-bold tracking-tight text-[#123524] dark:text-white font-sans">
          Habitora
        </span>
      </Link>
    </IconTooltip>
  );
}
