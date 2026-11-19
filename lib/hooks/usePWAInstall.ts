'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const noopSubscribe = () => () => {};

function subscribeDisplayMode(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia('(display-mode: standalone)');
  mq.addEventListener('change', callback);
  window.addEventListener('appinstalled', callback);
  return () => {
    mq.removeEventListener('change', callback);
    window.removeEventListener('appinstalled', callback);
  };
}

function getIsStandaloneSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function getIsIOSSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [acceptedInstall, setAcceptedInstall] = useState(false);

  const isStandalone = useSyncExternalStore(
    subscribeDisplayMode,
    getIsStandaloneSnapshot,
    () => false
  );
  const isIOS = useSyncExternalStore(noopSubscribe, getIsIOSSnapshot, () => false);
  const isInstalled = isStandalone || acceptedInstall;

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setAcceptedInstall(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setAcceptedInstall(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return {
    isInstallable: Boolean(deferredPrompt),
    isInstalled,
    isIOS,
    install,
  };
}
