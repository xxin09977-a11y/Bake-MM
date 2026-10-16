/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed or dismissed, don't show banner
  if (isInstalled || isDismissed) {
    return null;
  }

  if (!isInstallable && !isIOS) {
    return null;
  }

  return (
    <>
      <aside 
        aria-label="Install BakeLearn as an App"
        className="relative mb-5 rounded-lg bg-black text-white dark:bg-[#171717] dark:text-white p-4 sm:p-5 border border-black dark:border-[#262626] w-full max-w-full overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
          <div className="flex items-start gap-3 min-w-0">
            <div className="p-2 bg-white text-black rounded-md shrink-0 mt-0.5">
              <Download className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm sm:text-base text-white uppercase tracking-wide">
                  Install BakeLearn App
                </span>
                <span className="px-2 py-0.5 rounded-xs bg-[#262626] text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-300">
                  OFFLINE READY
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#A3A3A3] mt-0.5 leading-relaxed break-words">
                Add BakeLearn to your home screen for rapid 100% offline access anytime, anywhere.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {isInstallable && (
              <button
                onClick={install}
                className="px-4 py-2 rounded-md bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-colors active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Install App</span>
              </button>
            )}

            {isIOS && (
              <button
                onClick={() => setShowIOSGuide(true)}
                className="px-4 py-2 rounded-md bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-colors active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Smartphone className="w-4 h-4" />
                <span>Install on iOS</span>
              </button>
            )}

            <button
              onClick={() => setIsDismissed(true)}
              className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* iOS Modal Guide */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white dark:bg-[#000000] p-6 border border-black dark:border-[#262626]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] dark:border-[#262626]">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-black text-white dark:bg-white dark:text-black rounded-sm">
                  <Smartphone className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-black dark:text-white text-sm uppercase tracking-wide">Install on iOS</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-sm text-[#737373] hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-[#171717] dark:text-[#E5E5E5]">
              <div className="flex items-start gap-3 p-3 rounded-md bg-[#F5F5F5] dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#262626]">
                <span className="flex items-center justify-center w-5 h-5 rounded-xs bg-black text-white dark:bg-white dark:text-black text-[10px] font-mono font-bold shrink-0 mt-0.5">1</span>
                <p>In Safari, tap the <strong>Share</strong> button at the bottom of the screen.</p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-md bg-[#F5F5F5] dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#262626]">
                <span className="flex items-center justify-center w-5 h-5 rounded-xs bg-black text-white dark:bg-white dark:text-black text-[10px] font-mono font-bold shrink-0 mt-0.5">2</span>
                <p>Scroll down and tap <strong>"Add to Home Screen"</strong>.</p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-md bg-[#F5F5F5] dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#262626]">
                <span className="flex items-center justify-center w-5 h-5 rounded-xs bg-black text-white dark:bg-white dark:text-black text-[10px] font-mono font-bold shrink-0 mt-0.5">3</span>
                <p>Tap <strong>"Add"</strong> in the top-right corner to access offline anytime.</p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-md bg-black text-white dark:bg-white dark:text-black py-2.5 text-xs font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAInstallBanner;
