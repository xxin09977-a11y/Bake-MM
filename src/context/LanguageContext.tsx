/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ContentLanguage = 'en' | 'mm';

interface AppSettings {
  contentLang: ContentLanguage;
  [key: string]: unknown;
}

const SETTINGS_KEY = 'app_settings';

interface LanguageContextType {
  contentLang: ContentLanguage;
  setContentLang: (lang: ContentLanguage) => void;
  toggleContentLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  contentLang: 'en',
  setContentLang: () => {},
  toggleContentLang: () => {},
});

export function getContentLangFromStorage(): ContentLanguage {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppSettings;
      if (parsed && (parsed.contentLang === 'en' || parsed.contentLang === 'mm')) {
        return parsed.contentLang;
      }
    }
  } catch (e) {
    console.warn('[LanguageContext] Failed to read app_settings:', e);
  }
  return 'en';
}

export function saveContentLangToStorage(lang: ContentLanguage) {
  try {
    let settings: AppSettings = { contentLang: lang };
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === 'object' && parsed !== null) {
          settings = { ...parsed, contentLang: lang };
        }
      } catch {
        // ignore parse error and rewrite
      }
    }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('[LanguageContext] Failed to save app_settings:', e);
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contentLang, setContentLangState] = useState<ContentLanguage>(() => {
    return getContentLangFromStorage();
  });

  const setContentLang = (newLang: ContentLanguage) => {
    setContentLangState(newLang);
    saveContentLangToStorage(newLang);
    // Dispatch custom event so any listeners update synchronously if outside React tree
    window.dispatchEvent(new CustomEvent('contentLangChange', { detail: newLang }));
  };

  const toggleContentLang = () => {
    setContentLang(contentLang === 'en' ? 'mm' : 'en');
  };

  // Sync if another tab or window changes settings
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === SETTINGS_KEY) {
        setContentLangState(getContentLangFromStorage());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <LanguageContext.Provider value={{ contentLang, setContentLang, toggleContentLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useContentLanguage() {
  return useContext(LanguageContext);
}
