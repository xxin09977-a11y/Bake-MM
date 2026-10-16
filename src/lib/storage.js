/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { STORAGE_KEYS, DEFAULT_INGREDIENTS, DEFAULT_TOOLS } from '../data/schema.js';

/**
 * Safely parse JSON from localStorage
 * @param {string} key 
 * @param {any} fallback 
 * @returns {any}
 */
export function safeGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`[storage.js] Error parsing key "${key}":`, error);
    return fallback;
  }
}

/**
 * Safely stringify and write to localStorage
 * @param {string} key 
 * @param {any} value 
 */
export function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[storage.js] Error saving key "${key}":`, error);
  }
}

/**
 * Ensure app_settings.contentLang is initialized (default 'en')
 */
export function initSettings() {
  const currentSettings = safeGet(STORAGE_KEYS.APP_SETTINGS, null);
  if (!currentSettings || typeof currentSettings !== 'object' || !currentSettings.contentLang) {
    const defaultSettings = currentSettings && typeof currentSettings === 'object'
      ? { ...currentSettings, contentLang: 'en' }
      : { contentLang: 'en' };
    safeSet(STORAGE_KEYS.APP_SETTINGS, defaultSettings);
  }
}

/**
 * Migration helper:
 * On app load, if existing localStorage items lack _mm or _en fields,
 * merge with default bilingual terms without overwriting user customizations.
 */
export function runBilingualMigration() {
  // 1. Ingredients migration
  const storedIngredients = safeGet(STORAGE_KEYS.BAKE_INGREDIENTS, null);
  if (Array.isArray(storedIngredients) && storedIngredients.length > 0) {
    let hasChanges = false;
    const migrated = storedIngredients.map(item => {
      const defaultItem = DEFAULT_INGREDIENTS.find(d => 
        d.id === item.id || 
        (item.name_en && d.name_en && d.name_en.toLowerCase() === item.name_en.toLowerCase()) ||
        (item.name && d.name_en && d.name_en.toLowerCase() === item.name.toLowerCase()) ||
        (item.nameEn && d.name_en && d.name_en.toLowerCase() === item.nameEn.toLowerCase()) ||
        (item.nameMm && d.name_mm && d.name_mm === item.nameMm) ||
        (item.name_mm && d.name_mm && d.name_mm === item.name_mm)
      );

      let itemModified = false;
      const patched = { ...item };

      // Normalize legacy field keys
      if (!patched.name_en && (patched.name || patched.nameEn)) {
        patched.name_en = patched.name_en || patched.name || patched.nameEn;
        itemModified = true;
      }
      if (!patched.name_mm && patched.nameMm) {
        patched.name_mm = patched.nameMm;
        itemModified = true;
      }
      if (!patched.uses_en && (patched.uses || patched.usesEn)) {
        patched.uses_en = patched.uses || patched.usesEn;
        itemModified = true;
      }
      if (!patched.uses_mm && patched.usesMm) {
        patched.uses_mm = patched.usesMm;
        itemModified = true;
      }

      // Ensure _mm fields exist from defaultItem
      if (defaultItem) {
        if (!patched.name_mm && defaultItem.name_mm) {
          patched.name_mm = defaultItem.name_mm;
          itemModified = true;
        }
        if (!patched.uses_mm && defaultItem.uses_mm) {
          patched.uses_mm = defaultItem.uses_mm;
          itemModified = true;
        }
        if ((!patched.substitutes_mm || patched.substitutes_mm.length === 0) && defaultItem.substitutes_mm) {
          patched.substitutes_mm = defaultItem.substitutes_mm;
          itemModified = true;
        }
        if (!patched.storage_mm && defaultItem.storage_mm) {
          patched.storage_mm = defaultItem.storage_mm;
          itemModified = true;
        }
        if (!patched.nutrition_mm && (defaultItem.nutrition_mm || defaultItem.nutrition_short)) {
          patched.nutrition_mm = defaultItem.nutrition_mm || defaultItem.nutrition_short;
          itemModified = true;
        }

        // Ensure _en fields exist from defaultItem
        if (!patched.name_en && defaultItem.name_en) {
          patched.name_en = defaultItem.name_en;
          itemModified = true;
        }
        if (!patched.uses_en && defaultItem.uses_en) {
          patched.uses_en = defaultItem.uses_en;
          itemModified = true;
        }
        if ((!patched.substitutes_en || patched.substitutes_en.length === 0) && defaultItem.substitutes_en) {
          patched.substitutes_en = defaultItem.substitutes_en;
          itemModified = true;
        }
        if (!patched.storage_en && defaultItem.storage_en) {
          patched.storage_en = defaultItem.storage_en;
          itemModified = true;
        }
        if (!patched.nutrition_en && defaultItem.nutrition_en) {
          patched.nutrition_en = defaultItem.nutrition_en;
          itemModified = true;
        }
      }

      // Fallback for custom user items
      if (!patched.name_mm) {
        patched.name_mm = patched.name_en || patched.name || 'မုန့်ဖုတ်ပါဝင်ပစ္စည်း';
        itemModified = true;
      }
      if (!patched.uses_mm) {
        patched.uses_mm = patched.uses_en || 'မုန့်ဖုတ်ရာတွင် သုံးသည်';
        itemModified = true;
      }
      if (!patched.substitutes_mm) {
        patched.substitutes_mm = patched.substitutes_en || [];
        itemModified = true;
      }
      if (!patched.storage_mm) {
        patched.storage_mm = patched.storage_en || 'အေးမြခြောက်သွေ့သောနေရာတွင် ထားပါ';
        itemModified = true;
      }
      if (!patched.nutrition_mm) {
        patched.nutrition_mm = patched.nutrition_en || '';
        itemModified = true;
      }

      if (itemModified) hasChanges = true;
      return patched;
    });

    if (hasChanges) {
      safeSet(STORAGE_KEYS.BAKE_INGREDIENTS, migrated);
    }
  }

  // 2. Tools migration
  const storedTools = safeGet(STORAGE_KEYS.BAKE_TOOLS, null);
  if (Array.isArray(storedTools) && storedTools.length > 0) {
    let hasChanges = false;
    const migrated = storedTools.map(item => {
      const defaultItem = DEFAULT_TOOLS.find(d => 
        d.id === item.id || 
        (item.name_en && d.name_en && d.name_en.toLowerCase() === item.name_en.toLowerCase()) ||
        (item.name && d.name_en && d.name_en.toLowerCase() === item.name.toLowerCase()) ||
        (item.nameEn && d.name_en && d.name_en.toLowerCase() === item.nameEn.toLowerCase()) ||
        (item.nameMm && d.name_mm && d.name_mm === item.nameMm) ||
        (item.name_mm && d.name_mm && d.name_mm === item.name_mm)
      );

      let itemModified = false;
      const patched = { ...item };

      // Normalize legacy field keys
      if (!patched.name_en && (patched.name || patched.nameEn)) {
        patched.name_en = patched.name_en || patched.name || patched.nameEn;
        itemModified = true;
      }
      if (!patched.name_mm && patched.nameMm) {
        patched.name_mm = patched.nameMm;
        itemModified = true;
      }
      if (!patched.purpose_en && (patched.purpose || patched.purposeEn)) {
        patched.purpose_en = patched.purpose || patched.purposeEn;
        itemModified = true;
      }
      if (!patched.purpose_mm && patched.purposeMm) {
        patched.purpose_mm = patched.purposeMm;
        itemModified = true;
      }

      // Ensure _mm fields from defaultItem
      if (defaultItem) {
        if (!patched.name_mm && defaultItem.name_mm) {
          patched.name_mm = defaultItem.name_mm;
          itemModified = true;
        }
        if (!patched.purpose_mm && defaultItem.purpose_mm) {
          patched.purpose_mm = defaultItem.purpose_mm;
          itemModified = true;
        }
        if (!patched.how_to_use_mm && defaultItem.how_to_use_mm) {
          patched.how_to_use_mm = defaultItem.how_to_use_mm;
          itemModified = true;
        }
        if (!patched.care_mm && defaultItem.care_mm) {
          patched.care_mm = defaultItem.care_mm;
          itemModified = true;
        }
        if ((!patched.alternatives_mm || patched.alternatives_mm.length === 0) && defaultItem.alternatives_mm) {
          patched.alternatives_mm = defaultItem.alternatives_mm;
          itemModified = true;
        }

        // Ensure _en fields from defaultItem
        if (!patched.name_en && defaultItem.name_en) {
          patched.name_en = defaultItem.name_en;
          itemModified = true;
        }
        if (!patched.purpose_en && defaultItem.purpose_en) {
          patched.purpose_en = defaultItem.purpose_en;
          itemModified = true;
        }
        if (!patched.how_to_use_en && defaultItem.how_to_use_en) {
          patched.how_to_use_en = defaultItem.how_to_use_en;
          itemModified = true;
        }
        if (!patched.care_en && defaultItem.care_en) {
          patched.care_en = defaultItem.care_en;
          itemModified = true;
        }
        if ((!patched.alternatives_en || patched.alternatives_en.length === 0) && defaultItem.alternatives_en) {
          patched.alternatives_en = defaultItem.alternatives_en;
          itemModified = true;
        }
      }

      // Fallback for custom user tools
      if (!patched.name_mm) {
        patched.name_mm = patched.name_en || patched.name || 'မုန့်ဖုတ်ကိရိယာ';
        itemModified = true;
      }
      if (!patched.purpose_mm) {
        patched.purpose_mm = patched.purpose_en || 'မုန့်ဖုတ်ရာတွင် အသုံးပြုရန်';
        itemModified = true;
      }
      if (!patched.how_to_use_mm) {
        patched.how_to_use_mm = patched.how_to_use_en || 'သန့်ရှင်းစွာ အသုံးပြုပါ';
        itemModified = true;
      }
      if (!patched.care_mm) {
        patched.care_mm = patched.care_en || 'ဆေးကြောပြီး ခြောက်သွေ့အောင်ထားပါ';
        itemModified = true;
      }
      if (!patched.alternatives_mm) {
        patched.alternatives_mm = patched.alternatives_en || [];
        itemModified = true;
      }

      if (itemModified) hasChanges = true;
      return patched;
    });

    if (hasChanges) {
      safeSet(STORAGE_KEYS.BAKE_TOOLS, migrated);
    }
  }
}

/**
 * Seed default data to localStorage if empty or uninitialized
 */
export function seedIfEmpty() {
  initSettings();

  const currentIngredients = safeGet(STORAGE_KEYS.BAKE_INGREDIENTS, null);
  if (!currentIngredients || !Array.isArray(currentIngredients) || currentIngredients.length < DEFAULT_INGREDIENTS.length) {
    safeSet(STORAGE_KEYS.BAKE_INGREDIENTS, DEFAULT_INGREDIENTS);
  } else {
    runBilingualMigration();
  }

  const currentTools = safeGet(STORAGE_KEYS.BAKE_TOOLS, null);
  if (!currentTools || !Array.isArray(currentTools) || currentTools.length < DEFAULT_TOOLS.length) {
    safeSet(STORAGE_KEYS.BAKE_TOOLS, DEFAULT_TOOLS);
  } else {
    runBilingualMigration();
  }
}

/**
 * Get all ingredients from localStorage (runs seedIfEmpty if empty)
 * @returns {Array<any>} List of ingredients
 */
export function getIngredients() {
  const items = safeGet(STORAGE_KEYS.BAKE_INGREDIENTS, null);
  if (!items || !Array.isArray(items) || items.length < DEFAULT_INGREDIENTS.length) {
    seedIfEmpty();
    return safeGet(STORAGE_KEYS.BAKE_INGREDIENTS, DEFAULT_INGREDIENTS);
  }
  return items;
}

/**
 * Save ingredients array to localStorage
 * @param {Array<any>} ingredients 
 */
export function saveIngredients(ingredients) {
  safeSet(STORAGE_KEYS.BAKE_INGREDIENTS, Array.isArray(ingredients) ? ingredients : []);
}

/**
 * Get all baking tools from localStorage (runs seedIfEmpty if empty)
 * @returns {Array<any>} List of tools
 */
export function getTools() {
  const items = safeGet(STORAGE_KEYS.BAKE_TOOLS, null);
  if (!items || !Array.isArray(items) || items.length < DEFAULT_TOOLS.length) {
    seedIfEmpty();
    return safeGet(STORAGE_KEYS.BAKE_TOOLS, DEFAULT_TOOLS);
  }
  return items;
}

/**
 * Save tools array to localStorage
 * @param {Array<any>} tools 
 */
export function saveTools(tools) {
  safeSet(STORAGE_KEYS.BAKE_TOOLS, Array.isArray(tools) ? tools : []);
}

// Re-export STORAGE_KEYS with extended app keys
export const APP_STORAGE_KEYS = {
  ...STORAGE_KEYS,
  BAKE_LESSONS_COMPLETED: 'bake_lessons_completed',
  BAKE_BOOKMARKS: 'bake_bookmarks',
  BAKE_OWNED_TOOLS: 'bake_owned_tools',
  BAKE_NOTES: 'bake_notes',
};
export { APP_STORAGE_KEYS as STORAGE_KEYS };

/**
 * Get completed lesson IDs
 * @returns {string[]}
 */
export function getCompletedLessons() {
  return safeGet(APP_STORAGE_KEYS.BAKE_LESSONS_COMPLETED, []);
}

/**
 * Toggle lesson completed state
 * @param {string} id 
 * @returns {string[]}
 */
export function toggleLessonCompleted(id) {
  const current = getCompletedLessons();
  const updated = current.includes(id)
    ? current.filter(item => item !== id)
    : [...current, id];
  safeSet(APP_STORAGE_KEYS.BAKE_LESSONS_COMPLETED, updated);
  return updated;
}

/**
 * Get bookmarked recipe/item IDs
 * @returns {string[]}
 */
export function getBookmarks() {
  return safeGet(APP_STORAGE_KEYS.BAKE_BOOKMARKS, []);
}

/**
 * Toggle bookmark state
 * @param {string} id 
 * @returns {string[]}
 */
export function toggleBookmark(id) {
  const current = getBookmarks();
  const updated = current.includes(id)
    ? current.filter(item => item !== id)
    : [...current, id];
  safeSet(APP_STORAGE_KEYS.BAKE_BOOKMARKS, updated);
  return updated;
}

/**
 * Get kitchen owned tool IDs
 * @returns {string[]}
 */
export function getOwnedTools() {
  return safeGet(APP_STORAGE_KEYS.BAKE_OWNED_TOOLS, ['digital-scale', 'whisk', 'spatula']);
}

/**
 * Toggle owned tool state
 * @param {string} id 
 * @returns {string[]}
 */
export function toggleOwnedTool(id) {
  const current = getOwnedTools();
  const updated = current.includes(id)
    ? current.filter(item => item !== id)
    : [...current, id];
  safeSet(APP_STORAGE_KEYS.BAKE_OWNED_TOOLS, updated);
  return updated;
}

export default {
  getIngredients,
  saveIngredients,
  getTools,
  saveTools,
  seedIfEmpty,
  initSettings,
  runBilingualMigration,
  getCompletedLessons,
  toggleLessonCompleted,
  getBookmarks,
  toggleBookmark,
  getOwnedTools,
  toggleOwnedTool,
  STORAGE_KEYS: APP_STORAGE_KEYS,
};

