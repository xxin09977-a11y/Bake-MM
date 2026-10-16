/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Home, 
  Wheat, 
  UtensilsCrossed 
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
  // 3 Core navigation tabs: Home, Ingredients, Tools
  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'ingredients', label: 'Ingredients', icon: <Wheat className="w-4 h-4" /> },
    { id: 'tools', label: 'Tools', icon: <UtensilsCrossed className="w-4 h-4" /> },
  ];

  return (
    <nav 
      aria-label="Bottom Navigation Menu"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/75 dark:bg-[#0c0f17]/75 backdrop-blur-xl border-t border-black/[0.08] dark:border-white/10 pb-safe transition-colors w-full max-w-full overflow-hidden shadow-lg"
    >
      <div className="grid grid-cols-3 w-full max-w-sm mx-auto py-2 px-3">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer min-w-0 ${
                isActive
                  ? 'text-black dark:text-white font-extrabold'
                  : 'text-[#737373] dark:text-[#A3A3A3] hover:text-black dark:hover:text-white'
              }`}
            >
              <div 
                className={`p-1.5 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs scale-105' 
                    : 'bg-transparent'
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[10px] mt-1 tracking-wider uppercase font-mono truncate max-w-full text-center">
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
