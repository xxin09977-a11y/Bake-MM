/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { OfflineIndicator } from './components/OfflineIndicator';
import { BakingTimerModal } from './components/BakingTimerModal';
import { HomePage } from './pages/HomePage';
import { IngredientsPage } from './pages/IngredientsPage';
import { ToolsPage } from './pages/ToolsPage';
import { useDarkMode } from './hooks/useDarkMode';
import { NavigationTab } from './types';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const { isDark, toggleDarkMode } = useDarkMode();

  // Timer modal state
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerTitle, setTimerTitle] = useState('Baking Timer');

  const handleOpenTimer = (minutes: number = 25, title: string = 'Baking Timer') => {
    setTimerMinutes(minutes);
    setTimerTitle(title);
    setIsTimerOpen(true);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-transparent text-[#111827] dark:text-[#F3F4F6] selection:bg-black/80 selection:text-white dark:selection:bg-white/90 dark:selection:text-black transition-colors duration-150 w-full max-w-full overflow-x-hidden">
        {/* App Header with Dark Mode Toggle, Language Toggle, and Timer triggers */}
        <Header
          activeTab={activeTab}
          onSelectTab={tab => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenTimer={() => handleOpenTimer(25, 'Baking Timer')}
          isDark={isDark}
          onToggleDarkMode={toggleDarkMode}
        />

        {/* Main Content Area - Strictly bounded to viewport width */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 md:pb-8 min-w-0 overflow-x-hidden">
          {activeTab === 'home' && (
            <HomePage
              onNavigate={tab => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenTimer={handleOpenTimer}
            />
          )}

          {activeTab === 'ingredients' && <IngredientsPage />}

          {activeTab === 'tools' && <ToolsPage />}
        </main>

        {/* Mobile Bottom Navigation with 3 smooth tabs (Home, Ingredients, Tools) */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={tab => setActiveTab(tab)}
        />

        {/* Footer */}
        <Footer />

        {/* Global Baking Timer Modal */}
        <BakingTimerModal
          isOpen={isTimerOpen}
          onClose={() => setIsTimerOpen(false)}
          initialMinutes={timerMinutes}
          timerTitle={timerTitle}
        />

        {/* Offline Status Toast Indicator */}
        <OfflineIndicator />
      </div>
    </LanguageProvider>
  );
}
