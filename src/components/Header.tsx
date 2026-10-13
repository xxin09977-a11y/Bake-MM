/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Home, 
  Wheat, 
  UtensilsCrossed, 
  Bot, 
  GraduationCap, 
  Timer,
  Sun,
  Moon
} from 'lucide-react';
import { NavigationTab } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { ContentLanguageToggle } from './ContentLanguageToggle';

interface HeaderProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenTimer: () => void;
  isDark: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenTimer,
  isDark,
  onToggleDarkMode,
}) => {
  // Requirement 1: KEEP all UI, menus, buttons, labels in English only.
  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'ingredients', label: 'Ingredients', icon: <Wheat className="w-4 h-4" /> },
    { id: 'tools', label: 'Tools', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'chat', label: 'AI Chat', icon: <Bot className="w-4 h-4" /> },
    { id: 'learn', label: 'Learn', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-orange-100 dark:border-stone-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand */}
          <div 
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl sm:text-2xl">👩‍🍳</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-stone-900 dark:text-white tracking-tight text-lg sm:text-xl">
                  BakeLearn
                </span>
                <span className="px-1.5 py-0.5 text-xs font-bold text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-950 rounded-md">
                  PRO
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 -mt-0.5 hidden xs:block">
                Baking Companion (Offline)
              </p>
            </div>
          </div>

          {/* Desktop Navigation with requested labels */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-orange-50/80 dark:hover:bg-stone-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Content Language Toggle, Dark Mode Toggle, Timer, Install */}
          <div className="flex items-center gap-2">
            {/* Global Content Language Toggle (English | မြန်မာ) */}
            <ContentLanguageToggle />

            {/* Dark Mode Toggle Button */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-stone-600" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            {/* Timer Button */}
            <button
              onClick={onOpenTimer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-200 dark:border-stone-700 bg-orange-50/80 dark:bg-stone-800 hover:bg-orange-100 dark:hover:bg-stone-700 text-orange-800 dark:text-orange-300 text-xs font-bold transition cursor-pointer"
              title="Open Baking Timer"
            >
              <Timer className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="hidden sm:inline">Timer</span>
            </button>

            <PWAInstallButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
