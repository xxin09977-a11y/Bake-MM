/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Sparkles, WifiOff, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-orange-100/80 bg-white/60 py-10 pb-24 md:pb-10 text-stone-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-extrabold text-stone-900 dark:text-white text-sm">BakeLearn</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                100% Offline Ready
              </span>
            </div>
            <p className="text-stone-500 dark:text-stone-400">
              Your offline baking companion for mastering pastry science, tools, and ingredients.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-stone-500 dark:text-stone-400 text-xs">
            <span className="flex items-center gap-1">
              <WifiOff className="w-3.5 h-3.5 text-orange-600" />
              Stored Locally in Browser
            </span>
            <span>•</span>
            <span>Bilingual Content (English & Myanmar)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
