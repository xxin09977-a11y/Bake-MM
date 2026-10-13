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
  GraduationCap 
} from 'lucide-react';
import { NavigationTab } from '../types';

interface BottomNavProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  // Requirement 1: KEEP all UI, menus, buttons, labels in English only.
  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { id: 'ingredients', label: 'Ingredients', icon: <Wheat className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { id: 'tools', label: 'Tools', icon: <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { id: 'chat', label: 'AI Chat', icon: <Bot className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { id: 'learn', label: 'Learn', icon: <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" /> },
  ];

  return (
    <nav 
      aria-label="Bottom Navigation Menu"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-orange-100 dark:border-stone-800 pb-safe shadow-lg transition-colors"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto py-2 px-1">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'text-orange-600 dark:text-orange-400 font-extrabold scale-105'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <div 
                className={`p-1.5 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-orange-100 dark:bg-orange-950/80 shadow-2xs' 
                    : 'hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {item.icon}
              </div>
              <span className="text-xs sm:text-sm mt-1 tracking-tight font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
