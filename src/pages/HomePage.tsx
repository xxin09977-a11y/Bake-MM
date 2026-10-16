/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Bookmark, 
  BookmarkCheck, 
  ArrowRight, 
  ChefHat, 
  Wheat,
  Timer, 
  Flame, 
  RotateCcw,
  Lightbulb,
  X
} from 'lucide-react';
import { 
  RECIPES_DATA 
} from '../data/lessonsData';
import { 
  DAILY_BAKING_TIPS 
} from '../data/bakingTips';
import { 
  getBookmarks, 
  toggleBookmark, 
  getOwnedTools
} from '../lib/storage.js';
import { NavigationTab, Recipe } from '../types';
import { useContentLanguage } from '../context/LanguageContext';

interface HomePageProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenTimer: (minutes?: number, title?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenTimer,
}) => {
  const { contentLang } = useContentLanguage();
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [ownedTools, setOwnedTools] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Interactive Calculator State
  const [calcTab, setCalcTab] = useState<'unit' | 'pan' | 'temp'>('unit');
  const [inputGrams, setInputGrams] = useState<number>(100);
  const [ingredientType, setIngredientType] = useState<'flour' | 'sugar' | 'butter' | 'liquid'>('flour');
  
  // Pan scaler state
  const [fromPanSize, setFromPanSize] = useState<number>(8);
  const [toPanSize, setToPanSize] = useState<number>(9);

  // Oven temperature state
  const [tempC, setTempC] = useState<number>(180);

  // Daily Tip State
  const [tipIndex, setTipIndex] = useState<number>(0);

  useEffect(() => {
    setBookmarks(getBookmarks());
    setOwnedTools(getOwnedTools());
  }, []);

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleBookmark(id);
    setBookmarks(updated);
  };

  // Convert grams to cups/tbsp/tsp based on density
  const getUnitConversions = (grams: number, type: 'flour' | 'sugar' | 'butter' | 'liquid') => {
    const cupWeights = {
      flour: 125,
      sugar: 200,
      butter: 227,
      liquid: 240,
    };
    const cupRatio = grams / cupWeights[type];
    const tbspRatio = cupRatio * 16;
    const tspRatio = tbspRatio * 3;
    const ozRatio = grams / 28.35;

    return {
      cups: cupRatio.toFixed(2),
      tbsp: tbspRatio.toFixed(1),
      tsp: tspRatio.toFixed(1),
      oz: ozRatio.toFixed(1),
    };
  };

  const unitResult = getUnitConversions(inputGrams, ingredientType);
  const panScaleFactor = ((toPanSize * toPanSize) / (fromPanSize * fromPanSize)).toFixed(2);
  const tempF = Math.round((tempC * 9) / 5 + 32);

  const currentTip = DAILY_BAKING_TIPS[tipIndex];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150 w-full max-w-full overflow-hidden">
      {/* 2 Core Navigation Action Cards - Responsive Frosted Glass Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {/* Ingredients & Pantry Card */}
        <div 
          onClick={() => onNavigate('ingredients')}
          className="p-4 sm:p-5 rounded-2xl bg-white/60 dark:bg-white/[0.035] backdrop-blur-xl border border-black/[0.08] dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 hover:bg-white/80 dark:hover:bg-white/[0.07] transition-all duration-200 cursor-pointer flex flex-col justify-between group min-w-0 shadow-xs hover:shadow-lg dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
        >
          <div>
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-xs">
                <Wheat className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] px-2 py-0.5 rounded-md bg-black/[0.03] dark:bg-white/[0.04]">
                Library · 25 Items
              </span>
            </div>
            <h2 className="text-base font-bold text-black dark:text-white uppercase tracking-wide">
              {contentLang === 'mm' ? 'ပါဝင်ပစ္စည်းများ စာရင်း' : 'Ingredients & Pantry'}
            </h2>
            <p className="text-xs text-[#525252] dark:text-[#A3A3A3] mt-1.5 leading-relaxed">
              {contentLang === 'mm' 
                ? 'အခြေခံပါဝင်ပစ္စည်း ၂၅ မျိုး၊ အလေးချိန်နှင့် အစားထိုးနိုင်သော ပစ္စည်းများ' 
                : '25 core baking essentials, exact density weights & reliable substitutions'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs font-mono font-bold text-black dark:text-white uppercase">
            <span>Browse Ingredients</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Tools & Equipment Card */}
        <div 
          onClick={() => onNavigate('tools')}
          className="p-4 sm:p-5 rounded-2xl bg-white/60 dark:bg-white/[0.035] backdrop-blur-xl border border-black/[0.08] dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 hover:bg-white/80 dark:hover:bg-white/[0.07] transition-all duration-200 cursor-pointer flex flex-col justify-between group min-w-0 shadow-xs hover:shadow-lg dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
        >
          <div>
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-xs">
                <ChefHat className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] px-2 py-0.5 rounded-md bg-black/[0.03] dark:bg-white/[0.04]">
                Gear & Pans
              </span>
            </div>
            <h2 className="text-base font-bold text-black dark:text-white uppercase tracking-wide">
              {contentLang === 'mm' ? 'မီးဖိုချောင်သုံး ကိရိယာများ' : 'Kitchen Tools'}
            </h2>
            <p className="text-xs text-[#525252] dark:text-[#A3A3A3] mt-1.5 leading-relaxed">
              {contentLang === 'mm' 
                ? 'မီးဖိုချိန်ညှိမှု၊ ချိန်ခွင်၊ ဒယ်အိုးအရွယ်အစားနှင့် ထိန်းသိမ်းနည်း' 
                : 'Oven calibration, digital scales, pan dimensions & kitchen maintenance'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs font-mono font-bold text-black dark:text-white uppercase">
            <span>View Equipment</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* Quick Metrics Bar - Translucent Frosted Panels */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full">
        <div 
          onClick={() => onNavigate('ingredients')}
          className="p-3.5 sm:p-4 rounded-xl bg-white/60 dark:bg-white/[0.035] backdrop-blur-xl border border-black/[0.08] dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 hover:bg-white/80 dark:hover:bg-white/[0.07] transition-all cursor-pointer shadow-xs dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
        >
          <div className="flex items-center justify-between text-[#737373] dark:text-[#A3A3A3] mb-1">
            <span className="text-[10px] font-mono font-bold uppercase">Pantry</span>
            <Wheat className="w-3.5 h-3.5 text-black dark:text-white" />
          </div>
          <div className="text-lg font-black font-mono text-black dark:text-white">
            25 Items
          </div>
        </div>

        <div 
          onClick={() => onNavigate('tools')}
          className="p-3.5 sm:p-4 rounded-xl bg-white/60 dark:bg-white/[0.035] backdrop-blur-xl border border-black/[0.08] dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 hover:bg-white/80 dark:hover:bg-white/[0.07] transition-all cursor-pointer shadow-xs dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
        >
          <div className="flex items-center justify-between text-[#737373] dark:text-[#A3A3A3] mb-1">
            <span className="text-[10px] font-mono font-bold uppercase">Equipment</span>
            <ChefHat className="w-3.5 h-3.5 text-black dark:text-white" />
          </div>
          <div className="text-lg font-black font-mono text-black dark:text-white">
            {ownedTools.length} Tools
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-white/60 dark:bg-white/[0.035] backdrop-blur-xl border border-black/[0.08] dark:border-white/10 shadow-xs dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
          <div className="flex items-center justify-between text-[#737373] dark:text-[#A3A3A3] mb-1">
            <span className="text-[10px] font-mono font-bold uppercase">Bookmarks</span>
            <BookmarkCheck className="w-3.5 h-3.5 text-black dark:text-white" />
          </div>
          <div className="text-lg font-black font-mono text-black dark:text-white">
            {bookmarks.length} Saved
          </div>
        </div>

        <div 
          onClick={() => onOpenTimer(25, 'Baking Timer')}
          className="p-3.5 sm:p-4 rounded-xl bg-white/60 dark:bg-white/[0.035] backdrop-blur-xl border border-black/[0.08] dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 hover:bg-white/80 dark:hover:bg-white/[0.07] transition-all cursor-pointer shadow-xs dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
        >
          <div className="flex items-center justify-between text-[#737373] dark:text-[#A3A3A3] mb-1">
            <span className="text-[10px] font-mono font-bold uppercase">Timer</span>
            <Timer className="w-3.5 h-3.5 text-black dark:text-white" />
          </div>
          <div className="text-lg font-black font-mono text-black dark:text-white">
            Launch
          </div>
        </div>
      </section>

      {/* Interactive Baking Calculator Suite - Frosted Glass Container */}
      <section className="rounded-2xl bg-white/60 dark:bg-white/[0.035] backdrop-blur-xl border border-black/[0.08] dark:border-white/10 p-5 sm:p-6 w-full min-w-0 overflow-hidden shadow-xs dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-black text-white dark:bg-white dark:text-black rounded-lg shadow-xs">
              <Calculator className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-black dark:text-white">
                Baking Calculator
              </h2>
              <p className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                Density conversions & pan scaling
              </p>
            </div>
          </div>
        </div>

        {/* Calculator Segmented Tabs */}
        <div className="flex items-center gap-1.5 border-b border-black/[0.06] dark:border-white/[0.08] pb-3 mb-4 overflow-x-auto no-scrollbar w-full">
          <button
            onClick={() => setCalcTab('unit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              calcTab === 'unit'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'border border-black/[0.08] dark:border-white/10 bg-white/30 dark:bg-white/[0.02] text-[#737373] hover:text-black dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.06]'
            }`}
          >
            Grams to Cups
          </button>
          <button
            onClick={() => setCalcTab('pan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              calcTab === 'pan'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'border border-black/[0.08] dark:border-white/10 bg-white/30 dark:bg-white/[0.02] text-[#737373] hover:text-black dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.06]'
            }`}
          >
            Pan Size Scaler
          </button>
          <button
            onClick={() => setCalcTab('temp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              calcTab === 'temp'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'border border-black/[0.08] dark:border-white/10 bg-white/30 dark:bg-white/[0.02] text-[#737373] hover:text-black dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.06]'
            }`}
          >
            Oven Temp (°C / °F)
          </button>
        </div>

        {/* Tab 1: Unit Converter */}
        {calcTab === 'unit' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-1.5">
                  Ingredient Density
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'flour', label: contentLang === 'mm' ? 'ဂျုံမှုန့် (Flour)' : 'AP Flour' },
                    { id: 'sugar', label: contentLang === 'mm' ? 'သကြား (Sugar)' : 'Sugar' },
                    { id: 'butter', label: contentLang === 'mm' ? 'ထောပတ် (Butter)' : 'Butter' },
                    { id: 'liquid', label: contentLang === 'mm' ? 'နို့/အရည် (Liquid)' : 'Milk/Liquid' },
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setIngredientType(item.id as typeof ingredientType)}
                      className={`px-2.5 py-2 text-xs rounded-lg font-medium border text-left transition-all cursor-pointer truncate ${
                        ingredientType === item.id
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black font-bold shadow-xs'
                          : 'border-black/[0.08] dark:border-white/10 bg-white/40 dark:bg-white/[0.03] text-black dark:text-white hover:bg-white/80 dark:hover:bg-white/[0.07]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-1.5">
                  Weight (Grams)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    value={inputGrams}
                    onChange={e => setInputGrams(Math.max(1, Number(e.target.value) || 0))}
                    className="w-full px-3.5 py-2 rounded-xl border border-black/[0.12] dark:border-white/15 bg-white/60 dark:bg-white/[0.04] backdrop-blur-md font-mono text-base font-bold text-black dark:text-white focus:outline-hidden focus:border-black dark:focus:border-white"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-mono font-bold text-[#737373]">
                    G
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[50, 100, 150, 200, 250].map(val => (
                    <button
                      key={val}
                      onClick={() => setInputGrams(val)}
                      className="px-2 py-0.5 rounded-md text-[11px] font-mono border border-black/[0.08] dark:border-white/10 bg-white/40 dark:bg-white/[0.03] text-black dark:text-white hover:border-black dark:hover:border-white cursor-pointer"
                    >
                      {val}g
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
              <div className="p-3 bg-black/[0.03] dark:bg-white/[0.04] backdrop-blur-md border border-black/[0.06] dark:border-white/[0.08] rounded-xl min-w-0 shadow-xs">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] truncate">Cups</div>
                <div className="text-lg sm:text-xl font-black text-black dark:text-white font-mono mt-1">
                  {unitResult.cups}
                </div>
                <div className="text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3]">CUPS</div>
              </div>
              <div className="p-3 bg-black/[0.03] dark:bg-white/[0.04] backdrop-blur-md border border-black/[0.06] dark:border-white/[0.08] rounded-xl min-w-0 shadow-xs">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] truncate">Tablespoons</div>
                <div className="text-lg sm:text-xl font-black text-black dark:text-white font-mono mt-1">
                  {unitResult.tbsp}
                </div>
                <div className="text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3]">TBSP</div>
              </div>
              <div className="p-3 bg-black/[0.03] dark:bg-white/[0.04] backdrop-blur-md border border-black/[0.06] dark:border-white/[0.08] rounded-xl min-w-0 shadow-xs">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] truncate">Teaspoons</div>
                <div className="text-lg sm:text-xl font-black text-black dark:text-white font-mono mt-1">
                  {unitResult.tsp}
                </div>
                <div className="text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3]">TSP</div>
              </div>
              <div className="p-3 bg-black/[0.03] dark:bg-white/[0.04] backdrop-blur-md border border-black/[0.06] dark:border-white/[0.08] rounded-xl min-w-0 shadow-xs">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] truncate">Ounces</div>
                <div className="text-lg sm:text-xl font-black text-black dark:text-white font-mono mt-1">
                  {unitResult.oz}
                </div>
                <div className="text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3]">OZ</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Pan Size Scaler */}
        {calcTab === 'pan' && (
          <div className="space-y-4">
            <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
              Calculate the area scaling multiplier when baking with different pan dimensions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-1.5">
                  Original Recipe Pan (Inches)
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[6, 7, 8, 9, 10].map(size => (
                    <button
                      key={size}
                      onClick={() => setFromPanSize(size)}
                      className={`py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer text-center ${
                        fromPanSize === size
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black font-bold shadow-xs'
                          : 'border-black/[0.08] dark:border-white/10 bg-white/40 dark:bg-white/[0.03] text-black dark:text-white hover:bg-white/80 dark:hover:bg-white/[0.07]'
                      }`}
                    >
                      {size}"
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-1.5">
                  Target Kitchen Pan (Inches)
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[6, 7, 8, 9, 10].map(size => (
                    <button
                      key={size}
                      onClick={() => setToPanSize(size)}
                      className={`py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer text-center ${
                        toPanSize === size
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black font-bold shadow-xs'
                          : 'border-black/[0.08] dark:border-white/10 bg-white/40 dark:bg-white/[0.03] text-black dark:text-white hover:bg-white/80 dark:hover:bg-white/[0.07]'
                      }`}
                    >
                      {size}"
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] backdrop-blur-md border border-black/[0.06] dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white">
                  Scaling from {fromPanSize}" to {toPanSize}" Pan:
                </div>
                <div className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                  Multiply all recipe ingredients by <strong>{panScaleFactor}</strong>
                </div>
              </div>
              <div className="text-2xl font-black text-black dark:text-white font-mono shrink-0">
                × {panScaleFactor}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Oven Temp */}
        {calcTab === 'temp' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-1.5">
                  Celsius (°C)
                </label>
                <input
                  type="number"
                  step="5"
                  value={tempC}
                  onChange={e => setTempC(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-xl border border-black/[0.12] dark:border-white/15 bg-white/60 dark:bg-white/[0.04] backdrop-blur-md font-mono text-base font-bold text-black dark:text-white focus:outline-hidden focus:border-black dark:focus:border-white"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[150, 160, 175, 180, 200].map(val => (
                    <button
                      key={val}
                      onClick={() => setTempC(val)}
                      className="px-2 py-0.5 rounded-md text-[11px] font-mono border border-black/[0.08] dark:border-white/10 bg-white/40 dark:bg-white/[0.03] text-black dark:text-white hover:border-black dark:hover:border-white cursor-pointer"
                    >
                      {val}°C
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-1.5">
                  Equivalent Fahrenheit (°F)
                </label>
                <div className="w-full px-3.5 py-2 rounded-xl border border-black/[0.08] dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] backdrop-blur-md font-mono text-xl font-black text-black dark:text-white">
                  {tempF} °F
                </div>
                <div className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3] mt-2">
                  * For fan-forced / convection ovens, reduce setting by 20°C ({tempC - 20}°C).
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Tip of the Day - Frosted Glass Card */}
      <section className="p-4 sm:p-5 rounded-2xl bg-white/60 dark:bg-white/[0.035] backdrop-blur-xl border border-black/[0.08] dark:border-white/10 flex items-start gap-3 w-full shadow-xs dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
        <div className="p-2 bg-black text-white dark:bg-white dark:text-black rounded-lg shrink-0 mt-0.5 shadow-xs">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3]">
              Daily Tip · {contentLang === 'mm' ? currentTip.categoryMm : currentTip.category}
            </span>
          </div>
          <h3 className="font-bold text-black dark:text-white text-xs sm:text-sm mt-0.5">
            {contentLang === 'mm' ? currentTip.titleMm : currentTip.titleEn}
          </h3>
          <p className="text-xs sm:text-sm text-[#525252] dark:text-[#A3A3A3] mt-1 leading-relaxed">
            {contentLang === 'mm' ? currentTip.tipMm : currentTip.tipEn}
          </p>
        </div>
        <button
          onClick={() => setTipIndex((tipIndex + 1) % DAILY_BAKING_TIPS.length)}
          className="p-1.5 text-[#737373] hover:text-black dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] rounded-lg transition-colors shrink-0 cursor-pointer"
          title="Next Tip"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </section>

      {/* Featured Master Formulas */}
      <section className="space-y-3.5 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-black dark:text-white">
              Featured Recipes
            </h2>
            <p className="text-xs font-mono text-[#737373] dark:text-[#A3A3A3]">
              Step-by-step master formulas
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {RECIPES_DATA.slice(0, 3).map(recipe => {
            const isBookmarked = bookmarks.includes(recipe.id);
            const recipeTitle = contentLang === 'mm' ? (recipe.titleMm || recipe.titleEn) : (recipe.titleEn || recipe.titleMm);
            const recipeCat = contentLang === 'mm' ? (recipe.categoryMm || recipe.category) : recipe.category;

            return (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="group relative rounded-2xl bg-white/60 dark:bg-white/[0.035] backdrop-blur-xl border border-black/[0.08] dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 hover:bg-white/80 dark:hover:bg-white/[0.07] p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between min-w-0 shadow-xs hover:shadow-lg dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
              >
                <div>
                  {/* Card Header Divider with Category and Bookmark Button */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-black/[0.06] dark:border-white/[0.08]">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] px-2 py-0.5 rounded-md bg-black/[0.03] dark:bg-white/[0.04]">
                      {recipeCat}
                    </span>
                    <button
                      onClick={e => handleToggleBookmark(recipe.id, e)}
                      className="p-1.5 rounded-lg text-[#737373] hover:text-black dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
                      title={isBookmarked ? 'Bookmarked' : 'Add Bookmark'}
                      aria-label={`Bookmark ${recipeTitle}`}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-black dark:text-white" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <h3 className="font-bold text-black dark:text-white text-base group-hover:underline transition-all">
                    {recipeTitle}
                  </h3>
                  <p className="text-xs text-[#525252] dark:text-[#A3A3A3] mt-1.5 line-clamp-2 leading-relaxed">
                    {recipe.descriptionMm}
                  </p>
                </div>

                {/* Card Footer Divider */}
                <div className="mt-4 pt-2.5 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between flex-wrap gap-2 text-xs font-mono text-[#737373] dark:text-[#A3A3A3]">
                  <div className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-black dark:text-white" />
                    <span>{recipe.ovenTempC}°C</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Timer className="w-3.5 h-3.5 text-black dark:text-white" />
                    <span>{recipe.bakeTimeMinutes}m</span>
                  </div>
                  <span className="text-xs font-bold text-black dark:text-white group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5 ml-auto uppercase tracking-wider">
                    Formula →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recipe Detail Modal - Frosted Glass Window */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white/90 dark:bg-[#0c0f17]/90 backdrop-blur-2xl p-6 sm:p-8 border border-black/10 dark:border-white/15 animate-in fade-in duration-150 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between pb-3 border-b border-black/[0.08] dark:border-white/10">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-black dark:text-white uppercase tracking-tight">
                  {contentLang === 'mm' ? selectedRecipe.titleMm : selectedRecipe.titleEn}
                </h2>
                <div className="text-xs text-[#737373] dark:text-[#A3A3A3] font-mono mt-0.5">{contentLang === 'mm' ? selectedRecipe.titleEn : selectedRecipe.titleMm}</div>
              </div>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="p-1.5 rounded-lg text-[#737373] hover:text-black dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#525252] dark:text-[#A3A3A3] leading-relaxed">{selectedRecipe.descriptionMm}</p>

            <div className="p-3.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] backdrop-blur-md border border-black/[0.06] dark:border-white/[0.08] text-black dark:text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-black dark:text-white" />
                <span className="text-xs font-mono font-bold uppercase">Baking Time: {selectedRecipe.bakeTimeMinutes} mins</span>
              </div>
              <button
                onClick={() => {
                  onOpenTimer(selectedRecipe.bakeTimeMinutes, selectedRecipe.titleEn || selectedRecipe.titleMm);
                  setSelectedRecipe(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-mono font-bold transition-all cursor-pointer uppercase tracking-wider shadow-xs"
              >
                Start Timer
              </button>
            </div>

            {/* Steps */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-black dark:text-white text-sm uppercase font-mono">Step-by-step Instructions:</h4>
              {selectedRecipe.steps.map(st => (
                <div key={st.stepNumber} className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.035] backdrop-blur-md border border-black/[0.06] dark:border-white/[0.08] text-xs leading-relaxed text-black dark:text-white">
                  <span className="font-bold font-mono">Step {st.stepNumber}. {st.titleMm} - </span>
                  <span className="text-[#525252] dark:text-[#A3A3A3]">{st.instructionMm}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedRecipe(null)}
                className="w-full py-2.5 rounded-xl border border-black/[0.12] dark:border-white/15 bg-white/40 dark:bg-white/[0.04] hover:bg-white/80 dark:hover:bg-white/[0.08] text-black dark:text-white text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
