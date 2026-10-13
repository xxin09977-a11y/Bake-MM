/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calculator, 
  HelpCircle, 
  BookOpen, 
  CheckCircle, 
  Bookmark, 
  BookmarkCheck, 
  ArrowRight, 
  Timer, 
  Flame, 
  Lightbulb, 
  Scale, 
  ChefHat,
  NotebookPen,
  RotateCcw
} from 'lucide-react';
import { RECIPES_DATA, LESSON_MODULES } from '../data/lessonsData';
import { DAILY_BAKING_TIPS, QUIZ_QUESTIONS } from '../data/bakingTips';
import { StorageService } from '../services/storage';
import { NavigationTab, Recipe } from '../types';

interface HomePageProps {
  onNavigate: (tab: NavigationTab) => void;
  onSelectRecipe: (recipeId: string) => void;
  onOpenTimer: (minutes?: number, title?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectRecipe,
  onOpenTimer,
}) => {
  // Stats
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [ownedTools, setOwnedTools] = useState<string[]>([]);
  const [quickNote, setQuickNote] = useState('');
  const [isSavedNoteToast, setIsSavedNoteToast] = useState(false);

  // Tip of the day index
  const [tipIndex, setTipIndex] = useState(0);

  // Interactive Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Calculator states
  const [calcTab, setCalcTab] = useState<'unit' | 'pan' | 'temp'>('unit');
  
  // Unit converter
  const [ingredientType, setIngredientType] = useState<'flour' | 'sugar' | 'butter' | 'liquid'>('flour');
  const [inputGrams, setInputGrams] = useState<number>(100);

  // Pan scaler
  const [fromPanSize, setFromPanSize] = useState<number>(8); // inches
  const [toPanSize, setToPanSize] = useState<number>(6); // inches

  // Temp converter
  const [tempC, setTempC] = useState<number>(180);

  useEffect(() => {
    setBookmarks(StorageService.getBookmarks());
    setCompletedLessons(StorageService.getCompletedLessons());
    setOwnedTools(StorageService.getOwnedTools());
    setQuickNote(StorageService.getQuickNotes());

    // Randomize or select tip of the day based on day
    const day = new Date().getDate();
    setTipIndex(day % DAILY_BAKING_TIPS.length);
  }, []);

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    StorageService.toggleBookmark(id);
    setBookmarks(StorageService.getBookmarks());
  };

  const handleSaveNote = () => {
    StorageService.setQuickNotes(quickNote);
    setIsSavedNoteToast(true);
    setTimeout(() => setIsSavedNoteToast(false), 2000);
  };

  // Unit conversion helpers
  const getUnitConversions = (grams: number, type: 'flour' | 'sugar' | 'butter' | 'liquid') => {
    // Standard cup weights
    const cupWeights = {
      flour: 120, // 1 cup all-purpose ~ 120g
      sugar: 200, // 1 cup granulated sugar ~ 200g
      butter: 227, // 1 cup butter ~ 227g (2 sticks)
      liquid: 240, // 1 cup liquid ~ 240ml
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

  const currentQuiz = QUIZ_QUESTIONS[quizIndex];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Welcome Card */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-amber-500 via-orange-500 to-amber-600 p-6 sm:p-10 text-white shadow-xl shadow-orange-500/15">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>မုန့်ဖုတ်သင်ယူလက်စွဲ • အော့ဖ်လိုင်း PWA</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            မုန့်ဖုတ်လောကမှ ကြိုဆိုပါသည်! 🧁
          </h1>
          <p className="mt-2.5 text-amber-100 text-sm sm:text-base leading-relaxed">
            ကိတ်မုန့်၊ ပေါင်မုန့်၊ ကွတ်ကီးများနှင့် ရိုးရာမုန့်များကို သိပ္ပံနည်းကျ အချိုးအစား တိကျစွာဖြင့် ၁၀၀% အင်တာနက်မလိုဘဲ အချိန်မရွေး လေ့လာသင်ယူနိုင်ပါသည်။
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('learn')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-orange-700 font-bold text-sm shadow-md hover:bg-amber-50 transition active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>သင်ခန်းစာ စတင်လေ့လာမည်</span>
            </button>
            <button
              onClick={() => onNavigate('chat')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-700/60 hover:bg-orange-700/80 border border-orange-300/30 text-white font-semibold text-sm transition active:scale-95 cursor-pointer"
            >
              <ChefHat className="w-4 h-4" />
              <span>AI အကူ မေးမြန်းမည်</span>
            </button>
          </div>
        </div>
      </section>

      {/* Quick Stats Overview */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div 
          onClick={() => onNavigate('learn')}
          className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-orange-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-medium">လေ့လာပြီးမှု</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-stone-900">
            {completedLessons.length} / {LESSON_MODULES.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">ပြီးမြောက်သည့် သင်ခန်းစာ</div>
        </div>

        <div 
          onClick={() => onNavigate('tools')}
          className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-orange-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-medium">ကိရိယာများ</span>
            <ChefHat className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-stone-900">
            {ownedTools.length} ခု
          </div>
          <div className="text-[11px] text-stone-500 mt-1">ပိုင်ဆိုင်သည့် ကိရိယာ</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-medium">မှတ်သားချက်</span>
            <BookmarkCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-stone-900">
            {bookmarks.length} ခု
          </div>
          <div className="text-[11px] text-stone-500 mt-1">သိမ်းဆည်းထားသော အရာများ</div>
        </div>

        <div 
          onClick={() => onOpenTimer(25, 'မုန့်ဖုတ်ချိန် Timer')}
          className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-orange-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-medium">မုန့်ဖုတ်ချိန်</span>
            <Timer className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-orange-600">
            Timer
          </div>
          <div className="text-[11px] text-stone-500 mt-1">ဖွင့်ရန် နှိပ်ပါ</div>
        </div>
      </section>

      {/* Tip of the Day Banner */}
      <section className="p-5 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-xs flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              ယနေ့အတွက် မုန့်ဖုတ် အကြံပြုချက် ({DAILY_BAKING_TIPS[tipIndex].category})
            </span>
          </div>
          <h4 className="font-bold text-stone-900 text-sm mt-0.5">
            {DAILY_BAKING_TIPS[tipIndex].titleMm}
          </h4>
          <p className="text-xs sm:text-sm text-stone-700 mt-1 leading-relaxed">
            {DAILY_BAKING_TIPS[tipIndex].tipMm}
          </p>
        </div>
        <button
          onClick={() => setTipIndex((tipIndex + 1) % DAILY_BAKING_TIPS.length)}
          className="p-2 text-stone-400 hover:text-amber-800 hover:bg-amber-100 rounded-lg transition shrink-0 cursor-pointer"
          title="နောက်ထပ် အကြံပြုချက် ကြည့်ရန်"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </section>

      {/* Interactive Baking Calculator Suite */}
      <section className="rounded-3xl bg-white border border-stone-200/90 p-5 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-orange-100 text-orange-600 rounded-xl">
              <Calculator className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-stone-900">မုန့်ဖုတ် အချိုးတွက်စက် (Baking Calculator)</h2>
              <p className="text-xs text-stone-500">ဂရမ်၊ ခွက်၊ ဗန်းအရွယ်အစားနှင့် အပူချိန် အလွယ်တကူ တွက်ချက်နိုင်သည်</p>
            </div>
          </div>
        </div>

        {/* Calculator Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3 mb-5">
          <button
            onClick={() => setCalcTab('unit')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              calcTab === 'unit'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            ယူနစ် ပြောင်းစက် (Grams to Cups)
          </button>
          <button
            onClick={() => setCalcTab('pan')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              calcTab === 'pan'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            ဗန်းအရွယ်အစား ချိန်စက် (Pan Scaler)
          </button>
          <button
            onClick={() => setCalcTab('temp')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              calcTab === 'temp'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            မီးဖိုအပူချိန် (°C to °F)
          </button>
        </div>

        {/* Tab 1: Unit Converter */}
        {calcTab === 'unit' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  ပါဝင်ပစ္စည်း အမျိုးအစား ရွေးပါ
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'flour', labelMm: 'ဂျုံမှုန့် (Flour)' },
                    { id: 'sugar', labelMm: 'သကြား (Sugar)' },
                    { id: 'butter', labelMm: 'ထောပတ် (Butter)' },
                    { id: 'liquid', labelMm: 'အရည် / နို့ (Liquid)' },
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setIngredientType(item.id as typeof ingredientType)}
                      className={`px-3 py-2 text-xs rounded-xl font-medium border text-left transition cursor-pointer ${
                        ingredientType === item.id
                          ? 'border-orange-500 bg-orange-50 text-orange-900 font-bold'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      {item.labelMm}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  ဂရမ် (Gram) ထည့်သွင်းပါ
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    value={inputGrams}
                    onChange={e => setInputGrams(Math.max(1, Number(e.target.value) || 0))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 font-mono text-base font-bold text-stone-800 focus:outline-hidden focus:border-orange-500"
                  />
                  <span className="absolute right-3.5 top-3 text-xs font-semibold text-stone-400">
                    g (ဂရမ်)
                  </span>
                </div>
                <div className="flex gap-2 mt-2">
                  {[50, 100, 150, 200, 250].map(val => (
                    <button
                      key={val}
                      onClick={() => setInputGrams(val)}
                      className="px-2 py-0.5 rounded-md text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer"
                    >
                      {val}g
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="mt-4 p-4 rounded-2xl bg-orange-50/70 border border-orange-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 bg-white rounded-xl shadow-2xs">
                <div className="text-[11px] text-stone-500">ခွက် (Cups)</div>
                <div className="text-lg font-extrabold text-orange-600 font-mono mt-0.5">
                  {unitResult.cups}
                </div>
                <div className="text-[10px] text-stone-400">ခွက်ခန့်</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl shadow-2xs">
                <div className="text-[11px] text-stone-500">စားပွဲတင်ဇွန်း (Tbsp)</div>
                <div className="text-lg font-extrabold text-orange-600 font-mono mt-0.5">
                  {unitResult.tbsp}
                </div>
                <div className="text-[10px] text-stone-400">ဇွန်း</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl shadow-2xs">
                <div className="text-[11px] text-stone-500">လက်ဖက်ရည်ဇွန်း (Tsp)</div>
                <div className="text-lg font-extrabold text-orange-600 font-mono mt-0.5">
                  {unitResult.tsp}
                </div>
                <div className="text-[10px] text-stone-400">ဇွန်း</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl shadow-2xs">
                <div className="text-[11px] text-stone-500">အောင်စ (Ounces)</div>
                <div className="text-lg font-extrabold text-orange-600 font-mono mt-0.5">
                  {unitResult.oz}
                </div>
                <div className="text-[10px] text-stone-400">oz</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Pan Size Scaler */}
        {calcTab === 'pan' && (
          <div className="space-y-4">
            <p className="text-xs text-stone-600">
              ချက်နည်းပါ ဗန်းအရွယ်အစားမှ မိမိဖုတ်လိုသော ဗန်းအရွယ်အစားသို့ ပြောင်းလဲရာတွင် ပါဝင်ပစ္စည်းများကို အဆမည်မျှ မြှောက်ရမည်ကို တွက်ချက်ပေးပါသည်။
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  မူလချက်နည်းပါ ဗန်းအရွယ် (လက်မ)
                </label>
                <div className="flex gap-2">
                  {[6, 7, 8, 9, 10].map(size => (
                    <button
                      key={size}
                      onClick={() => setFromPanSize(size)}
                      className={`flex-1 py-2 text-xs rounded-xl font-bold border transition cursor-pointer ${
                        fromPanSize === size
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      {size}"
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  မိမိဖုတ်မည့် ဗန်းအရွယ် (လက်မ)
                </label>
                <div className="flex gap-2">
                  {[6, 7, 8, 9, 10].map(size => (
                    <button
                      key={size}
                      onClick={() => setToPanSize(size)}
                      className={`flex-1 py-2 text-xs rounded-xl font-bold border transition cursor-pointer ${
                        toPanSize === size
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      {size}"
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-amber-900">
                  {fromPanSize} လက်မ ဗန်း မှ {toPanSize} လက်မ ဗန်းသို့ ပြောင်းလဲရန် အဆ-
                </div>
                <div className="text-xs text-stone-600 mt-0.5">
                  မူလပါဝင်ပစ္စည်းများ အားလုံးကို <strong>{panScaleFactor}</strong> ဖြင့် မြှောက်၍ အသုံးပြုပါ
                </div>
              </div>
              <div className="text-2xl font-black text-orange-600 font-mono">
                x {panScaleFactor}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Oven Temp */}
        {calcTab === 'temp' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  ဒီဂရီ စင်တီဂရိတ် (°C)
                </label>
                <input
                  type="number"
                  step="5"
                  value={tempC}
                  onChange={e => setTempC(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 font-mono text-base font-bold text-stone-800 focus:outline-hidden focus:border-orange-500"
                />
                <div className="flex gap-2 mt-2">
                  {[150, 160, 175, 180, 200].map(val => (
                    <button
                      key={val}
                      onClick={() => setTempC(val)}
                      className="px-2 py-0.5 rounded-md text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer"
                    >
                      {val}°C
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  ညီမျှသော ဖာရင်ဟိုက် (°F)
                </label>
                <div className="w-full px-3.5 py-2.5 rounded-xl border border-orange-200 bg-orange-50/60 font-mono text-xl font-black text-orange-700">
                  {tempF} °F
                </div>
                <div className="text-xs text-stone-500 mt-2">
                  * ပန်ကာပါသော မီးဖို (Fan-forced/Convection) ဖြစ်ပါက အပူချိန်ကို ၂၀°C လျှော့ချပါ ({tempC - 20}°C သုံးပါ)
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Featured Recipes Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900">ထင်ရှားသော မုန့်ဖုတ်နည်းများ</h2>
            <p className="text-xs text-stone-500">အဆင့်ဆင့် ဖော်ပြထားသော လက်စွဲ ချက်နည်းများ</p>
          </div>
          <button
            onClick={() => onNavigate('learn')}
            className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
          >
            <span>အားလုံးကြည့်မည်</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RECIPES_DATA.slice(0, 3).map(recipe => {
            const isBookmarked = bookmarks.includes(recipe.id);
            return (
              <div
                key={recipe.id}
                onClick={() => onSelectRecipe(recipe.id)}
                className="group relative rounded-2xl bg-white border border-stone-200/90 p-5 shadow-xs hover:shadow-md hover:border-orange-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800">
                      {recipe.categoryMm}
                    </span>
                    <button
                      onClick={e => handleToggleBookmark(recipe.id, e)}
                      className="p-1 rounded-lg text-stone-400 hover:text-orange-600 hover:bg-orange-50 transition cursor-pointer"
                      title={isBookmarked ? 'မှတ်သားထားပြီး' : 'မှတ်သားမည်'}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-5 h-5 text-orange-600" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <h3 className="font-bold text-stone-900 text-base group-hover:text-orange-600 transition">
                    {recipe.titleMm}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {recipe.descriptionMm}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                  <div className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span>{recipe.ovenTempC}°C</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Timer className="w-3.5 h-3.5 text-amber-500" />
                    <span>{recipe.bakeTimeMinutes} မိနစ်</span>
                  </div>
                  <span className="text-xs font-semibold text-orange-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                    ကြည့်မည် →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Daily Baking Quiz & Knowledge Check */}
      <section className="rounded-3xl bg-linear-to-br from-stone-900 to-stone-800 p-6 sm:p-7 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-white/10 text-amber-400 rounded-xl">
              <HelpCircle className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base text-white">မုန့်ဖုတ် ဗဟုသုတ မေးခွန်းတို</h3>
              <p className="text-xs text-stone-400">မေးခွန်း {quizIndex + 1} / {QUIZ_QUESTIONS.length}</p>
            </div>
          </div>
        </div>

        <div className="mt-2">
          <p className="text-sm sm:text-base font-medium text-stone-100 leading-relaxed">
            {currentQuiz.questionMm}
          </p>

          <div className="mt-4 space-y-2">
            {currentQuiz.optionsMm.map((opt, idx) => {
              let btnClass = 'bg-white/10 hover:bg-white/15 text-stone-200 border-transparent';
              if (isAnswered) {
                if (idx === currentQuiz.correctIndex) {
                  btnClass = 'bg-emerald-600 text-white font-bold border-emerald-400';
                } else if (idx === selectedOption) {
                  btnClass = 'bg-rose-600 text-white border-rose-400';
                } else {
                  btnClass = 'bg-white/5 text-stone-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => {
                    setSelectedOption(idx);
                    setIsAnswered(true);
                  }}
                  className={`w-full p-3 rounded-xl text-xs sm:text-sm text-left border transition cursor-pointer ${btnClass}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-mono shrink-0">
                      {idx + 1}
                    </span>
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="mt-4 p-3.5 rounded-xl bg-white/10 border border-white/10 text-xs sm:text-sm text-amber-200 space-y-2 animate-in fade-in duration-150">
              <div className="font-bold flex items-center gap-1.5">
                {selectedOption === currentQuiz.correctIndex ? (
                  <span className="text-emerald-400">✓ မှန်ကန်ပါသည်!</span>
                ) : (
                  <span className="text-rose-400">✗ မှားယွင်းပါသည်!</span>
                )}
              </div>
              <p className="text-stone-300 leading-relaxed">
                {currentQuiz.explanationMm}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsAnswered(false);
                    setSelectedOption(null);
                    setQuizIndex((quizIndex + 1) % QUIZ_QUESTIONS.length);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700 transition cursor-pointer"
                >
                  နောက်မေးခွန်းသို့ →
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick Notes / Personal Baking Scratchpad (Stored in localStorage) */}
      <section className="rounded-3xl bg-white border border-stone-200/90 p-5 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <NotebookPen className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-stone-900 text-base">ကိုယ်ပိုင် မုန့်ဖုတ် မှတ်စုတို</h3>
              <p className="text-xs text-stone-500">ဖုန်းထဲတွင် Local Storage ဖြင့် အလိုအလျောက် သိမ်းဆည်းပေးပါသည်</p>
            </div>
          </div>
          {isSavedNoteToast && (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
              သိမ်းပြီးပါပြီ!
            </span>
          )}
        </div>

        <textarea
          rows={3}
          value={quickNote}
          onChange={e => setQuickNote(e.target.value)}
          placeholder="မုန့်ဖုတ်ရင်း သတိထားမိသည့် အချက်များကို ရေးသားသိမ်းဆည်းပါ..."
          className="w-full p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 text-xs sm:text-sm text-stone-800 focus:outline-hidden focus:border-orange-500 focus:bg-white transition"
        />

        <div className="mt-2.5 flex justify-end">
          <button
            onClick={handleSaveNote}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
          >
            မှတ်စု သိမ်းဆည်းမည်
          </button>
        </div>
      </section>
    </div>
  );
};
