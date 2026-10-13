/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Trash2, 
  Sparkles, 
  Bot, 
  User, 
  RotateCcw,
  Copy,
  Check,
  Search,
  BookOpen
} from 'lucide-react';
import { getIngredients, getTools } from '../lib/storage.js';
import { useContentLanguage } from '../context/LanguageContext';
import { ContentLanguageToggle } from './ContentLanguageToggle';

const CHAT_STORAGE_KEY = 'bake_chat_history';

/**
 * Find matched ingredient from text
 */
function findMatchedIngredient(text, ingredients) {
  const normalized = text.toLowerCase().trim();

  // Keyword to ID / Name mapping
  const keywordMap = [
    { keys: ['ကိတ်မုန့်ဂျုံ', 'ကိတ်ဂျုံ', 'cake flour'], id: 'cake-flour' },
    { keys: ['ပေါင်မုန့်ဂျုံ', 'bread flour'], id: 'bread-flour' },
    { keys: ['ဂျုံမှုန့်', 'အိမ်သုံးဂျုံ', 'all purpose', 'plain flour', 'all-purpose', 'ဂျုံ'], id: 'all-purpose-flour' },
    { keys: ['ပြောင်းဖူးကစီ', 'cornstarch', 'ကစီ'], id: 'cornstarch' },
    { keys: ['ဘိတ်ကင်ပေါင်ဒါ', 'မုန့်ဖုတ်ပေါင်ဒါ', 'baking powder', 'ပေါင်ဒါ'], id: 'baking-powder' },
    { keys: ['ဘိတ်ကင်ဆိုဒါ', 'မုန့်ဖုတ်ဆိုဒါ', 'baking soda', 'ဆိုဒါ'], id: 'baking-soda' },
    { keys: ['အခြောက်တဆေး', 'တဆေး', 'yeast', 'instant yeast'], id: 'instant-yeast' },
    { keys: ['ခရင်မ်အော့ဖ်တာတာ', 'cream of tartar', 'တာတာ'], id: 'cream-of-tartar' },
    { keys: ['သကြားဖြူ', 'သကြားကြမ်း', 'granulated sugar', 'white sugar'], id: 'granulated-sugar' },
    { keys: ['သကြားနု', 'ကာစတာသကြား', 'caster sugar', 'superfine'], id: 'caster-sugar' },
    { keys: ['သကြားညို', 'brown sugar'], id: 'brown-sugar' },
    { keys: ['အိုင်စင်းသကြား', 'အိုင်စင်း', 'icing sugar', 'powdered sugar'], id: 'icing-sugar' },
    { keys: ['ဆားမပါထောပတ်', 'unsalted butter'], id: 'unsalted-butter' },
    { keys: ['ဆားပါထောပတ်', 'salted butter'], id: 'salted-butter' },
    { keys: ['ထောပတ်', 'butter'], id: 'unsalted-butter' },
    { keys: ['ဟင်းသီးဟင်းရွက်ဆီ', 'ဆီ', 'vegetable oil', 'canola oil', 'oil'], id: 'vegetable-oil' },
    { keys: ['နို့စိမ်း', 'နို့ငွေ့', 'evaporated milk'], id: 'evaporated-milk' },
    { keys: ['နို့ဆီ', 'condensed milk'], id: 'condensed-milk' },
    { keys: ['ဝှစ်ပင်းခရင်မ်', 'whipping cream', 'heavy cream', 'ခရင်မ်'], id: 'whipping-cream' },
    { keys: ['နို့', 'နွားနို့', 'fresh milk', 'whole milk', 'milk'], id: 'fresh-milk' },
    { keys: ['ကြက်ဥ', 'eggs', 'egg'], id: 'fresh-eggs' },
    { keys: ['ဗနီလာ', 'vanilla', 'vanilla extract'], id: 'vanilla-extract' },
    { keys: ['ဆား', 'salt', 'table salt'], id: 'table-salt' },
    { keys: ['ချောကလက်', 'chocolate', 'chocolate chips'], id: 'dark-chocolate' },
    { keys: ['ကိုကိုး', 'ကိုကိုးမှုန့်', 'cocoa', 'cocoa powder'], id: 'cocoa-powder' },
    { keys: ['အုန်းနို့', 'coconut milk'], id: 'coconut-milk' },
  ];

  for (const item of keywordMap) {
    if (item.keys.some(k => normalized.includes(k))) {
      const match = ingredients.find(ing => ing.id === item.id);
      if (match) return match;
    }
  }

  // Fallback to name search
  return ingredients.find(ing => {
    const mm = (ing.name_mm || ing.nameMm || '').toLowerCase();
    const en = (ing.name_en || ing.nameEn || '').toLowerCase();
    return (mm && normalized.includes(mm)) || (en && normalized.includes(en));
  });
}

/**
 * Find matched tool from text
 */
function findMatchedTool(text, tools) {
  const normalized = text.toLowerCase().trim();

  const keywordMap = [
    { keys: ['ဖုတ်စက်', 'မုန့်ဖုတ်မီးဖို', 'မီးဖို', 'oven', 'baking oven'], id: 'baking-oven' },
    { keys: ['လက်နှိပ်စက်', 'လက်ကိုင်မစ်ဆာ', 'hand mixer', 'electric mixer', 'မစ်ဆာ'], id: 'hand-mixer' },
    { keys: ['မုန့်ဖုတ်ဗန်း', 'ကိတ်မုန့်ဗန်း', 'ဗန်း', 'cake tin', 'baking pan', 'pan'], id: 'cake-pan' },
    { keys: ['လက်ကိုင်မွှေတံ', 'မွှေတံ', 'whisk', 'balloon whisk'], id: 'balloon-whisk' },
    { keys: ['စီလီကွန်ယောက်မ', 'ယောက်မပြား', 'ယောက်မ', 'spatula', 'silicone spatula'], id: 'silicone-spatula' },
    { keys: ['အတိုင်းအတာခွက်', 'တိုင်းခွက်', 'measuring cup', 'measuring cups', 'ခွက်'], id: 'measuring-cups' },
    { keys: ['အတိုင်းအတာဇွန်း', 'တိုင်းဇွန်း', 'measuring spoon', 'measuring spoons', 'ဇွန်း'], id: 'measuring-spoons' },
    { keys: ['မီးဖိုချောင်ချိန်ခွင်', 'ချိန်ခွင်', 'scale', 'digital scale'], id: 'kitchen-scale' },
    { keys: ['အပူချိန်တိုင်း', 'သာမိုမီတာ', 'thermometer', 'oven thermometer'], id: 'oven-thermometer' },
    { keys: ['အအေးခံဇကာ', 'ဇကာ', 'cooling rack', 'wire rack'], id: 'cooling-rack' },
    { keys: ['မုန့်ဖုတ်စက္ကူ', 'စက္ကူ', 'parchment paper', 'parchment'], id: 'parchment-paper' },
    { keys: ['ဂျုံစစ်ဇကာ', 'ဂျုံစစ်', 'sifter', 'flour sifter'], id: 'flour-sifter' },
    { keys: ['ခရင်မ်ညှစ်အိတ်', 'ညှစ်အိတ်', 'piping bag', 'piping tips', 'ခေါင်း'], id: 'piping-bag-tips' },
    { keys: ['စတန်းမစ်ဆာ', 'စက်ကြီး', 'stand mixer'], id: 'stand-mixer' },
    { keys: ['ဒလိမ့်တုံး', 'rolling pin'], id: 'rolling-pin' },
  ];

  for (const item of keywordMap) {
    if (item.keys.some(k => normalized.includes(k))) {
      const match = tools.find(t => t.id === item.id);
      if (match) return match;
    }
  }

  return tools.find(t => {
    const mm = (t.name_mm || t.nameMm || '').toLowerCase();
    const en = (t.name_en || t.nameEn || '').toLowerCase();
    return (mm && normalized.includes(mm)) || (en && normalized.includes(en));
  });
}

/**
 * Local Intent Matching Engine (100% Offline / No API)
 * Replies in language specified by contentLang ('en' or 'mm')
 */
function matchLocalIntent(userMessage, contentLang = 'en') {
  const text = userMessage.toLowerCase().trim();
  const ingredients = getIngredients();
  const tools = getTools();

  const matchedIngredient = findMatchedIngredient(text, ingredients);
  const matchedTool = findMatchedTool(text, tools);

  // Check explicit demo intents first:
  // 1. Flour comparison (ဂျုံ, ဂျုံမှုန့် vs ကိတ်မုန့်ဂျုံ, or flour differences)
  const isFlourComparison = 
    text === 'ဂျုံ' || 
    text === 'ဂျုံမှုန့်' || 
    text === 'flour' || 
    text === 'flour comparison' ||
    (text.includes('ဂျုံ') && (text.includes('ကွာခြား') || text.includes('ဘာကွာ') || text.includes('ဘယ်လိုကွာ') || text.includes('အမျိုးအစား') || text.includes('ကိတ်ဂျုံ') || text.includes('နှိုင်းယှဉ်'))) ||
    (text.includes('flour') && (text.includes('diff') || text.includes('vs') || text.includes('compare') || text.includes('cake flour')));

  if (isFlourComparison) {
    if (contentLang === 'mm') {
      return {
        text: `မင်္ဂလာပါရှင်! 🌾🥣 **ဂျုံမှုန့် (All-Purpose Flour) နှင့် ကိတ်မုန့်ဂျုံ (Cake Flour)** တို့၏ အဓိက ကွာခြားချက်များမှာ အောက်ပါအတိုင်း ဖြစ်ပါတယ်ရှင် -

🌾 **၁။ ဂျုံမှုန့် / အိမ်သုံးဂျုံ (All-Purpose Flour):**
• **ပရိုတင်း / Gluten:** ၁၀-၁၂% (အလယ်အလတ် Gluten)
• **အသုံးပြုပုံ:** ကွတ်ကီး၊ ပန်ကိတ်၊ မာဖင်၊ ပေါင်မုန့်နှင့် ရိုးရိုးကိတ်များအတွက် စွယ်စုံသုံးနိုင်ပါသည်။ မုန့်သား တည်ဆောက်ပုံကို ပိုမိုကျစ်လျစ်ခိုင်မာစေပါသည်။

🥣 **၂။ ကိတ်မုန့်ဂျုံ (Cake Flour):**
• **ပရိုတင်း / Gluten:** ၇-၉% (Gluten အလွန်နည်းပါး)
• **အသုံးပြုပုံ:** စပေါန့်ခ်ျကိတ်၊ ရှစ်ဖွန်ကိတ်၊ နူးညံ့အိစက်သော မုန့်များအတွက် သုံးပါသည်။ Gluten ဖွဲ့စည်းမှု အနည်းဆုံးဖြစ်စေ၍ ကိတ်မုန့်သားကို အလွန်နူးညံ့ပေါ့ပါးစေပါသည်။

⚖️ **၃။ အဓိက ကွာခြားချက် ၃ ချက် (Differences):**
• **ကော်ရည်ကြော (Gluten) ကွာခြားမှု:** ကိတ်ဂျုံသည် Gluten နည်း၍ အိစက်ပျော့ပျောင်းပြီး၊ အိမ်သုံးဂျုံသည် Gluten အလယ်အလတ်ဖြစ်၍ ပုံသဏ္ဌာန်ခိုင်မာစေသည်။
• **မုန့်သား အထိအတွေ့:** ကိတ်ဂျုံဖြင့် ဖုတ်သော ကိတ်များသည် ပါးစပ်ထဲတွင် ပျော်ဝင်လွယ်ပြီး၊ အိမ်သုံးဂျုံသည် ဝါးရတာ ပိုမိုကျစ်လျစ်သည်။
• **အရေးပေါ် အစားထိုးနည်း:** ကိတ်ဂျုံမရှိပါက အိမ်သုံးဂျုံမှုန့် ၈၅ ဂရမ် + ပြောင်းဖူးကစီ (Cornstarch) ၁၅ ဂရမ် ရောစပ်ကာ ၂-၃ ကြိမ် ဇကာစစ်၍ ကိတ်ဂျုံအဖြစ် အစားထိုးနိုင်ပါသည်။`,
        card: {
          title: 'ဂျုံမှုန့် vs ကိတ်မုန့်ဂျုံ ကွာခြားချက်',
          emoji: '🌾🥣',
          category: 'ဂျုံနှိုင်းယှဉ်ချက် (Flour Differences)',
          bullet1: 'ဂျုံမှုန့် (All-Purpose): Gluten ၁၀-၁၂% ၊ စွယ်စုံသုံး၊ မုန့်သားကျစ်လျစ်ခိုင်မာစေသည်',
          bullet2: 'ကိတ်မုန့်ဂျုံ (Cake Flour): Gluten ၇-၉% ၊ ကိတ်မုန့်သား အလွန်နူးညံ့ပေါ့ပါးစေသည်',
          bullet3: 'အစားထိုးနည်း: အိမ်သုံးဂျုံ ၈၅g + ပြောင်းဖူးကစီ ၁၅g = ကိတ်ဂျုံ ၁၀၀g ရရှိပါသည်',
        }
      };
    } else {
      return {
        text: `Hello! 🌾🥣 Here are the key differences between **All-Purpose Flour** and **Cake Flour**:

🌾 **1. All-Purpose Flour:**
• **Protein / Gluten Content:** 10-12% (Medium Gluten)
• **Uses:** Multi-purpose staple for cookies, muffins, pancakes, waffles, and standard quick cakes. Forms a balanced structure with moderate chew.

🥣 **2. Cake Flour:**
• **Protein / Gluten Content:** 7-9% (Low Gluten, Extra-Fine Mill)
• **Uses:** Sponge cakes, chiffon cakes, delicate cupcakes, and pastries. Inhibits gluten formation for an ultra-tender, melt-in-your-mouth crumb.

⚖️ **3. Key Takeaways & Substitution:**
• **Gluten Differences:** Cake flour has minimal protein, yielding soft and airy crumb; all-purpose flour offers stronger structural integrity.
• **Crumb Texture:** Cakes made with cake flour rise higher and stay delicate; all-purpose flour makes crumb firmer and denser.
• **DIY Emergency Substitute:** 85g All-Purpose Flour + 15g Cornstarch, sifted together 2-3 times = 100g Cake Flour.`,
        card: {
          title: 'All-Purpose Flour vs Cake Flour',
          emoji: '🌾🥣',
          category: 'Flour Comparison Guide',
          bullet1: 'All-Purpose: 10-12% protein, versatile structure, chewy & stable',
          bullet2: 'Cake Flour: 7-9% protein, delicate tender crumb for chiffon & sponge',
          bullet3: 'Substitute: 85g All-Purpose + 15g Cornstarch = 100g Cake Flour',
        }
      };
    }
  }

  // 2. Butter Substitution (ထောပတ်အစား ဘာသုံးလို့ရလဲ / butter substitute)
  const isButterSub = 
    (text.includes('ထောပတ်') || text.includes('butter')) && 
    (text.includes('အစား') || text.includes('အစားထိုး') || text.includes('substitute') || text.includes('substitutes') || text.includes('ဘာသုံးလို့ရလဲ') || text.includes('မရှိရင်') || text.includes('instead'));

  if (isButterSub) {
    if (contentLang === 'mm') {
      return {
        text: `မင်္ဂလာပါရှင်! 🧈🫗 **ထောပတ်အစား အသုံးပြုနိုင်သော ပစ္စည်းများ (Butter Substitutes)** -

မုန့်ဖုတ်ရာတွင် ထောပတ်မရှိပါက အောက်ပါအတိုင်း အစားထိုးသုံးစွဲနိုင်ပါတယ်ရှင်:

🫗 **၁။ ဟင်းသီးဟင်းရွက်ဆီ / ပြောင်းဖူးဆီ (Vegetable Oil):**
• **အချိုးအစား:** ထောပတ် ၁၀၀ ဂရမ် နေရာတွင် ဆီ ၈၀ ဂရမ် (ဆီ ၈၀% အချိုး) အသုံးပြုပါ။
• **အသုံးဝင်ပုံ:** ချောကလက်ကိတ်၊ မာဖင်၊ ရှစ်ဖွန်ကိတ်များတွင် မုန့်သားကို အလွန်စိုပြေစေပြီး ရေခဲသေတ္တာထဲတွင်ပင် မာမသွားစေပါ။

🧈 **၂။ မာဂျရင်း (Margarine):**
• **အချိုးအစား:** ၁:၁ အချိုး (ထောပတ် ၁၀၀ ဂရမ် = မာဂျရင်း ၁၀၀ ဂရမ်) အပြည့်အဝ အစားထိုးနိုင်ပါသည်။
• **အသုံးဝင်ပုံ:** ကွတ်ကီးနှင့် ပေါင်မုန့်များတွင် သုံးရန် အထူးသင့်တော်ပါသည်။

🧂 **၃။ ဆားပါထောပတ် (Salted Butter):**
• ဆားမပါထောပတ်အစား ၁:၁ သုံးနိုင်ပြီး ချက်နည်းထဲမှ ဆား ၁/၄ လက်ဖက်ရည်ဇွန်းခန့်ကို လျှော့ချ/ဖယ်ထုတ်ပေးပါ။`,
        card: {
          title: 'ထောပတ် အစားထိုးနည်း (Butter Substitutes)',
          emoji: '🧈🫗',
          category: 'အစားထိုးနည်း လမ်းညွှန်',
          bullet1: 'ဟင်းသီးဟင်းရွက်ဆီ: ထောပတ် ၁၀၀g လျှင် ဆီ ၈၀g (ကိတ်သား စိုပြေအိစက်စေသည်)',
          bullet2: 'မာဂျရင်း (Margarine): ၁:၁ အချိုးညီ အစားထိုးသုံးနိုင်ပါသည်',
          bullet3: 'ဆားပါထောပတ်: ၁:၁ သုံးနိုင်ပြီး ချက်နည်းပါ ဆားပမာဏကို လျှော့ချပါ',
        }
      };
    } else {
      return {
        text: `Hello! 🧈🫗 Here are the top **Butter Substitutes** from our offline baking library:

🫗 **1. Vegetable Oil / Canola Oil:**
• **Ratio:** Use 80g vegetable oil per 100g butter (80% ratio).
• **Best for:** Chocolate cakes, carrot cakes, muffins, and chiffons. Keeps baked goods remarkably moist and soft even when chilled.

🧈 **2. Margarine:**
• **Ratio:** 1:1 direct replacement (100g butter = 100g margarine).
• **Best for:** Cookies, scones, and yeast breads where solid fat structure is needed.

🧂 **3. Salted Butter:**
• **Ratio:** 1:1 replacement for unsalted butter. Simply omit or reduce 1/4 tsp of salt from the original recipe.`,
        card: {
          title: 'Butter Substitutes Guide',
          emoji: '🧈🫗',
          category: 'Substitution Guide',
          bullet1: 'Vegetable Oil: 80g oil per 100g butter (yields ultra-moist crumb)',
          bullet2: 'Margarine: 1:1 direct swap for cookies and quick breads',
          bullet3: 'Salted Butter: 1:1 swap; reduce recipe salt by 1/4 tsp',
        }
      };
    }
  }

  const isSubstituteIntent = text.includes('အစား') || text.includes('အစားထိုး') || text.includes('substitute') || text.includes('substitutes') || text.includes('replace') || text.includes('ဘာသုံးလို့ရလဲ') || text.includes('မရှိရင်');
  const isStorageIntent = text.includes('ဘယ်လိုသိမ်း') || text.includes('သိမ်းဆည်း') || text.includes('သိမ်းနည်း') || text.includes('storage') || text.includes('store') || text.includes('keep');
  const isUsesIntent = text.includes('ဘာလုပ်လို့ရလဲ') || text.includes('ဘာလုပ်') || text.includes('ဘယ်လိုသုံး') || text.includes('ဘာလို့သုံး') || text.includes('uses') || text.includes('purpose') || text.includes('role');

  // 3. Matched Ingredient with specific or general intent
  if (matchedIngredient) {
    const emoji = matchedIngredient.image_emoji || '🌾';
    const isMm = contentLang === 'mm';
    const name = isMm
      ? (matchedIngredient.name_mm || matchedIngredient.name_en)
      : (matchedIngredient.name_en || matchedIngredient.name_mm);
    const purpose = isMm
      ? (matchedIngredient.uses_mm || matchedIngredient.uses_en)
      : (matchedIngredient.uses_en || matchedIngredient.uses_mm);
    const subsList = isMm
      ? (matchedIngredient.substitutes_mm || matchedIngredient.substitutes_en || [])
      : (matchedIngredient.substitutes_en || matchedIngredient.substitutes_mm || []);
    const subs = subsList[0] || (isMm ? 'ချက်နည်းပါ အတိုင်းအတာအတိုင်း အသုံးပြုပါ' : 'Follow recipe measurements directly');
    const storage = isMm
      ? (matchedIngredient.storage_mm || matchedIngredient.storage_en)
      : (matchedIngredient.storage_en || matchedIngredient.storage_mm);
    const nutrition = isMm
      ? (matchedIngredient.nutrition_mm || matchedIngredient.nutrition_short || matchedIngredient.nutrition_en)
      : (matchedIngredient.nutrition_en || matchedIngredient.nutrition_short || matchedIngredient.nutrition_mm);

    if (isSubstituteIntent) {
      if (isMm) {
        return {
          text: `မင်္ဂလာပါရှင်! ${emoji} **${name}** အတွက် အစားထိုး အသုံးပြုနည်း လမ်းညွှန်ပေးပါမယ်နော် -

**အဓိက ရည်ရွယ်ချက် (Purpose):**
${purpose}

✨ **အဓိက သိထားသင့်သည့် အချက် ၃ ချက်:**
• **အစားထိုးနည်း (Substitute):** ${subs}
• **သတိပြုရန် အချက်:** အစားထိုးသုံးပါက မုန့်သား အိစက်မှုနှင့် အချိုဓာတ်ကို ချက်နည်းအလိုက် အနည်းငယ် ညှိပေးရပါမည်။
• **သိမ်းဆည်းနည်း (Storage):** ${storage}`,
          card: {
            title: name,
            emoji,
            category: 'အစားထိုးနည်း (Substitute Guide)',
            bullet1: `အစားထိုးနည်း: ${subs}`,
            bullet2: `အသုံးဝင်ပုံ: ${purpose.slice(0, 80)}...`,
            bullet3: `သိမ်းဆည်းနည်း: ${storage}`,
          }
        };
      } else {
        return {
          text: `Hello! ${emoji} Here is the substitution guideline for **${name}**:

**Role in Baking:**
${purpose}

✨ **Key Points & Substitutes:**
• **Recommended Substitute:** ${subs}
• **Important Tip:** Adjust sugar, liquids, or baking times slightly when making swaps.
• **Storage Note:** ${storage}`,
          card: {
            title: name,
            emoji,
            category: 'Substitution Guide',
            bullet1: `Substitute: ${subs}`,
            bullet2: `Purpose: ${purpose.slice(0, 90)}...`,
            bullet3: `Storage: ${storage}`,
          }
        };
      }
    }

    if (isStorageIntent) {
      if (isMm) {
        return {
          text: `မင်္ဂလာပါရှင်! ${emoji} **${name}** ကို သိုလှောင်သိမ်းဆည်းနည်း အကြံပြုချက် ဖြစ်ပါတယ်ရှင် -

**အဓိက ရည်ရွယ်ချက် (Purpose):**
${purpose}

✨ **အဓိက သိထားသင့်သည့် အချက် ၃ ချက်:**
• **သိမ်းဆည်းနည်း (Storage):** ${storage}
• **အာဟာရနှင့် သဘောသဘာဝ:** ${nutrition}
• **အစားထိုး အသုံးပြုနည်း:** ${subs}`,
          card: {
            title: name,
            emoji,
            category: 'သိမ်းဆည်းနည်း (Storage Guide)',
            bullet1: `သိမ်းဆည်းနည်း: ${storage}`,
            bullet2: `အာဟာရနှင့် ဂုဏ်သတ္တိ: ${nutrition}`,
            bullet3: `အစားထိုးနည်း: ${subs}`,
          }
        };
      } else {
        return {
          text: `Hello! ${emoji} Here are the storage instructions for **${name}**:

**Role in Baking:**
${purpose}

✨ **Storage & Freshness Tips:**
• **How to Store:** ${storage}
• **Properties & Nutrition:** ${nutrition}
• **Substitute Option:** ${subs}`,
          card: {
            title: name,
            emoji,
            category: 'Storage Guide',
            bullet1: `Storage: ${storage}`,
            bullet2: `Properties: ${nutrition}`,
            bullet3: `Substitute: ${subs}`,
          }
        };
      }
    }

    // Default Detailed Card for Ingredient
    if (isMm) {
      return {
        text: `မင်္ဂလာပါရှင်! ${emoji} **${name}** အကြောင်း အသေးစိတ် ရှင်းပြပေးပါမယ်နော် -

**အဓိက ရည်ရွယ်ချက် (Purpose):**
${purpose}

✨ **အဓိက သိထားသင့်သည့် အချက် ၃ ချက်:**
• **မုန့်လုပ်ရာမှာ ဘာလို့သုံးလဲ:** ${purpose}
• **အစားထိုး အသုံးပြုနည်း:** ${subs}
• **သိုလှောင်သိမ်းဆည်းနည်း:** ${storage}`,
        card: {
          title: name,
          emoji,
          category: 'ပါဝင်ပစ္စည်း အသေးစိတ် (Ingredient Info)',
          bullet1: `ဘာလို့သုံးလဲ: ${purpose.slice(0, 90)}...`,
          bullet2: `အစားထိုးနည်း: ${subs}`,
          bullet3: `သိမ်းဆည်းနည်း: ${storage}`,
        }
      };
    } else {
      return {
        text: `Hello! ${emoji} Here is the complete overview for **${name}**:

**Role in Baking:**
${purpose}

✨ **Key Details:**
• **Purpose & Role:** ${purpose}
• **Substitutes:** ${subs}
• **Storage Advice:** ${storage}`,
        card: {
          title: name,
          emoji,
          category: 'Ingredient Details',
          bullet1: `Role: ${purpose.slice(0, 90)}...`,
          bullet2: `Substitute: ${subs}`,
          bullet3: `Storage: ${storage}`,
        }
      };
    }
  }

  // 4. Matched Tool with specific or general intent
  if (matchedTool) {
    const emoji = matchedTool.image_emoji || '🧁';
    const isMm = contentLang === 'mm';
    const name = isMm
      ? (matchedTool.name_mm || matchedTool.name_en)
      : (matchedTool.name_en || matchedTool.name_mm);
    const purpose = isMm
      ? (matchedTool.purpose_mm || matchedTool.purpose_en)
      : (matchedTool.purpose_en || matchedTool.purpose_mm);
    const howTo = isMm
      ? (matchedTool.how_to_use_mm || matchedTool.how_to_use_en)
      : (matchedTool.how_to_use_en || matchedTool.how_to_use_mm);
    const care = isMm
      ? (matchedTool.care_mm || matchedTool.care_en)
      : (matchedTool.care_en || matchedTool.care_mm);
    const altList = isMm
      ? (matchedTool.alternatives_mm || matchedTool.alternatives_en || [])
      : (matchedTool.alternatives_en || matchedTool.alternatives_mm || []);
    const alt = altList[0] || (isMm ? 'အိမ်သုံး အနီးစပ်ဆုံး ကိရိယာဖြင့် အစားထိုးနိုင်သည်' : 'Common kitchen utensils can substitute');

    if (isMm) {
      return {
        text: `မင်္ဂလာပါရှင်! ${emoji} **${name}** ကိရိယာ အကြောင်း ဖြစ်ပါတယ်ရှင် -

**အဓိက ရည်ရွယ်ချက် (Purpose):**
${purpose}

✨ **အဓိက သိထားသင့်သည့် အချက် ၃ ချက်:**
• **မုန့်လုပ်ရာမှာ ဘာလို့သုံးလဲ:** ${purpose}
• **အသုံးပြုနည်း လမ်းညွှန်:** ${howTo}
• **သန့်ရှင်းထိန်းသိမ်းနည်း:** ${care}`,
        card: {
          title: name,
          emoji,
          category: 'ကိရိယာ အသေးစိတ် (Tool Info)',
          bullet1: `ရည်ရွယ်ချက်: ${purpose.slice(0, 90)}...`,
          bullet2: `အသုံးပြုနည်း: ${howTo.slice(0, 80)}...`,
          bullet3: `ထိန်းသိမ်းနည်း: ${care}`,
        }
      };
    } else {
      return {
        text: `Hello! ${emoji} Here is the guide for **${name}**:

**Purpose in Baking:**
${purpose}

✨ **Essential Guidelines:**
• **How to Use:** ${howTo}
• **Care & Maintenance:** ${care}
• **Alternative:** ${alt}`,
        card: {
          title: name,
          emoji,
          category: 'Tool & Equipment Info',
          bullet1: `Purpose: ${purpose.slice(0, 90)}...`,
          bullet2: `Usage: ${howTo.slice(0, 80)}...`,
          bullet3: `Care: ${care}`,
        }
      };
    }
  }

  // 5. Generic Substitute Fallback
  if (isSubstituteIntent) {
    if (contentLang === 'mm') {
      return {
        text: `မင်္ဂလာပါရှင်! 👩‍🍳 မုန့်ဖုတ်ရာတွင် ပါဝင်ပစ္စည်းများ အစားထိုးရန်အတွက် မည်သည့်ပစ္စည်းကို အစားထိုးလိုပါသလဲရှင့်?

**အသုံးအများဆုံး အစားထိုးနည်း ၃ မျိုး:**
• **ကိတ်ဂျုံမှုန့် အစားထိုးနည်း:** အိမ်သုံးဂျုံ ၈၅% + ပြောင်းဖူးကစီဓာတ် ၁၅% ရောစပ်ပါ။
• **ထောပတ် အစားထိုးနည်း:** ဟင်းသီးဟင်းရွက်ဆီ (ထောပတ် ၁၀၀g = ဆီ ၈၀g) သို့မဟုတ် မာဂျရင်း သုံးနိုင်ပါသည်။
• **ဘိတ်ကင်ပေါင်ဒါ အစားထိုးနည်း:** ဘိတ်ကင်ဆိုဒါ ၁/၄ ဇွန်း + Cream of Tartar ၁/၂ ဇွန်း ရောစပ်ပါ။

သိလိုသော ပစ္စည်းအမည် (ဥပမာ - ကိတ်ဂျုံ၊ သကြားညို၊ တဆေး) ကို ရေးသားမေးမြန်းနိုင်ပါသည်ရှင်!`,
        card: null
      };
    } else {
      return {
        text: `Hello! 👩‍🍳 Which ingredient would you like to find a substitution for?

**Top 3 Common Baking Substitutions:**
• **Cake Flour Substitute:** 85g All-Purpose Flour + 15g Cornstarch (sifted 2-3 times).
• **Butter Substitute:** Vegetable Oil (80g oil per 100g butter) or Margarine 1:1.
• **Baking Powder Substitute:** 1/4 tsp Baking Soda + 1/2 tsp Cream of Tartar = 1 tsp Baking Powder.

Type any ingredient name (e.g. "butter substitute", "cake flour", "yeast") to get exact ratios!`,
        card: null
      };
    }
  }

  // 6. Default Friendly Greeting
  if (contentLang === 'mm') {
    return {
      text: `မင်္ဂလာပါရှင်! 👩‍🍳 ကျွန်မက BakeLearn MM ရဲ့ အော့ဖ်လိုင်း AI မုန့်ဖုတ်လက်ထောက် ဖြစ်ပါတယ်။

မုန့်ဖုတ် ပါဝင်ပစ္စည်း ၂၅ မျိုးနှင့် ကိရိယာ ၁၅ မျိုးတို့၏ အသုံးပြုပုံ၊ အစားထိုးနည်းများနှင့် သိမ်းဆည်းနည်းများကို အင်တာနက်မလိုဘဲ အချိန်မရွေး မေးမြန်းနိုင်ပါသည်ရှင်။

💡 **မေးမြန်းနိုင်သည့် ပုံစံ ၃ မျိုး:**
• **ပါဝင်ပစ္စည်းအမည်:** "ကိတ်မုန့်ဂျုံ", "ထောပတ်", "ဘိတ်ကင်ပေါင်ဒါ", "ချိန်ခွင်"
• **အစားထိုးနည်း မေးလိုပါက:** "ကိတ်ဂျုံ အစားထိုး", "ထောပတ်အစား ဆီသုံးလို့ရလား"
• **သိမ်းဆည်းနည်း မေးလိုပါက:** "တဆေး ဘယ်လိုသိမ်းရမလဲ", "ထောပတ် ဘယ်လိုသိမ်းမလဲ"`,
      card: null
    };
  } else {
    return {
      text: `Hello! 👩‍🍳 I am your offline Baking AI Assistant in BakeLearn.

You can ask me about all 25 baking ingredients and 15 tools—including purposes, chemistry, substitutions, and storage guidelines—with zero internet connection required.

💡 **Sample Queries:**
• **Ingredient & Tool names:** "Cake flour", "Butter", "Baking powder", "Kitchen scale"
• **Substitutions:** "What can I substitute for butter?", "Cake flour substitute"
• **Storage advice:** "How to store yeast?", "How to care for rolling pin"`,
      card: null
    };
  }
}

export const AIAgent = () => {
  const { contentLang } = useContentLanguage();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  // Load chat history from localStorage key "bake_chat_history"
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to parse chat history:', e);
    }

    // Default initial greeting if history is empty
    const welcome = {
      id: 'welcome_' + Date.now(),
      sender: 'assistant',
      text: contentLang === 'mm'
        ? `မင်္ဂလာပါရှင်! 👩‍🍳 ကျွန်မက BakeLearn MM ရဲ့ အော့ဖ်လိုင်း AI လက်ထောက် ဖြစ်ပါတယ်။ 

ပါဝင်ပစ္စည်း ၂၅ မျိုးနှင့် ကိရိယာ ၁၅ မျိုးတို့၏ အသုံးပြုပုံ၊ အစားထိုးနည်းများနှင့် သိမ်းဆည်းနည်းများကို ၁၀၀% အော့ဖ်လိုင်း မေးမြန်းနိုင်ပါတယ်ရှင်။`
        : `Hello! 👩‍🍳 I am your offline BakeLearn Assistant. 

Ask me anytime about 25 baking ingredients and 15 equipment tools, replacements, and storage tips with 100% offline local intelligence.`,
    };
    setMessages([welcome]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveChatHistory = (newMessages) => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(newMessages));
    } catch (e) {
      console.error('Failed to save bake_chat_history:', e);
    }
  };

  const handleSend = (textToSend = null) => {
    const text = typeof textToSend === 'string' ? textToSend : inputText;
    if (!text || !text.trim()) return;

    const userMsg = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');

    // Local Intent Matching Engine (No external API calls)
    setTimeout(() => {
      const result = matchLocalIntent(text.trim(), contentLang);
      const assistantMsg = {
        id: 'bot_' + Date.now(),
        sender: 'assistant',
        text: result.text,
        card: result.card || null,
        timestamp: Date.now(),
      };
      const updated = [...newMessages, assistantMsg];
      setMessages(updated);
      saveChatHistory(updated);
    }, 120);
  };

  const handleClearHistory = () => {
    if (confirm('Clear entire chat history?')) {
      localStorage.removeItem(CHAT_STORAGE_KEY);
      const initialGreeting = {
        id: 'welcome_' + Date.now(),
        sender: 'assistant',
        text: contentLang === 'mm'
          ? 'မင်္ဂလာပါရှင်! စကားပြောမှတ်တမ်း ဖျက်ပြီးပါပြီ။ မုန့်ဖုတ်ပစ္စည်းများအကြောင်း မေးမြန်းနိုင်ပါသည်ရှင်။'
          : 'Chat history cleared. How can I help with your baking today?',
      };
      setMessages([initialGreeting]);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Suggestion chips supporting both queries
  const suggestionChips = contentLang === 'mm' ? [
    'ထောပတ်အစား ဘာသုံးလို့ရလဲ',
    'ဂျုံ',
    'ကိတ်မုန့်ဂျုံ အစားထိုး',
    'ဘိတ်ကင်ပေါင်ဒါ ဘယ်လိုသိမ်း',
    'မီးဖိုချောင်ချိန်ခွင် ဘာလုပ်လို့ရလဲ',
    'အခြောက်တဆေး အစားထိုး',
    'ဝှစ်ပင်းခရင်မ် ဘယ်လိုသိမ်း',
    'ကိုကိုးမှုန့် ဘာလုပ်လို့ရလဲ',
  ] : [
    'What can I substitute for butter?',
    'Flour comparison',
    'Cake flour substitute',
    'How to store baking powder',
    'Why use kitchen scale',
    'Instant yeast substitute',
    'How to store whipping cream',
    'Cocoa powder role',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-h-[850px] rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-sm overflow-hidden animate-in fade-in duration-200">
      {/* Header with Language Toggle and Clear History (English UI) */}
      <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 bg-orange-50/60 dark:bg-stone-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-sm text-xl">
              👩‍🍳
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-stone-900 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-stone-900 dark:text-white text-sm sm:text-base">
                BakeLearn AI Assistant
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                100% Offline
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Instant rule-based lookup for 25 ingredients and 15 baking tools
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Content Language Toggle */}
          <ContentLanguageToggle />

          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
            title="Clear chat history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Demo Script Quick Action Bar (English UI) */}
      <div className="bg-amber-100/70 dark:bg-stone-800/80 border-b border-amber-200/80 dark:border-stone-700 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-amber-950 dark:text-amber-200 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Demo Scripts (Click to Test):</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSend('ထောပတ်အစား ဘာသုံးလို့ရလဲ')}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 border border-amber-300 dark:border-stone-700 text-orange-950 dark:text-orange-300 hover:bg-orange-50 font-bold transition shadow-2xs active:scale-95 cursor-pointer text-[11px]"
          >
            🧈 "ထောပတ်အစား ဘာသုံးလို့ရလဲ"
          </button>
          <button
            onClick={() => handleSend('ဂျုံ')}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 border border-amber-300 dark:border-stone-700 text-orange-950 dark:text-orange-300 hover:bg-orange-50 font-bold transition shadow-2xs active:scale-95 cursor-pointer text-[11px]"
          >
            🌾 "ဂျုံ" (Flour Differences)
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-50/40 dark:bg-stone-950/40">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-2xl ${
                isUser ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs relative group ${
                  isUser
                    ? 'bg-orange-600 text-white rounded-br-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 border border-stone-200/90 dark:border-stone-700 rounded-bl-xs'
                }`}
              >
                {msg.text}

                {/* Detailed Item Card if generated */}
                {!isUser && msg.card && (
                  <div className="mt-3.5 p-3.5 rounded-xl bg-orange-50/70 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-900/50 space-y-2 text-stone-900 dark:text-stone-100">
                    <div className="flex items-center gap-2 font-bold text-sm text-orange-950 dark:text-orange-300 pb-1.5 border-b border-orange-200/60 dark:border-orange-900/40">
                      <span className="text-xl">{msg.card.emoji}</span>
                      <span>{msg.card.title}</span>
                      <span className="ml-auto text-[10px] px-2 py-0.5 bg-orange-200/70 dark:bg-orange-900/60 text-orange-900 dark:text-orange-200 rounded-md">
                        {msg.card.category}
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-stone-800 dark:text-stone-200 pt-1">
                      <li className="flex items-start gap-1.5">
                        <span className="text-orange-600 font-bold">•</span>
                        <span>{msg.card.bullet1}</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-orange-600 font-bold">•</span>
                        <span>{msg.card.bullet2}</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-orange-600 font-bold">•</span>
                        <span>{msg.card.bullet3}</span>
                      </li>
                    </ul>
                  </div>
                )}

                {/* Copy Button */}
                {!isUser && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="absolute top-2.5 right-2.5 p-1 rounded-md text-stone-300 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    title="Copy message"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-4 py-2 border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-stone-400 uppercase shrink-0">Quick Ask:</span>
        {suggestionChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-[11px] whitespace-nowrap transition cursor-pointer active:scale-95"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Box (English UI) */}
      <div className="p-3 sm:p-4 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about any ingredient or tool (e.g. butter substitute, ဂျုံ, baking soda)..."
            className="flex-1 px-4 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs sm:text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-orange-500 focus:bg-white transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white transition active:scale-95 cursor-pointer"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAgent;
