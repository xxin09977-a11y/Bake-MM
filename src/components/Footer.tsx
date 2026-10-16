/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 sm:mt-16 border-t border-black/[0.08] dark:border-white/10 bg-white/40 dark:bg-[#0c0f17]/40 backdrop-blur-lg py-8 pb-24 md:pb-8 text-[#737373] text-xs w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left min-w-0">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-extrabold text-black dark:text-white text-sm tracking-tight uppercase">
                BakeLearn
              </span>
              <span className="text-[10px] font-mono text-[#A3A3A3]">v2.0</span>
            </div>
            <p className="text-[#737373] dark:text-[#A3A3A3] text-xs break-words">
              Your baking companion for mastering pastry science, tools, and ingredients.
            </p>
          </div>
          <div className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
            100% Offline PWA · Zero Internet Required
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
