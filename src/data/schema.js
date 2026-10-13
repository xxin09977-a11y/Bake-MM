/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * LocalStorage keys for BakeLearn application
 */
export const STORAGE_KEYS = {
  BAKE_INGREDIENTS: 'bake_ingredients',
  BAKE_TOOLS: 'bake_tools',
  APP_SETTINGS: 'app_settings',
};

/**
 * 25 Common Baking Ingredients with complete bilingual data:
 * name_en, uses_en, substitutes_en[], storage_en, nutrition_en
 * name_mm, uses_mm, substitutes_mm[], storage_mm, nutrition_mm
 */
export const DEFAULT_INGREDIENTS = [
  {
    id: 'all-purpose-flour',
    name_en: 'All-Purpose Flour',
    name_mm: 'ဂျုံမှုန့် / အိမ်သုံးဂျုံ (All-Purpose Flour)',
    category: 'flour',
    uses_en: 'Forms a medium gluten network to build the structural foundation of baked goods. Essential for cookies, muffins, pancakes, and standard cakes to create a tender yet stable crumb. With 10-12% protein, it is the most versatile multi-purpose flour in baking.',
    uses_mm: 'မုန့်ဖုတ်ရာတွင် ကော်ရည်ကြော (Gluten) အလယ်အလတ် ဖွဲ့စည်းပေးပြီး မုန့်၏ အခြေခံတည်ဆောက်ပုံကို ခိုင်မာစေပါသည်။ ကွတ်ကီး၊ မာဖင်၊ ပန်ကိတ်နှင့် ရိုးရိုးကိတ်မုန့်များတွင် မုန့်သားကျစ်လျစ်နူးညံ့စေရန် မရှိမဖြစ် အသုံးပြုကြသည်။ ဂလူတင်ဓာတ် ၁၀-၁၂% ပါဝင်သဖြင့် မုန့်အမျိုးအစား အများစုအတွက် စွယ်စုံသုံးနိုင်သော ဂျုံမှုန့်ဖြစ်ပါသည်။',
    substitutes_en: [
      '50% cake flour + 50% bread flour mixed in equal ratio'
    ],
    substitutes_mm: [
      'ကိတ်ဂျုံမှုန့် ၅၀% နှင့် ပေါင်မုန့်ဂျုံမှုန့် ၅၀% အချိုးညီ ရောစပ်သုံးနိုင်ပါသည်'
    ],
    storage_en: 'Store in an airtight container in a cool, dry pantry away from direct sunlight and pests.',
    storage_mm: 'အစိုဓာတ်ကင်းစင်သော လေလုံဘူးတွင် ထည့်၍ အေးမြခြောက်သွေ့သော နေရာတွင် သိမ်းဆည်းပါ။ ပိုးမွှားမဝင်စေရန် အဖုံးသေချာ ပိတ်ထားပါ။',
    nutrition_en: 'Protein 10-12% (Medium Gluten), High in carbohydrates',
    nutrition_mm: 'ပရိုတင်း ၁၀-၁၂% (Medium Gluten)၊ ကာဗိုဟိုက်ဒရိတ် ကြွယ်ဝ',
    nutrition_short: 'Protein 10-12% (Medium Gluten)',
    image_emoji: '🌾',
  },
  {
    id: 'cake-flour',
    name_en: 'Cake Flour',
    name_mm: 'ကိတ်မုန့်ဂျုံ (Cake Flour)',
    category: 'flour',
    uses_en: 'Contains low protein (7-9%) to minimize gluten development during mixing, producing exceptionally soft and delicate crumb textures. Ideal for sponge cakes, chiffon cakes, and tender cupcakes so they never turn tough or rubbery.',
    uses_mm: 'ပရိုတင်းဓာတ် နည်းပါးသောကြောင့် မုန့်မွှေရာတွင် Gluten ဖြစ်ပေါ်မှုကို အနည်းဆုံးဖြစ်စေကာ ကိတ်မုန့်သားကို အလွန်နူးညံ့ပေါ့ပါးစေပါသည်။ စပေါန့်ခ်ျကိတ်၊ ရှစ်ဖွန်ကိတ်နှင့် ကပ်ပကိတ်များ ဖုတ်ရာတွင် မုန့်သားမမာသွားစေဘဲ အိစက်ပျော့ပျောင်းစေရန် အသုံးပြုပါသည်။ ဂျုံမှုန့်အမှုန် အလွန်ညက်ညောသဖြင့် အရည်များနှင့် အမြန်ပျော်ဝင်လွယ်ပါသည်။',
    substitutes_en: [
      '85g all-purpose flour + 15g cornstarch, sifted together 2-3 times'
    ],
    substitutes_mm: [
      'အိမ်သုံးဂျုံမှုန့် ၈၅ ဂရမ် + ပြောင်းဖူးကစီဓာတ် (Cornstarch) ၁၅ ဂရမ် ရောစပ်ကာ ၂-၃ ကြိမ် ဇကာစစ်သုံးပါ'
    ],
    storage_en: 'Store in a sealed container in a cool pantry or refrigerator. Absorbs humidity easily.',
    storage_mm: 'အေးမြခြောက်သွေ့သော နေရာ သို့မဟုတ် ရေခဲသေတ္တာထဲတွင် လေလုံဘူးဖြင့် သိမ်းဆည်းပါ။ အစိုဓာတ်ထိပါက ခဲသွားတတ်ပါသည်။',
    nutrition_en: 'Protein 7-9% (Low Gluten), Very fine pure milled starch',
    nutrition_mm: 'ပရိုတင်း ၇-၉% (Low Gluten)၊ ကစီဓာတ် အလွန်နု',
    nutrition_short: 'Protein 7-9% (Low Gluten)',
    image_emoji: '🥣',
  },
  {
    id: 'bread-flour',
    name_en: 'Bread Flour',
    name_mm: 'ပေါင်မုန့်ဂျုံ (Bread Flour)',
    category: 'flour',
    uses_en: 'Contains high protein (12-14%) to build strong elastic gluten networks that trap expanding gas bubbles during yeast proofing. Produces chewy, high-rising loaves, dinner rolls, and artisan crusty breads.',
    uses_mm: 'ပရိုတင်းဓာတ် ၁၂-၁၄% အထိ မြင့်မားစွာ ပါဝင်သောကြောင့် ခိုင်မာသော Gluten ကွန်ရက်ကို တည်ဆောက်ပေးနိုင်ပါသည်။ တဆေးဖြင့် ဖောက်သော ပေါင်မုန့်များတွင် လေပူဖောင်းများကို ထိန်းချုပ်ကာ မုန့်သားဖောင်းကြွပြီး ဝါးရတာ elastic ဖြစ်စေရန် သုံးပါသည်။ ပေါင်မုန့်ဖြူ၊ နို့ပေါင်မုန့်နှင့် ပီဇာဂျုံသားများအတွက် အဓိက လိုအပ်သော ဂျုံဖြစ်ပါသည်။',
    substitutes_en: [
      '100g all-purpose flour + 2g vital wheat gluten'
    ],
    substitutes_mm: [
      'အိမ်သုံးဂျုံမှုန့် (All-Purpose) ၁၀၀ ဂရမ်လျှင် Vital Wheat Gluten ၂ ဂရမ် ထည့်သွင်းနိုင်ပါသည်'
    ],
    storage_en: 'Keep sealed in an airtight bin in a dark, cool cupboard. Shelf life 6-12 months.',
    storage_mm: 'မှောင်၍ အေးသောနေရာတွင် လေလုံဘူးဖြင့် သိမ်းဆည်းပါ။ သက်တမ်း ၆ လမှ ၁ နှစ်အထိ ခံပါသည်။',
    nutrition_en: 'Protein 12-14% (High Gluten), High elasticity structure',
    nutrition_mm: 'ပရိုတင်း ၁၂-၁၄% (High Gluten)၊ ဂျုံကော်ကြော အားကောင်း',
    nutrition_short: 'Protein 12-14% (High Gluten)',
    image_emoji: '🍞',
  },
  {
    id: 'cornstarch',
    name_en: 'Cornstarch',
    name_mm: 'ပြောင်းဖူးကစီမှုန့် (Cornstarch)',
    category: 'flour',
    uses_en: 'Weakens gluten formation when blended into flours, imparting a melt-in-the-mouth crumb in shortbread and cakes. Acts as an effective clear thickener for custards, fruit pie fillings, and puddings.',
    uses_mm: 'ဂျုံမှုန့်ထဲသို့ ရောစပ်ထည့်သွင်းပါက Gluten ဖွဲ့စည်းမှုကို လျှော့ချပေးပြီး မုန့်သားကို ပါးစပ်ထဲတွင် ပျော်ဝင်သွားအောင် နူးညံ့စေပါသည်။ ပူတင်း၊ ကာစတပ်နှင့် ကိတ်ခရင်မ်များကို ပျစ်နှစ်ချောမွေ့စေရန် အသုံးပြုပါသည်။ ပိုင်မုန့်အစာသွပ်သစ်သီးများ ရေကျဲမသွားစေရန် ထိန်းပေးရာတွင်လည်း သုံးပါသည်။',
    substitutes_en: [
      'Tapioca starch or potato starch at a 1:1 ratio'
    ],
    substitutes_mm: [
      'ကန်စွန်းဥမှုန့် (Tapioca starch) သို့မဟုတ် အာလူးကစီမှုန့် (Potato starch) ၁:၁ အစားထိုးနိုင်သည်'
    ],
    storage_en: 'Keep completely dry in an airtight canister; always use dry measuring spoons.',
    storage_mm: 'လေလုံဘူးဖြင့် ခြောက်သွေ့စွာ သိမ်းပါ။ ရေစိုဇွန်းများဖြင့် မခတ်ရပါ။',
    nutrition_en: '100% pure carbohydrate starch (Naturally Gluten-Free)',
    nutrition_mm: 'ကစီဓာတ် ၁၀၀% (Gluten Free)',
    nutrition_short: 'Pure Starch (Gluten-Free)',
    image_emoji: '🌽',
  },
  {
    id: 'baking-powder',
    name_en: 'Baking Powder',
    name_mm: 'ဘိတ်ကင်ပေါင်ဒါ (Baking Powder - Double Acting)',
    category: 'leavening',
    uses_en: 'Releases carbon dioxide gas bubbles to expand batters for airy volume. Double-acting formulas react twice: first upon wetting, and second under oven heat, guaranteeing fluffy cakes, quick breads, and scones.',
    uses_mm: 'မုန့်ဖုတ်ရာတွင် ကာဗွန်ဒိုင်အောက်ဆိုက် ဓာတ်ငွေ့ပူဖောင်းများ ထုတ်ပေးခြင်းဖြင့် မုန့်သားကို အလွယ်တကူ ဖောင်းကြွတက်စေပါသည်။ အရည်နှင့် ထိတွေ့ချိန်တွင် တစ်ကြိမ်၊ မီးဖိုအပူရချိန်တွင် တစ်ကြိမ် စုစုပေါင်း နှစ်ကြိမ် ဖောင်းကြွစေသဖြင့် မုန့်သားပေါ့ပါးစေပါသည်။ ကိတ်မုန့်၊ ကွတ်ကီး၊ မာဖင်နှင့် ပန်ကိတ်များ ဖုတ်ရာတွင် မရှိမဖြစ် သုံးရပါသည်။',
    substitutes_en: [
      '1/4 tsp baking soda + 1/2 tsp cream of tartar = 1 tsp baking powder'
    ],
    substitutes_mm: [
      'မုန့်ဖုတ်ဆိုဒါ ၁/၄ ဇွန်း + Cream of Tartar ၁/၂ ဇွန်း = ဘိတ်ကင်ပေါင်ဒါ ၁ ဇွန်း'
    ],
    storage_en: 'Store dry at room temperature. Test freshness by stirring 1/2 tsp into warm water to see rapid fizzing.',
    storage_mm: 'အစိုဓာတ်ကင်းအောင် ထားပါ။ ရေနွေးထဲ အနည်းငယ်ထည့်၍ ပွက်ပွက်ဆူလာမှ အာနိသင် ကောင်းဆဲဖြစ်ကြောင်း စစ်ဆေးနိုင်သည်။',
    nutrition_en: 'Chemical leavening blend of sodium bicarbonate and acid salts',
    nutrition_mm: 'ဆိုဒီယမ်နှင့် အက်ဆစ်ဓာတ် ပါဝင်သော ဓာတုဖောင်းပွဆေး',
    nutrition_short: 'Sodium & Acid Salts',
    image_emoji: '✨',
  },
  {
    id: 'baking-soda',
    name_en: 'Baking Soda',
    name_mm: 'ဘိတ်ကင်ဆိုဒါ / ဆိုဒါ (Baking Soda)',
    category: 'leavening',
    uses_en: 'Reacts instantaneously with acidic ingredients (buttermilk, yogurt, lemon juice, cocoa, brown sugar) to release rapid leavening gas. Approximately 3-4x stronger than baking powder, it also accelerates Maillard browning in cookies.',
    uses_mm: 'သဘာဝ အက်ဆစ်ဓာတ် (ဒိန်ချဉ်၊ သံပရာရည်၊ ကိုကိုးမှုန့်၊ သကြားညို) များနှင့် ဓာတ်ပြုကာ မုန့်သားကို လျင်မြန်စွာ ဖောင်းကြွစေပါသည်။ ဘိတ်ကင်ပေါင်ဒါထက် ၃-၄ ဆခန့် ပိုမိုပြင်းထန်ပြီး မုန့်မျက်နှာပြင်ကို လှပသော ရွှေညိုရောင် သန်းစေပါသည်။ ချောကလက်ကိတ်၊ ငှက်ပျောသီးကိတ်နှင့် ဂျင်းကွတ်ကီးများတွင် အဓိက သုံးပါသည်။',
    substitutes_en: [
      '3x amount of baking powder (only when recipe does not strictly require acid neutralization)'
    ],
    substitutes_mm: [
      'ဘိတ်ကင်ပေါင်ဒါ ၃ ဆ (အက်ဆစ်မပါသော မုန့်များတွင် အစားထိုးသုံးနိုင်သည်)'
    ],
    storage_en: 'Readily absorbs odors, so seal tightly away from spices in a dry cupboard.',
    storage_mm: 'အနံ့ဆွဲလွယ်သဖြင့် အခြားဟင်းခတ်အမွှေးအကြိုင်များနှင့် ခပ်ဝေးဝေးတွင် လေလုံဘူးဖြင့် ထားပါ။',
    nutrition_en: '100% pure Sodium Bicarbonate (alkaline leavener)',
    nutrition_mm: 'ဆိုဒီယမ်ဘိုင်ကာဗွန်နိတ် ၁၀၀% သန့်စင်',
    nutrition_short: '100% Sodium Bicarbonate',
    image_emoji: '🧂',
  },
  {
    id: 'instant-yeast',
    name_en: 'Instant Dry Yeast',
    name_mm: 'အခြောက်တဆေး (Instant Dry Yeast)',
    category: 'leavening',
    uses_en: 'Ferments sugars inside dough to produce carbon dioxide and ethanol, generating natural rise and deep artisan bread aromas. Can be blended directly into dry flour without prior water proofing.',
    uses_mm: 'ပေါင်မုန့်ဂျုံသားအတွင်းရှိ သကြားဓာတ်ကို စားသုံးကာ ကာဗွန်ဒိုင်အောက်ဆိုက် ထုတ်ပေးခြင်းဖြင့် ပေါင်မုန့်ကို သဘာဝအတိုင်း ဖောင်းပွစေပါသည်။ ပေါင်မုန့်၏ သင်းပျံ့သော သဘာဝတဆေးရနံ့နှင့် အိစက်သော မုန့်သားဖွဲ့စည်းမှုကို ဖန်တီးပေးပါသည်။ ရေကြိုဖျော်ရန် မလိုဘဲ ဂျုံမှုန့်ထဲ တိုက်ရိုက်ထည့်သုံးနိုင်သော အဆင့်မြင့် တဆေးဖြစ်ပါသည်။',
    substitutes_en: [
      'Active dry yeast (proof first in 40°C warm water with a pinch of sugar for 5-10 min)'
    ],
    substitutes_mm: [
      'Active Dry Yeast (ရေနွေးနွေး ၄၀°C နှင့် သကြားအနည်းငယ်ဖြင့် ၅ မိနစ် အရင်ဖျော်သုံးရသည်)'
    ],
    storage_en: 'Once opened, keep tightly sealed in the refrigerator or freezer. Heat and dampness kill yeast.',
    storage_mm: 'ဖောက်ပြီးသားကို လေလုံဘူးဖြင့် ရေခဲသေတ္တာထဲတွင် သိမ်းဆည်းပါ။ အပူနှင့် အစိုဓာတ် ထိပါက တဆေးသေသွားတတ်ပါသည်။',
    nutrition_en: 'Live active microorganisms (Saccharomyces cerevisiae), rich in B vitamins',
    nutrition_mm: 'သဘာဝမှိုဆဲလ် (Microorganism)၊ ပရိုတင်းနှင့် ဗီတာမင် B ပါဝင်',
    nutrition_short: 'Live Cultured Yeast',
    image_emoji: '🥖',
  },
  {
    id: 'cream-of-tartar',
    name_en: 'Cream of Tartar',
    name_mm: 'ခရင်မ်အော့ဖ်တာတာ (Cream of Tartar)',
    category: 'leavening',
    uses_en: 'Stabilizes whipped egg whites (meringues) by reinforcing protein structures to prevent weeping and collapsing. Also inhibits sugar crystallization in syrups and helps maintain bright white crumb color.',
    uses_mm: 'ကြက်ဥအကာ (Egg white) ကို မွှေသည့်အခါ ပရိုတင်းအမြှုပ်များကို ခိုင်မာစေပြီး အမြှုပ်ပြိုကျမသွားအောင် ထိန်းသိမ်းပေးပါသည်။ သကြားရည်ကျိုရာတွင် သကြားခဲမသွားစေရန်နှင့် မုန့်သားဖြူစင်စေရန်လည်း သုံးပါသည်။ ရှစ်ဖွန်ကိတ်နှင့် မာရင်း (Meringue) မုန့်များတွင် မရှိမဖြစ် လိုအပ်သော အက်ဆစ်မှုန့် ဖြစ်ပါသည်။',
    substitutes_en: [
      'Fresh lemon juice or white vinegar (1/2 tsp cream of tartar = 1 tsp lemon juice)'
    ],
    substitutes_mm: [
      'သံပရာရည် သို့မဟုတ် ဗင်နီဂါရည် (Cream of Tartar ၁/၂ ဇွန်းလျှင် သံပရာရည် ၁ ဇွန်း)'
    ],
    storage_en: 'Keep sealed in an airtight container at room temperature away from moisture.',
    storage_mm: 'လေလုံဘူးတွင် ထည့်၍ ခြောက်သွေ့သော အခန်းအပူချိန်တွင် သိမ်းဆည်းပါ။',
    nutrition_en: 'Potassium bitartrate (organic acid byproduct of winemaking)',
    nutrition_mm: 'ပိုတက်စီယမ် ဘိုင်တာထရိတ် (Potassium Bitartrate)',
    nutrition_short: 'Potassium Bitartrate Acid',
    image_emoji: '🍋',
  },
  {
    id: 'granulated-sugar',
    name_en: 'Granulated Sugar',
    name_mm: 'သကြားဖြူ / သကြားကြမ်း (Granulated Sugar)',
    category: 'sugar',
    uses_en: 'Sweetens baked treats while locking in moisture to keep crumb tender. During creaming with butter, crystal edges aerate small pockets for volume, and caramelizes into golden crusts.',
    uses_mm: 'မုန့်ကို ချိုမြိန်စေရုံသာမက မုန့်သားအတွင်း အစိုဓာတ်ကို ထိန်းသိမ်းပေးပြီး နူးညံ့မှုကို ဖြစ်ပေါ်စေပါသည်။ ထောပတ်နှင့် မွှေရာတွင် လေအိတ်ငယ်များ ဖန်တီးပေးပြီး မီးဖိုထဲတွင် အရောင်ရွှေညိုရောင် လှပစေပါသည်။ ကိတ်မုန့်၊ ကွတ်ကီးနှင့် မုန့်အမျိုးမျိုးတွင် အခြေခံအကျဆုံး အချိုဓာတ်အဖြစ် အသုံးပြုပါသည်။',
    substitutes_en: [
      'Caster sugar (superfine) or brown sugar (yields deeper caramel note)'
    ],
    substitutes_mm: [
      'ကာစတာသကြား (Caster sugar) သို့မဟုတ် သကြားညို (Brown sugar)'
    ],
    storage_en: 'Store in an airtight jar in a moisture-free area. Keep sealed away from ants.',
    storage_mm: 'အစိုဓာတ်ကင်းစင်သော လေလုံဘူးတွင် ထားရှိပါ။ ပုရွက်ဆိတ် မဝင်စေရန် သတိပြုပါ။',
    nutrition_en: '100% pure Sucrose carbohydrates, quick energy source',
    nutrition_mm: 'ဆူးခရို့စ် ကာဗိုဟိုက်ဒရိတ် ၁၀၀%၊ စွမ်းအင် မြင့်မား',
    nutrition_short: '100% Sucrose Carbohydrate',
    image_emoji: '🍚',
  },
  {
    id: 'caster-sugar',
    name_en: 'Caster Sugar',
    name_mm: 'သကြားနု / ကာစတာသကြား (Caster Sugar)',
    category: 'sugar',
    uses_en: 'Superfine crystal texture dissolves rapidly into butter or egg whites without leaving gritty residue. The standard gold choice for delicate Genoise sponges, meringues, and soft butter cakes.',
    uses_mm: 'သာမန်သကြားထက် အစေ့အဆန် အလွန်သေးငယ်သဖြင့် ကြက်ဥ သို့မဟုတ် ထောပတ်နှင့် အလွန်လျင်မြန်စွာ ပျော်ဝင်စေပါသည်။ မုန့်ဖုတ်ပြီးချိန်တွင် သကြားစေ့များ ကျန်မနေဘဲ မုန့်သား ချောမွတ်အိစက်စေရန် အထူးသုံးပါသည်။ ကြက်ဥအကာမွှေခြင်း (Meringue) နှင့် စပေါန့်ခ်ျကိတ်များအတွက် အကောင်းဆုံး သကြားဖြစ်ပါသည်။',
    substitutes_en: [
      'Pulse granulated sugar in a blender or food processor for 10-15 seconds'
    ],
    substitutes_mm: [
      'သာမန်သကြားဖြူကို Blender ဖြင့် စက္ကန့်အနည်းငယ် အမှုန့်ကြိတ်သုံးနိုင်ပါသည်'
    ],
    storage_en: 'Keep tightly sealed in an airtight jar away from kitchen steam.',
    storage_mm: 'အစိုဓာတ်မဝင်အောင် လေလုံဘူးတွင် သိမ်းဆည်းပါ။',
    nutrition_en: 'Superfine refined pure white sugar',
    nutrition_mm: 'အမှုန်အလွန်နုသော သန့်စင်ပြီး သကြားဖြူ',
    nutrition_short: 'Superfine Refined Sugar',
    image_emoji: '🍬',
  },
  {
    id: 'brown-sugar',
    name_en: 'Brown Sugar',
    name_mm: 'သကြားညို (Brown Sugar)',
    category: 'sugar',
    uses_en: 'Infused with natural molasses to deliver moist, chewy textures with rich toffee caramel tones. Essential for chocolate chip cookies, gingerbread, and moist fruit cakes.',
    uses_mm: 'တင်လဲရည် (Molasses) ပါဝင်သောကြောင့် မုန့်သားကို စိုပြေအိစက်စေပြီး ဝါးရတာ နူးညံ့ပျော့ပျောင်းစေပါသည်။ မွှေးပျံ့သော ကာရာမယ်လ်ရနံ့နှင့် နက်ရှိုင်းသော အရသာကို ပေးစွမ်းနိုင်ပါသည်။ ချောကလက်ချစ်ပ် ကွတ်ကီး၊ ဂျင်းမုန့်နှင့် သစ်သီးကိတ်များတွင် မရှိမဖြစ် အသုံးပြုကြပါသည်။',
    substitutes_en: [
      '1 cup granulated white sugar + 1 tbsp dark molasses or pure honey'
    ],
    substitutes_mm: [
      'သကြားဖြူ ၁ ခွက် + တင်လဲရည် (သို့မဟုတ် ပျားရည်) ၁ စားပွဲတင်ဇွန်း ရောစပ်ပါ'
    ],
    storage_en: 'Prone to hardening if dried; store in an airtight container with a terracotta brown sugar saver or bread slice.',
    storage_mm: 'အစိုဓာတ် ဆုံးရှုံးပါက မာကျောခဲသွားတတ်သဖြင့် လေလုံဘူးထဲတွင် ပေါင်မုန့်တစ်ချပ် သို့မဟုတ် စိုစွတ်စက္ကူခံ၍ သိမ်းပါ။',
    nutrition_en: 'Sucrose + Natural molasses, rich trace minerals',
    nutrition_mm: 'သဘာဝ သတ္တုဓာတ်နှင့် တင်လဲရည် အစိုဓာတ် ပါဝင်',
    nutrition_short: 'Molasses-Infused Sugar',
    image_emoji: '🍯',
  },
  {
    id: 'icing-sugar',
    name_en: 'Icing Sugar',
    name_mm: 'အိုင်စင်းသကြား (Icing Sugar / Powdered Sugar)',
    category: 'sugar',
    uses_en: 'Finely pulverized sugar combined with cornstarch that dissolves instantly with no heat required. Creates satiny smooth buttercream frostings, dusting on desserts, and glossy glazes for donuts and cookies.',
    uses_mm: 'သကြားကို အမှုန့်အလွန်ညက်အောင် ကြိတ်ထားပြီး အပူမလိုဘဲ အရည်နှင့် ချက်ချင်း ပျော်ဝင်နိုင်ပါသည်။ ထောပတ်ခရင်မ် (Buttercream Frosting) ချောမွတ်စေရန်နှင့် မုန့်မျက်နှာပြင်တွင် သကြားနှင်းမှုန့် ဖြူးရန် အသုံးပြုပါသည်။ မာဖင်၊ ကိတ်မုန့်နှင့် ဒိုးနပ်များပေါ်တွင် အလှဆင် glaze ရည် ပြုလုပ်ရာတွင် သုံးပါသည်။',
    substitutes_en: [
      '1 cup white granulated sugar + 1 tbsp cornstarch pulverized in high-speed blender'
    ],
    substitutes_mm: [
      'သကြားဖြူ ၁ ခွက် + ပြောင်းဖူးကစီ ၁ ဇွန်း ရော၍ Blender ဖြင့် အမှုန့်ညက်အောင် ကြိတ်ပါ'
    ],
    storage_en: 'Clumps easily in humidity; sift before measuring and keep strictly dry.',
    storage_mm: 'အစိုဓာတ်ထိပါက ခဲသွားတတ်သဖြင့် ဇကာစစ်ပြီးမှ သုံးရန်နှင့် လေလုံဘူးဖြင့် သိမ်းရန် လိုအပ်သည်။',
    nutrition_en: '97% pulverized sugar + 3% cornstarch anti-caking agent',
    nutrition_mm: 'သကြားမှုန့် ၉၇% + ပြောင်းဖူးကစီ ၃%',
    nutrition_short: 'Fine Powder + Starch',
    image_emoji: '🧁',
  },
  {
    id: 'unsalted-butter',
    name_en: 'Unsalted Butter',
    name_mm: 'ဆားမပါထောပတ် (Unsalted Butter)',
    category: 'dairy',
    uses_en: 'The premier fat in pastry baking allowing exact control over recipe salt levels. Provides rich dairy aroma, tender flaky layers, and emulsifies airy pockets during creaming. Essential for cakes, cookies, and pie crusts.',
    uses_mm: 'မုန့်ဖုတ်ရာတွင် ဆားပမာဏကို မိမိစိတ်ကြိုက် တိကျစွာ ထိန်းညှိနိုင်စေရန် အမြဲဦးစားပေး သုံးရသော ထောပတ်ဖြစ်ပါသည်။ မုန့်သားကို စိုပြေနူးညံ့စေပြီး နို့ဆီရနံ့ သင်းပျံ့စေကာ သကြားနှင့် မွှေရာတွင် လေခိုစေပါသည်။ ဘတာကိတ်၊ ကွတ်ကီး၊ ပိုင်မုန့်ခွံနှင့် ထောပတ်ခရင်မ်များအတွက် နံပါတ်တစ် အဓိက အဆီဖြစ်ပါသည်။',
    substitutes_en: [
      'Vegetable oil (80g oil = 100g butter), Margarine (1:1 ratio), or Salted butter (omit added salt)'
    ],
    substitutes_mm: [
      'ဟင်းသီးဟင်းရွက်ဆီ (ဆီ ၈၀g = ထောပတ် ၁၀၀g အချိုး)၊ မာဂျရင်း (Margarine ၁:၁ အချိုး) သို့မဟုတ် ဆားပါထောပတ် (ချက်နည်းထဲမှ ဆားကို ဖယ်ထုတ်ပါ)'
    ],
    storage_en: 'Always keep refrigerated. Soften to room temperature 1 hour before creaming.',
    storage_mm: 'ရေခဲသေတ္တာထဲတွင် အမြဲထားပါ။ အသုံးမပြုမီ အခန်းအပူချိန်ဖြစ်အောင် ၁ နာရီ ကြိုထုတ်ထားပါ။',
    nutrition_en: '80-82% milkfat, rich natural dairy flavor',
    nutrition_mm: 'နို့ဆီအဆီဓာတ် ၈၀-၈၂%၊ ရနံ့ အလွန်မွှေးပျံ့',
    nutrition_short: '80-82% Pure Milkfat',
    image_emoji: '🧈',
  },
  {
    id: 'salted-butter',
    name_en: 'Salted Butter',
    name_mm: 'ဆားပါထောပတ် (Salted Butter)',
    category: 'dairy',
    uses_en: 'Infused with roughly 1.5% salt, lending savory depth to cookies, breads, and scones. Can replace unsalted butter when additional recipe salt is reduced accordingly.',
    uses_mm: 'ဆားဓာတ် အနည်းငယ် ပါဝင်ပြီး ကွတ်ကီးနှင့် ပေါင်မုန့်များတွင် အရသာ လေးပင်စေရန် အသုံးပြုနိုင်ပါသည်။ မုန့်သားကို စိုပြေအိစက်စေပြီး ကြော်ဖုတ်ရာတွင် သင်းပျံ့သော ထောပတ်ရနံ့ ရရှိစေပါသည်။ ဆားမပါထောပတ် မရှိသောအခါ ချက်နည်းထဲမှ ဆားကို လျှော့၍ အစားထိုးသုံးနိုင်ပါသည်။',
    substitutes_en: [
      '100g unsalted butter + 1/4 tsp fine table salt'
    ],
    substitutes_mm: [
      'ဆားမပါထောပတ် ၁၀၀ ဂရမ် + ဆား ၁/၄ လက်ဖက်ရည်ဇွန်း'
    ],
    storage_en: 'Keep refrigerated in an airtight container or original foil wrapping.',
    storage_mm: 'ရေခဲသေတ္တာ အအေးခန်းထဲတွင် လေလုံအောင် ထားရှိပါ။',
    nutrition_en: '80% milkfat + 1.5-2% salt',
    nutrition_mm: 'နို့ဆီအဆီဓာတ် ၈၀% + ဆား ၁.၅-၂%',
    nutrition_short: '80% Milkfat + 1.5% Salt',
    image_emoji: '🧈',
  },
  {
    id: 'vegetable-oil',
    name_en: 'Vegetable Oil',
    name_mm: 'ဆီ / ဟင်းသီးဟင်းရွက်ဆီ (Vegetable Oil / Canola Oil)',
    category: 'dairy',
    uses_en: 'Remains completely liquid at room temperature and chilled conditions, producing exceptionally moist crumbs that stay tender for days. Best for chocolate cakes, carrot cakes, muffins, and chiffons.',
    uses_mm: 'အခန်းအပူချိန်နှင့် ရေခဲသေတ္တာထဲတွင်ပင် မခဲသွားဘဲ အရည်အဖြစ် တည်ရှိသဖြင့် မုန့်သားကို အလွန်စိုပြေစေပါသည်။ ချောကလက်ကိတ်၊ မာဖင်၊ ရှစ်ဖွန်ကိတ်နှင့် မုန်လာဥနီကိတ်များတွင် မုန့်သားမခြောက်သွေ့စေရန် သုံးပါသည်။ ထောပတ်ထက် ပေါ့ပါးသော အထိအတွေ့ကို ရရှိစေပါသည်။',
    substitutes_en: [
      'Canola oil, sunflower oil, corn oil, or melted butter (80g oil = 100g butter)'
    ],
    substitutes_mm: [
      'ပြောင်းဖူးဆီ၊ နေကြာဆီ၊ ကာနိုလာဆီ သို့မဟုတ် အရည်ဖျော်ထောပတ် (ဆီ ၈၀g = ထောပတ် ၁၀၀g)'
    ],
    storage_en: 'Store capped tightly in a cool, dark cupboard away from oven heat.',
    storage_mm: 'နေရောင်မထိသော အေးမြသည့်နေရာတွင် ပုလင်းအဖုံးလုံအောင် ပိတ်ထားပါ။',
    nutrition_en: '100% plant-based fat, rich in unsaturated fatty acids',
    nutrition_mm: 'အပင်ထွက် အဆီ ၁၀၀%၊ မပြည့်ဝဆီ ကြွယ်ဝ',
    nutrition_short: '100% Plant Unsaturated Fat',
    image_emoji: '🫗',
  },
  {
    id: 'fresh-milk',
    name_en: 'Fresh Whole Milk',
    name_mm: 'နို့ / နွားနို့လတ်ဆတ် (Fresh Cow Milk)',
    category: 'dairy',
    uses_en: 'Hydrates flour proteins to form gluten strands while softening the crumb. Natural milk sugars (lactose) promote golden crust caramelization and lend rich milky taste.',
    uses_mm: 'ဂျုံမှုန့်ထဲရှိ Gluten ကို ဖွဲ့စည်းစေရန် လိုအပ်သော အစိုဓာတ်ကို ဖြည့်ဆည်းပေးပြီး မုန့်သားကို နူးညံ့စေပါသည်။ နို့ထဲရှိ သဘာဝသကြားဓာတ် (Lactose) သည် မုန့်ဖုတ်ချိန်တွင် မျက်နှာပြင် ရွှေညိုရောင်သန်းစေပါသည်။ ပေါင်မုန့်၊ ကိတ်မုန့်နှင့် ကာစတပ်များတွင် အရသာစိုပြေမွှေးပျံ့စေရန် သုံးပါသည်။',
    substitutes_en: [
      'Reconstituted powdered milk or equal parts evaporated milk and water'
    ],
    substitutes_mm: [
      'နို့မှုန့်ဖျော်ရည် သို့မဟုတ် နို့စိမ်းနှင့် ရေ အချိုးညီ ရောစပ်အသုံးပြုနိုင်သည်'
    ],
    storage_en: 'Always keep refrigerated at 2-4°C. Check expiration date regularly.',
    storage_mm: 'ရေခဲသေတ္တာ အအေးခန်းထဲတွင် အမြဲထားပါ။ သက်တမ်းလွန်မလွန် သတိပြုပါ။',
    nutrition_en: 'Rich in calcium, protein, vitamin D, and natural dairy fat',
    nutrition_mm: 'ကယ်လ်စီယမ်၊ ပရိုတင်းနှင့် သဘာဝ နို့ဆီဓာတ်',
    nutrition_short: 'Calcium, Protein & Lactose',
    image_emoji: '🥛',
  },
  {
    id: 'evaporated-milk',
    name_en: 'Evaporated Milk',
    name_mm: 'နို့စိမ်း / နို့ငွေ့ (Evaporated Milk)',
    category: 'dairy',
    uses_en: 'Whole milk with 60% of water gently simmered away, concentrating dairy solids without adding sugar. Imparts luxurious body and creaminess to custards, egg tarts, and traditional cakes.',
    uses_mm: 'သာမန်နို့ထက် ရေဓာတ် ၆၀% လျှော့ချထားသဖြင့် ပိုမိုပျစ်နှစ်ပြီး ဆိမ့်သော နို့အရသာကို ပေးစွမ်းနိုင်ပါသည်။ မြန်မာ့ရိုးရာ မုန့်များ၊ ကိတ်မုန့်နှင့် ပူတင်းများတွင် နို့ရနံ့ပြင်းပြင်းနှင့် စိုစိုပြေပြေ ဖြစ်စေရန် သုံးပါသည်။ သကြားမပါဝင်သဖြင့် အချိုပမာဏကို မထိခိုက်စေဘဲ မုန့်သားအိစက်စေပါသည်။',
    substitutes_en: [
      '1 cup whole milk + 1 tbsp melted butter, or light cream'
    ],
    substitutes_mm: [
      'နို့လတ်ဆတ် ၁ ခွက် + ထောပတ် ၁ ဇွန်း သို့မဟုတ် Heavy cream'
    ],
    storage_en: 'Once opened, transfer to a glass jar and refrigerate; consume within 5-7 days.',
    storage_mm: 'ဘူးဖွင့်ပြီးပါက ဖန်ပုလင်းထဲ ပြောင်းထည့်၍ ရေခဲသေတ္တာထဲတွင် ၅-၇ ရက်အတွင်း သုံးပါ။',
    nutrition_en: 'Concentrated dairy solids with 2x intensity of regular milk',
    nutrition_mm: 'နို့အဆီအနှစ် ပြင်းအား ၂ ဆခန့် မြင့်မား',
    nutrition_short: '2x Concentrated Milk Solids',
    image_emoji: '🥫',
  },
  {
    id: 'condensed-milk',
    name_en: 'Sweetened Condensed Milk',
    name_mm: 'နို့ဆီ (Sweetened Condensed Milk)',
    category: 'dairy',
    uses_en: 'Thick, caramelized cooked milk with high sugar concentration that produces rich velvety textures in traditional desserts, fudges, fillings, and caramel puddings.',
    uses_mm: 'နို့နှင့် သကြားကို ပျစ်ခဲအောင် ကျိုထားသောကြောင့် အလွန်ချိုမြိန်ပြီး ဆိမ့်သော အထိအတွေ့ကို ပေးစွမ်းပါသည်။ ရွှေကြည်မုန့်၊ ဖာလူဒါ၊ ကာရာမယ်လ်ပူတင်းနှင့် မီးဖိုမလိုသော မုန့်များတွင် အချိုနှင့် နို့ဆီရနံ့အတွက် သုံးပါသည်။ မုန့်သားကို စေးကပ်ချောမွတ်စေရန် အထူးကောင်းမွန်ပါသည်။',
    substitutes_en: [
      '1 cup evaporated milk + 3/4 cup sugar simmered until thickened'
    ],
    substitutes_mm: [
      'နို့စိမ်း ၁ ခွက် + သကြား ၃/၄ ခွက်ကို အိုးထဲတွင် ပျစ်လာသည်အထိ ကျိုချက်သုံးနိုင်သည်'
    ],
    storage_en: 'Store opened cans covered in a refrigerator for up to 2-3 weeks.',
    storage_mm: 'ဘူးဖောက်ပြီးပါက လေလုံဘူးဖြင့် ရေခဲသေတ္တာထဲတွင် သိမ်းဆည်းပါ။',
    nutrition_en: 'High sugar carbohydrates combined with milk fat',
    nutrition_mm: 'သကြားဓာတ်နှင့် နို့အဆီဓာတ် ပျစ်နှစ်စွာ ပါဝင်',
    nutrition_short: 'Sweet Milk Fat Emulsion',
    image_emoji: '🍯',
  },
  {
    id: 'whipping-cream',
    name_en: 'Whipping Cream',
    name_mm: 'ဝှစ်ပင်းခရင်မ် (Whipping Cream / Heavy Cream)',
    category: 'dairy',
    uses_en: 'Contains at least 35% dairy fat to whip into velvety peaks that trap stable air bubbles. Indispensable for cake frosting, fillings, mousses, and silky chocolate ganache.',
    uses_mm: 'နို့ဆီအဆီဓာတ် ၃၅% နှင့်အထက် ပါဝင်ပြီး အေးခဲစွာ မွှေလိုက်ပါက လေပူဖောင်းများ ခိုအောင်းကာ ပွတက်လာပါသည်။ မွေးနေ့ကိတ်များ အလှဆင်ရန်၊ မုန့်လွှာကြား ညှပ်ရန်နှင့် ချောကလက် ဂါနာရှ် (Ganache) ပြုလုပ်ရာတွင် မရှိမဖြစ် သုံးပါသည်။ မုန့်သားကို နူးညံ့ပျော်ဝင်စေသော ရနံ့ကောင်းကို ရရှိစေပါသည်။',
    substitutes_en: [
      'Non-dairy whipping cream, or chilled coconut cream (for dairy-free piping)'
    ],
    substitutes_mm: [
      'Non-dairy whipping cream သို့မဟုတ် နို့စိမ်း + ထောပတ် (ဟင်းချက်အတွက်သာ ခရင်မ်မွှေ၍ မရပါ)'
    ],
    storage_en: 'Keep strictly refrigerated at 2-4°C; never freeze liquid cream as the emulsion splits.',
    storage_mm: 'ရေခဲသေတ္တာ ရိုးရိုးအအေးခန်းတွင် အမြဲထားပါ (အေးခဲအကန့်တွင် လုံးဝမထားရပါ၊ ကွဲထွက်သွားတတ်သည်)။',
    nutrition_en: '35-38% rich dairy milkfat, high calorie density',
    nutrition_mm: 'နို့ဆီအဆီဓာတ် ၃၅-၃၈%၊ စွမ်းအင် ကြွယ်ဝ',
    nutrition_short: '35-38% Dairy Milkfat',
    image_emoji: '🧁',
  },
  {
    id: 'fresh-eggs',
    name_en: 'Fresh Eggs',
    name_mm: 'ကြက်ဥ (Fresh Eggs)',
    category: 'egg',
    uses_en: 'Egg whites aerate batters to add lightness; yolks contain lecithin, a natural emulsifier binding fats with water. Provide structural lift, rich moisture, and golden coloration.',
    uses_mm: 'ကြက်ဥအကာသည် မုန့်သားကို လေခိုဖောင်းကြွစေပြီး၊ ကြက်ဥအနှစ်ရှိ လက်ဆီသင် (Lecithin) က အဆီနှင့် အရည်ကို သမစေပါသည်။ မုန့်သား၏ ဖွဲ့စည်းပုံကို ခိုင်မာစေခြင်း၊ စိုပြေစေခြင်းနှင့် ရွှေဝါရောင် သန်းစေခြင်းတို့ကို ဆောင်ရွက်ပေးပါသည်။ မုန့်ဖုတ်ရာတွင် အခန်းအပူချိန် ကြက်ဥကိုသာ အမြဲ ဦးစားပေး သုံးရပါသည်။',
    substitutes_en: [
      '1 egg = 1/4 cup mashed banana, 60g plain yogurt, or 1/4 cup applesauce'
    ],
    substitutes_mm: [
      'ကြက်ဥ ၁ လုံးလျှင် ငှက်ပျောသီးမှည့်ချေ ၁/၄ ခွက် သို့မဟုတ် ဒိန်ချဉ် ၆၀ ဂရမ် (သက်သတ်လွတ်အတွက်)'
    ],
    storage_en: 'Refrigerate pointed-end down. Bring to room temperature 30 minutes before baking.',
    storage_mm: 'ရေခဲသေတ္တာထဲတွင် သိမ်းပါ။ မုန့်မဖုတ်မီ အနည်းဆုံး မိနစ် ၃၀ ကြိုထုတ်၍ အခန်းအပူချိန် ပြုလုပ်ပါ။',
    nutrition_en: 'High biological value protein, natural lecithin, vitamins A, D, B12',
    nutrition_mm: 'အရည်အသွေးမြင့် ပရိုတင်း၊ သဘာဝ Emulsifier (Lecithin)',
    nutrition_short: 'High-Bio Protein & Lecithin',
    image_emoji: '🥚',
  },
  {
    id: 'vanilla-extract',
    name_en: 'Vanilla Extract',
    name_mm: 'ဗနီလာ / ဗနီလာအမွှေးနံ့ (Vanilla Extract)',
    category: 'flavor',
    uses_en: 'Masks raw egg and raw flour scents while tying dairy and sugar flavors together in aromatic harmony. The universal background aroma of baked sweets.',
    uses_mm: 'ကြက်ဥညှီနံ့နှင့် ဂျုံနံ့များကို ပျောက်ကွယ်စေပြီး မုန့်တစ်ခုလုံးကို သင်းပျံ့သော မွှေးရနံ့ ဖြစ်ပေါ်စေပါသည်။ သကြားနှင့် ထောပတ်၏ အရသာကို ပိုမိုပေါ်လွင်စေရန် သဘာဝအရသာ မြှင့်တင်ပေးသည့် အခန်းကဏ္ဍမှ ပါဝင်ပါသည်။ မုန့်ဖုတ်လုပ်ငန်း အားလုံးနီးပါးတွင် မရှိမဖြစ် ထည့်သွင်းရသော အဓိက အမွှေးနံ့ ဖြစ်ပါသည်။',
    substitutes_en: [
      'Pure vanilla bean paste, vanilla sugar, or almond extract (in smaller quantity)'
    ],
    substitutes_mm: [
      'ဗနီလာအမှုန့် (Vanilla powder)၊ ဗနီလာစေ့ သို့မဟုတ် ဗနီလာအက်ဆန့်'
    ],
    storage_en: 'Store tightly closed in a cool, dark pantry away from sunlight and direct heat.',
    storage_mm: 'နေရောင်မထိသော အခန်းအပူချိန် မှောင်သည့်ဗီဒိုထဲတွင် သေချာပိတ်၍ သိမ်းဆည်းပါ။',
    nutrition_en: 'Natural vanilla bean oil extract containing vanillin compounds',
    nutrition_mm: 'သဘာဝ ဗနီလာသီးတောင့် အဆီအနှစ်',
    nutrition_short: 'Natural Vanillin Extract',
    image_emoji: '🌼',
  },
  {
    id: 'table-salt',
    name_en: 'Fine Salt',
    name_mm: 'ဆား / ဆားနု (Fine Table Salt)',
    category: 'flavor',
    uses_en: 'Sharpens sweet flavor profiles and balances butter richness. In yeasted bread, salt tightens gluten strands and controls yeast activity for balanced proofing.',
    uses_mm: 'မုန့်ဖုတ်ရာတွင် ဆားအနည်းငယ် ထည့်ခြင်းသည် အချိုအရသာကို ပိုမိုလေးနက် ပေါ်လွင်စေပါသည်။ ပေါင်မုန့်လုပ်ရာတွင် တဆေး၏ အလုပ်လုပ်နှုန်းကို ထိန်းညှိပေးပြီး Gluten ကြောကို ပိုမိုခိုင်မာစေပါသည်။ မုန့်သား မအီသွားစေရန်နှင့် အရသာ အချိုးညီစေရန် ဇွန်းဖျားတစ်ရွေး အမြဲထည့်ရပါသည်။',
    substitutes_en: [
      'Fine sea salt or pink Himalayan salt measured equally by weight'
    ],
    substitutes_mm: [
      'ပင်လယ်ဆားနု (Fine Sea Salt) သို့မဟုတ် ဟိမဝန္တာ ပန်းရောင်ဆား'
    ],
    storage_en: 'Store dry in an airtight container to avoid moisture clumping.',
    storage_mm: 'အစိုဓာတ်ကင်းစင်သော လေလုံဘူးတွင် ထားရှိပါ။',
    nutrition_en: '99% Sodium chloride, essential flavor enhancer',
    nutrition_mm: 'ဆိုဒီယမ်ကလိုရိုက် ၉၉%၊ သဘာဝ အရသာထိန်းညှိပစ္စည်း',
    nutrition_short: '99% Sodium Chloride',
    image_emoji: '🧂',
  },
  {
    id: 'dark-chocolate',
    name_en: 'Dark Chocolate / Chocolate Chips',
    name_mm: 'ချောကလက် / ချောကလက်ချစ်ပ် (Dark Chocolate / Chocolate Chips)',
    category: 'flavor',
    uses_en: 'Melted into batters for decadent cakes, or folded whole as chips for cookies and brownies. Specialized bake-stable chocolate chips retain pleasant shape and gooey texture under oven heat.',
    uses_mm: 'မုန့်ဖုတ်ရာတွင် အရည်ဖျော်၍ ကိတ်မုန့်သားထဲ ထည့်သွင်းခြင်း သို့မဟုတ် ကွတ်ကီးထဲသို့ အစေ့လိုက် ထည့်သွင်းခြင်း ပြုလုပ်ပါသည်။ နက်ရှိုင်းသော ချောကလက် အရသာနှင့် စိုပြေသော Texture ကို ဖြစ်ပေါ်စေပါသည်။ မုန့်ဖုတ်အပူဒဏ်ခံနိုင်သော Baking Chocolate Chips ကို သုံးပါက ပုံစံမပျက်ဘဲ နူးညံ့စွာ ကျန်ရစ်စေပါသည်။',
    substitutes_en: [
      '3 tbsp unsweetened cocoa powder + 1 tbsp melted butter = 30g dark chocolate'
    ],
    substitutes_mm: [
      'ကိုကိုးမှုန့် ၃ စားပွဲတင်ဇွန်း + ထောပတ် ၁ ဇွန်း = ချောကလက် ၁ အောင်စ (၃၀ ဂရမ်)'
    ],
    storage_en: 'Store in a cool, dry place at 18-20°C. Storing in the fridge causes sugar/fat bloom.',
    storage_mm: 'အပူချိန် ၁၈°C-၂၀°C ရှိသော ခြောက်သွေ့အေးမြသည့် နေရာတွင် ထားပါ။ ရေခဲသေတ္တာထဲ ထည့်ပါက အပေါ်ယံ အဖြူကွက် (Bloom) ထတတ်ပါသည်။',
    nutrition_en: 'Cocoa butter, flavonoids, rich in iron and antioxidants',
    nutrition_mm: 'ကိုကိုးအဆီ (Cocoa Butter)၊ Antioxidants နှင့် သံဓာတ် ကြွယ်ဝ',
    nutrition_short: 'Cocoa Butter & Antioxidants',
    image_emoji: '🍫',
  },
  {
    id: 'cocoa-powder',
    name_en: 'Pure Cocoa Powder',
    name_mm: 'ကိုကိုး / ကိုကိုးမှုန့်စစ်စစ် (Pure Unsweetened Cocoa Powder)',
    category: 'flavor',
    uses_en: 'Concentrated unsweetened pure cocoa that brings deep roasted chocolate notes and striking dark color to devil’s food cakes, brownies, and cookies. Reacts with baking soda for extra lift.',
    uses_mm: 'သကြားမပါသော ကိုကိုးစစ်စစ် ဖြစ်ပြီး ချောကလက်ကိတ်နှင့် ဘရောင်းနီများတွင် ခါးသက်မွှေးပျံ့သော ချောကလက်အရသာကို ပေးစွမ်းပါသည်။ ဂျုံမှုန့်နှင့် ရောစပ်ကာ ဇကာစစ်ထည့်ရပြီး မုန့်သားအရောင်ကို ညိုမည်းလှပစေပါသည်။ မုန့်ဖုတ်ဆိုဒါနှင့် ဓာတ်ပြုကာ မုန့်သားဖောင်းတက်စေရန်လည်း ကူညီပေးပါသည်။',
    substitutes_en: [
      'Dutch-processed cocoa powder or melted unsweetened baking chocolate'
    ],
    substitutes_mm: [
      'Dutch-processed cocoa powder သို့မဟုတ် အရည်ဖျော်ထားသော Dark chocolate'
    ],
    storage_en: 'Keep sealed in an airtight jar away from kitchen moisture. Sift before use.',
    storage_mm: 'လေလုံဘူးထဲတွင် အစိုဓာတ်ကင်းစွာ သိမ်းဆည်းပါ။ ဇကာစစ်ပြီးမှ အသုံးပြုပါ။',
    nutrition_en: 'Defatted cocoa solids, high in polyphenols and flavonoids',
    nutrition_mm: 'အဆီဓာတ်နည်း ကိုကိုးမှုန့်၊ Flavonoids ဓာတ်တိုးဆန့်ကျင်ပစ္စည်း မြင့်မား',
    nutrition_short: 'Rich Polyphenols & Flavonoids',
    image_emoji: '☕',
  },
  {
    id: 'coconut-milk',
    name_en: 'Coconut Milk',
    name_mm: 'အုန်းနို့ / အုန်းနို့ရည်ပျစ်ပျစ် (Thick Coconut Milk)',
    category: 'dairy',
    uses_en: 'Adds distinct tropical richness and delicate aroma to Asian tea cakes, chiffon cakes, and puddings. Serves as a luxurious dairy-free milk substitute that keeps crumb ultra-tender.',
    uses_mm: 'မြန်မာ့ရိုးရာ မုန့်များဖြစ်သော ရွှေကြည်မုန့်၊ ဆနွင်းမကင်းနှင့် အုန်းနို့ကိတ်များတွင် ထူးခြားသော ရနံ့နှင့် ဆိမ့်သော အရသာအတွက် အဓိက သုံးပါသည်။ နို့ထွက်ပစ္စည်း မစားနိုင်သူများအတွက် နွားနို့အစားထိုး မုန့်ဖုတ်ရာတွင် သုံးနိုင်ပါသည်။ သဘာဝအုန်းဆီဓာတ် ပါဝင်သဖြင့် မုန့်သားကို အလွန်အိစက်စိုပြေစေပါသည်။',
    substitutes_en: [
      'Coconut cream dissolved in warm water, or heavy dairy cream'
    ],
    substitutes_mm: [
      'အုန်းနို့မှုန့် ရေနွေးဖျော် သို့မဟုတ် Heavy cream (ရိုးရာမုန့်တွင်မူ အုန်းနို့စစ်စစ်က အကောင်းဆုံးဖြစ်သည်)'
    ],
    storage_en: 'Once opened, transfer to a sealed container and refrigerate; consume within 3 days.',
    storage_mm: 'သံဗူးဖွင့်ပြီးပါက လေလုံဘူးဖြင့် ရေခဲသေတ္တာထဲတွင် ၃ ရက်အတွင်း ကုန်အောင် သုံးပါ။',
    nutrition_en: 'Medium-chain triglycerides (MCT fats), plant-based dairy alternative',
    nutrition_mm: 'သဘာဝ အုန်းအဆီ (MCTs)၊ အပင်ထွက် အဆီအနှစ် ကြွယ်ဝ',
    nutrition_short: 'Plant MCT Fats (Dairy-Free)',
    image_emoji: '🥥',
  },
];

/**
 * 15 Common Baking Tools with complete bilingual data:
 * name_en, purpose_en, how_to_use_en, care_en, alternatives_en[]
 * name_mm, purpose_mm, how_to_use_mm, care_mm, alternatives_mm[]
 */
export const DEFAULT_TOOLS = [
  {
    id: 'baking-oven',
    name_en: 'Baking Oven',
    name_mm: 'ဖုတ်စက် / မုန့်ဖုတ်မီးဖို (Baking Oven)',
    purpose_en: 'Provides steady top and bottom radiant heating to bake batters into fully set, golden creations. Circulates heat for even crust development and proper leavening rise. The central workhorse of all baking.',
    purpose_mm: 'မုန့်ဖုတ်ရာတွင် အပူချိန်ကို အောက်မီး၊ အပေါ်မီး တိကျစွာ ပေးစွမ်းပြီး မုန့်နှစ်ကို ကျက်နပ်ဖောင်းကြွစေရန် အဓိက အသုံးပြုပါသည်။ လေပူလှည့်ပတ်မှုဖြင့် မုန့်သားအတွင်းပိုင်းအထိ အညီအမျှ ကျက်စေပြီး မျက်နှာပြင်ကို ရွှေညိုရောင် လှပစေပါသည်။ မုန့်ဖုတ်လုပ်ငန်း အားလုံး၏ အရေးအကြီးဆုံး ဗဟိုကိရိယာ ဖြစ်ပါသည်။',
    how_to_use_en: 'Always preheat for 15-20 minutes before inserting pans. Place baking pans on the middle rack for uniform airflow and heat distribution.',
    how_to_use_mm: 'မုန့်မထည့်မီ အနည်းဆုံး ၁၅-၂၀ မိနစ် ကြိုတင် အပူပေးထားပါ (Preheat)။ မုန့်ဗန်းကို မီးဖို၏ အလယ်စင် (Middle rack) တွင် အမြဲထားဖုတ်ပါ။',
    care_en: 'Let cool completely before wiping interior walls with a damp cloth. Clean oven glass door gently without abrasive pads.',
    care_mm: 'မုန့်ဖုတ်ပြီးပါက အအေးခံပြီး အတွင်းပိုင်း အဆီစွန်းများကို စိုစွတ်သောအဝတ်ဖြင့် ပုံမှန် သုတ်သင်ပါ။ မီးဖိုမှန်တံခါးကို ဂရုတစိုက် သန့်ရှင်းပါ။',
    alternatives_en: [
      'Air Fryer (reduce recipe temp by 20°C) or heavy cast iron pot baking'
    ],
    alternatives_mm: [
      'အဲဖရိုင်းယား (Air Fryer - အပူချိန် ၂၀°C လျှော့သုံးပါ) သို့မဟုတ် ဒယ်အိုးထူထူဖြင့် အောက်ခံသဲ/ဆားခံဖုတ်နည်း'
    ],
    image_emoji: '🔥',
  },
  {
    id: 'hand-mixer',
    name_en: 'Electric Hand Mixer',
    name_mm: 'လက်နှိပ်စက် / လျှပ်စစ်လက်ကိုင်မစ်ဆာ (Hand Mixer)',
    purpose_en: 'Whips egg whites into glossy stiff meringue and creams butter and sugar fluffy in minutes. Saves significant manual effort and ensures consistent batter aeration.',
    purpose_mm: 'ကြက်ဥအကာ (Meringue) ကို လေခိုအမြှုပ်ထစေရန်နှင့် ထောပတ်သကြားတို့ကို ဖြူဖွေးအိစက်သွားအောင် မွှေရန် သုံးပါသည်။ လူအားစိုက်ထုတ်ရမှု သက်သာစေပြီး မုန့်နှစ်ကို မိနစ်ပိုင်းအတွင်း အချိုးညီ သမစေပါသည်။ ကိတ်မုန့်သား နူးညံ့အိစက်စေရန် မရှိမဖြစ် အရေးပါသော လျှပ်စစ်ကိရိယာ ဖြစ်ပါသည်။',
    how_to_use_en: 'Start at the lowest speed (Speed 1) to prevent splattering, then gradually increase speed while guiding beaters in smooth circular motions.',
    how_to_use_mm: 'အမြန်နှုန်း အနိမ့်ဆုံး (Speed 1) မှ စတင်ပါ၊ ပါဝင်ပစ္စည်းများ လွင့်မစင်စေရန် ဇလုံကို အသာစောင်း၍ စက်ဝိုင်းပုံ ရွှေ့ပေးပါ။',
    care_en: 'Never immerse motor body in water; wipe housing with a damp cloth and wash beaters thoroughly with soapy warm water.',
    care_mm: 'မော်တာကိုယ်ထည်ကို ရေလုံးဝမဆေးရပါ၊ မွှေတံခေါင်းများကိုသာ ဖြုတ်၍ ဆပ်ပြာဖြင့် ဆေးကြောအခြောက်ခံပါ။',
    alternatives_en: [
      'Balloon whisk (requires 3x more physical stamina and time)'
    ],
    alternatives_mm: [
      'လက်ကိုင်မွှေတံ (Balloon Whisk - လူအားနှင့် အချိန် ၃ ဆခန့် ပိုမိုစိုက်ထုတ်ရပါသည်)'
    ],
    image_emoji: '🔌',
  },
  {
    id: 'cake-pan',
    name_en: 'Baking Pan',
    name_mm: 'မုန့်ဖုတ်ဗန်း / ကိတ်မုန့်ဗန်း (Baking Pan / Cake Tin)',
    purpose_en: 'Holds batter in consistent thickness and designated shape during oven baking. Distributes heat evenly across bottom and sides for even rise in round, square, or loaf cakes.',
    purpose_mm: 'မုန့်နှစ်များကို သတ်မှတ်ထားသော ပုံသဏ္ဌာန်နှင့် အထူအပါးအတိုင်း တည်ငြိမ်စွာ ဖုတ်နိုင်စေရန် ထည့်သွင်းသော ဗန်းဖြစ်ပါသည်။ အပူဒဏ်ကို အညီအမျှ ကူးစက်စေပြီး ကိတ်မုန့်၊ ဘရောင်းနီနှင့် ပေါင်မုန့်များကို ပုံကျစေပါသည်။ အဝိုင်း၊ လေးထောင့်နှင့် ပေါင်မုန့်ရှည်ဗန်း စသဖြင့် အမျိုးမျိုး ရှိပါသည်။',
    how_to_use_en: 'Line pan base with parchment paper; fill batter to roughly 70-80% full to prevent overflowing during baking rise.',
    how_to_use_mm: 'အောက်ခြေတွင် မုန့်ဖုတ်စက္ကူ ခင်းပေးပါ၊ ဘေးဘောင်ကို ဆီမသုတ်ဘဲ မုန့်နှစ်ကို ဗန်း၏ ၇၀-၈၀% သာ ဖြည့်သွင်းပါ။',
    care_en: 'Avoid scratching nonstick coatings with knives or metal utensils; wash with soft sponge and dry immediately.',
    care_mm: 'ဓား သို့မဟုတ် သံဇွန်းဖြင့် မခြစ်ရပါ၊ ကပ်မငြိသောအလွှာ မပျက်စီးစေရန် ဆပ်ပြာပျော့ sponge ဖြင့်သာ ဆေးကြောပါ။',
    alternatives_en: [
      'Oven-safe Pyrex glass dish or stainless steel pan lined with parchment'
    ],
    alternatives_mm: [
      'ဖန်အပူခံဗန်း (Pyrex) သို့မဟုတ် စတီးဗန်း (မုန့်ဖုတ်စက္ကူ သေချာခင်းသုံးရမည်)'
    ],
    image_emoji: '🥧',
  },
  {
    id: 'balloon-whisk',
    name_en: 'Balloon Whisk',
    name_mm: 'လက်ကိုင်မွှေတံ (Balloon Whisk)',
    purpose_en: 'Quickly froths eggs, liquids, and dry flour mixtures. Multiple bulbous wire loops introduce air bubbles effectively into pancake batters, sauces, and custards.',
    purpose_mm: 'ကြက်ဥ၊ အရည်နှင့် သကြားတို့ကို လျင်မြန်စွာ အမြှုပ်ထစေရန်နှင့် ဂျုံမှုန့်များကို ဇကာမစစ်မီ သမအောင် မွှေရန် သုံးပါသည်။ ဘောလုံးပုံစံ ဝါယာကြိုးများစွာ ပါဝင်သဖြင့် လေပူဖောင်းများကို မုန့်နှစ်ထဲသို့ ထိရောက်စွာ သွင်းပေးနိုင်ပါသည်။ ဆော့စ်များနှင့် ပန်ကိတ်မုန့်နှစ် မွှေရာတွင်လည်း မရှိမဖြစ် သုံးပါသည်။',
    how_to_use_en: 'Whisk in rapid circular or figure-8 strokes from the wrist to incorporate maximum air volume.',
    how_to_use_mm: 'လက်ကောက်ဝတ်ကို လျင်မြန်စွာ အသုံးပြု၍ စက်ဝိုင်းပုံ သို့မဟုတ် အက္ခရာ ၈ ပုံစံ လေဝင်အောင် မွှေခလောက်ပါ။',
    care_en: 'Rinse immediately after use so batter does not dry and cake between wires.',
    care_mm: 'မုန့်နှစ်များ ဝါယာကြိုးကြားတွင် ကပ်ငြိခြောက်သွေ့မသွားစေရန် အသုံးပြုပြီးပြီးချင်း ချက်ချင်း ရေဆေးပါ။',
    alternatives_en: [
      'Two dinner forks held side-by-side'
    ],
    alternatives_mm: [
      'ခက်ရင်း (Fork) ၂ ချောင်း ပူးတွဲမွှေခြင်း'
    ],
    image_emoji: '🥢',
  },
  {
    id: 'silicone-spatula',
    name_en: 'Silicone Spatula',
    name_mm: 'စီလီကွန်ယောက်မပြား (Silicone Spatula)',
    purpose_en: 'Crucial for gentle folding motions that combine delicate whipped whites without deflating air pockets. Flexible head cleanly scrapes every drop from mixing bowls.',
    purpose_mm: 'ကိတ်မုန့်မွှေရာတွင် လေခိုပူဖောင်းများ မသေစေဘဲ ဖြည်းညင်းစွာ ခေါက်မွှေရန် (Folding method) အဓိက သုံးပါသည်။ ပျော့ပျောင်းသော စီလီကွန်ထိပ်ဖျားဖြင့် ဇလုံဘေးပတ်လည်ရှိ မုန့်နှစ်များကို တစ်စက်မကျန် ပြောင်စင်အောင် သုတ်ယူနိုင်ပါသည်။ အပူဒဏ်ခံနိုင်သဖြင့် မီးဖိုပေါ်တွင် ကာစတပ်နှင့် ဆော့စ်ကျိုရာတွင်လည်း သုံးပါသည်။',
    how_to_use_en: 'Cut down the center of the bowl, sweep across the bottom, and fold up and over in a gentle J-motion.',
    how_to_use_mm: 'ဇလုံအလယ်ကို ဓားဖြတ်သလို ဖြတ်ကာ အောက်ခြေမှ ကော်ယူပြီး အပေါ်သို့ လှန်တင်သော J-motion ဖြင့် ဖြည်းညင်းစွာ ခေါက်မွှေပါ။',
    care_en: 'Wash in warm soapy water; keep away from sharp serrated knife blades.',
    care_mm: 'ဆပ်ပြာရည်နွေးဖြင့် ဆေးကြောပါ၊ ဓားထက်ထက်များနှင့် မထိမိစေရန် ဂရုပြုပါ။',
    alternatives_en: [
      'Flat wooden spoon or wide rubber scraper'
    ],
    alternatives_mm: [
      'သစ်သားယောက်မပြား သို့မဟုတ် ရိုးရိုးယောက်မကြီး'
    ],
    image_emoji: '🥄',
  },
  {
    id: 'measuring-cups',
    name_en: 'Measuring Cups',
    name_mm: 'အတိုင်းအတာခွက်စုံ (Measuring Cups)',
    purpose_en: 'Standard volumetric cups (1 cup, 1/2, 1/3, 1/4 cup) for portioning flours, sugars, and liquids when a scale is unavailable.',
    purpose_mm: 'ဂျုံမှုန့်၊ သကြားနှင့် နို့အရည်များကို သတ်မှတ်ထားသော စံခွက် (1 cup, 1/2, 1/3, 1/4 cup) အလိုက် တိုင်းတာရန် သုံးပါသည်။ ချိန်ခွင်မရှိသော အခါတွင် ချက်နည်းပါ အချိုးအစားများကို မှန်ကန်စွာ ထည့်သွင်းနိုင်စေရန် ကူညီပေးပါသည်။ အခြောက်ပစ္စည်းတိုင်းခွက်နှင့် အရည်တိုင်းခွက်ဟူ၍ ခွဲခြားထားပါသည်။',
    how_to_use_en: 'Spoon flour lightly into the cup and level off flush with the back of a flat knife without packing down.',
    how_to_use_mm: 'ဂျုံမှုန့်ကို ခွက်ထဲ မသိပ်ရပါ၊ ဇွန်းဖြင့် ဖြူးထည့်ပြီး ဓားကျောဖြင့် မျက်နှာပြင် ညီညာအောင် ခြစ်ချရပါမည်။',
    care_en: 'Wash gently to prevent measurement markings from rubbing off.',
    care_mm: 'အပူလွန်ကဲသော နေရာတွင် မထားပါနှင့်၊ စာသားများ မပြယ်စေရန် ညင်သာစွာ ဆေးကြောပါ။',
    alternatives_en: [
      'Digital kitchen scale (weighing in grams is far more accurate)'
    ],
    alternatives_mm: [
      'ဒီဂျစ်တယ်ချိန်ခွင် (ချိန်ခွင်က ခွက်ထက် ပိုမိုတိကျပါသည်)'
    ],
    image_emoji: '🥛',
  },
  {
    id: 'measuring-spoons',
    name_en: 'Measuring Spoons',
    name_mm: 'အတိုင်းအတာဇွန်းစုံ (Measuring Spoons)',
    purpose_en: 'Measures small, potent baking agents accurately from 1 Tbsp down to 1 tsp, 1/2 tsp, and 1/4 tsp. Crucial because slight errors in leaveners alter cake outcomes.',
    purpose_mm: 'ဘိတ်ကင်ပေါင်ဒါ၊ ဆိုဒါ၊ တဆေး၊ ဆားနှင့် ဗနီလာကဲ့သို့ ပမာဏအနည်းငယ်သာ လိုအပ်သော ပစ္စည်းများကို တိကျစွာ ချိန်ရန် သုံးပါသည်။ စားပွဲတင်ဇွန်း (1 Tbsp) မှသည် လက်ဖက်ရည်ဇွန်း (1 tsp, 1/2, 1/4 tsp) အထိ ပါဝင်ပါသည်။ မုန့်ဖုတ်ရာတွင် ပေါင်ဒါအနည်းအများ မှားယွင်းပါက မုန့်ပျက်စီးတတ်သဖြင့် အလွန်အရေးကြီးပါသည်။',
    how_to_use_en: 'Dip into powder and scrape flat against container edge for exact level measurement.',
    how_to_use_mm: 'ဇွန်းအပြည့် မောက်မောက်မယူဘဲ မျက်နှာပြင် ညီညာအောင် ခြစ်ချပြီးမှ တိုင်းတာထည့်သွင်းပါ။',
    care_en: 'Keep attached to their organizing ring so individual spoons never get misplaced.',
    care_mm: 'အစုံလိုက် ကွင်းထဲတွင် စုစည်းချိတ်ဆွဲထားပါက မပျောက်ရှဘဲ သန့်ရှင်းစွာ ထားရှိနိုင်ပါသည်။',
    alternatives_en: [
      'Standard cutlery teaspoons (use with caution as sizes vary widely)'
    ],
    alternatives_mm: [
      'သာမန် ဟင်းစားဇွန်းနှင့် လက်ဖက်ရည်ဇွန်း (သို့သော် တိကျမှု လျော့နည်းနိုင်သည်)'
    ],
    image_emoji: '🥄',
  },
  {
    id: 'kitchen-scale',
    name_en: 'Kitchen Digital Scale',
    name_mm: 'မီးဖိုချောင်ချိန်ခွင် (Kitchen Digital Scale)',
    purpose_en: 'The #1 most important baker’s tool, measuring precision down to 1 gram. Eliminates volume inconsistencies and guarantees reproducible crumb texture every single bake.',
    purpose_mm: 'မုန့်ဖုတ်ပညာတွင် အောင်မြင်မှုအတွက် နံပါတ်တစ် အရေးအကြီးဆုံး ကိရိယာဖြစ်ပြီး ၁ ဂရမ်အထိ တိကျစွာ ချိန်တွယ်ပေးပါသည်။ ခွက်ဖြင့် တိုင်းခြင်းထက် ဂရမ်ဖြင့် ချိန်ခြင်းက မုန့်သားသိပ်သည်းဆ ကွာခြားမှုကို ကာကွယ်ပေးပါသည်။ ကိတ်မုန့်သား အမြဲတမ်း စံချိန်မီ နူးညံ့စေရန် မရှိမဖြစ် လိုအပ်ပါသည်။',
    how_to_use_en: 'Set bowl on platform, press Tare to zero reading, and add ingredients slowly to the exact gram.',
    how_to_use_mm: 'ဇလုံကို အရင်တင်ပါ၊ Tare ခလုတ်ကို နှိပ်၍ 0g ပြုလုပ်ပြီးမှ ပါဝင်ပစ္စည်းများကို ဖြည်းဖြည်းချင်း ချိန်တွယ်ပါ။',
    care_en: 'Wipe surface with dry cloth; do not submerge in water. Replace batteries when low.',
    care_mm: 'ရေစိုမခံပါ၊ အသုံးပြုပြီးပါက အဝတ်ခြောက်ဖြင့် သုတ်၍ ညီညာသော မျက်နှာပြင်ပေါ်တွင် ထားပါ။ ဓာတ်ခဲကုန်ပါက လဲလှယ်ပါ။',
    alternatives_en: [
      'Standard volumetric measuring cups and spoons'
    ],
    alternatives_mm: [
      'အတိုင်းအတာခွက်နှင့် ဇွန်းများ'
    ],
    image_emoji: '⚖️',
  },
  {
    id: 'oven-thermometer',
    name_en: 'Oven Thermometer',
    name_mm: 'မီးဖိုအတွင်းအပူချိန်တိုင်းကိရိယာ (Oven Thermometer)',
    purpose_en: 'Verifies true internal oven temperature which often deviates 10-25°C from appliance dials. Prevents sunken cake centers, cracked tops, and uneven browning.',
    purpose_mm: 'အိမ်သုံးမီးဖိုများ၏ အပြင်ခလုတ်သည် အတွင်းအပူချိန်အမှန်နှင့် ၁၀°C မှ ၂၅°C အထိ ကွာခြားတတ်သဖြင့် အမှန်တကယ် အပူကို သိရှိရန် သုံးပါသည်။ ကိတ်မုန့် အလယ်ကျွံခြင်း သို့မဟုတ် မျက်နှာပြင် ကွဲအက်ခြင်းများကို ကာကွယ်ပေးနိုင်ပါသည်။ မီးဖိုထဲတွင် ချိတ်ဆွဲထားရုံဖြင့် တိကျသော အပူချိန်ကို အမြဲ စောင့်ကြည့်နိုင်ပါသည်။',
    how_to_use_en: 'Hang from middle oven rack near center and read temperature through the glass door.',
    how_to_use_mm: 'မီးဖိုအတွင်း ကင်စင်အလယ်တွင် ချိတ်ဆွဲထားပြီး မီးဖိုမှန်တံခါးမှတစ်ဆင့် အပူချိန်ကို ကြည့်ရှုပါ။',
    care_en: 'Leave permanently in oven; avoid sudden cold water shock while glass is scorching hot.',
    care_mm: 'မီးဖိုထဲတွင် အမြဲချိတ်ထားနိုင်သည်၊ ရေအေးဖြင့် ရုတ်တရက် ဆေးကြောခြင်း ရှောင်ကြဉ်ပါ။',
    alternatives_en: [
      'Relying solely on external oven dial with careful visual inspection'
    ],
    alternatives_mm: [
      'မီးဖိုခလုတ်ကို အားကိုးခြင်း (အပူချိန် အတက်အကျ စောင့်ကြည့်ရမည်)'
    ],
    image_emoji: '🌡️',
  },
  {
    id: 'cooling-rack',
    name_en: 'Wire Cooling Rack',
    name_mm: 'မုန့်အအေးခံဇကာ (Wire Cooling Rack)',
    purpose_en: 'Elevates fresh bakes to allow complete 360° air circulation underneath. Prevents condensation steam from pooling on pan bottoms and turning crusts soggy.',
    purpose_mm: 'မုန့်ဖုတ်ပြီးပြီးချင်း ဗန်းထဲတွင် မထားဘဲ အောက်ခြေမှ လေဝင်လေထွက်ကောင်းစေရန် အအေးခံထားသော ဇကာဖြစ်ပါသည်။ အောက်ခြေတွင် ချွေးပြန်ကာ မုန့်သား စိုစိစိဖြစ်သွားခြင်းကို ကာကွယ်ပေးပါသည်။ ကွတ်ကီးများကို ကြွပ်ရွစေပြီး ကိတ်မုန့်များကို ပုံစံမပျက်ဘဲ အေးသွားစေရန် အသုံးပြုပါသည်။',
    how_to_use_en: 'Transfer hot cakes or cookies out of pans and set directly onto wire grids with small gaps.',
    how_to_use_mm: 'မီးဖိုထဲမှ ထုတ်ပြီးသော ကိတ်မုန့် သို့မဟုတ် ကွတ်ကီးများကို ဗန်းမှထုတ်၍ ဇကာပေါ်တွင် အကွာအဝေးချန်ကာ တင်ထားပါ။',
    care_en: 'Dry immediately after washing to prevent wire oxidation and rust.',
    care_mm: 'ဆေးကြောပြီးပါက သံချေးမတက်စေရန် အဝတ်ခြောက်ဖြင့် ချက်ချင်း သုတ်ပေးပါ။',
    alternatives_en: [
      'Oven wire shelf or clean woven bamboo rack'
    ],
    alternatives_mm: [
      'မီးဖိုကင်စင် သို့မဟုတ် သန့်ရှင်းသော ဝါးဇကာ'
    ],
    image_emoji: '🧇',
  },
  {
    id: 'parchment-paper',
    name_en: 'Parchment Paper',
    name_mm: 'မုန့်ဖုတ်စက္ကူ (Parchment Paper)',
    purpose_en: 'Heat-resistant silicone-coated baking liner that eliminates sticking so cakes lift out effortlessly. Minimizes pan cleanup and stops cookie bottoms from scorching.',
    purpose_mm: 'မုန့်ဗန်းတွင် ကပ်မငြိစေရန်နှင့် မုန့်ကျက်ပါက အလွယ်တကူ ကွာကျလာစေရန် အောက်ခြေတွင် ခင်းရသော အပူဒဏ်ခံ ဆီစိမ်စက္ကူ ဖြစ်ပါသည်။ ဗန်းဆေးကြောရ သက်သာစေပြီး ကိတ်မုန့်အောက်ခြေ မတူးအောင်လည်း ကာကွယ်ပေးပါသည်။ ကွတ်ကီးနှင့် ပေါင်မုန့်ဖုတ်ရာတွင်လည်း မရှိမဖြစ် ခင်းပေးရပါသည်။',
    how_to_use_en: 'Cut circle or rectangle matching pan base; dab a little butter underneath corners to keep in place.',
    how_to_use_mm: 'မုန့်ဗန်းအရွယ်အစားအတိုင်း ညှပ်၍ အောက်ခြေတွင် ခင်းပါ။ ထောင့်များ မကြွစေရန် ထောပတ်အနည်းငယ် တို့ပေးနိုင်ပါသည်။',
    care_en: 'Single use. Never confuse with wax paper which produces smoke in hot ovens.',
    care_mm: 'တစ်ခါသုံး ဖြစ်ပြီး ဖယောင်းစက္ကူ (Wax Paper) နှင့် မမှားအောင် သတိပြုပါ (Wax paper သည် မီးဖိုထဲ မီးခိုးထွက်တတ်သည်)။',
    alternatives_en: [
      'Reusable silicone baking mat (Silpat) or butter and flour coating'
    ],
    alternatives_mm: [
      'စီလီကွန် မုန့်ဖုတ်ဖျာ (Silicone baking mat) သို့မဟုတ် ထောပတ်သုတ်၍ ဂျုံမှုန့်ဖြူးခြင်း'
    ],
    image_emoji: '📜',
  },
  {
    id: 'flour-sifter',
    name_en: 'Flour Sifter',
    name_mm: 'ဂျုံစစ်ဇကာ (Flour Sifter / Fine Strainer)',
    purpose_en: 'Breaks down compact flour, cocoa, and leavener lumps while introducing light aeration. Blends dry ingredients evenly for delicate, lump-free cake crumb.',
    purpose_mm: 'ဂျုံမှုန့်၊ ကိုကိုးမှုန့်နှင့် ဘိတ်ကင်ပေါင်ဒါတို့ ခဲနေသော အဖုအကျိတ်များကို ချေဖျက်ပေးပြီး အမှုန်များကို လေဝင်ပေါ့ပါးစေရန် သုံးပါသည်။ ပါဝင်ပစ္စည်း အခြောက်များ အချင်းချင်း သမအောင် ရောစပ်ပေးသဖြင့် မုန့်သားကို အလွန်နူးညံ့စေပါသည်။ ကိတ်မုန့်လုပ်ရာတွင် အနည်းဆုံး ၂ ကြိမ် စစ်ပေးခြင်းဖြင့် မုန့်သား ပိုမိုဖောင်းကြွစေပါသည်။',
    how_to_use_en: 'Rest over bowl, add dry blend, and tap rim lightly to let aerated powder rain down.',
    how_to_use_mm: 'ဇလုံပေါ်တွင် ဇကာကိုတင်၍ ဂျုံမှုန့်ထည့်ကာ ဇကာဘေးဘောင်ကို လက်ဖြင့် အသာပုတ်၍ စစ်ချပါ။',
    care_en: 'Shake out dry flour residue; if washed, dry in sunlight immediately to stop mesh rust.',
    care_mm: 'အသုံးပြုပြီးပါက အခြောက်ခါထုတ်ပါ၊ ရေဆေးပါက သံချေးမတက်စေရန် နေရောင်တွင် ချက်ချင်း အခြောက်လှန်းပါ။',
    alternatives_en: [
      'Vigorously whisking dry ingredients in a large bowl with a wire whisk'
    ],
    alternatives_mm: [
      'လက်ကိုင်မွှေတံ (Whisk) ဖြင့် ဇလုံထဲတွင် အားကြိုးမာန်တက် မွှေပေးခြင်း'
    ],
    image_emoji: '🕸️',
  },
  {
    id: 'piping-bag-tips',
    name_en: 'Piping Bags & Tips',
    name_mm: 'ခရင်မ်ညှစ်အိတ်နှင့် ခေါင်းများ (Piping Bags & Tips)',
    purpose_en: 'Essential decorating set for piping decorative buttercream rosettes, borders, lettering, choux pastry puffs, and uniform macaron shells.',
    purpose_mm: 'ကိတ်မုန့်မျက်နှာပြင်ပေါ်တွင် ပန်းပွင့်ဖော်ခြင်း၊ နာမည်ရေးခြင်းနှင့် ဘေးဘောင် အလှဆင်ခြင်းတို့အတွက် အသုံးပြုပါသည်။ ရှူးခရင်မ် (Choux puffs) ညှစ်ခြင်းနှင့် မကာရွန်း (Macaron) မုန့်လုံးများ ညီညာစွာ ချရန်လည်း သုံးပါသည်။ မုန့်ကို ပရော်ဖက်ရှင်နယ် ဆန်ဆန် လှပသပ်ရပ်စေသော အလှဆင်ကိရိယာ ဖြစ်ပါသည်။',
    how_to_use_en: 'Insert tip into bag corner, fill half full with frosting, twist top, and squeeze gently from the palm.',
    how_to_use_mm: 'ခေါင်းကို အိတ်ထိပ်တွင် တပ်ဆင်ပါ၊ ခရင်မ်ကို အိတ်၏ ထက်ဝက်သာ ထည့်၍ အပေါ်ပိုင်းကို လိမ်ကာ လက်ဖဝါးဖြင့် ဖိညှစ်ပါ။',
    care_en: 'Clean metal tips with warm soapy water and small brush; discard single-use plastic bags.',
    care_mm: 'ခေါင်းများကို ဆပ်ပြာရည်နွေးဖြင့် စုတ်တံသေးသေးလေး သုံးကာ သန့်ရှင်းပါ။ တစ်ခါသုံးအိတ် သုံးပါက စွန့်ပစ်ပါ။',
    alternatives_en: [
      'Heavy-duty Ziploc bag with small corner cut off'
    ],
    alternatives_mm: [
      'ဇစ်လော့အိတ် (Ziploc bag) ထောင့်စွန်းကို အနည်းငယ် ကတ်ကြေးဖြင့် ညှပ်သုံးခြင်း'
    ],
    image_emoji: '🧁',
  },
  {
    id: 'stand-mixer',
    name_en: 'Stand Mixer',
    name_mm: 'စတန်းမစ်ဆာ စက်ကြီး (Stand Mixer)',
    purpose_en: 'Heavy-duty motorized planetary mixer that kneads elastic yeast doughs with dough hooks and whips large batches effortlessly hands-free.',
    purpose_mm: 'အားပြင်းသော မော်တာဖြင့် ပေါင်မုန့်ဂျုံနယ်ခြင်း (Dough hook) နှင့် အရေအတွက်များပြားသော ခရင်မ်များကို အလိုအလျောက် မွှေပေးနိုင်သော စက်ကြီး ဖြစ်ပါသည်။ လူအားစိုက်စရာမလိုဘဲ မိနစ်ပိုင်းအတွင်း Windowpane အဆင့်ထိ ဂျုံနယ်ပေးနိုင်ပါသည်။ မုန့်ဖုတ်လုပ်ငန်း အများအပြား လုပ်ကိုင်သူများအတွက် အထူးသင့်တော်ပါသည်။',
    how_to_use_en: 'Attach suitable tool (Whisk, Paddle, Dough Hook) and increase speed progressively from lowest setting.',
    how_to_use_mm: 'ခေါင်းအမျိုးအစား (Whisk, Paddle, Dough hook) ကို မှန်ကန်စွာ တပ်ဆင်ပြီး အမြန်နှုန်းကို အဆင့်ဆင့် တင်ပေးပါ။',
    care_en: 'Wipe body with a clean damp cloth; wash mixing bowls and attachments thoroughly.',
    care_mm: 'စက်ကိုယ်ထည်ကို အဝတ်စိုဖြင့် သုတ်ပါ၊ ဇလုံနှင့် မွှေတံများကို ဆပ်ပြာဖြင့် ဆေးကြောပါ။ မော်တာ အပူချိန်ကို စစ်ဆေးပါ။',
    alternatives_en: [
      'Hand mixer or vigorous manual hand-kneading'
    ],
    alternatives_mm: [
      'လျှပ်စစ်လက်နှိပ်စက် (Hand mixer) သို့မဟုတ် လက်ဖြင့် ဂျုံနယ်ခြင်း'
    ],
    image_emoji: '⚙️',
  },
  {
    id: 'rolling-pin',
    name_en: 'Rolling Pin',
    name_mm: 'ဒလိမ့်တုံး (Rolling Pin)',
    purpose_en: 'Flattens bread, cookie, and flaky pie doughs into uniform thickness while rolling out trapped air pockets for even baking.',
    purpose_mm: 'ပေါင်မုန့်၊ ကွတ်ကီးနှင့် ပိုင်မုန့်ခွံ ဂျုံသားများကို လိုချင်သော အထူအပါးအတိုင်း ညီညာပြန့်ပြူးသွားအောင် လှိမ့်ပေးရန် သုံးပါသည်။ ဂျုံသားအတွင်းရှိ မလိုလားအပ်သော လေပူဖောင်းကြီးများကို ဖိထုတ်ပေးရာတွင်လည်း ကူညီပေးပါသည်။ ကွတ်ကီးပုံစံခွက်များဖြင့် မဖြတ်မီ မျက်နှာပြင်ညီအောင် ပြုလုပ်ရန် မရှိမဖြစ် သုံးပါသည်။',
    how_to_use_en: 'Dust rolling pin and board with flour; roll smoothly from the center outward with even pressure.',
    how_to_use_mm: 'ဒလိမ့်တုံးနှင့် စားပွဲခုံပေါ်တွင် ဂျုံမှုန့်အနည်းငယ် ဖြူးပါ၊ အလယ်ဗဟိုမှ အပြင်ဘက်သို့ ညီညာသော ဖိအားဖြင့် ရှေ့နောက် လှိမ့်ပါ။',
    care_en: 'Do not soak wooden pins in water; wipe clean and condition occasionally with food-grade mineral oil.',
    care_mm: 'သစ်သားဒလိမ့်တုံးကို ရေစိမ်မထားရပါ၊ အဝတ်စိုဖြင့် သုတ်၍ သံလွင်ဆီ အနည်းငယ် သုတ်လိမ်းပေးပါက ကြာရှည်ခံပါသည်။',
    alternatives_en: [
      'Clean smooth glass bottle or stainless steel tumbler'
    ],
    alternatives_mm: [
      'သန့်ရှင်းသော ဖန်ပုလင်း အခွံ သို့မဟုတ် စတီးပိုက်လုံး'
    ],
    image_emoji: '🥖',
  },
];
