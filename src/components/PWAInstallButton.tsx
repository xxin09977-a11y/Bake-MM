/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, show subtle installed badge or return null
  if (isInstalled) {
    return (
      <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-100 rounded-full border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>PWA သွင်းပြီးပြီ</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-linear-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
        title="ဖုန်း သို့မဟုတ် ကွန်ပျူတာတွင် App အဖြစ် သွင်းယူမည်"
      >
        <Download className="w-4 h-4 animate-bounce" />
        <span>App သွင်းမည်</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs sm:text-sm font-medium transition cursor-pointer"
        >
          <Smartphone className="w-4 h-4 text-orange-600" />
          <span>iOS တွင် သွင်းရန်</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                    <Smartphone className="w-5 h-5" />
                  </span>
                  <h3 className="font-bold text-stone-900 text-base">iPhone / iPad တွင် သွင်းနည်း</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-stone-700">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold shrink-0 mt-0.5">၁</span>
                  <p>Safari browser ၏ အောက်ခြေရှိ <strong>Share (မျှဝေရန်)</strong> ခလုတ်ကို နှိပ်ပါ။</p>
                </div>
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold shrink-0 mt-0.5">၂</span>
                  <p>အောက်သို့ ဆွဲချပြီး <strong>"Add to Home Screen (ပင်မမျက်နှာပြင်သို့ ထည့်ပါ)"</strong> ကို ရွေးချယ်ပါ။</p>
                </div>
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold shrink-0 mt-0.5">၃</span>
                  <p>ညာဘက်ထိပ်ရှိ <strong>"Add (ထည့်မည်)"</strong> ကို နှိပ်ပါက ဖုန်းမျက်နှာပြင်တွင် App အဖြစ် အော့ဖ်လိုင်း အမြဲ အသုံးပြုနိုင်ပါပြီ။</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-orange-600 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 transition"
              >
                နားလည်ပါပြီ
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
