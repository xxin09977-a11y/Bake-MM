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
import { ContentLanguageToggle } from '../components/ContentLanguageToggle';

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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              Baking Ingredients
            </h1>
            <ContentLanguageToggle />
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Explore 25 core baking ingredients, roles, smart substitutions, and storage guidelines.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleResetDefaults}
            className="p-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 text-stone-600 dark:text-stone-300 text-xs font-semibold transition cursor-pointer"
            title="Restore default ingredients library"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Ingredient</span>
          </button>
        </div>
      </div>

      {/* Search Bar matching both name_en and name_mm */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by English or Burmese name (e.g. Cake flour, ဂျုံ, Butter, ထောပတ်, Baking soda)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs sm:text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-orange-500 shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-700 text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Quick Search Tag Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-[11px] font-bold text-stone-400 shrink-0">Quick Search:</span>
        {[
          { label: '🌾 Flour Comparison (ဂျုံ)', query: 'ဂျုံ' },
          { label: '🧈 Butter (ထောပတ်)', query: 'butter' },
          { label: '✨ Baking Powder (ဘိတ်ကင်ပေါင်ဒါ)', query: 'baking powder' },
          { label: '🧂 Baking Soda (ဆိုဒါ)', query: 'soda' },
          { label: '🌼 Vanilla (ဗနီလာ)', query: 'vanilla' },
          { label: '🍫 Chocolate (ချောကလက်)', query: 'chocolate' },
        ].map(tag => (
          <button
            key={tag.query}
            onClick={() => {
              setSearchQuery(tag.query);
              setSelectedCategory('all');
            }}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition cursor-pointer active:scale-95 ${
              searchQuery === tag.query
                ? 'bg-orange-600 text-white shadow-2xs'
                : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORY_OPTIONS.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Special Comparison Banner: All-Purpose vs Cake Flour */}
      {(searchQuery.toLowerCase().includes('ဂျုံ') || searchQuery.toLowerCase().includes('flour')) && (
        <section className="rounded-3xl bg-linear-to-r from-amber-50 via-orange-50 to-amber-100/60 dark:from-stone-900 dark:via-orange-950/30 dark:to-stone-900 border-2 border-orange-200 dark:border-stone-800 p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-1.5 bg-white dark:bg-stone-800 rounded-xl shadow-2xs">🌾🥣</span>
              <div>
                <h3 className="font-black text-stone-900 dark:text-white text-sm sm:text-base">
                  {contentLang === 'mm'
                    ? 'ဂျုံမှုန့် (All-Purpose Flour) နှင့် ကိတ်မုန့်ဂျုံ (Cake Flour) အဓိက ကွာခြားချက်များ'
                    : 'Key Differences: All-Purpose Flour vs Cake Flour'}
                </h3>
                <p className="text-xs text-orange-950 dark:text-orange-300 font-medium">
                  {contentLang === 'mm'
                    ? 'မုန့်ဖုတ်ရာတွင် Gluten (ကော်ရည်ကြော) ပါဝင်မှုပေါ်မူတည်၍ မုန့်သားတည်ဆောက်ပုံ ကွာခြားသွားပါသည်'
                    : 'Protein and gluten formation dictate structural tenderness versus chewiness in baked goods'}
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-3 py-1 rounded-full text-[11px] font-extrabold bg-orange-600 text-white">
              Comparison Guide
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {/* All-Purpose Flour Card */}
            <div className="bg-white/95 dark:bg-stone-800 p-4 rounded-2xl border border-orange-200/80 dark:border-stone-700 shadow-2xs space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-stone-100 dark:border-stone-700">
                <span className="font-extrabold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                  <span>🌾</span> {contentLang === 'mm' ? 'ဂျုံမှုန့် / အိမ်သုံးဂျုံ (All-Purpose)' : 'All-Purpose Flour'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-[10px] font-mono font-bold">
                  Gluten 10-12%
                </span>
              </div>
              <ul className="text-xs text-stone-700 dark:text-stone-300 space-y-1">
                <li className="flex items-start gap-1">
                  <span className="text-orange-500 font-bold">•</span>
                  <span><strong>Role:</strong> {contentLang === 'mm' ? 'ကော်ရည်ကြော အလယ်အလတ်၊ မုန့်သားကျစ်လျစ်ခိုင်မာစေသည်။' : 'Medium gluten network provides stable, versatile structure.'}</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-orange-500 font-bold">•</span>
                  <span><strong>Best for:</strong> {contentLang === 'mm' ? 'ကွတ်ကီး၊ ပန်ကိတ်၊ မာဖင်၊ ပေါင်မုန့်နှင့် ကိတ်မုန့်များအတွက် စွယ်စုံသုံး။' : 'Cookies, muffins, pancakes, quick breads, and standard cakes.'}</span>
                </li>
              </ul>
            </div>

            {/* Cake Flour Card */}
            <div className="bg-white/95 dark:bg-stone-800 p-4 rounded-2xl border border-orange-200/80 dark:border-stone-700 shadow-2xs space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-stone-100 dark:border-stone-700">
                <span className="font-extrabold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                  <span>🥣</span> {contentLang === 'mm' ? 'ကိတ်မုန့်ဂျုံ (Cake Flour)' : 'Cake Flour'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[10px] font-mono font-bold">
                  Gluten 7-9% (Low)
                </span>
              </div>
              <ul className="text-xs text-stone-700 dark:text-stone-300 space-y-1">
                <li className="flex items-start gap-1">
                  <span className="text-orange-500 font-bold">•</span>
                  <span><strong>Role:</strong> {contentLang === 'mm' ? 'Gluten အလွန်နည်း၍ ကိတ်မုန့်သားကို အလွန်နူးညံ့ပေါ့ပါးအိစက်စေသည်။' : 'Minimal gluten allows cakes to rise extra light, airy and tender.'}</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-orange-500 font-bold">•</span>
                  <span><strong>Best for:</strong> {contentLang === 'mm' ? 'စပေါန့်ခ်ျကိတ်၊ ရှစ်ဖွန်ကိတ်၊ နူးညံ့ပျော့ပျောင်းသော ကိတ်များ။' : 'Sponge cakes, chiffon cakes, delicate cupcakes, and angel food.'}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-3 bg-white/80 dark:bg-stone-800 rounded-2xl border border-amber-200/80 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200 flex items-start gap-2">
            <span className="font-bold text-orange-600 shrink-0">💡 Substitution Tip:</span>
            <span>
              {contentLang === 'mm'
                ? 'ကိတ်ဂျုံမရှိပါက အိမ်သုံးဂျုံမှုန့် ၈၅ ဂရမ် + ပြောင်းဖူးကစီမှုန့် (Cornstarch) ၁၅ ဂရမ် ရောစပ်ကာ ၂-၃ ကြိမ် ဇကာစစ်သုံးပါက ကိတ်ဂျုံ ၁၀၀ ဂရမ် အဖြစ် အလွယ်တကူ အစားထိုးနိုင်ပါသည်။'
                : 'Emergency Cake Flour Substitute: Measure 85g all-purpose flour + 15g cornstarch. Sift together 2-3 times to aerate and thoroughly disperse for 100g cake flour.'}
            </span>
          </div>
        </section>
      )}

      {/* Ingredients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 p-5 shadow-xs hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl p-1.5 bg-amber-50 dark:bg-stone-800 rounded-2xl border border-amber-100 dark:border-stone-700">
                      {emoji}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300">
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={e => handleOpenEdit(item, e)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-stone-800 transition cursor-pointer"
                      title="Edit ingredient"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={e => handleDelete(item.id, e)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-stone-800 transition cursor-pointer"
                      title="Delete ingredient"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-stone-900 dark:text-white text-base group-hover:text-orange-600 dark:group-hover:text-orange-400 transition mt-1">
                  {primaryName}
                </h3>
                {secondaryName && (
                  <div className="text-[11px] font-mono text-stone-400 dark:text-stone-500">
                    {secondaryName}
                  </div>
                )}

                <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 line-clamp-2 leading-relaxed">
                  {usesText}
                </p>

                {nutritionText && (
                  <div className="mt-2 text-[10px] text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/50 dark:border-amber-900/40 inline-block font-medium truncate max-w-full">
                    📊 {nutritionText}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                <span className="text-orange-600 dark:text-orange-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  View Details →
                </span>
                <span className="text-stone-400 dark:text-stone-500 truncate max-w-[120px]">
                  {substitutesList.length > 0 ? 'Substitutes Available' : 'Core Ingredient'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredIngredients.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8">
          <Wheat className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="text-stone-600 dark:text-stone-300 font-semibold text-sm">
            No matching ingredients found for "{searchQuery}"
          </p>
          <div className="mt-3 flex justify-center gap-2">
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-3 py-1.5 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 text-xs font-bold"
            >
              Show All
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-3 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-bold"
            >
              Add New Ingredient
            </button>
          </div>
        </div>
      )}

      {/* FULL DETAIL MODAL (Matching contentLang) */}
      {selectedIngredient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-stone-900 p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-800 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-start gap-3">
                <span className="text-4xl p-2 bg-amber-50 dark:bg-stone-800 rounded-2xl border border-amber-100 dark:border-stone-700">
                  {selectedIngredient.image_emoji || '🌾'}
                </span>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300">
                    {getCategoryLabel(selectedIngredient.category)}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white mt-1">
                    {getItemName(selectedIngredient)}
                  </h3>
                  <div className="text-xs font-mono text-stone-400 dark:text-stone-500">
                    {getItemSecondaryName(selectedIngredient)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedIngredient(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
              {/* Uses / Purpose */}
              <div className="p-3.5 rounded-2xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-100 dark:border-stone-800">
                <h4 className="font-bold text-orange-950 dark:text-orange-300 mb-1 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span>{contentLang === 'mm' ? 'မုန့်လုပ်ရာမှာ ဘာလို့သုံးလဲ (Uses & Purpose)' : 'Role in Baking & Purpose'}</span>
                </h4>
                <p className="leading-relaxed text-stone-700 dark:text-stone-300">
                  {getItemUses(selectedIngredient)}
                </p>
              </div>

              {/* Substitutes */}
              {getItemSubstitutes(selectedIngredient).length > 0 && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                  <h4 className="font-bold text-emerald-950 dark:text-emerald-300 mb-1.5">
                    {contentLang === 'mm' ? 'အစားထိုးနည်းများ (Substitutes)' : 'Recommended Substitutions'}
                  </h4>
                  <ul className="text-emerald-950 dark:text-emerald-200 space-y-1.5">
                    {getItemSubstitutes(selectedIngredient).map((sub, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Storage */}
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700">
                <h4 className="font-bold text-stone-900 dark:text-white mb-1">
                  {contentLang === 'mm' ? 'သိမ်းဆည်းနည်း (Storage)' : 'Storage Guidelines'}
                </h4>
                <p className="leading-relaxed text-stone-600 dark:text-stone-300">
                  {getItemStorage(selectedIngredient)}
                </p>
              </div>

              {/* Nutrition */}
              {getItemNutrition(selectedIngredient) && (
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 text-amber-950 dark:text-amber-300">
                  <h4 className="font-bold mb-1">
                    {contentLang === 'mm' ? 'အာဟာရနှင့် ဂုဏ်သတ္တိ (Nutrition & Properties)' : 'Nutrition & Baking Properties'}
                  </h4>
                  <p>{getItemNutrition(selectedIngredient)}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => handleOpenEdit(selectedIngredient)}
                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Ingredient</span>
              </button>
              <button
                onClick={() => setSelectedIngredient(null)}
                className="px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT FORM MODAL (English UI) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-stone-900 p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-800 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-extrabold text-stone-900 dark:text-white text-base sm:text-lg">
                {editingId ? 'Edit Ingredient' : 'Add New Ingredient'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3.5 text-xs">
              {/* Emoji Picker */}
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Emoji Icon
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl p-2 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                    {formData.image_emoji || '🌾'}
                  </span>
                  <input
                    type="text"
                    value={formData.image_emoji}
                    onChange={e => setFormData({ ...formData, image_emoji: e.target.value })}
                    className="w-24 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-center font-mono text-sm bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100"
                  />
                  <span className="text-[11px] text-stone-400">or pick below:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {COMMON_EMOJIS.map(em => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setFormData({ ...formData, image_emoji: em })}
                      className="p-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-stone-800 text-base"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    English Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name_en}
                    onChange={e => setFormData({ ...formData, name_en: e.target.value })}
                    placeholder="e.g. Cake Flour"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Myanmar Name (မြန်မာအမည်)
                  </label>
                  <input
                    type="text"
                    value={formData.name_mm}
                    onChange={e => setFormData({ ...formData, name_mm: e.target.value })}
                    placeholder="e.g. ကိတ်မုန့်ဂျုံ"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white"
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
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Uses in Baking (English)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.uses_en}
                    onChange={e => setFormData({ ...formData, uses_en: e.target.value })}
                    placeholder="Controls gluten formation to produce delicate, tender crumb..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Uses in Baking (Myanmar)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.uses_mm}
                    onChange={e => setFormData({ ...formData, uses_mm: e.target.value })}
                    placeholder="ကိတ်မုန့်သား နူးညံ့အိစက်စေရန် သုံးသည်..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Substitutes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Substitutes (English - one per line)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.substitutes_en_str}
                    onChange={e => setFormData({ ...formData, substitutes_en_str: e.target.value })}
                    placeholder="85g all-purpose flour + 15g cornstarch..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Substitutes (Myanmar - one per line)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.substitutes_mm_str}
                    onChange={e => setFormData({ ...formData, substitutes_mm_str: e.target.value })}
                    placeholder="အိမ်သုံးဂျုံ ၈၅g + ပြောင်းဖူးကစီ ၁၅g..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Storage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Storage (English)
                  </label>
                  <input
                    type="text"
                    value={formData.storage_en}
                    onChange={e => setFormData({ ...formData, storage_en: e.target.value })}
                    placeholder="Airtight container in a cool, dry pantry..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Storage (Myanmar)
                  </label>
                  <input
                    type="text"
                    value={formData.storage_mm}
                    onChange={e => setFormData({ ...formData, storage_mm: e.target.value })}
                    placeholder="အေးမြခြောက်သွေ့သော နေရာတွင် သိမ်းပါ..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition shadow-xs cursor-pointer"
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
