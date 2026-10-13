/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  RotateCw, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  Trophy, 
  BookOpen, 
  ChefHat, 
  RotateCcw, 
  Shuffle, 
  ArrowRight, 
  ArrowLeft,
  Check,
  Timer,
  Clock,
  Users,
  Award,
  Layers,
  Info
} from 'lucide-react';
import { getIngredients, getTools } from '../lib/storage.js';
import { RECIPES_DATA } from '../data/lessonsData';
import { Recipe } from '../types';
import { useContentLanguage } from '../context/LanguageContext';
import { ContentLanguageToggle } from '../components/ContentLanguageToggle';

interface LearnPageProps {
  initialRecipeId?: string | null;
  onOpenTimer: (minutes?: number, title?: string) => void;
}

interface FlashcardItem {
  id: string;
  type: 'ingredient' | 'tool';
  name_en: string;
  name_mm: string;
  image_emoji: string;
  category: string;
  purpose_or_uses_en: string;
  purpose_or_uses_mm: string;
  substitutes_or_alts_en: string[];
  substitutes_or_alts_mm: string[];
  storage_or_care_en: string;
  storage_or_care_mm: string;
  nutrition_en?: string;
  nutrition_mm?: string;
}

interface BakeProgress {
  flashcardsReviewed: number;
  flashcardsKnown: number;
  flashcardsLearning: number;
  quizTotalAnswered: number;
  quizCorrect: number;
  quizStreak: number;
  bestStreak: number;
  lastUpdated: number;
}

const PROGRESS_STORAGE_KEY = 'bake_progress';

function getStoredProgress(): BakeProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          flashcardsReviewed: parsed.flashcardsReviewed || 0,
          flashcardsKnown: parsed.flashcardsKnown || 0,
          flashcardsLearning: parsed.flashcardsLearning || 0,
          quizTotalAnswered: parsed.quizTotalAnswered || 0,
          quizCorrect: parsed.quizCorrect || 0,
          quizStreak: parsed.quizStreak || 0,
          bestStreak: parsed.bestStreak || 0,
          lastUpdated: parsed.lastUpdated || Date.now(),
        };
      }
    }
  } catch (e) {
    console.warn('Failed to parse bake_progress:', e);
  }
  return {
    flashcardsReviewed: 0,
    flashcardsKnown: 0,
    flashcardsLearning: 0,
    quizTotalAnswered: 0,
    quizCorrect: 0,
    quizStreak: 0,
    bestStreak: 0,
    lastUpdated: Date.now(),
  };
}

function saveStoredProgress(prog: BakeProgress) {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({ ...prog, lastUpdated: Date.now() }));
  } catch (e) {
    console.error('Failed to save bake_progress:', e);
  }
}

export const LearnPage: React.FC<LearnPageProps> = ({
  initialRecipeId,
  onOpenTimer,
}) => {
  const { contentLang } = useContentLanguage();

  // Main mode switcher: 'flashcards' | 'quiz' | 'recipes'
  const [activeMode, setActiveMode] = useState<'flashcards' | 'quiz' | 'recipes'>(
    initialRecipeId ? 'recipes' : 'flashcards'
  );

  // Progress state stored in localStorage "bake_progress"
  const [progress, setProgress] = useState<BakeProgress>(getStoredProgress);

  // Combined Flashcard items from local data
  const [deck, setDeck] = useState<FlashcardItem[]>([]);
  const [deckFilter, setDeckFilter] = useState<'all' | 'ingredients' | 'tools'>('all');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [currentQuizItem, setCurrentQuizItem] = useState<FlashcardItem | null>(null);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isQuizAnswered, setIsQuizAnswered] = useState(false);

  // Recipe view state (if opened from Home)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Load items from localStorage
  const loadAllItems = (): FlashcardItem[] => {
    const ings = getIngredients() || [];
    const tls = getTools() || [];

    const ingCards: FlashcardItem[] = ings.map((ing: any) => ({
      id: ing.id,
      type: 'ingredient',
      name_en: ing.name_en || ing.nameEn || '',
      name_mm: ing.name_mm || ing.nameMm || '',
      image_emoji: ing.image_emoji || '🌾',
      category: ing.category || 'flour',
      purpose_or_uses_en: ing.uses_en || ing.uses_mm || '',
      purpose_or_uses_mm: ing.uses_mm || ing.shortDescMm || ing.fullDescMm || '',
      substitutes_or_alts_en: ing.substitutes_en || [],
      substitutes_or_alts_mm: ing.substitutes_mm || ing.substitutionsMm || [],
      storage_or_care_en: ing.storage_en || '',
      storage_or_care_mm: ing.storage_mm || ing.storageTipMm || '',
      nutrition_en: ing.nutrition_en || ing.nutrition_short || '',
      nutrition_mm: ing.nutrition_mm || ing.nutrition_short || '',
    }));

    const toolCards: FlashcardItem[] = tls.map((t: any) => ({
      id: t.id,
      type: 'tool',
      name_en: t.name_en || t.nameEn || '',
      name_mm: t.name_mm || t.nameMm || '',
      image_emoji: t.image_emoji || '⚖️',
      category: t.category || 'tool',
      purpose_or_uses_en: t.purpose_en || t.purpose_mm || '',
      purpose_or_uses_mm: t.purpose_mm || t.descriptionMm || '',
      substitutes_or_alts_en: t.alternatives_en || [],
      substitutes_or_alts_mm: t.alternatives_mm || (t.substituteAlternativeMm ? [t.substituteAlternativeMm] : []),
      storage_or_care_en: t.care_en || '',
      storage_or_care_mm: t.care_mm || t.careTipMm || '',
    }));

    return [...ingCards, ...toolCards];
  };

  useEffect(() => {
    const all = loadAllItems();
    setDeck(all);
    if (initialRecipeId) {
      const found = RECIPES_DATA.find(r => r.id === initialRecipeId);
      if (found) {
        setSelectedRecipe(found);
        setActiveMode('recipes');
      }
    }
  }, [initialRecipeId]);

  // Filtered deck for Flashcards
  const filteredDeck = useMemo(() => {
    if (deckFilter === 'ingredients') return deck.filter(i => i.type === 'ingredient');
    if (deckFilter === 'tools') return deck.filter(i => i.type === 'tool');
    return deck;
  }, [deck, deckFilter]);

  const currentCard = filteredDeck[currentCardIndex] || filteredDeck[0];

  // Helper to extract text matching current contentLang
  const getCardPrimaryName = (item: FlashcardItem) => {
    if (contentLang === 'mm') {
      return item.name_mm || item.name_en;
    }
    return item.name_en || item.name_mm;
  };

  const getCardSecondaryName = (item: FlashcardItem) => {
    if (contentLang === 'mm') {
      return item.name_en;
    }
    return item.name_mm;
  };

  const getCardPurpose = (item: FlashcardItem) => {
    if (contentLang === 'mm') {
      return item.purpose_or_uses_mm || item.purpose_or_uses_en;
    }
    return item.purpose_or_uses_en || item.purpose_or_uses_mm;
  };

  const getCardSubstitutes = (item: FlashcardItem) => {
    if (contentLang === 'mm') {
      return item.substitutes_or_alts_mm.length > 0 ? item.substitutes_or_alts_mm : item.substitutes_or_alts_en;
    }
    return item.substitutes_or_alts_en.length > 0 ? item.substitutes_or_alts_en : item.substitutes_or_alts_mm;
  };

  const getCardStorage = (item: FlashcardItem) => {
    if (contentLang === 'mm') {
      return item.storage_or_care_mm || item.storage_or_care_en;
    }
    return item.storage_or_care_en || item.storage_or_care_mm;
  };

  // Flip card
  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // Card response action: Known vs Learning
  const handleCardFeedback = (known: boolean) => {
    const newProg: BakeProgress = {
      ...progress,
      flashcardsReviewed: progress.flashcardsReviewed + 1,
      flashcardsKnown: known ? progress.flashcardsKnown + 1 : progress.flashcardsKnown,
      flashcardsLearning: !known ? progress.flashcardsLearning + 1 : progress.flashcardsLearning,
    };
    setProgress(newProg);
    saveStoredProgress(newProg);

    // Advance to next card
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % Math.max(1, filteredDeck.length));
    }, 150);
  };

  // Shuffle flashcard deck
  const handleShuffleDeck = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  // Generate Quiz Question dynamically from local data in current contentLang
  const generateNewQuizQuestion = () => {
    if (deck.length < 4) return;

    // Pick 1 random item
    const targetIndex = Math.floor(Math.random() * deck.length);
    const targetItem = deck[targetIndex];

    // Get 3 random distractors from other items using the selected language
    const otherItems = deck.filter(i => i.id !== targetItem.id);
    const shuffledOthers = [...otherItems].sort(() => Math.random() - 0.5);
    const distractors = shuffledOthers.slice(0, 3).map(i => getCardPurpose(i));

    const correctText = getCardPurpose(targetItem);
    const allOptions = [correctText, ...distractors].sort(() => Math.random() - 0.5);
    const correctIdx = allOptions.indexOf(correctText);

    setCurrentQuizItem(targetItem);
    setQuizOptions(allOptions);
    setCorrectOptionIndex(correctIdx);
    setSelectedOptionIndex(null);
    setIsQuizAnswered(false);
  };

  // Re-generate or update quiz question when mode or content language changes
  useEffect(() => {
    if (activeMode === 'quiz' && deck.length >= 4) {
      generateNewQuizQuestion();
    }
  }, [activeMode, deck.length, contentLang]);

  const handleSelectQuizAnswer = (index: number) => {
    if (isQuizAnswered) return;

    setSelectedOptionIndex(index);
    setIsQuizAnswered(true);

    const isCorrect = index === correctOptionIndex;
    const currentStreak = isCorrect ? progress.quizStreak + 1 : 0;
    const bestStreak = Math.max(progress.bestStreak, currentStreak);

    const updatedProg: BakeProgress = {
      ...progress,
      quizTotalAnswered: progress.quizTotalAnswered + 1,
      quizCorrect: isCorrect ? progress.quizCorrect + 1 : progress.quizCorrect,
      quizStreak: currentStreak,
      bestStreak: bestStreak,
    };

    setProgress(updatedProg);
    saveStoredProgress(updatedProg);
  };

  const handleResetProgress = () => {
    if (confirm('Reset your baking progress statistics to 0?')) {
      const reset: BakeProgress = {
        flashcardsReviewed: 0,
        flashcardsKnown: 0,
        flashcardsLearning: 0,
        quizTotalAnswered: 0,
        quizCorrect: 0,
        quizStreak: 0,
        bestStreak: 0,
        lastUpdated: Date.now(),
      };
      setProgress(reset);
      saveStoredProgress(reset);
    }
  };

  const quizAccuracy = progress.quizTotalAnswered > 0
    ? Math.round((progress.quizCorrect / progress.quizTotalAnswered) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              BakeLearn Practice
            </h1>
            <ContentLanguageToggle />
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Master ingredient chemistry & tools through interactive flashcards and randomized quizzes.
          </p>
        </div>

        {/* 2 Primary Modes + Recipes tab */}
        <div className="inline-flex p-1.5 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200/90 dark:border-stone-700 self-start sm:self-auto shadow-2xs">
          <button
            onClick={() => { setActiveMode('flashcards'); setIsFlipped(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeMode === 'flashcards'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. Flashcards</span>
          </button>

          <button
            onClick={() => setActiveMode('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeMode === 'quiz'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>2. Quiz Mode</span>
          </button>

          <button
            onClick={() => setActiveMode('recipes')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeMode === 'recipes'
                ? 'bg-white dark:bg-stone-900 text-orange-700 dark:text-orange-400 shadow-xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Recipes</span>
          </button>
        </div>
      </div>

      {/* Persistent Progress Tracker Banner ("bake_progress") */}
      <section className="rounded-3xl bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 p-4 sm:p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
            <Trophy className="w-6 h-6 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
                Baking Progress Record
              </span>
            </div>
            <div className="text-sm sm:text-base font-extrabold mt-0.5">
              Reviewed: {progress.flashcardsReviewed} • Mastered: {progress.flashcardsKnown} • Quiz Score: {progress.quizCorrect}/{progress.quizTotalAnswered} ({quizAccuracy}%)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-black/20 px-3 py-1.5 rounded-xl border border-white/20 font-bold">
            <Flame className="w-4 h-4 text-orange-200" />
            <span>Streak: {progress.quizStreak} 🔥 (Best: {progress.bestStreak})</span>
          </div>
          <button
            onClick={handleResetProgress}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition cursor-pointer"
            title="Reset progress to zero"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MODE 1: FLASHCARDS */}
      {/* ============================================================ */}
      {activeMode === 'flashcards' && currentCard && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Deck Filters & Controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 bg-white dark:bg-stone-900 p-1 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
              {[
                { id: 'all', label: `All (${deck.length})` },
                { id: 'ingredients', label: `Ingredients (${deck.filter(i => i.type === 'ingredient').length})` },
                { id: 'tools', label: `Tools (${deck.filter(i => i.type === 'tool').length})` },
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setDeckFilter(filter.id as any);
                    setCurrentCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    deckFilter === filter.id
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleShuffleDeck}
              className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:text-orange-600 text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Shuffle</span>
            </button>
          </div>

          {/* Interactive Flashcard with Flip Animation */}
          <div className="relative perspective-1000">
            <div
              onClick={handleFlipCard}
              className={`w-full min-h-[380px] sm:min-h-[420px] rounded-3xl p-6 sm:p-8 border-2 transition-all duration-300 shadow-md cursor-pointer flex flex-col justify-between select-none ${
                isFlipped
                  ? 'bg-white dark:bg-stone-900 border-orange-400 dark:border-orange-500 ring-4 ring-orange-100 dark:ring-orange-950/40'
                  : 'bg-linear-to-b from-white to-amber-50/50 dark:from-stone-900 dark:to-stone-950 border-orange-200 dark:border-stone-800 hover:border-orange-300 hover:shadow-lg'
              }`}
            >
              {/* Card Top Header */}
              <div className="flex items-center justify-between text-xs pb-3 border-b border-stone-100 dark:border-stone-800">
                <span className="px-3 py-1 rounded-full font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300">
                  {currentCard.type === 'ingredient' ? '🌾 Ingredient' : '🧁 Tool & Equipment'}
                </span>
                <span className="text-stone-400 font-mono font-semibold">
                  Card {currentCardIndex + 1} / {filteredDeck.length}
                </span>
              </div>

              {/* CARD FRONT (UNFLIPPED) */}
              {!isFlipped ? (
                <div className="my-auto py-8 text-center space-y-4">
                  <div className="text-7xl sm:text-8xl filter drop-shadow-sm animate-bounce duration-1000">
                    {currentCard.image_emoji}
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
                      {getCardPrimaryName(currentCard)}
                    </h3>
                    <div className="text-xs sm:text-sm font-mono text-stone-400 dark:text-stone-500 mt-1">
                      {getCardSecondaryName(currentCard)}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFlipCard();
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg active:scale-95 transition cursor-pointer"
                    >
                      <RotateCw className="w-5 h-5 animate-spin-slow" />
                      <span>{contentLang === 'mm' ? 'သိလား? (Tap to Flip)' : 'Do You Know? (Tap to Flip)'}</span>
                    </button>
                    <div className="text-[11px] text-stone-400 mt-2">
                      Click anywhere on the card to reveal full details
                    </div>
                  </div>
                </div>
              ) : (
                /* CARD BACK (FLIPPED - FULL DETAIL IN CONTENT LANG) */
                <div className="my-auto py-4 space-y-4 text-left animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-1.5 bg-amber-50 dark:bg-stone-800 rounded-xl border border-amber-200 dark:border-stone-700">
                      {currentCard.image_emoji}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-lg sm:text-xl text-stone-900 dark:text-white">
                        {getCardPrimaryName(currentCard)}
                      </h3>
                      <div className="text-xs font-mono text-stone-400 dark:text-stone-500">
                        {getCardSecondaryName(currentCard)}
                      </div>
                    </div>
                  </div>

                  {/* Uses / Purpose */}
                  <div className="p-3.5 rounded-2xl bg-orange-50/80 dark:bg-orange-950/30 border border-orange-200 dark:border-stone-800">
                    <div className="text-xs font-bold text-orange-950 dark:text-orange-300 mb-1 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <span>{contentLang === 'mm' ? 'မုန့်လုပ်ရာမှာ ဘာလို့သုံးလဲ (Purpose):' : 'Baking Purpose & Role:'}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                      {getCardPurpose(currentCard)}
                    </p>
                  </div>

                  {/* Substitutes / Alternatives */}
                  {getCardSubstitutes(currentCard).length > 0 && (
                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
                      <div className="text-xs font-bold text-emerald-950 dark:text-emerald-300 mb-0.5">
                        {contentLang === 'mm' ? 'အစားထိုးနည်း (Substitutes):' : 'Substitutes & Alternatives:'}
                      </div>
                      <p className="text-xs text-emerald-900 dark:text-emerald-200">
                        {getCardSubstitutes(currentCard)[0]}
                      </p>
                    </div>
                  )}

                  {/* Storage / Care */}
                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
                    <div className="text-xs font-bold text-stone-900 dark:text-white mb-0.5">
                      {contentLang === 'mm' ? 'သိမ်းဆည်းနည်း / ထိန်းသိမ်းနည်း (Storage & Care):' : 'Storage & Maintenance:'}
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300">
                      {getCardStorage(currentCard)}
                    </p>
                  </div>
                </div>
              )}

              {/* Card Bottom Instructions / Flipped Action buttons */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                {isFlipped ? (
                  <div className="w-full flex items-center justify-between gap-3 pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardFeedback(false);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <RotateCw className="w-4 h-4 text-amber-600" />
                      <span>Review Again ↻</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardFeedback(true);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center justify-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>I Know This ✓</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentCardIndex((prev) => (prev - 1 + filteredDeck.length) % filteredDeck.length);
                      }}
                      className="text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>
                    <span className="text-[11px] text-stone-400">Tap to flip answer</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentCardIndex((prev) => (prev + 1) % filteredDeck.length);
                      }}
                      className="text-orange-600 dark:text-orange-400 font-semibold hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODE 2: QUIZ */}
      {/* ============================================================ */}
      {activeMode === 'quiz' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {currentQuizItem ? (
            <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 p-6 sm:p-8 shadow-sm space-y-6">
              {/* Question Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-300">
                  Question #{progress.quizTotalAnswered + 1}
                </span>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/60 px-2.5 py-1 rounded-xl border border-orange-200 dark:border-orange-900/40">
                    <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                    <span>Streak: {progress.quizStreak}</span>
                  </div>
                </div>
              </div>

              {/* Target Item Display */}
              <div className="text-center py-2 space-y-2">
                <div className="text-6xl sm:text-7xl filter drop-shadow-sm">
                  {currentQuizItem.image_emoji}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
                  {contentLang === 'mm'
                    ? 'ဒီ မုန့်ဖုတ်ပစ္စည်းက ဘာအတွက်သုံးလဲ?'
                    : 'What is the primary role or purpose of this item in baking?'}
                </h2>
                <div className="inline-block px-3 py-1 rounded-xl bg-amber-50 dark:bg-stone-800 text-amber-900 dark:text-amber-300 font-extrabold text-sm border border-amber-200 dark:border-stone-700">
                  {getCardPrimaryName(currentQuizItem)} ({getCardSecondaryName(currentQuizItem)})
                </div>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-2.5 pt-2">
                {quizOptions.map((optionText, idx) => {
                  let btnStyle = 'bg-stone-50 dark:bg-stone-800 hover:bg-orange-50/60 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200';
                  
                  if (isQuizAnswered) {
                    if (idx === correctOptionIndex) {
                      btnStyle = 'bg-emerald-600 text-white font-bold border-emerald-500 shadow-sm';
                    } else if (idx === selectedOptionIndex) {
                      btnStyle = 'bg-rose-600 text-white font-bold border-rose-500 shadow-sm';
                    } else {
                      btnStyle = 'bg-stone-50 dark:bg-stone-800 text-stone-400 dark:text-stone-500 opacity-60 border-stone-100 dark:border-stone-700';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isQuizAnswered}
                      onClick={() => handleSelectQuizAnswer(idx)}
                      className={`w-full p-4 rounded-2xl border text-xs sm:text-sm text-left leading-relaxed transition-all cursor-pointer flex items-start gap-3 ${btnStyle}`}
                    >
                      <span className="w-6 h-6 rounded-full bg-white/20 border border-current flex items-center justify-center text-xs font-mono shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">{optionText}</span>
                    </button>
                  );
                })}
              </div>

              {/* Answer Feedback & Explanations */}
              {isQuizAnswered && (
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {selectedOptionIndex === correctOptionIndex ? (
                      <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <span>{contentLang === 'mm' ? 'မှန်ကန်ပါသည်! 🎉 တော်လိုက်တာ' : 'Correct! 🎉 Excellent work!'}</span>
                      </span>
                    ) : (
                      <span className="text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        <span>{contentLang === 'mm' ? 'မှားယွင်းပါသည်! မှန်ကန်သောအဖြေကို လေ့လာပါ' : 'Incorrect. Review the correct answer below:'}</span>
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-stone-700 dark:text-stone-300 space-y-1.5 pt-1">
                    <div>
                      <strong>{contentLang === 'mm' ? 'မုန့်လုပ်ရာမှာ သုံးပုံ -' : 'Primary Role:'} </strong>
                      {getCardPurpose(currentQuizItem)}
                    </div>
                    {getCardSubstitutes(currentQuizItem).length > 0 && (
                      <div>
                        <strong>{contentLang === 'mm' ? 'အစားထိုးနည်း -' : 'Substitute:'} </strong>
                        {getCardSubstitutes(currentQuizItem)[0]}
                      </div>
                    )}
                    <div>
                      <strong>{contentLang === 'mm' ? 'သိမ်းဆည်းနည်း -' : 'Storage / Care:'} </strong>
                      {getCardStorage(currentQuizItem)}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={generateNewQuizQuestion}
                      className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <span>Next Question →</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8">
              <p className="text-stone-600 dark:text-stone-300">Loading quiz questions from local database...</p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODE 3: RECIPES */}
      {/* ============================================================ */}
      {activeMode === 'recipes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RECIPES_DATA.map(recipe => (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 p-5 shadow-xs hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300">
                    {recipe.category} • {recipe.difficulty}
                  </span>
                  <h3 className="font-extrabold text-stone-900 dark:text-white text-base group-hover:text-orange-600 dark:group-hover:text-orange-400 transition mt-2">
                    {contentLang === 'mm' ? recipe.titleMm : recipe.titleEn}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                    {recipe.descriptionMm}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{recipe.bakeTimeMinutes} mins</span>
                  </div>
                  <span className="text-orange-600 dark:text-orange-400 font-bold group-hover:translate-x-1 transition-transform">
                    View Recipe →
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Recipe Modal */}
          {selectedRecipe && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
              <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-stone-900 p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 animate-in fade-in zoom-in-95 duration-150 space-y-4">
                <div className="flex items-start justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
                      {contentLang === 'mm' ? selectedRecipe.titleMm : selectedRecipe.titleEn}
                    </h2>
                    <div className="text-xs text-stone-400 font-mono">{contentLang === 'mm' ? selectedRecipe.titleEn : selectedRecipe.titleMm}</div>
                  </div>
                  <button
                    onClick={() => setSelectedRecipe(null)}
                    className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">{selectedRecipe.descriptionMm}</p>

                <div className="p-3.5 rounded-2xl bg-amber-500 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer className="w-5 h-5 text-amber-100" />
                    <span className="text-xs font-bold">Baking Time: {selectedRecipe.bakeTimeMinutes} mins</span>
                  </div>
                  <button
                    onClick={() => onOpenTimer(selectedRecipe.bakeTimeMinutes, selectedRecipe.titleEn || selectedRecipe.titleMm)}
                    className="px-3 py-1.5 rounded-xl bg-white text-orange-900 text-xs font-bold hover:bg-amber-50 transition cursor-pointer"
                  >
                    Start Timer
                  </button>
                </div>

                {/* Steps */}
                <div className="space-y-2.5">
                  <h4 className="font-bold text-stone-900 dark:text-white text-sm">Step-by-step Instructions:</h4>
                  {selectedRecipe.steps.map(st => (
                    <div key={st.stepNumber} className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 text-xs leading-relaxed text-stone-800 dark:text-stone-200">
                      <span className="font-bold text-orange-700 dark:text-orange-400">Step {st.stepNumber}. {st.titleMm} - </span>
                      <span>{st.instructionMm}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setSelectedRecipe(null)}
                    className="w-full py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LearnPage;
