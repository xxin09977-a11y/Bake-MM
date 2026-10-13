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
      className={`inline-flex items-center gap-1 p-1 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs ${className}`}
      role="group"
      aria-label="Content Language"
    >
      <div className="flex items-center px-1.5 text-stone-400 dark:text-stone-500">
        <Languages className="w-3.5 h-3.5" />
      </div>

      <button
        type="button"
        onClick={() => setContentLang('en')}
        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          contentLang === 'en'
            ? 'bg-white dark:bg-stone-900 text-orange-600 dark:text-orange-400 shadow-2xs font-extrabold'
            : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
        }`}
        title="View baking content in English"
      >
        English
      </button>

      <span className="text-stone-300 dark:text-stone-600 text-xs">|</span>

      <button
        type="button"
        onClick={() => setContentLang('mm')}
        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          contentLang === 'mm'
            ? 'bg-white dark:bg-stone-900 text-orange-600 dark:text-orange-400 shadow-2xs font-extrabold'
            : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
        }`}
        title="View baking content in Burmese (မြန်မာ)"
      >
        မြန်မာ
      </button>
    </div>
  );
};

export default ContentLanguageToggle;
