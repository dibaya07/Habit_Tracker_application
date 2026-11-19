'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Copy, Download, Monitor, Share2, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '@/lib/hooks/usePWAInstall';
import IconTooltip from '@/components/ui/IconTooltip';

interface DownloadAppButtonProps {
  variant?: 'navbar' | 'menu' | 'footer' | 'profile';
  onActionClick?: () => void;
}

export default function DownloadAppButton({
  variant = 'navbar',
  onActionClick,
}: DownloadAppButtonProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        onActionClick?.();
        return;
      }
    }
    setShowGuideModal(true);
  };

  const handleCopyUrl = async () => {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <>
      {variant === 'navbar' && (
        <IconTooltip label="Download Habitora App" position="bottom">
          <button
            type="button"
            onClick={handleClick}
            title="Download App"
            aria-label="Download Habitora App"
            className="inline-flex items-center gap-1.5 px-2.5 lg:px-3 py-2 rounded-lg border border-emerald-700/20 dark:border-emerald-400/25 bg-white/50 dark:bg-emerald-950/40 backdrop-blur-xs text-[12px] lg:text-xs font-semibold text-[#183f2e] dark:text-[#2fe196] hover:bg-white/80 dark:hover:bg-emerald-900/50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Download App</span>
          </button>
        </IconTooltip>
      )}

      {variant === 'menu' && (
        <button
          type="button"
          onClick={handleClick}
          className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#183f2e]/25 dark:border-[#2fe196]/35 bg-[#eaf3ed]/70 dark:bg-emerald-950/50 text-[#183f2e] dark:text-[#2fe196] font-semibold text-sm hover:bg-[#eaf3ed] dark:hover:bg-emerald-900/50 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download App</span>
        </button>
      )}

      {variant === 'footer' && (
        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center gap-1.5 hover:text-emerald-700 dark:hover:text-[#2fe196] transition-colors cursor-pointer text-left"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download App</span>
        </button>
      )}

      {variant === 'profile' && (
        <button
          type="button"
          onClick={handleClick}
          className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <span className="w-10 h-10 rounded-xl bg-emerald-500/15 text-[#183f2e] dark:text-[#2fe196] flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <span className="text-sm font-semibold text-[#123524] dark:text-white block">
                Download Habitora App
              </span>
              <span className="text-xs text-slate-500 dark:text-emerald-300/70 block truncate">
                Install as a standalone app on iOS, Android, or Desktop
              </span>
            </div>
          </div>
          <Download className="w-4 h-4 text-slate-400 dark:text-emerald-400/70 shrink-0" />
        </button>
      )}

      {showGuideModal &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Download Habitora App"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#091f17] border border-slate-200 dark:border-emerald-800/60 p-6 shadow-2xl space-y-5">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-emerald-900/40 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-[#eaf3ed] dark:bg-emerald-500/15 text-[#183f2e] dark:text-[#2fe196] flex items-center justify-center shrink-0">
                    <Download className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-700 dark:text-[#2fe196] block">
                      INSTALL APP
                    </span>
                    <h3 className="font-editorial text-2xl font-normal text-[#123524] dark:text-white">
                      Download Habitora
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGuideModal(false)}
                  title="Close install dialog"
                  aria-label="Close install dialog"
                  className="p-2 rounded-full text-slate-400 hover:text-slate-900 dark:text-emerald-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-emerald-100/80">
                {isIOS ? (
                  <div className="p-4 rounded-2xl bg-[#fafcf9] dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800/50 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-[#123524] dark:text-white">
                      <Share2 className="w-4 h-4 text-[#183f2e] dark:text-[#2fe196]" />
                      <span>iPhone &amp; iPad (Safari)</span>
                    </div>
                    <p className="leading-relaxed">
                      1. Tap the <strong>Share</strong> icon in your Safari toolbar.
                      <br />
                      2. Scroll down and tap <strong>Add to Home Screen</strong>.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="p-4 rounded-2xl bg-[#fafcf9] dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800/50 space-y-1.5">
                      <div className="flex items-center gap-2 font-semibold text-[#123524] dark:text-white">
                        <Smartphone className="w-4 h-4 text-[#183f2e] dark:text-[#2fe196]" />
                        <span>Android &amp; Mobile Chrome</span>
                      </div>
                      <p className="leading-relaxed">
                        Open the browser menu (<strong>⋮</strong>) and tap{' '}
                        <strong>Install app</strong> or <strong>Add to Home screen</strong>.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#fafcf9] dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800/50 space-y-1.5">
                      <div className="flex items-center gap-2 font-semibold text-[#123524] dark:text-white">
                        <Monitor className="w-4 h-4 text-[#183f2e] dark:text-[#2fe196]" />
                        <span>Desktop (Chrome / Edge)</span>
                      </div>
                      <p className="leading-relaxed">
                        Click the <strong>Install Habitora</strong> icon on the right side of your browser&apos;s address bar, or open directly in a standalone tab.
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-700/60 text-xs font-semibold text-slate-700 dark:text-emerald-100 hover:bg-slate-50 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 dark:text-[#2fe196]" />
                      <span>Link Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy App Link</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowGuideModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] text-xs font-semibold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
