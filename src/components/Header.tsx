/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Home, 
  Wheat, 
  UtensilsCrossed, 
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
  // Navigation tabs in clean English UI
  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'ingredients', label: 'Ingredients', icon: <Wheat className="w-4 h-4" /> },
    { id: 'tools', label: 'Tools', icon: <UtensilsCrossed className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-[#0c0f17]/70 backdrop-blur-xl border-b border-black/[0.08] dark:border-white/10 transition-colors w-full max-w-full overflow-hidden shadow-xs">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Logo & Brand */}
          <div 
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0 min-w-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-sm sm:text-base shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              BL
            </div>
            <span className="font-extrabold text-black dark:text-white tracking-tight text-base sm:text-lg uppercase">
              BakeLearn
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] backdrop-blur-md">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                      : 'text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.07]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Language, Dark Mode, Timer, Install */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Content Language Toggle */}
            <ContentLanguageToggle />

            {/* Dark Mode Toggle Button - Frosted glass stroke */}
            <button
              onClick={onToggleDarkMode}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-black/[0.08] dark:border-white/10 bg-white/40 dark:bg-white/[0.04] hover:bg-white/80 dark:hover:bg-white/[0.1] text-black dark:text-white text-xs font-bold transition-all backdrop-blur-md cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
              title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline font-mono text-[11px]">LIGHT</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline font-mono text-[11px]">DARK</span>
                </>
              )}
            </button>

            {/* Timer Button - Frosted glass stroke */}
            <button
              onClick={onOpenTimer}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-black/[0.08] dark:border-white/10 bg-white/40 dark:bg-white/[0.04] hover:bg-white/80 dark:hover:bg-white/[0.1] text-black dark:text-white text-xs font-bold transition-all backdrop-blur-md cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
              title="Open Baking Timer"
            >
              <Timer className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline font-mono text-[11px]">TIMER</span>
            </button>

            <PWAInstallButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
