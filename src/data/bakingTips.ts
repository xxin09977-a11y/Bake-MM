/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QuizQuestion } from '../types';

export interface DailyBakingTip {
  titleMm: string;
  titleEn: string;
  tipMm: string;
  tipEn: string;
  category: string;
  categoryMm: string;
}

export const DAILY_BAKING_TIPS: DailyBakingTip[] = [
  {
    titleMm: 'ကြက်ဥ အခန်းအပူချိန် အမြန်ပြုလုပ်နည်း',
    titleEn: 'Quick Room-Temperature Eggs',
    tipMm: 'ရေခဲသေတ္တာထဲမှ ကြက်ဥကို အမြန်သုံးလိုပါက ကြက်သီးနွေးရေ (အရမ်းမပူသောရေ) ထဲတွင် ၅ မိနစ်မှ ၁၀ မိနစ်ခန့် စိမ်ထားပေးပါက အခန်းအပူချိန်သို့ လျင်မြန်စွာ ရောက်ရှိပါမည်။',
    tipEn: 'Need room-temperature eggs quickly? Submerge cold eggs in a bowl of lukewarm (not hot) water for 5–10 minutes. They will warm evenly without cooking.',
    category: 'Eggs',
    categoryMm: 'ကြက်ဥ',
  },
  {
    titleMm: 'မုန့်ဖုတ်စက္ကူ မလွင့်ပြေးအောင် ထိန်းနည်း',
    titleEn: 'Anchoring Parchment Paper',
    tipMm: 'မုန့်ဖုတ်ဗန်း အောက်ခြေထောင့် ၄ ခုတွင် ထောပတ် သို့မဟုတ် မုန့်နှစ် အနည်းငယ် တို့ပေးပြီးမှ စက္ကူခင်းပါက စက္ကူသည် ငြိမ်သက်စွာ ကပ်နေပါမည်။',
    tipEn: 'Dab a tiny dot of butter or batter under each of the 4 corners of your baking pan before placing parchment paper to keep it locked flat and slip-free.',
    category: 'Gear & Prep',
    categoryMm: 'ကိရိယာ',
  },
  {
    titleMm: 'ကိတ်မုန့် အလယ်ကျွံရသည့် လျှို့ဝှက်ချက်',
    titleEn: 'Why Cakes Sink in the Center',
    tipMm: 'မုန့်ဖုတ်ပေါင်ဒါ အလွန်အကျွံထည့်မိပါက မုန့်သားသည် မီးဖိုထဲတွင် မြန်မြန်ဆန်ဆန် ကြွတက်လာပြီး အတွင်းပိုင်း အအေးခံချိန်တွင် အားမခံနိုင်ဘဲ အလယ်ဗဟို ကျွံကျသွားတတ်သည်။ ချက်နည်းပါ အတိုင်းအတာအတိုင်း တိကျစွာသုံးပါ။',
    tipEn: 'Too much chemical leavener causes cells to expand beyond their gluten strength, collapsing inward during cooling. Always measure baking powder level and precise.',
    category: 'Troubleshooting',
    categoryMm: 'ပြဿနာဖြေရှင်းနည်း',
  },
  {
    titleMm: 'ကွတ်ကီး မာမသွားစေရန် ထိန်းနည်း',
    titleEn: 'Keeping Baked Cookies Soft',
    tipMm: 'ကွတ်ကီးကို လေလုံဘူးထဲတွင် ပေါင်မုန့်ဖြူ အချပ်တစ်ချပ်နှင့်အတူ ထည့်ထားပါက ပေါင်မုန့်မှ အစိုဓာတ်ကို စုပ်ယူပြီး ကွတ်ကီးသားသည် ရက်ပေါင်းများစွာ နူးညံ့ပျော့ပျောင်းနေပါမည်။',
    tipEn: 'Store fresh cookies in an airtight container with a slice of plain sandwich bread. Cookies draw ambient moisture from the bread, staying soft for days.',
    category: 'Storage',
    categoryMm: 'သိမ်းဆည်းနည်း',
  },
  {
    titleMm: 'မုန့်ဖုတ်ပေါင်ဒါ စစ်ဆေးနည်း',
    titleEn: 'Testing Baking Powder Freshness',
    tipMm: 'မုန့်ဖုတ်ပေါင်ဒါ သက်တမ်းရှိမရှိ သိလိုပါက ရေနွေးနွေး လက်ဖက်ရည် ၁/၂ ခွက်ထဲသို့ ပေါင်ဒါ ၁/၂ ဇွန်း ထည့်ကြည့်ပါ။ ချက်ချင်း ပွက်ပွက်ဆူလာပါက အာနိသင် ကောင်းမွန်ဆဲ ဖြစ်သည်။',
    tipEn: 'Stir 1/2 tsp of baking powder into 1/2 cup of warm water. If it fizzes immediately with vigorous bubbles, it is active and fresh.',
    category: 'Ingredients',
    categoryMm: 'ပါဝင်ပစ္စည်း',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    questionMm: 'ကိတ်မုန့်သား နူးညံ့အိစက်စေရန် မည်သည့်ဂျုံမှုန့် အမျိုးအစားကို အဓိက သုံးသင့်သနည်း?',
    questionEn: 'Which flour variety should you prioritize for an ultra-tender, delicate cake crumb?',
    optionsMm: [
      'ပေါင်မုန့်ဂျုံမှုန့် (Bread Flour)',
      'ကိတ်ဂျုံမှုန့် (Cake Flour)',
      'ဆန်မှုန့် (Rice Flour)',
      'ကောက်ညှင်းမှုန့် (Glutinous Rice Flour)',
    ],
    optionsEn: [
      'Bread Flour (High protein 12-14%)',
      'Cake Flour (Low protein 7-9%)',
      'Rice Flour',
      'Glutinous Rice Flour',
    ],
    correctIndex: 1,
    explanationMm: 'ကိတ်ဂျုံမှုန့် (Cake Flour) သည် ပရိုတင်းဓာတ် ၇-၉% သာပါဝင်ပြီး ဂလူတင် (Gluten) ဖြစ်ပေါ်မှု နည်းပါးသဖြင့် မုန့်သားကို အလွန်နူးညံ့စေပါသည်။',
    explanationEn: 'Cake flour contains only 7–9% protein, minimizing tough gluten strands for a melt-in-your-mouth tender texture.',
  },
  {
    id: 'q2',
    questionMm: 'ကြက်ဥအကာ (Meringue) မွှေသည့်အခါ အမြှုပ်မထဘဲ ပျက်စီးသွားစေနိုင်သော အရာမှာ အဘယ်နည်း?',
    questionEn: 'What substance will prevent egg whites from whipping into a voluminous meringue?',
    optionsMm: [
      'သကြား ထည့်သွင်းခြင်း',
      'ဇလုံထဲတွင် အဆီ သို့မဟုတ် ကြက်ဥအနှစ် စွန်းထင်းနေခြင်း',
      'သံပရာရည် အနည်းငယ် ထည့်ခြင်း',
      'မစ်ဆာ အမြန်နှုန်း အမြင့်ဆုံးဖြင့် မွှေခြင်း',
    ],
    optionsEn: [
      'Adding granulated sugar gradually',
      'Fat or egg yolk residue in bowl',
      'Adding a drop of lemon juice',
      'Using high speed on hand mixer',
    ],
    correctIndex: 1,
    explanationMm: 'အဆီ (Fat) သည် ကြက်ဥအကာ ပရိုတင်းများ၏ လေပူဖောင်းဖွဲ့စည်းမှုကို တားဆီးဖျက်ဆီးသဖြင့် ဇလုံတွင် အဆီလုံးဝ မရှိစေရပါ။',
    explanationEn: 'Even trace amounts of lipid/fat destabilize ovalbumin protein bubbles, preventing stiff foam formation entirely.',
  },
  {
    id: 'q3',
    questionMm: 'ကိတ်ဖုတ်ရာတွင် မီးဖိုအပူချိန် ၁၈၀°C သည် ဖာရင်ဟိုက် (Fahrenheit) ဖြင့် ခန့်မှန်းခြေ မည်မျှနှင့် ညီမျှသနည်း?',
    questionEn: 'In standard oven baking, 180°C corresponds approximately to what in Fahrenheit?',
    optionsMm: [
      '300°F',
      '325°F',
      '350°F',
      '400°F',
    ],
    optionsEn: [
      '300°F',
      '325°F',
      '350°F',
      '400°F',
    ],
    correctIndex: 2,
    explanationMm: '၁၈၀°C သည် ၃၅၀°F (356°F ခန့်မှန်းခြေ) နှင့် တူညီပြီး ကိတ်မုန့်အများစု ဖုတ်ရာတွင် အသုံးအများဆုံး စံအပူချိန်ဖြစ်သည်။',
    explanationEn: '180°C equals 356°F, conventionally dialed in as 350°F across American recipes as standard golden-bake temperature.',
  },
  {
    id: 'q4',
    questionMm: 'ပေါင်မုန့်ဂျုံနယ်ပြီး Gluten ကောင်းမွန်စွာ ဖြစ်ပေါ်မှု ရှိမရှိ စစ်ဆေးသည့် နည်းလမ်းမှာ အဘယ်နည်း?',
    questionEn: 'Which testing technique confirms whether bread dough has developed optimal gluten structure?',
    optionsMm: [
      'Windowpane Test (အမြှေးပါးစမ်းသပ်ချက်)',
      'Toothpick Test (သွားကြားထိုးတံ စမ်းသပ်ချက်)',
      'Water Test (ရေစိမ်စမ်းသပ်ချက်)',
      'Freezer Test (ရေခဲရိုက်စမ်းသပ်ချက်)',
    ],
    optionsEn: [
      'Windowpane Test (Thin translucent stretch)',
      'Toothpick Test (Center skewer insert)',
      'Water Bowl Float Test',
      'Flash Freezer Firmness Test',
    ],
    correctIndex: 0,
    explanationMm: 'Windowpane test သည် ဂျုံစ အနည်းငယ်ကို ဘေးသို့ဆွဲဆန့်ပြီး မပြတ်ထွက်ဘဲ အလင်းပေါက်သော ပါးလွှာသည့် အမြှေးပါး ဖြစ်မဖြစ် စစ်ဆေးခြင်း ဖြစ်သည်။',
    explanationEn: 'The Windowpane test stretches dough gently between fingers until thin enough for light to shine through without tearing.',
  },
  {
    id: 'q5',
    questionMm: 'မုန့်ဖုတ်နေစဉ် မီးဖိုတံခါးကို ခဏခဏ ဖွင့်ကြည့်ပါက မည်သည့်ဆိုးကျိုး ဖြစ်တတ်သနည်း?',
    questionEn: 'What negative baking consequence occurs if the oven door is opened repeatedly early in baking?',
    optionsMm: [
      'မုန့်မျက်နှာပြင် အရောင် ပိုတောက်ပလာမည်',
      'မီးဖိုတွင်း အပူချိန် ရုတ်တရက်ကျဆင်းသွားပြီး ကိတ်အလယ်ဗဟို ကျွံကျသွားမည်',
      'မုန့်ဖုတ်ချိန် ပိုမိုမြန်ဆန်သွားမည်',
      'မုန့်သား ပိုမိုနူးညံ့လာမည်',
    ],
    optionsEn: [
      'The crust gloss becomes shinier',
      'Sudden temperature drop causes center collapse',
      'Bake time accelerates faster',
      'Crumb becomes softer and spongier',
    ],
    correctIndex: 1,
    explanationMm: 'မုန့်ဖုတ်ချိန် မပြည့်မီ တံခါးဖွင့်ပါက အပူချိန် အေးခဲကျဆင်းသွားသဖြင့် ဖောင်းတက်နေသော လေပူဖောင်းများ ပြိုဆင်းသွားတတ်သည်။',
    explanationEn: 'Opening the door vents hot air, plunging internal chamber temp and causing fragile leavened air pockets to fall flat.',
  },
];
