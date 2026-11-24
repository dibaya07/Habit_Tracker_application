'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useHabitTracker } from '@/lib/context/HabitTrackerContext';

interface GoogleSignInButtonProps {
  label?: string;
  onSuccess?: (handledCustomAction: boolean) => void;
  onError?: (message: string) => void;
  className?: string;
}

interface GoogleAuthMessage {
  type?: string;
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  error?: string;
}

export default function GoogleSignInButton({
  label = 'Continue with Google',
  onSuccess,
  onError,
  className = '',
}: GoogleSignInButtonProps) {
  const { signInWithGoogleAccount } = useHabitTracker();
  const [isLoading, setIsLoading] = useState(false);
  const popupRef = useRef<Window | null>(null);
  const pollTimerRef = useRef<number | null>(null);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

  useEffect(() => {
    const clearPoll = () => {
      if (pollTimerRef.current !== null) {
        window.clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };

    const handleMessage = (event: MessageEvent<GoogleAuthMessage>) => {
      const origin = event.origin || '';
      const isTrustedOrigin =
        origin === window.location.origin ||
        origin.endsWith('.run.app') ||
        origin.includes('localhost');

      if (!isTrustedOrigin || !event.data || typeof event.data !== 'object') {
        return;
      }

      if (event.data.type === 'GOOGLE_AUTH_SUCCESS' && event.data.user?.email) {
        clearPoll();
        popupRef.current = null;
        setIsLoading(false);

        try {
          window.sessionStorage.removeItem('habitora_stay_home');
        } catch {}

        const handledCustomAction = signInWithGoogleAccount(event.data.user);
        onSuccessRef.current?.(handledCustomAction);
      } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
        clearPoll();
        popupRef.current = null;
        setIsLoading(false);
        onErrorRef.current?.(event.data.error || 'Google sign-in could not be completed.');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      clearPoll();
      window.removeEventListener('message', handleMessage);
    };
  }, [signInWithGoogleAccount]);

  const handleClick = async () => {
    if (isLoading) return;
    onError?.('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/google/url', { cache: 'no-store' });
      const data = (await response.json()) as {
        url?: string;
        configured?: boolean;
        error?: string;
      };

      if (!response.ok || !data.url) {
        setIsLoading(false);
        onError?.(
          data.error ||
            'Google Sign-In is not configured yet. Please configure Google OAuth credentials.'
        );
        return;
      }

      const width = 520;
      const height = 640;
      const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2));
      const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2));

      const popup = window.open(
        data.url,
        'habitora_google_oauth',
        `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,status=no`
      );

      if (!popup) {
        setIsLoading(false);
        onError?.('Popup window was blocked. Please allow popups for this site and try again.');
        return;
      }

      popupRef.current = popup;
      if (pollTimerRef.current !== null) {
        window.clearInterval(pollTimerRef.current);
      }
      pollTimerRef.current = window.setInterval(() => {
        if (!popupRef.current || popupRef.current.closed) {
          if (pollTimerRef.current !== null) {
            window.clearInterval(pollTimerRef.current);
            pollTimerRef.current = null;
          }
          popupRef.current = null;
          setIsLoading(false);
        }
      }, 400);
    } catch {
      setIsLoading(false);
      onError?.('Unable to reach Google Sign-In right now. Please try again.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`w-full min-h-[44px] inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-700/60 bg-white dark:bg-emerald-950/40 text-xs sm:text-sm font-semibold text-[#123524] dark:text-white hover:bg-slate-50 dark:hover:bg-emerald-900/45 shadow-2xs transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-[#183f2e] dark:text-[#2fe196]" />
      ) : (
        <span
          aria-hidden="true"
          className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold leading-none shrink-0 shadow-2xs"
          style={{
            background:
              'conic-gradient(#ea4335 0deg 90deg, #4285f4 90deg 180deg, #34a853 180deg 270deg, #fbbc05 270deg 360deg)',
          }}
        >
          <span className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center text-[10px] font-extrabold text-[#4285f4]">
            G
          </span>
        </span>
      )}
      <span>{isLoading ? 'Connecting to Google...' : label}</span>
    </button>
  );
}
