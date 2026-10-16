/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, show subtle installed badge
  if (isInstalled) {
    return (
      <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold text-black dark:text-white bg-[#F5F5F5] dark:bg-[#171717] rounded-md border border-[#E5E5E5] dark:border-[#262626]">
        <Check className="w-3.5 h-3.5" />
        <span>PWA Installed</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow: Solid black block
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-bold transition-colors cursor-pointer"
        title="Install BakeLearn as an App"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow: Stroke-only outlined button
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-black dark:border-white text-black dark:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#171717] text-xs font-bold transition-colors cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Install iOS</span>
        </button>

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
                  <p>In Safari, tap the <strong>Share</strong> icon at the bottom of the screen.</p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-md bg-[#F5F5F5] dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#262626]">
                  <span className="flex items-center justify-center w-5 h-5 rounded-xs bg-black text-white dark:bg-white dark:text-black text-[10px] font-mono font-bold shrink-0 mt-0.5">2</span>
                  <p>Scroll down and tap <strong>"Add to Home Screen"</strong>.</p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-md bg-[#F5F5F5] dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#262626]">
                  <span className="flex items-center justify-center w-5 h-5 rounded-xs bg-black text-white dark:bg-white dark:text-black text-[10px] font-mono font-bold shrink-0 mt-0.5">3</span>
                  <p>Tap <strong>"Add"</strong> in the top-right corner to launch offline anytime.</p>
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
  }

  return null;
};
