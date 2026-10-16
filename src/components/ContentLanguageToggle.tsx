/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Languages } from 'lucide-react';
import { useContentLanguage } from '../context/LanguageContext';

interface ContentLanguageToggleProps {
  className?: string;
  compact?: boolean;
}

export const ContentLanguageToggle: React.FC<ContentLanguageToggleProps> = ({
  className = '',
  compact = false,
}) => {
  const { contentLang, setContentLang } = useContentLanguage();

  return (
    <div
      className={`inline-flex items-center gap-0.5 p-0.5 rounded-lg bg-white/40 dark:bg-white/[0.04] backdrop-blur-md border border-black/[0.08] dark:border-white/10 shrink-0 select-none shadow-xs ${className}`}
      role="group"
      aria-label="Content Language"
    >
      <div className="hidden sm:flex items-center px-1 text-[#737373] dark:text-[#A3A3A3]">
        <Languages className="w-3.5 h-3.5" />
      </div>

      <button
        type="button"
        onClick={() => setContentLang('en')}
        className={`px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
          contentLang === 'en'
            ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
            : 'text-[#737373] hover:text-black dark:text-[#A3A3A3] dark:hover:text-white'
        }`}
        title="View baking content in English"
      >
        EN
      </button>

      <span className="text-black/20 dark:text-white/20 text-xs select-none">/</span>

      <button
        type="button"
        onClick={() => setContentLang('mm')}
        className={`px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
          contentLang === 'mm'
            ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
            : 'text-[#737373] hover:text-black dark:text-[#A3A3A3] dark:hover:text-white'
        }`}
        title="View baking content in Burmese (မြန်မာ)"
      >
        MM
      </button>
    </div>
  );
};

export default ContentLanguageToggle;
