import React from 'react';
import Image from 'next/image';

interface BrandMarkProps {
  size?: number;
  variant?: 'default' | 'glow' | 'light-only';
  className?: string;
}

export default function BrandMark({
  size = 36,
  variant = 'default',
  className = '',
}: BrandMarkProps) {
  const darkSrc =
    variant === 'glow' ? '/images/logo_glow.webp' : '/images/logo_neon.webp';

  if (variant === 'light-only') {
    return (
      <div
        style={{ width: size, height: size }}
        className={`relative rounded-xl overflow-hidden shrink-0 border border-emerald-200/80 bg-white shadow-2xs ${className}`}
      >
        <Image
          src="/images/logo_light.webp"
          alt="Habitora checklist logo"
          width={size}
          height={size}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-xl overflow-hidden shrink-0 border border-emerald-200/80 dark:border-emerald-700/50 shadow-2xs ${className}`}
    >
      <Image
        src="/images/logo_light.webp"
        alt="Habitora checklist logo"
        width={size}
        height={size}
        className="w-full h-full object-cover dark:hidden"
        referrerPolicy="no-referrer"
      />
      <Image
        src={darkSrc}
        alt="Habitora checklist logo"
        width={size}
        height={size}
        className="w-full h-full object-cover hidden dark:block"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
