/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Wheat, 
  Info, 
  RotateCcw,
  Sparkles,
  Check,
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import { getIngredients, saveIngredients, seedIfEmpty } from '../lib/storage.js';
import { DEFAULT_INGREDIENTS } from '../data/schema.js';
import { IngredientItem } from '../types';
import { useContentLanguage } from '../context/LanguageContext';

// Bilingual search match helper: matches English or Burmese text
function bilingualSearchMatch(item: IngredientItem, query: string): boolean {
  if (!query) return true;
  const cleanQuery = query.toLowerCase().trim().replace(/[\s\u200B]/g, '');

  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);

  const fieldsToSearch = [
    item.name_en || '',
    item.nameEn || '',
    item.name_mm || '',
    item.nameMm || '',
    item.uses_en || '',
    item.uses_mm || '',
    item.category || '',
    item.storage_en || '',
    item.storage_mm || '',
    item.nutrition_en || '',
    item.nutrition_mm || '',
    item.nutrition_short || '',
    ...(item.substitutes_en || []),
    ...(item.substitutes_mm || []),
  ];

  const combined = fieldsToSearch.join(' ').toLowerCase();
  const cleanCombined = combined.replace(/[\s\u200B]/g, '');

  if (cleanCombined.includes(cleanQuery)) return true;
  return tokens.every(token => combined.includes(token));
}

const COMMON_EMOJIS = ['🌾', '🥣', '🍞', '🌽', '✨', '🧂', '🥖', '🍯', '🧈', '🫗', '🥛', '🥫', '🧁', '🥚', '🌼', '🍫', '☕', '🥥'];

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'All Categories' },
  { id: 'flour', label: 'Flour & Starches' },
  { id: 'leavening', label: 'Leavening Agents' },
  { id: 'dairy', label: 'Dairy & Fats' },
  { id: 'sugar', label: 'Sugars & Sweeteners' },
  { id: 'flavor', label: 'Flavors & Seasonings' },
  { id: 'egg', label: 'Eggs' },
];

export const IngredientsPage: React.FC = () => {
  const { contentLang } = useContentLanguage();
  const [ingredientsList, setIngredientsList] = useState<IngredientItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientItem | null>(null);

  // Form Modal state (for Add or Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form fields
  const [formData, setFormData] = useState({
    name_en: '',
    name_mm: '',
    category: 'flour',
    image_emoji: '🌾',
    uses_en: '',
    uses_mm: '',
    substitutes_en_str: '',
    substitutes_mm_str: '',
    storage_en: '',
    storage_mm: '',
    nutrition_en: '',
    nutrition_mm: '',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const loadData = () => {
    const data = getIngredients();
    setIngredientsList(data as IngredientItem[]);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered ingredients matching both name_en, name_mm, and other bilingual fields
  const filteredIngredients = ingredientsList.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = bilingualSearchMatch(item, searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name_en: '',
      name_mm: '',
      category: 'flour',
      image_emoji: '🌾',
      uses_en: '',
      uses_mm: '',
      substitutes_en_str: '',
      substitutes_mm_str: '',
      storage_en: '',
      storage_mm: '',
      nutrition_en: '',
      nutrition_mm: '',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: IngredientItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingId(item.id);
    setFormData({
      name_en: item.name_en || item.nameEn || '',
      name_mm: item.name_mm || item.nameMm || '',
      category: item.category || 'flour',
      image_emoji: item.image_emoji || '🌾',
      uses_en: item.uses_en || '',
      uses_mm: item.uses_mm || item.shortDescMm || item.fullDescMm || '',
      substitutes_en_str: (item.substitutes_en || []).join('\n'),
      substitutes_mm_str: (item.substitutes_mm || item.substitutionsMm || []).join('\n'),
      storage_en: item.storage_en || '',
      storage_mm: item.storage_mm || item.storageTipMm || '',
      nutrition_en: item.nutrition_en || item.nutrition_short || '',
      nutrition_mm: item.nutrition_mm || item.nutrition_short || '',
    });
    setIsFormOpen(true);
    if (selectedIngredient) {
      setSelectedIngredient(null);
    }
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('Are you sure you want to delete this ingredient?')) {
      const updated = ingredientsList.filter(item => item.id !== id);
      saveIngredients(updated);
      setIngredientsList(updated);
      if (selectedIngredient?.id === id) {
        setSelectedIngredient(null);
      }
      showToast('Ingredient deleted successfully');
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name_en.trim() && !formData.name_mm.trim()) return;

    const subsEnArray = formData.substitutes_en_str
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const subsMmArray = formData.substitutes_mm_str
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    let updated: IngredientItem[];

    if (editingId) {
      // Edit existing
      updated = ingredientsList.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            name_en: formData.name_en.trim() || item.name_en,
            name_mm: formData.name_mm.trim() || item.name_mm,
            category: formData.category,
            image_emoji: formData.image_emoji.trim() || '🌾',
            uses_en: formData.uses_en.trim(),
            uses_mm: formData.uses_mm.trim(),
            substitutes_en: subsEnArray,
            substitutes_mm: subsMmArray,
            storage_en: formData.storage_en.trim(),
            storage_mm: formData.storage_mm.trim(),
            nutrition_en: formData.nutrition_en.trim(),
            nutrition_mm: formData.nutrition_mm.trim(),
            nutrition_short: formData.nutrition_en.trim() || formData.nutrition_mm.trim(),
          };
        }
        return item;
      });
      showToast('Ingredient updated successfully');
    } else {
      // Add new
      const newItem: IngredientItem = {
        id: 'ing_' + Date.now(),
        name_en: formData.name_en.trim() || formData.name_mm.trim(),
        name_mm: formData.name_mm.trim() || formData.name_en.trim(),
        category: formData.category,
        image_emoji: formData.image_emoji.trim() || '🌾',
        uses_en: formData.uses_en.trim(),
        uses_mm: formData.uses_mm.trim(),
        substitutes_en: subsEnArray,
        substitutes_mm: subsMmArray,
        storage_en: formData.storage_en.trim(),
        storage_mm: formData.storage_mm.trim(),
        nutrition_en: formData.nutrition_en.trim(),
        nutrition_mm: formData.nutrition_mm.trim(),
        nutrition_short: formData.nutrition_en.trim() || formData.nutrition_mm.trim(),
      };
      updated = [newItem, ...ingredientsList];
      showToast('New ingredient added successfully');
    }

    saveIngredients(updated);
    setIngredientsList(updated);
    setIsFormOpen(false);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all ingredients to default bilingual library (25 items)?')) {
      saveIngredients(DEFAULT_INGREDIENTS);
      setIngredientsList(DEFAULT_INGREDIENTS as IngredientItem[]);
      showToast('Default ingredients restored');
    }
  };

  const getCategoryLabel = (cat: string) => {
    const found = CATEGORY_OPTIONS.find(c => c.id === cat);
    return found ? found.label : cat;
  };

  // Helper to extract language-appropriate text based on contentLang
  const getItemName = (item: IngredientItem) => {
    if (contentLang === 'mm') {
      return item.name_mm || item.nameMm || item.name_en || item.nameEn || '';
    }
    return item.name_en || item.nameEn || item.name_mm || item.nameMm || '';
  };

  const getItemSecondaryName = (item: IngredientItem) => {
    if (contentLang === 'mm') {
      return item.name_en || item.nameEn || '';
    }
    return item.name_mm || item.nameMm || '';
  };

  const getItemUses = (item: IngredientItem) => {
    if (contentLang === 'mm') {
      return item.uses_mm || item.shortDescMm || item.fullDescMm || item.uses_en || '';
    }
    return item.uses_en || item.uses_mm || item.shortDescMm || '';
  };

  const getItemSubstitutes = (item: IngredientItem) => {
    if (contentLang === 'mm') {
      return (item.substitutes_mm && item.substitutes_mm.length > 0)
        ? item.substitutes_mm
        : (item.substitutes_en || []);
    }
    return (item.substitutes_en && item.substitutes_en.length > 0)
      ? item.substitutes_en
      : (item.substitutes_mm || []);
  };

  const getItemStorage = (item: IngredientItem) => {
    if (contentLang === 'mm') {
      return item.storage_mm || item.storageTipMm || item.storage_en || 'အေးမြခြောက်သွေ့သော နေရာတွင် ထားပါ';
    }
    return item.storage_en || item.storage_mm || 'Store in a cool, dry place in an airtight container.';
  };

  const getItemNutrition = (item: IngredientItem) => {
    if (contentLang === 'mm') {
      return item.nutrition_mm || item.nutrition_short || item.nutrition_en || '';
    }
    return item.nutrition_en || item.nutrition_short || item.nutrition_mm || '';
  };

  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-150 w-full max-w-full overflow-hidden">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-black text-white dark:bg-white dark:text-black text-xs font-mono font-bold px-4 py-2.5 rounded-md border border-black dark:border-white flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-black dark:text-white">
              Baking Ingredients
            </h1>
            <span className="px-2 py-0.5 rounded-sm text-[11px] font-mono font-bold uppercase tracking-wider bg-[#F5F5F5] dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#262626] text-[#737373] dark:text-[#A3A3A3]">
              {ingredientsList.length} Items
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#737373] mt-1 break-words">
            Explore 25 core baking ingredients, roles, reliable substitutions, and storage guidelines.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={handleResetDefaults}
            className="p-2 sm:p-2.5 rounded-md border border-[#E5E5E5] dark:border-[#262626] bg-transparent hover:bg-[#F5F5F5] dark:hover:bg-[#171717] text-black dark:text-white text-xs font-semibold transition-colors cursor-pointer"
            title="Restore default ingredients library"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-md bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-mono font-bold uppercase tracking-wider transition-colors active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Ingredient</span>
          </button>
        </div>
      </div>

      {/* Cohesive Sticky Header Section: Search, Quick Chips, Category Tabs */}
      <div className="sticky top-14 sm:top-16 z-30 bg-white/70 dark:bg-[#0c0f17]/75 backdrop-blur-xl pt-2.5 pb-3.5 space-y-2.5 border-b border-black/[0.08] dark:border-white/10 -mx-3.5 sm:-mx-6 lg:-mx-8 px-3.5 sm:px-6 lg:px-8 shadow-xs">
        {/* Search Bar matching both name_en and name_mm */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#737373]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by English or Burmese name (e.g. Cake flour, ဂျုံ, Butter, ထောပတ်, Baking soda)..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-black/[0.12] dark:border-white/15 bg-white/60 dark:bg-white/[0.04] backdrop-blur-md text-xs sm:text-sm text-black dark:text-white placeholder-[#737373] focus:outline-hidden focus:border-black dark:focus:border-white shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-2.5 text-[#737373] hover:text-black dark:hover:text-white text-sm cursor-pointer p-0.5"
              aria-label="Clear search query"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Search Tag Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] shrink-0">Quick:</span>
          {[
            { label: 'Flour (ဂျုံ)', query: 'ဂျုံ' },
            { label: 'Butter (ထောပတ်)', query: 'butter' },
            { label: 'Baking Powder (ဘိတ်ကင်ပေါင်ဒါ)', query: 'baking powder' },
            { label: 'Baking Soda (ဆိုဒါ)', query: 'soda' },
            { label: 'Vanilla (ဗနီလာ)', query: 'vanilla' },
            { label: 'Chocolate (ချောကလက်)', query: 'chocolate' },
          ].map(tag => (
            <button
              key={tag.query}
              onClick={() => {
                setSearchQuery(tag.query);
                setSelectedCategory('all');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase whitespace-nowrap transition-all cursor-pointer ${
                searchQuery === tag.query
                  ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs'
                  : 'border border-black/[0.08] dark:border-white/10 bg-white/40 dark:bg-white/[0.03] backdrop-blur-md hover:border-black/30 dark:hover:border-white/30 text-[#737373] dark:text-[#A3A3A3]'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {CATEGORY_OPTIONS.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs'
                  : 'border border-black/[0.08] dark:border-white/10 bg-white/40 dark:bg-white/[0.03] backdrop-blur-md text-[#737373] hover:text-black dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Special Comparison Banner: All-Purpose vs Cake Flour */}
      {(searchQuery.toLowerCase().includes('ဂျုံ') || searchQuery.toLowerCase().includes('flour')) && (
        <section className="rounded-2xl bg-white/60 dark:bg-white/[0.035] backdrop-blur-xl border border-black/[0.08] dark:border-white/10 p-5 sm:p-6 space-y-4 animate-in fade-in duration-150 shadow-xs dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-mono font-bold shadow-xs">VS</span>
              <div>
                <h3 className="font-extrabold uppercase tracking-wide text-black dark:text-white text-sm sm:text-base">
                  {contentLang === 'mm'
                    ? 'ဂျုံမှုန့် (All-Purpose Flour) နှင့် ကိတ်မုန့်ဂျုံ (Cake Flour) အဓိက ကွာခြားချက်များ'
                    : 'Key Differences: All-Purpose Flour vs Cake Flour'}
                </h3>
                <p className="text-xs text-[#737373] dark:text-[#A3A3A3] font-medium">
                  {contentLang === 'mm'
                    ? 'မုန့်ဖုတ်ရာတွင် Gluten (ကော်ရည်ကြော) ပါဝင်မှုပေါ်မူတည်၍ မုန့်သားတည်ဆောက်ပုံ ကွာခြားသွားပါသည်'
                    : 'Protein and gluten formation dictate structural tenderness versus chewiness in baked goods'}
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border border-black/[0.12] dark:border-white/20 text-black dark:text-white bg-white/40 dark:bg-white/[0.03]">
              Comparison Guide
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {/* All-Purpose Flour Card */}
            <div className="bg-black/[0.03] dark:bg-white/[0.04] backdrop-blur-md p-4 rounded-xl border border-black/[0.06] dark:border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-black/[0.06] dark:border-white/[0.08]">
                <span className="font-bold text-sm text-black dark:text-white">
                  {contentLang === 'mm' ? 'ဂျုံမှုန့် / အိမ်သုံးဂျုံ (All-Purpose)' : 'All-Purpose Flour'}
                </span>
                <span className="px-1.5 py-0.5 rounded-md border border-[#A3A3A3] dark:border-white/20 text-black dark:text-white text-[10px] font-mono font-bold bg-white/40 dark:bg-white/[0.04]">
                  Gluten 10-12%
                </span>
              </div>
              <ul className="text-xs text-[#525252] dark:text-[#A3A3A3] space-y-1">
                <li className="flex items-start gap-1">
                  <span className="text-black dark:text-white font-bold">•</span>
                  <span><strong>Role:</strong> {contentLang === 'mm' ? 'ကော်ရည်ကြော အလယ်အလတ်၊ မုန့်သားကျစ်လျစ်ခိုင်မာစေသည်။' : 'Medium gluten network provides stable, versatile structure.'}</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-black dark:text-white font-bold">•</span>
                  <span><strong>Best for:</strong> {contentLang === 'mm' ? 'ကွတ်ကီး၊ ပန်ကိတ်၊ မာဖင်၊ ပေါင်မုန့်နှင့် ကိတ်မုန့်များအတွက် စွယ်စုံသုံး။' : 'Cookies, muffins, pancakes, quick breads, and standard cakes.'}</span>
                </li>
              </ul>
            </div>

            {/* Cake Flour Card */}
            <div className="bg-black/[0.03] dark:bg-white/[0.04] backdrop-blur-md p-4 rounded-xl border border-black/[0.06] dark:border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-black/[0.06] dark:border-white/[0.08]">
                <span className="font-bold text-sm text-black dark:text-white">
                  {contentLang === 'mm' ? 'ကိတ်မုန့်ဂျုံ (Cake Flour)' : 'Cake Flour'}
                </span>
                <span className="px-1.5 py-0.5 rounded-md border border-[#A3A3A3] dark:border-white/20 text-black dark:text-white text-[10px] font-mono font-bold bg-white/40 dark:bg-white/[0.04]">
                  Gluten 7-9% (Low)
                </span>
              </div>
              <ul className="text-xs text-[#525252] dark:text-[#A3A3A3] space-y-1">
                <li className="flex items-start gap-1">
                  <span className="text-black dark:text-white font-bold">•</span>
                  <span><strong>Role:</strong> {contentLang === 'mm' ? 'Gluten အလွန်နည်း၍ ကိတ်မုန့်သားကို အလွန်နူးညံ့ပေါ့ပါးအိစက်စေသည်။' : 'Minimal gluten allows cakes to rise extra light, airy and tender.'}</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-black dark:text-white font-bold">•</span>
                  <span><strong>Best for:</strong> {contentLang === 'mm' ? 'စပေါန့်ခ်ျကိတ်၊ ရှစ်ဖွန်ကိတ်၊ နူးညံ့ပျော့ပျောင်းသော ကိတ်များ။' : 'Sponge cakes, chiffon cakes, delicate cupcakes, and angel food.'}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-3 bg-black/[0.03] dark:bg-white/[0.04] backdrop-blur-md rounded-xl border border-black/[0.06] dark:border-white/[0.08] text-xs text-black dark:text-white flex items-start gap-2 font-mono">
            <span className="font-bold uppercase shrink-0">Formula Note:</span>
            <span>
              {contentLang === 'mm'
                ? 'ကိတ်ဂျုံမရှိပါက အိမ်သုံးဂျုံမှုန့် ၈၅ ဂရမ် + ပြောင်းဖူးကစီမှုန့် (Cornstarch) ၁၅ ဂရမ် ရောစပ်ကာ ၂-၃ ကြိမ် ဇကာစစ်သုံးပါက ကိတ်ဂျုံ ၁၀၀ ဂရမ် အဖြစ် အလွယ်တကူ အစားထိုးနိုင်ပါသည်။'
                : 'Emergency Cake Flour Substitute: Measure 85g all-purpose flour + 15g cornstarch. Sift together 2-3 times to aerate and thoroughly disperse for 100g cake flour.'}
            </span>
          </div>
        </section>
      )}

      {/* Ingredients Cards Grid - Frosted Glass Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredIngredients.map(item => {
          const primaryName = getItemName(item);
          const secondaryName = getItemSecondaryName(item);
          const usesText = getItemUses(item);
          const nutritionText = getItemNutrition(item);
          const substitutesList = getItemSubstitutes(item);
          const emoji = item.image_emoji || '🌾';

          return (
            <div
              key={item.id}
              onClick={() => setSelectedIngredient(item)}
              className="rounded-2xl bg-white/60 dark:bg-white/[0.035] backdrop-blur-xl border border-black/[0.08] dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 hover:bg-white/80 dark:hover:bg-white/[0.07] p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between group min-w-0 shadow-xs hover:shadow-lg dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
            >
              <div>
                {/* Card Header Divider with Emoji, Category, and Action Buttons */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-black/[0.06] dark:border-white/[0.08]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-8 h-8 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/10 flex items-center justify-center text-base shrink-0 shadow-xs">
                      {emoji}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] truncate">
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>

                  {/* Properly aligned action buttons */}
                  <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={e => handleOpenEdit(item, e)}
                      className="p-1.5 rounded-lg text-[#737373] hover:text-black dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
                      title="Edit ingredient"
                      aria-label={`Edit ${primaryName}`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={e => handleDelete(item.id, e)}
                      className="p-1.5 rounded-lg text-[#737373] hover:text-black dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
                      title="Delete ingredient"
                      aria-label={`Delete ${primaryName}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Typography Hierarchy */}
                <div className="pt-2.5">
                  <h3 className="font-bold text-black dark:text-white text-base group-hover:underline transition-all break-words">
                    {primaryName}
                  </h3>
                  {secondaryName && (
                    <div className="text-xs font-mono text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                      {secondaryName}
                    </div>
                  )}

                  <p className="text-xs text-[#525252] dark:text-[#A3A3A3] mt-2 line-clamp-2 leading-relaxed break-words">
                    {usesText}
                  </p>

                  {nutritionText && (
                    <div className="mt-2.5">
                      <span className="text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3] bg-black/[0.03] dark:bg-white/[0.04] px-2 py-0.5 rounded-md border border-black/[0.06] dark:border-white/[0.08] inline-block truncate max-w-full">
                        {nutritionText}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Divider */}
              <div className="mt-3.5 pt-2.5 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                <span className="text-black dark:text-white font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 uppercase tracking-wider">
                  Details →
                </span>
                <span className="truncate max-w-[130px] uppercase text-[10px] font-bold">
                  {substitutesList.length > 0 ? `${substitutesList.length} Substitutes` : 'Core Ingredient'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredIngredients.length === 0 && (
        <div className="text-center py-12 bg-white/60 dark:bg-white/[0.035] backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/10 p-8">
          <Wheat className="w-8 h-8 text-[#737373] mx-auto mb-2" />
          <p className="text-black dark:text-white font-bold text-sm">
            No matching ingredients found for "{searchQuery}"
          </p>
          <div className="mt-3 flex justify-center gap-2">
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-3 py-1.5 rounded-lg border border-black dark:border-white text-black dark:text-white text-xs font-mono font-bold uppercase tracking-wider"
            >
              Show All
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-3 py-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-mono font-bold uppercase tracking-wider shadow-xs"
            >
              Add New
            </button>
          </div>
        </div>
      )}

      {/* FULL DETAIL MODAL - Frosted Glass Window */}
      {selectedIngredient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-md p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white/90 dark:bg-[#0c0f17]/90 backdrop-blur-2xl p-6 sm:p-7 border border-black/10 dark:border-white/15 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between pb-3 border-b border-black/[0.08] dark:border-white/10">
              <div className="flex items-start gap-3">
                <span className="text-3xl p-2.5 bg-black/[0.04] dark:bg-white/[0.06] rounded-xl border border-black/[0.06] dark:border-white/10 shadow-xs">
                  {selectedIngredient.image_emoji || '🌾'}
                </span>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3]">
                    {getCategoryLabel(selectedIngredient.category)}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-black dark:text-white mt-0.5">
                    {getItemName(selectedIngredient)}
                  </h3>
                  <div className="text-xs font-mono text-[#737373] dark:text-[#A3A3A3]">
                    {getItemSecondaryName(selectedIngredient)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedIngredient(null)}
                className="p-1.5 rounded-lg text-[#737373] hover:text-black dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-[#171717] dark:text-[#E5E5E5]">
              {/* Uses / Purpose */}
              <div className="p-3.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] backdrop-blur-md border border-black/[0.06] dark:border-white/[0.08]">
                <h4 className="font-bold text-black dark:text-white mb-1 uppercase tracking-wider font-mono text-xs flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>{contentLang === 'mm' ? 'မုန့်လုပ်ရာတွင် သုံးပုံ (Purpose)' : 'Role & Purpose in Baking'}</span>
                </h4>
                <p className="leading-relaxed text-[#525252] dark:text-[#A3A3A3]">
                  {getItemUses(selectedIngredient)}
                </p>
              </div>

              {/* Substitutes */}
              {getItemSubstitutes(selectedIngredient).length > 0 && (
                <div className="p-3.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] backdrop-blur-md border border-black/[0.06] dark:border-white/[0.08]">
                  <h4 className="font-bold text-black dark:text-white mb-1.5 uppercase tracking-wider font-mono text-xs">
                    {contentLang === 'mm' ? 'အစားထိုးနည်းများ (Substitutes)' : 'Recommended Substitutions'}
                  </h4>
                  <ul className="text-[#525252] dark:text-[#A3A3A3] space-y-1">
                    {getItemSubstitutes(selectedIngredient).map((sub, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-black dark:text-white font-bold">•</span>
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Storage */}
              <div className="p-3.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] backdrop-blur-md border border-black/[0.06] dark:border-white/[0.08]">
                <h4 className="font-bold text-black dark:text-white mb-1 uppercase tracking-wider font-mono text-xs">
                  {contentLang === 'mm' ? 'သိမ်းဆည်းနည်း (Storage)' : 'Storage Guidelines'}
                </h4>
                <p className="leading-relaxed text-[#525252] dark:text-[#A3A3A3]">
                  {getItemStorage(selectedIngredient)}
                </p>
              </div>

              {/* Nutrition */}
              {getItemNutrition(selectedIngredient) && (
                <div className="p-3.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] backdrop-blur-md border border-black/[0.06] dark:border-white/[0.08]">
                  <h4 className="font-bold text-black dark:text-white mb-1 uppercase tracking-wider font-mono text-xs">
                    {contentLang === 'mm' ? 'အာဟာရနှင့် ဂုဏ်သတ္တိ (Nutrition & Properties)' : 'Nutrition & Baking Properties'}
                  </h4>
                  <p className="text-[#525252] dark:text-[#A3A3A3]">{getItemNutrition(selectedIngredient)}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => handleOpenEdit(selectedIngredient)}
                className="flex-1 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Ingredient</span>
              </button>
              <button
                onClick={() => setSelectedIngredient(null)}
                className="px-5 py-2.5 rounded-xl border border-black/[0.12] dark:border-white/15 bg-white/40 dark:bg-white/[0.04] hover:bg-white/80 dark:hover:bg-white/[0.08] text-black dark:text-white text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT FORM MODAL - Frosted Glass Window */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-md p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white/90 dark:bg-[#0c0f17]/90 backdrop-blur-2xl p-6 sm:p-7 border border-black/10 dark:border-white/15 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.08] dark:border-white/10">
              <h3 className="font-extrabold uppercase tracking-wide text-black dark:text-white text-sm sm:text-base">
                {editingId ? 'Edit Ingredient' : 'Add New Ingredient'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg text-[#737373] hover:text-black dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3.5 text-xs">
              {/* Emoji Picker */}
              <div>
                <label className="block font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-1">
                  Emoji Icon
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl p-2 bg-black/[0.04] dark:bg-white/[0.06] rounded-xl border border-black/[0.06] dark:border-white/10 shadow-xs">
                    {formData.image_emoji || '🌾'}
                  </span>
                  <input
                    type="text"
                    value={formData.image_emoji}
                    onChange={e => setFormData({ ...formData, image_emoji: e.target.value })}
                    className="w-20 px-3 py-1.5 rounded-xl border border-black/[0.12] dark:border-white/15 text-center font-mono text-sm bg-white/60 dark:bg-white/[0.04] backdrop-blur-md text-black dark:text-white"
                  />
                  <span className="text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">or choose:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {COMMON_EMOJIS.map(em => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setFormData({ ...formData, image_emoji: em })}
                      className="p-1.5 rounded-lg hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-base transition-colors"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-1">
                    English Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name_en}
                    onChange={e => setFormData({ ...formData, name_en: e.target.value })}
                    placeholder="e.g. Cake Flour"
                    className="w-full px-3 py-2 rounded-xl border border-black/[0.12] dark:border-white/15 bg-white/60 dark:bg-white/[0.04] backdrop-blur-md text-black dark:text-white focus:outline-hidden focus:border-black dark:focus:border-white"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-1">
                    Myanmar Name
                  </label>
                  <input
                    type="text"
                    value={formData.name_mm}
                    onChange={e => setFormData({ ...formData, name_mm: e.target.value })}
                    placeholder="e.g. ကိတ်မုန့်ဂျုံ"
                    className="w-full px-3 py-2 rounded-xl border border-black/[0.12] dark:border-white/15 bg-white/60 dark:bg-white/[0.04] backdrop-blur-md text-black dark:text-white focus:outline-hidden focus:border-black dark:focus:border-white"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-black/[0.12] dark:border-white/15 bg-white/60 dark:bg-white/[0.04] backdrop-blur-md text-black dark:text-white focus:outline-hidden focus:border-black dark:focus:border-white"
                >
                  <option value="flour">Flour & Starches</option>
                  <option value="leavening">Leavening Agents</option>
                  <option value="dairy">Dairy & Fats</option>
                  <option value="sugar">Sugars & Sweeteners</option>
                  <option value="egg">Eggs</option>
                  <option value="flavor">Flavors & Seasonings</option>
                </select>
              </div>

              {/* Uses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-1">
                    Uses (English)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.uses_en}
                    onChange={e => setFormData({ ...formData, uses_en: e.target.value })}
                    placeholder="Role in baking structure..."
                    className="w-full px-3 py-2 rounded-xl border border-black/[0.12] dark:border-white/15 bg-white/60 dark:bg-white/[0.04] backdrop-blur-md text-black dark:text-white focus:outline-hidden focus:border-black dark:focus:border-white"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-1">
                    Uses (Myanmar)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.uses_mm}
                    onChange={e => setFormData({ ...formData, uses_mm: e.target.value })}
                    placeholder="ကိတ်မုန့်သား နူးညံ့အိစက်စေရန်..."
                    className="w-full px-3 py-2 rounded-xl border border-black/[0.12] dark:border-white/15 bg-white/60 dark:bg-white/[0.04] backdrop-blur-md text-black dark:text-white focus:outline-hidden focus:border-black dark:focus:border-white"
                  />
                </div>
              </div>

              {/* Substitutes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-1">
                    Substitutes (English)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.substitutes_en_str}
                    onChange={e => setFormData({ ...formData, substitutes_en_str: e.target.value })}
                    placeholder="85g AP flour + 15g cornstarch..."
                    className="w-full px-3 py-2 rounded-xl border border-black/[0.12] dark:border-white/15 bg-white/60 dark:bg-white/[0.04] backdrop-blur-md text-black dark:text-white focus:outline-hidden focus:border-black dark:focus:border-white"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-1">
                    Substitutes (Myanmar)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.substitutes_mm_str}
                    onChange={e => setFormData({ ...formData, substitutes_mm_str: e.target.value })}
                    placeholder="အိမ်သုံးဂျုံ ၈၅g + ပြောင်းဖူးကစီ ၁၅g..."
                    className="w-full px-3 py-2 rounded-xl border border-black/[0.12] dark:border-white/15 bg-white/60 dark:bg-white/[0.04] backdrop-blur-md text-black dark:text-white focus:outline-hidden focus:border-black dark:focus:border-white"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex justify-end gap-2 font-mono">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl border border-black/[0.12] dark:border-white/15 text-black dark:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-all cursor-pointer uppercase tracking-wider text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-bold transition-all cursor-pointer uppercase tracking-wider text-xs shadow-xs"
                >
                  {editingId ? 'Save Changes' : 'Add Ingredient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientsPage;
