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
      const defaultItem = DEFAULT_INGREDIENTS.find(d => d.id === item.id);
      if (!defaultItem) return item;

      let itemModified = false;
      const patched = { ...item };

      // Ensure _mm fields exist
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

      // Ensure _en fields exist
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
      const defaultItem = DEFAULT_TOOLS.find(d => d.id === item.id);
      if (!defaultItem) return item;

      let itemModified = false;
      const patched = { ...item };

      // Ensure _mm fields
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

      // Ensure _en fields
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

export default {
  getIngredients,
  saveIngredients,
  getTools,
  saveTools,
  seedIfEmpty,
  initSettings,
  runBilingualMigration,
};
