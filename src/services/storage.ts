/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BakingLogEntry } from '../types';

const STORAGE_KEYS = {
  BOOKMARKS: 'bakelearn_bookmarks',
  PANTRY: 'bakelearn_pantry_items',
  OWNED_TOOLS: 'bakelearn_owned_tools',
  COMPLETED_LESSONS: 'bakelearn_completed_lessons',
  BAKING_LOGS: 'bakelearn_baking_logs',
  QUICK_NOTES: 'bakelearn_quick_notes',
} as const;

// Helper to safely read from localStorage
function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`[Storage] Failed to read ${key}:`, error);
    return defaultValue;
  }
}

// Helper to safely write to localStorage
function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[Storage] Failed to write ${key}:`, error);
  }
}

export const StorageService = {
  // Bookmarks (Recipe IDs or Ingredient IDs)
  getBookmarks(): string[] {
    return safeGet<string[]>(STORAGE_KEYS.BOOKMARKS, ['sponge-cake', 'cake-flour']);
  },
  setBookmarks(bookmarks: string[]): void {
    safeSet(STORAGE_KEYS.BOOKMARKS, bookmarks);
  },
  toggleBookmark(id: string): boolean {
    const current = this.getBookmarks();
    let updated: string[];
    let isAdded = false;
    if (current.includes(id)) {
      updated = current.filter(item => item !== id);
    } else {
      updated = [...current, id];
      isAdded = true;
    }
    this.setBookmarks(updated);
    return isAdded;
  },
  isBookmarked(id: string): boolean {
    return this.getBookmarks().includes(id);
  },

  // User's Pantry / Shopping list
  getPantryItems(): { id: string; name: string; checked: boolean; note?: string }[] {
    return safeGet(STORAGE_KEYS.PANTRY, [
      { id: '1', name: 'ကိတ်ဂျုံမှုန့် (Cake Flour)', checked: true, note: '၅၀၀ ဂရမ်' },
      { id: '2', name: 'သကြားအမှုန့် (Caster Sugar)', checked: true, note: '၂၅၀ ဂရမ်' },
      { id: '3', name: 'ဆားမပါထောပတ် (Unsalted Butter)', checked: false, note: '၂၀၀ ဂရမ်' },
      { id: '4', name: 'မုန့်ဖုတ်ပေါင်ဒါ (Baking Powder)', checked: true, note: '၁ ဘူး' },
      { id: '5', name: 'ဗနီလာအမွှေးနံ့ (Vanilla Extract)', checked: false, note: '၁ ပုလင်း' },
    ]);
  },
  setPantryItems(items: { id: string; name: string; checked: boolean; note?: string }[]): void {
    safeSet(STORAGE_KEYS.PANTRY, items);
  },

  // Kitchen Owned Tools
  getOwnedTools(): string[] {
    return safeGet<string[]>(STORAGE_KEYS.OWNED_TOOLS, [
      'digital_scale',
      'silicone_spatula',
      'whisk',
      'round_pan_8inch',
    ]);
  },
  setOwnedTools(toolIds: string[]): void {
    safeSet(STORAGE_KEYS.OWNED_TOOLS, toolIds);
  },
  toggleOwnedTool(toolId: string): void {
    const current = this.getOwnedTools();
    const updated = current.includes(toolId)
      ? current.filter(id => id !== toolId)
      : [...current, toolId];
    this.setOwnedTools(updated);
  },

  // Completed Lessons
  getCompletedLessons(): string[] {
    return safeGet<string[]>(STORAGE_KEYS.COMPLETED_LESSONS, ['lesson_1']);
  },
  setCompletedLessons(lessons: string[]): void {
    safeSet(STORAGE_KEYS.COMPLETED_LESSONS, lessons);
  },
  toggleLessonCompletion(lessonId: string): boolean {
    const current = this.getCompletedLessons();
    let updated: string[];
    let completed = false;
    if (current.includes(lessonId)) {
      updated = current.filter(id => id !== lessonId);
    } else {
      updated = [...current, lessonId];
      completed = true;
    }
    this.setCompletedLessons(updated);
    return completed;
  },

  // Baking Log / Diary entries
  getBakingLogs(): BakingLogEntry[] {
    return safeGet<BakingLogEntry[]>(STORAGE_KEYS.BAKING_LOGS, [
      {
        id: 'sample_log_1',
        recipeName: 'အခြေခံ စပေါန့်ခ်ျကိတ် (Basic Sponge Cake)',
        date: '2026-10-10',
        ovenTemp: '160°C (အောက်မီး/အပေါ်မီး)',
        rating: 5,
        outcomeMm: 'အရမ်းနူးညံ့ပြီး စိုပြေတယ်! အလယ်မကျွံဘဲ မျက်နှာပြင်လှလှလေး ဖောင်းတက်လာတယ်။',
        notesMm: 'ကြက်ဥနဲ့ သကြားကို ဖဲကြိုးပုံစံ (Ribbon stage) ရောက်အောင် ၇ မိနစ်တိတိ မွှေခဲ့တယ်။',
      },
    ]);
  },
  setBakingLogs(logs: BakingLogEntry[]): void {
    safeSet(STORAGE_KEYS.BAKING_LOGS, logs);
  },
  addBakingLog(entry: Omit<BakingLogEntry, 'id'>): void {
    const logs = this.getBakingLogs();
    const newEntry: BakingLogEntry = {
      ...entry,
      id: 'log_' + Date.now(),
    };
    this.setBakingLogs([newEntry, ...logs]);
  },
  deleteBakingLog(id: string): void {
    const logs = this.getBakingLogs().filter(log => log.id !== id);
    this.setBakingLogs(logs);
  },

  // Quick Notes
  getQuickNotes(): string {
    return safeGet<string>(
      STORAGE_KEYS.QUICK_NOTES,
      'မှတ်စု - ကိတ်ဖုတ်သည့်အခါ ကြက်ဥနှင့် ထောပတ်ကို အခန်းအပူချိန် (Room Temperature) ဖြစ်အောင် အနည်းဆုံး မိနစ် ၃၀ ကြိုထုတ်ထားပါ!'
    );
  },
  setQuickNotes(note: string): void {
    safeSet(STORAGE_KEYS.QUICK_NOTES, note);
  },
};
