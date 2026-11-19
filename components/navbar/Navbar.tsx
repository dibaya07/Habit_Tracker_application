'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useHabitTracker } from '../../lib/context/HabitTrackerContext';
import IconTooltip from '@/components/ui/IconTooltip';
import BrandLogo from './components/BrandLogo';
import DesktopNavMenu from './components/DesktopNavMenu';
import Signin_CTA_btns from './components/Signin_CTA_btns';
import MobileMenu from './components/MobileMenu';

interface NavbarProps {
  brandLogo?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({ brandLogo }) => {
  const pathname = usePathname();
  const {
    hasMounted,
    theme,
    toggleTheme,
    user,
    setIsAuthModalOpen,
    logout,
  } = useHabitTracker();

  // Derive open state per pathname so route transitions automatically close the drawer without setState in useEffect
  const [openForPath, setOpenForPath] = useState<string | null>(null);
  const mobileMenuOpen = openForPath === pathname;

  const setMobileMenuOpen = useCallback(
    (value: boolean) => {
      setOpenForPath(value ? pathname : null);
    },
    [pathname]
  );

  const isDark = hasMounted ? theme === 'dark' : false;
  const activeUser = hasMounted ? user : null;

  // Lock background page scrolling while keeping drawer internally scrollable
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenForPath(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overscrollBehavior = prevHtmlOverscroll;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="no-print sticky top-0 z-40 w-full bg-transparent backdrop-blur-md transition-colors duration-200 border-b border-emerald-950/5 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-20 flex items-center justify-between gap-2 sm:gap-3 lg:gap-8">
          {/* Left: Mobile Menu Button (left side on small screens) */}
          <div className="flex items-center md:hidden shrink-0">
            <IconTooltip label={mobileMenuOpen ? 'Close menu' : 'Open menu'} position="bottom">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                title={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                className="h-10 w-10 flex items-center justify-center rounded-xl border border-emerald-950/10 dark:border-white/15 bg-transparent hover:bg-emerald-950/5 dark:hover:bg-white/10 text-slate-800 dark:text-emerald-100 hover:border-[#183f2e] dark:hover:border-[#2fe196] focus-visible:outline-2 focus-visible:outline-[#2fe196] transition-colors cursor-pointer"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-drawer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </IconTooltip>
          </div>

          {/* Center on Mobile / Left on Desktop: Software Name (+ Logo on md+) */}
          <div className="flex-1 flex justify-center md:flex-none md:justify-start min-w-0">
            {brandLogo ?? <BrandLogo />}
          </div>

          <DesktopNavMenu />

          <Signin_CTA_btns
            toggleTheme={toggleTheme}
            isDark={isDark}
            user={activeUser}
            logout={logout}
            setIsAuthModalOpen={setIsAuthModalOpen}
          />

          {/* Right: Mobile Theme Toggle */}
          <div className="flex items-center md:hidden shrink-0">
            <IconTooltip label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'} position="bottom">
              <button
                type="button"
                onClick={toggleTheme}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle dark/light theme"
                className="h-10 w-10 flex items-center justify-center rounded-xl border border-emerald-950/10 dark:border-white/15 bg-transparent hover:bg-emerald-950/5 dark:hover:bg-white/10 text-slate-700 dark:text-emerald-100 hover:border-[#183f2e] dark:hover:border-[#2fe196] transition-colors cursor-pointer"
              >
                {isDark ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5" />}
              </button>
            </IconTooltip>
          </div>
        </div>
      </header>

      {/* Rendered outside <header> so backdrop-blur on <header> never traps position:fixed */}
      <MobileMenu
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        setIsAuthModalOpen={setIsAuthModalOpen}
        user={activeUser}
        logout={logout}
      />
    </>
  );
};

export default Navbar;
