'use client';

import React from 'react';
import Link from 'next/link';
import { LogOut, Moon, Sun, User } from 'lucide-react';
import { UserAccount } from '@/lib/types/tracker';
import IconTooltip from '@/components/ui/IconTooltip';
import DownloadAppButton from '@/components/pwa/DownloadAppButton';

interface CTAProps {
  toggleTheme: () => void;
  isDark: boolean;
  user: UserAccount | null;
  logout: () => void;
  setIsAuthModalOpen: (open: boolean) => void;
}

export default function Signin_CTA_btns({
  toggleTheme,
  isDark,
  user,
  logout,
  setIsAuthModalOpen,
}: CTAProps) {
  return (
    <div className="hidden md:flex items-center gap-2 lg:gap-2.5 shrink-0">
      <DownloadAppButton variant="navbar" />

      <IconTooltip label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'} position="bottom">
        <button
          type="button"
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle dark/light theme"
          className="p-2 rounded-lg text-slate-600 dark:text-emerald-100/80 hover:text-[#183f2e] dark:hover:text-white hover:bg-emerald-950/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-amber-300" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700" />
          )}
        </button>
      </IconTooltip>

      {user ? (
        <div className="flex items-center gap-1.5 lg:gap-2">
          <IconTooltip label="Open Profile Menu" position="bottom">
            <Link
              href="/profile"
              title="Open Profile Menu"
              className="inline-flex items-center gap-2 px-3 lg:px-3.5 py-2 rounded-lg bg-[#eaf3ed] dark:bg-emerald-900/35 border border-emerald-200 dark:border-emerald-500/30 text-xs font-semibold text-[#123524] dark:text-emerald-200 hover:border-[#183f2e] dark:hover:border-[#2fe196] transition-colors whitespace-nowrap shrink-0"
            >
              <User className="w-3.5 h-3.5 text-[#183f2e] dark:text-[#2fe196]" />
              <span className="truncate max-w-[100px] lg:max-w-[120px]">
                {!user.name || user.name === 'Habitora Member' ? 'Profile' : user.name}
              </span>
            </Link>
          </IconTooltip>

          <IconTooltip label="Sign Out" position="bottom">
            <button
              type="button"
              onClick={logout}
              title="Sign Out"
              aria-label="Sign Out"
              className="p-2 rounded-lg text-slate-500 hover:text-rose-600 dark:text-emerald-300/70 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </IconTooltip>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 lg:gap-2">
          <Link
            href="/signin"
            onClick={() => setIsAuthModalOpen(false)}
            className="text-[13px] lg:text-sm font-medium text-slate-800 dark:text-emerald-100/90 hover:text-[#183f2e] dark:hover:text-white px-3 lg:px-4 py-2 rounded-lg border border-slate-300 dark:border-emerald-800/80 hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors whitespace-nowrap shrink-0"
          >
            Sign In
          </Link>

          <Link
            href="/signup"
            onClick={() => setIsAuthModalOpen(false)}
            className="inline-flex items-center justify-center px-3.5 lg:px-5 py-2 rounded-lg text-[13px] lg:text-sm font-medium transition-all duration-200 shadow-xs bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}
