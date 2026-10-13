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
  UtensilsCrossed, 
  Info, 
  RotateCcw,
  Check,
  Award,
  Sparkles
} from 'lucide-react';
import { getTools, saveTools } from '../lib/storage.js';
import { DEFAULT_TOOLS } from '../data/schema.js';
import { ToolItem } from '../types';
import { useContentLanguage } from '../context/LanguageContext';
import { ContentLanguageToggle } from '../components/ContentLanguageToggle';

// Bilingual search helper: matches English or Burmese text
function bilingualToolSearchMatch(item: ToolItem, query: string): boolean {
  if (!query) return true;
  const cleanQuery = query.toLowerCase().trim().replace(/[\s\u200B]/g, '');

  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);

  const fieldsToSearch = [
    item.name_en || '',
    item.nameEn || '',
    item.name_mm || '',
    item.nameMm || '',
    item.purpose_en || '',
    item.purpose_mm || '',
    item.how_to_use_en || '',
    item.how_to_use_mm || '',
    item.care_en || '',
    item.care_mm || '',
    item.category || '',
    ...(item.alternatives_en || []),
    ...(item.alternatives_mm || []),
  ];

  const combined = fieldsToSearch.join(' ').toLowerCase();
  const cleanCombined = combined.replace(/[\s\u200B]/g, '');

  if (cleanCombined.includes(cleanQuery)) return true;
  return tokens.every(token => combined.includes(token));
}

const TOOL_EMOJIS = ['🔥', '🔌', '🥧', '🥢', '🥄', '🥛', '⚖️', '🌡️', '🧇', '📜', '🕸️', '🧁', '⚙️', '🥖', '🥣', '🔪', '🧤'];

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'All Tools' },
  { id: 'measuring', label: 'Measuring & Scales' },
  { id: 'mixing', label: 'Mixing & Whisks' },
  { id: 'baking_pan', label: 'Baking Pans & Molds' },
  { id: 'oven_gear', label: 'Oven & Heat Tools' },
  { id: 'decorating', label: 'Decorating & Pastry' },
];

export const ToolsPage: React.FC = () => {
  const { contentLang } = useContentLanguage();
  const [toolsList, setToolsList] = useState<ToolItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);

  // Form Modal state (for Add or Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    name_en: '',
    name_mm: '',
    category: 'measuring',
    image_emoji: '⚖️',
    purpose_en: '',
    purpose_mm: '',
    how_to_use_en: '',
    how_to_use_mm: '',
    care_en: '',
    care_mm: '',
    alternatives_en_str: '',
    alternatives_mm_str: '',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const loadData = () => {
    const data = getTools();
    setToolsList(data as ToolItem[]);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered tools matching search across English & Burmese
  const filteredTools = toolsList.filter(item => {
    const matchesCategory = selectedCategory === 'all' || (item.category || 'measuring') === selectedCategory;
    const matchesSearch = bilingualToolSearchMatch(item, searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name_en: '',
      name_mm: '',
      category: 'measuring',
      image_emoji: '⚖️',
      purpose_en: '',
      purpose_mm: '',
      how_to_use_en: '',
      how_to_use_mm: '',
      care_en: '',
      care_mm: '',
      alternatives_en_str: '',
      alternatives_mm_str: '',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: ToolItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingId(item.id);
    setFormData({
      name_en: item.name_en || item.nameEn || '',
      name_mm: item.name_mm || item.nameMm || '',
      category: item.category || 'measuring',
      image_emoji: item.image_emoji || '⚖️',
      purpose_en: item.purpose_en || '',
      purpose_mm: item.purpose_mm || item.descriptionMm || '',
      how_to_use_en: item.how_to_use_en || '',
      how_to_use_mm: item.how_to_use_mm || item.buyingTipMm || '',
      care_en: item.care_en || '',
      care_mm: item.care_mm || item.careTipMm || '',
      alternatives_en_str: (item.alternatives_en || []).join('\n'),
      alternatives_mm_str: (item.alternatives_mm || (item.substituteAlternativeMm ? [item.substituteAlternativeMm] : [])).join('\n'),
    });
    setIsFormOpen(true);
    if (selectedTool) {
      setSelectedTool(null);
    }
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('Are you sure you want to delete this baking tool?')) {
      const updated = toolsList.filter(item => item.id !== id);
      saveTools(updated);
      setToolsList(updated);
      if (selectedTool?.id === id) {
        setSelectedTool(null);
      }
      showToast('Tool deleted successfully');
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name_en.trim() && !formData.name_mm.trim()) return;

    const altsEnArray = formData.alternatives_en_str
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const altsMmArray = formData.alternatives_mm_str
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    let updated: ToolItem[];

    if (editingId) {
      updated = toolsList.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            name_en: formData.name_en.trim() || item.name_en,
            name_mm: formData.name_mm.trim() || item.name_mm,
            category: formData.category,
            image_emoji: formData.image_emoji.trim() || '⚖️',
            purpose_en: formData.purpose_en.trim(),
            purpose_mm: formData.purpose_mm.trim(),
            how_to_use_en: formData.how_to_use_en.trim(),
            how_to_use_mm: formData.how_to_use_mm.trim(),
            care_en: formData.care_en.trim(),
            care_mm: formData.care_mm.trim(),
            alternatives_en: altsEnArray,
            alternatives_mm: altsMmArray,
          };
        }
        return item;
      });
      showToast('Tool updated successfully');
    } else {
      const newItem: ToolItem = {
        id: 'tool_' + Date.now(),
        name_en: formData.name_en.trim() || formData.name_mm.trim(),
        name_mm: formData.name_mm.trim() || formData.name_en.trim(),
        category: formData.category,
        image_emoji: formData.image_emoji.trim() || '⚖️',
        purpose_en: formData.purpose_en.trim(),
        purpose_mm: formData.purpose_mm.trim(),
        how_to_use_en: formData.how_to_use_en.trim(),
        how_to_use_mm: formData.how_to_use_mm.trim(),
        care_en: formData.care_en.trim(),
        care_mm: formData.care_mm.trim(),
        alternatives_en: altsEnArray,
        alternatives_mm: altsMmArray,
      };
      updated = [newItem, ...toolsList];
      showToast('New tool added successfully');
    }

    saveTools(updated);
    setToolsList(updated);
    setIsFormOpen(false);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all tools to default bilingual library (15 items)?')) {
      saveTools(DEFAULT_TOOLS);
      setToolsList(DEFAULT_TOOLS as ToolItem[]);
      showToast('Default tools restored');
    }
  };

  const getCategoryLabel = (cat?: string) => {
    const found = CATEGORY_OPTIONS.find(c => c.id === cat);
    return found ? found.label : (cat || 'Baking Gear');
  };

  // Helper to extract language-appropriate text based on contentLang
  const getToolName = (item: ToolItem) => {
    if (contentLang === 'mm') {
      return item.name_mm || item.nameMm || item.name_en || item.nameEn || '';
    }
    return item.name_en || item.nameEn || item.name_mm || item.nameMm || '';
  };

  const getToolSecondaryName = (item: ToolItem) => {
    if (contentLang === 'mm') {
      return item.name_en || item.nameEn || '';
    }
    return item.name_mm || item.nameMm || '';
  };

  const getToolPurpose = (item: ToolItem) => {
    if (contentLang === 'mm') {
      return item.purpose_mm || item.descriptionMm || item.purpose_en || '';
    }
    return item.purpose_en || item.purpose_mm || item.descriptionMm || '';
  };

  const getToolHowTo = (item: ToolItem) => {
    if (contentLang === 'mm') {
      return item.how_to_use_mm || item.buyingTipMm || item.how_to_use_en || '';
    }
    return item.how_to_use_en || item.how_to_use_mm || item.buyingTipMm || '';
  };

  const getToolCare = (item: ToolItem) => {
    if (contentLang === 'mm') {
      return item.care_mm || item.careTipMm || item.care_en || 'သန့်ရှင်းစွာ အခြောက်ထားပါ';
    }
    return item.care_en || item.care_mm || 'Clean and dry thoroughly after use.';
  };

  const getToolAlternatives = (item: ToolItem) => {
    if (contentLang === 'mm') {
      return (item.alternatives_mm && item.alternatives_mm.length > 0)
        ? item.alternatives_mm
        : (item.alternatives_en || (item.substituteAlternativeMm ? [item.substituteAlternativeMm] : []));
    }
    return (item.alternatives_en && item.alternatives_en.length > 0)
      ? item.alternatives_en
      : (item.alternatives_mm || []);
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
              Baking Tools & Equipment
            </h1>
            <ContentLanguageToggle />
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Essential gear for precise measurements, mixing, oven setups, and cake decorating.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleResetDefaults}
            className="p-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 text-stone-600 dark:text-stone-300 text-xs font-semibold transition cursor-pointer"
            title="Restore default tools library"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Tool</span>
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
          placeholder="Search by English or Burmese name (e.g. Scale, ချိန်ခွင်, Oven, မီးဖို, Whisk, Spatula)..."
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

      {/* Tools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map(item => {
          const primaryName = getToolName(item);
          const secondaryName = getToolSecondaryName(item);
          const purposeText = getToolPurpose(item);
          const alternativesList = getToolAlternatives(item);
          const emoji = item.image_emoji || '⚖️';

          return (
            <div
              key={item.id}
              onClick={() => setSelectedTool(item)}
              className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 p-5 shadow-xs hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl p-1.5 bg-orange-50 dark:bg-stone-800 rounded-2xl border border-orange-100 dark:border-stone-700">
                      {emoji}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-300">
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={e => handleOpenEdit(item, e)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-stone-800 transition cursor-pointer"
                      title="Edit tool"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={e => handleDelete(item.id, e)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-stone-800 transition cursor-pointer"
                      title="Delete tool"
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
                  {purposeText}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                <span className="text-orange-600 dark:text-orange-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  View Instructions →
                </span>
                <span className="text-stone-400 dark:text-stone-500 truncate max-w-[120px]">
                  {alternativesList.length > 0 ? 'Alternative Available' : 'Kitchen Standard'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8">
          <UtensilsCrossed className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="text-stone-600 dark:text-stone-300 font-semibold text-sm">
            No matching tools found for "{searchQuery}"
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
              Add New Tool
            </button>
          </div>
        </div>
      )}

      {/* FULL DETAIL MODAL (Matching contentLang) */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-stone-900 p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-800 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-start gap-3">
                <span className="text-4xl p-2 bg-orange-50 dark:bg-stone-800 rounded-2xl border border-orange-100 dark:border-stone-700">
                  {selectedTool.image_emoji || '⚖️'}
                </span>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-300">
                    {getCategoryLabel(selectedTool.category)}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white mt-1">
                    {getToolName(selectedTool)}
                  </h3>
                  <div className="text-xs font-mono text-stone-400 dark:text-stone-500">
                    {getToolSecondaryName(selectedTool)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedTool(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
              {/* Purpose */}
              <div className="p-3.5 rounded-2xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-100 dark:border-stone-800">
                <h4 className="font-bold text-orange-950 dark:text-orange-300 mb-1 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span>{contentLang === 'mm' ? 'အသုံးဝင်ပုံနှင့် ရည်ရွယ်ချက် (Purpose)' : 'Tool Purpose & Importance'}</span>
                </h4>
                <p className="leading-relaxed text-stone-700 dark:text-stone-300">
                  {getToolPurpose(selectedTool)}
                </p>
              </div>

              {/* How to use */}
              {getToolHowTo(selectedTool) && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40">
                  <h4 className="font-bold text-amber-950 dark:text-amber-300 mb-1">
                    {contentLang === 'mm' ? 'အသုံးပြုနည်းနှင့် သတိပြုရန် (How to use)' : 'How to Use & Best Practices'}
                  </h4>
                  <p className="leading-relaxed text-stone-700 dark:text-stone-300">
                    {getToolHowTo(selectedTool)}
                  </p>
                </div>
              )}

              {/* Care & Maintenance */}
              {getToolCare(selectedTool) && (
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700">
                  <h4 className="font-bold text-stone-900 dark:text-white mb-1">
                    {contentLang === 'mm' ? 'သန့်ရှင်းထိန်းသိမ်းနည်း (Care & Maintenance)' : 'Care & Maintenance'}
                  </h4>
                  <p className="leading-relaxed text-stone-600 dark:text-stone-300">
                    {getToolCare(selectedTool)}
                  </p>
                </div>
              )}

              {/* Alternatives */}
              {getToolAlternatives(selectedTool).length > 0 && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                  <h4 className="font-bold text-emerald-950 dark:text-emerald-300 mb-1.5">
                    {contentLang === 'mm' ? 'ယာယီ အစားထိုးနိုင်သော ပစ္စည်းများ (Alternatives)' : 'Kitchen Alternatives'}
                  </h4>
                  <ul className="text-emerald-950 dark:text-emerald-200 space-y-1.5">
                    {getToolAlternatives(selectedTool).map((alt, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{alt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => handleOpenEdit(selectedTool)}
                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Tool</span>
              </button>
              <button
                onClick={() => setSelectedTool(null)}
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
                {editingId ? 'Edit Tool' : 'Add New Tool'}
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
                    {formData.image_emoji || '⚖️'}
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
                  {TOOL_EMOJIS.map(em => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setFormData({ ...formData, image_emoji: em })}
                      className="p-1.5 rounded-lg hover:bg-orange-100 dark:hover:bg-stone-800 text-base"
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
                    placeholder="e.g. Digital Scale"
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
                    placeholder="e.g. မီးဖိုချောင်ချိန်ခွင်"
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
                  <option value="measuring">Measuring & Scales</option>
                  <option value="mixing">Mixing & Whisks</option>
                  <option value="baking_pan">Baking Pans & Molds</option>
                  <option value="oven_gear">Oven & Heat Tools</option>
                  <option value="decorating">Decorating & Pastry</option>
                </select>
              </div>

              {/* Purpose */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Purpose in Baking (English)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.purpose_en}
                    onChange={e => setFormData({ ...formData, purpose_en: e.target.value })}
                    placeholder="Measures ingredients with 1g precision..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Purpose in Baking (Myanmar)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.purpose_mm}
                    onChange={e => setFormData({ ...formData, purpose_mm: e.target.value })}
                    placeholder="၁ ဂရမ်အထိ တိကျစွာ ချိန်တွယ်ပေးရန် သုံးသည်..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-orange-500"
                  />
                </div>
              </div>

              {/* How to use */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    How to Use (English)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.how_to_use_en}
                    onChange={e => setFormData({ ...formData, how_to_use_en: e.target.value })}
                    placeholder="Place bowl, press Tare to zero, add ingredients slowly..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    How to Use (Myanmar)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.how_to_use_mm}
                    onChange={e => setFormData({ ...formData, how_to_use_mm: e.target.value })}
                    placeholder="Tare ခလုတ်ကို နှိပ်၍ 0g ပြုလုပ်ပြီးမှ တိုင်းတာပါ..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Care & Maintenance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Care & Maintenance (English)
                  </label>
                  <input
                    type="text"
                    value={formData.care_en}
                    onChange={e => setFormData({ ...formData, care_en: e.target.value })}
                    placeholder="Wipe with dry cloth; do not immerse in water..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Care & Maintenance (Myanmar)
                  </label>
                  <input
                    type="text"
                    value={formData.care_mm}
                    onChange={e => setFormData({ ...formData, care_mm: e.target.value })}
                    placeholder="ရေစိုမခံပါ၊ အဝတ်ခြောက်ဖြင့် သုတ်ပါ..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Alternatives */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Alternatives (English - one per line)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.alternatives_en_str}
                    onChange={e => setFormData({ ...formData, alternatives_en_str: e.target.value })}
                    placeholder="Measuring cups and spoons..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Alternatives (Myanmar - one per line)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.alternatives_mm_str}
                    onChange={e => setFormData({ ...formData, alternatives_mm_str: e.target.value })}
                    placeholder="အတိုင်းအတာခွက်နှင့် ဇွန်းများ..."
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
                  {editingId ? 'Save Changes' : 'Add Tool'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolsPage;
