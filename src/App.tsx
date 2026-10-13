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
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { HomePage } from './pages/HomePage';
import { IngredientsPage } from './pages/IngredientsPage';
import { ToolsPage } from './pages/ToolsPage';
import { AiChatPage } from './pages/AiChatPage';
import { LearnPage } from './pages/LearnPage';
import { useDarkMode } from './hooks/useDarkMode';
import { NavigationTab } from './types';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
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

  const handleSelectRecipeFromHome = (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setActiveTab('learn');
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-[#fffaf5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-orange-200 selection:text-orange-950 transition-colors duration-200">
        {/* App Header with Dark Mode Toggle, Language Toggle, and Timer triggers */}
        <Header
          activeTab={activeTab}
          onSelectTab={tab => {
            setActiveTab(tab);
            if (tab !== 'learn') {
              setSelectedRecipeId(null);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenTimer={() => handleOpenTimer(25, 'Baking Timer')}
          isDark={isDark}
          onToggleDarkMode={toggleDarkMode}
        />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 pb-24 md:pb-8">
        {/* Prominent PWA Install Prompt Banner */}
        <PWAInstallBanner />

        {activeTab === 'home' && (
          <HomePage
            onNavigate={tab => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectRecipe={handleSelectRecipeFromHome}
            onOpenTimer={handleOpenTimer}
          />
        )}

        {activeTab === 'ingredients' && <IngredientsPage />}

        {activeTab === 'tools' && <ToolsPage />}

        {activeTab === 'chat' && <AiChatPage />}

        {activeTab === 'learn' && (
          <LearnPage
            initialRecipeId={selectedRecipeId}
            onOpenTimer={handleOpenTimer}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation (ပင်မ, ပါဝင်ပစ္စည်း, ကိရိယာ, AI, လေ့လာ) */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={tab => {
          setActiveTab(tab);
          if (tab !== 'learn') {
            setSelectedRecipeId(null);
          }
        }}
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
