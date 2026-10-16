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
    <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-200 w-full max-w-full overflow-hidden">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-black dark:text-white">
              Baking Tools & Equipment
            </h1>
            <span className="px-2 py-0.5 rounded-sm text-[11px] font-mono font-bold uppercase tracking-wider bg-[#F5F5F5] dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#262626] text-[#737373] dark:text-[#A3A3A3]">
              {toolsList.length} Tools
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#737373] mt-1 break-words">
            Essential gear for precise measurements, mixing, oven setups, and cake decorating.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={handleResetDefaults}
            className="p-2 sm:p-2.5 rounded-md border border-[#E5E5E5] dark:border-[#262626] bg-transparent hover:bg-[#F5F5F5] dark:hover:bg-[#171717] text-black dark:text-white text-xs font-semibold transition-colors cursor-pointer"
            title="Restore default tools library"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-md bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-mono font-bold uppercase tracking-wider transition-colors active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Tool</span>
          </button>
        </div>
      </div>

      {/* Cohesive Sticky Header Section: Search & Category Tabs */}
      <div className="sticky top-14 sm:top-16 z-30 bg-[#FAFAFA]/95 dark:bg-[#000000]/95 backdrop-blur-md pt-2 pb-3.5 space-y-2.5 border-b border-[#E5E5E5] dark:border-[#262626] -mx-3.5 sm:-mx-6 lg:-mx-8 px-3.5 sm:px-6 lg:px-8">
        {/* Search Bar matching both name_en and name_mm */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#737373]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by English or Burmese name (e.g. Scale, ချိန်ခွင်, Oven, မီးဖို, Whisk, Spatula)..."
            className="w-full pl-10 pr-9 py-2.5 rounded-md border border-black dark:border-[#404040] bg-white dark:bg-[#171717] text-xs sm:text-sm text-black dark:text-white placeholder-[#737373] focus:outline-hidden"
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

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {CATEGORY_OPTIONS.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                  : 'border border-[#E5E5E5] dark:border-[#262626] bg-white dark:bg-[#111111] text-[#737373] hover:text-black dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Cards Grid - Responsive Columns (1 col mobile, 2 col tablet) with 16px Padding & Clean Dividers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
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
              className="rounded-lg bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#262626] p-4 hover:border-black dark:hover:border-white transition-all duration-150 cursor-pointer flex flex-col justify-between group min-w-0"
            >
              <div>
                {/* Card Header Divider with Emoji, Category, and Action Buttons */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#F0F0F0] dark:border-[#1F1F1F]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-8 h-8 rounded-md bg-[#F5F5F5] dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#262626] flex items-center justify-center text-base shrink-0">
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
                      className="p-1.5 rounded-md text-[#737373] hover:text-black dark:hover:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#1F1F1F] transition-colors cursor-pointer"
                      title="Edit tool"
                      aria-label={`Edit ${primaryName}`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={e => handleDelete(item.id, e)}
                      className="p-1.5 rounded-md text-[#737373] hover:text-black dark:hover:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#1F1F1F] transition-colors cursor-pointer"
                      title="Delete tool"
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
                    {purposeText}
                  </p>
                </div>
              </div>

              {/* Card Footer Divider */}
              <div className="mt-3.5 pt-2.5 border-t border-[#E5E5E5] dark:border-[#262626] flex items-center justify-between text-[11px] font-mono text-[#737373] dark:text-[#A3A3A3]">
                <span className="text-black dark:text-white font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 uppercase tracking-wider">
                  View Guide →
                </span>
                <span className="truncate max-w-[130px] uppercase text-[10px] font-bold">
                  {alternativesList.length > 0 ? `${alternativesList.length} Alternatives` : 'Standard Gear'}
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
              className="px-3 py-1.5 rounded-md border border-[#E5E5E5] dark:border-[#262626] bg-white dark:bg-[#111111] text-black dark:text-white text-xs font-bold"
            >
              Show All
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-3 py-1.5 rounded-md bg-black text-white dark:bg-white dark:text-black text-xs font-bold"
            >
              Add New Tool
            </button>
          </div>
        </div>
      )}

      {/* FULL DETAIL MODAL (Matching contentLang) */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-[#000000] p-6 sm:p-7 border border-black dark:border-[#262626] animate-in fade-in duration-150 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#E5E5E5] dark:border-[#262626]">
              <div className="flex items-start gap-3">
                <span className="text-3xl p-2 bg-[#F5F5F5] dark:bg-[#171717] rounded-md border border-[#E5E5E5] dark:border-[#262626]">
                  {selectedTool.image_emoji || '⚖️'}
                </span>
                <div>
                  <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono font-bold uppercase tracking-wider bg-[#F5F5F5] dark:bg-[#262626] text-black dark:text-white">
                    {getCategoryLabel(selectedTool.category)}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-black dark:text-white mt-1">
                    {getToolName(selectedTool)}
                  </h3>
                  <div className="text-xs font-mono text-[#737373]">
                    {getToolSecondaryName(selectedTool)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedTool(null)}
                className="p-1.5 rounded-md text-[#737373] hover:text-black dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-black dark:text-white">
              {/* Purpose */}
              <div className="p-3.5 rounded-md bg-[#F5F5F5] dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#262626]">
                <h4 className="font-bold text-black dark:text-white mb-1 flex items-center gap-1.5 uppercase font-mono text-xs">
                  <Info className="w-4 h-4 text-black dark:text-white" />
                  <span>{contentLang === 'mm' ? 'အသုံးဝင်ပုံနှင့် ရည်ရွယ်ချက် (Purpose)' : 'Tool Purpose & Importance'}</span>
                </h4>
                <p className="leading-relaxed text-[#525252] dark:text-[#A3A3A3]">
                  {getToolPurpose(selectedTool)}
                </p>
              </div>

              {/* How to use */}
              {getToolHowTo(selectedTool) && (
                <div className="p-3.5 rounded-md bg-[#F5F5F5] dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#262626]">
                  <h4 className="font-bold text-black dark:text-white mb-1 uppercase font-mono text-xs">
                    {contentLang === 'mm' ? 'အသုံးပြုနည်းနှင့် သတိပြုရန် (How to use)' : 'How to Use & Best Practices'}
                  </h4>
                  <p className="leading-relaxed text-[#525252] dark:text-[#A3A3A3]">
                    {getToolHowTo(selectedTool)}
                  </p>
                </div>
              )}

              {/* Care & Maintenance */}
              {getToolCare(selectedTool) && (
                <div className="p-3.5 rounded-md bg-[#F5F5F5] dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#262626]">
                  <h4 className="font-bold text-black dark:text-white mb-1 uppercase font-mono text-xs">
                    {contentLang === 'mm' ? 'သန့်ရှင်းထိန်းသိမ်းနည်း (Care & Maintenance)' : 'Care & Maintenance'}
                  </h4>
                  <p className="leading-relaxed text-[#525252] dark:text-[#A3A3A3]">
                    {getToolCare(selectedTool)}
                  </p>
                </div>
              )}

              {/* Alternatives */}
              {getToolAlternatives(selectedTool).length > 0 && (
                <div className="p-3.5 rounded-md bg-[#F5F5F5] dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#262626]">
                  <h4 className="font-bold text-black dark:text-white mb-1.5 uppercase font-mono text-xs">
                    {contentLang === 'mm' ? 'ယာယီ အစားထိုးနိုင်သော ပစ္စည်းများ (Alternatives)' : 'Kitchen Alternatives'}
                  </h4>
                  <ul className="text-[#525252] dark:text-[#A3A3A3] space-y-1">
                    {getToolAlternatives(selectedTool).map((alt, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="font-bold text-black dark:text-white">•</span>
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
                className="flex-1 py-2.5 rounded-md bg-black text-white dark:bg-white dark:text-black text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider font-mono"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Tool</span>
              </button>
              <button
                onClick={() => setSelectedTool(null)}
                className="px-4 py-2.5 rounded-md border border-[#E5E5E5] dark:border-[#262626] bg-transparent text-black dark:text-white text-xs font-bold transition cursor-pointer uppercase tracking-wider font-mono"
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
                      className="p-1.5 rounded-md hover:bg-[#F5F5F5] dark:hover:bg-[#171717] text-base"
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
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-black dark:focus:border-white"
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
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-black dark:focus:border-white"
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
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-black dark:focus:border-white"
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
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-black dark:focus:border-white"
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
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-black dark:focus:border-white"
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
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-black dark:focus:border-white"
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
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-black dark:focus:border-white"
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
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-black dark:focus:border-white"
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
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-black dark:focus:border-white"
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
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:bg-white focus:border-black dark:focus:border-white"
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
                  className="px-5 py-2 rounded-md bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-bold transition cursor-pointer uppercase tracking-wider font-mono text-xs"
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
