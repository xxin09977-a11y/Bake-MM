/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NavigationTab = 'home' | 'ingredients' | 'tools';

export interface IngredientItem {
  id: string;
  nameMm?: string;
  nameEn?: string;
  name_mm?: string;
  name_en?: string;
  category: 'flour' | 'leavening' | 'sugar' | 'dairy' | 'egg' | 'flavor' | string;
  categoryMm?: string;
  shortDescMm?: string;
  fullDescMm?: string;
  roleInBakingMm?: string;
  storageTipMm?: string;
  commonUsesMm?: string[];
  substitutionsMm?: string[];
  uses_mm?: string;
  uses_en?: string;
  substitutes_mm?: string[];
  substitutes_en?: string[];
  storage_mm?: string;
  storage_en?: string;
  nutrition_short?: string;
  nutrition_mm?: string;
  nutrition_en?: string;
  image_emoji?: string;
  badgeColor?: string;
  icon?: string;
}

export interface SubstitutionRule {
  id: string;
  targetIngredientMm: string;
  targetIngredientEn: string;
  replaceWithMm: string;
  ratioMm: string;
  notesMm: string;
}

export interface ToolItem {
  id: string;
  nameMm?: string;
  nameEn?: string;
  name_mm?: string;
  name_en?: string;
  category?: 'measuring' | 'mixing' | 'baking_pan' | 'decorating' | 'oven_gear' | string;
  categoryMm?: string;
  importance?: 'essential' | 'recommended' | 'advanced' | string;
  importanceMm?: string;
  descriptionMm?: string;
  buyingTipMm?: string;
  careTipMm?: string;
  substituteAlternativeMm?: string;
  purpose_mm?: string;
  purpose_en?: string;
  how_to_use_mm?: string;
  how_to_use_en?: string;
  care_mm?: string;
  care_en?: string;
  alternatives_mm?: string[];
  alternatives_en?: string[];
  image_emoji?: string;
}

export interface RecipeStep {
  stepNumber: number;
  titleMm: string;
  instructionMm: string;
  durationMinutes?: number;
  proTipMm?: string;
}

export interface Recipe {
  id: string;
  titleMm: string;
  titleEn: string;
  category: 'cake' | 'bread' | 'cookie' | 'traditional' | 'pastry';
  categoryMm: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  difficultyMm: string;
  prepTimeMinutes: number;
  bakeTimeMinutes: number;
  servings: string;
  ovenTempC: number;
  ovenTempF: number;
  descriptionMm: string;
  ingredients: {
    nameMm: string;
    amount: string;
    notesMm?: string;
  }[];
  steps: RecipeStep[];
  commonMistakesMm: string[];
}

export interface LessonModule {
  id: string;
  moduleNumber: number;
  titleMm: string;
  titleEn: string;
  subtitleMm: string;
  summaryMm: string;
  contentMm: {
    heading: string;
    paragraphs: string[];
    tips?: string[];
  }[];
  keyTakeawaysMm: string[];
  suggestedRecipeId?: string;
}

export interface BakingLogEntry {
  id: string;
  recipeName: string;
  date: string;
  ovenTemp: string;
  rating: number; // 1 to 5
  outcomeMm: string;
  notesMm: string;
}

export interface QuizQuestion {
  id: string;
  questionMm: string;
  questionEn?: string;
  optionsMm: string[];
  optionsEn?: string[];
  correctIndex: number;
  explanationMm: string;
  explanationEn?: string;
}
