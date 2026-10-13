/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, Smartphone, X, Sparkles, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed or dismissed by user in this session, don't show banner
  if (isInstalled || isDismissed) {
    return null;
  }

  // If neither Chromium installable nor iOS Safari, don't display ambiently
  if (!isInstallable && !isIOS) {
    return null;
  }

  return (
    <>
      <aside 
        aria-label="PWA သွင်းယူရန် နှိုးဆော်ချက်"
        className="relative mb-6 rounded-3xl bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 p-4 sm:p-5 text-white shadow-xl shadow-orange-600/20 animate-in fade-in slide-in-from-top-3 duration-200"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md shrink-0 mt-0.5">
              <Download className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white">
                  BakeLearn MM ကို App အဖြစ် သွင်းယူပါ
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  PWA Install
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-100 mt-0.5 leading-relaxed">
                ဖုန်းပင်မမျက်နှာပြင်တွင် ထည့်သွင်းထားပါက အင်တာနက်လုံးဝမရှိသည့်အချိန်တွင်ပင် လျင်မြန်စွာ ၁၀၀% အော့ဖ်လိုင်း သုံးနိုင်ပါသည်
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {isInstallable && (
              <button
                onClick={install}
                className="px-4 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-amber-50 text-orange-800 text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>App သွင်းမည်</span>
              </button>
            )}

            {isIOS && (
              <button
                onClick={() => setShowIOSGuide(true)}
                className="px-4 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-amber-50 text-orange-800 text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Smartphone className="w-4 h-4" />
                <span>iOS တွင် သွင်းနည်း</span>
              </button>
            )}

            <button
              onClick={() => setIsDismissed(true)}
              className="p-2 rounded-xl text-amber-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="ခေတ္တပိတ်ထားမည်"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* iOS Modal Guide */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-stone-900 p-6 shadow-2xl border border-stone-200 dark:border-stone-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-orange-100 dark:bg-orange-950 text-orange-600 rounded-xl">
                  <Smartphone className="w-5 h-5" />
                </span>
                <h3 className="font-extrabold text-stone-900 dark:text-white text-base">iPhone / iPad တွင် သွင်းနည်း</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold shrink-0 mt-0.5">၁</span>
                <p>Safari browser ၏ အောက်ခြေရှိ <strong>Share (မျှဝေရန်)</strong> ခလုတ်ကို နှိပ်ပါ။</p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold shrink-0 mt-0.5">၂</span>
                <p>အောက်သို့ ဆွဲချပြီး <strong>"Add to Home Screen (ပင်မမျက်နှာပြင်သို့ ထည့်ပါ)"</strong> ကို ရွေးချယ်ပါ။</p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold shrink-0 mt-0.5">၃</span>
                <p>ညာဘက်ထိပ်ရှိ <strong>"Add (ထည့်မည်)"</strong> ကို နှိပ်ပါက ဖုန်းမျက်နှာပြင်တွင် App အဖြစ် အော့ဖ်လိုင်း အမြဲ အသုံးပြုနိုင်ပါပြီ။</p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-2xl bg-orange-600 py-3 text-sm font-bold text-white hover:bg-orange-700 transition"
            >
              နားလည်ပါပြီ
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAInstallBanner;
