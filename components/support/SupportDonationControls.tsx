'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Check, Coffee, Heart, QrCode, X } from 'lucide-react';
import { useHabitTracker } from '@/lib/context/HabitTrackerContext';

interface SupportDonationControlsProps {
  amounts: number[];
}

export default function SupportDonationControls({ amounts }: SupportDonationControlsProps) {
  const { recordHistoryAction } = useHabitTracker();
  const [selectedAmount, setSelectedAmount] = useState<number>(amounts[1] ?? 5);
  const [showQrPanel, setShowQrPanel] = useState(false);
  const [confirmedSupport, setConfirmedSupport] = useState(false);

  const handleOpenCoffeeQr = () => {
    setShowQrPanel(true);
    setConfirmedSupport(false);
    recordHistoryAction(
      'support_coffee',
      'Opened Buy Us a Coffee QR',
      `Selected $${selectedAmount} coffee support`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {amounts.map((amt) => (
          <button
            key={amt}
            type="button"
            onClick={() => setSelectedAmount(amt)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              selectedAmount === amt
                ? 'bg-[#2fe196] text-[#071912] shadow-sm'
                : 'bg-slate-100 dark:bg-emerald-950/80 border border-slate-200 dark:border-emerald-800/40 text-slate-700 dark:text-emerald-200 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ${amt}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleOpenCoffeeQr}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-200 hover:bg-[#2fe196] hover:text-[#071912] transition-all cursor-pointer"
      >
        <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
        <span>Buy Us a Coffee (${selectedAmount})</span>
      </button>

      {showQrPanel && (
        <div className="mt-4 mx-auto max-w-md rounded-2xl bg-[#fafcf9] dark:bg-[#071912] border border-[#dce8df] dark:border-emerald-800/60 p-5 sm:p-6 shadow-md text-center space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-emerald-900/50 pb-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#183f2e] dark:text-[#2fe196]">
              <QrCode className="w-4 h-4" />
              <span>Scan to Support (${selectedAmount})</span>
            </div>
            <button
              type="button"
              onClick={() => setShowQrPanel(false)}
              aria-label="Close QR code"
              className="p-1 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="w-44 h-44 mx-auto rounded-2xl bg-white p-2.5 border border-slate-200 shadow-xs flex items-center justify-center">
            <Image
              src="/images/coffee_qr.webp"
              alt={`QR code to support Habitora with $${selectedAmount}`}
              width={160}
              height={160}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-[#123524] dark:text-white">
              <Coffee className="w-4 h-4 text-[#183f2e] dark:text-[#2fe196]" />
              <span>Thank You So Much!</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-emerald-100/80 leading-relaxed">
              Your generosity keeps Habitora free, calm, and completely distraction-free for everyone building better daily habits.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setConfirmedSupport(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#183f2e] hover:bg-[#123325] dark:bg-[#2fe196] dark:hover:bg-[#28cf88] text-white dark:text-[#071912] transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{confirmedSupport ? 'Thank you for supporting Habitora!' : 'Done · Send Love'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
