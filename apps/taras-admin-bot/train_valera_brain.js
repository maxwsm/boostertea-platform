require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Ініціалізація Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = "gemini-2.5-flash"; // Або gemini-1.5-pro для глибшого аналізу
const BUDGET_USD = 4.00;

// Орієнтовні ціни (Gemini 2.5 Flash)
// Вхід: $0.075 за 1M токенів
// Вихід: $0.30 за 1M токенів
const COST_PER_1M_INPUT = 0.075;
const COST_PER_1M_OUTPUT = 0.30;

const SKILLS_DIR = '/Users/ANTI 001/_agents/skills';

// Список скілів
const skills = [
  'boostertea-strategy/SKILL.md',
  'boostertea-marketing/SKILL.md',
  'boostertea-legal/SKILL.md',
  'boostertea-engineering/SKILL.md',
  'boostertea-mixology/SKILL.md',
  'neo-industrial-ecommerce/SKILL.md'
];

async function runTrainingSimulation() {
  console.log(`🚀 Ініціалізація тренування ValeraGPT (Бюджет: $${BUDGET_USD})`);
  
  let megaContext = "СИСТЕМНИЙ КОНТЕКСТ BOOSTERTEA (АБСОЛЮТНИЙ ПРІОРИТЕТ)\\n\\n";
  
  // Збираємо весь контекст
  for (const skillPath of skills) {
    const fullPath = path.join(SKILLS_DIR, skillPath);
    if (fs.existsSync(fullPath)) {
      megaContext += `--- SKILL: ${skillPath} ---\\n`;
      megaContext += fs.readFileSync(fullPath, 'utf8') + "\\n\\n";
    }
  }

  // Оцінка кількості токенів (грубо: 1 токен = 4 символи)
  const estimatedInputTokens = Math.ceil(megaContext.length / 4);
  const estimatedOutputTokens = 800; // Очікуємо десь 800 токенів на відповідь
  
  const costPerSessionInput = (estimatedInputTokens / 1_000_000) * COST_PER_1M_INPUT;
  const costPerSessionOutput = (estimatedOutputTokens / 1_000_000) * COST_PER_1M_OUTPUT;
  const costPerSession = costPerSessionInput + costPerSessionOutput;
  
  const totalSessions = Math.floor(BUDGET_USD / costPerSession);

  console.log(`📊 Оцінка токенів на 1 прогон: Вхід ~${estimatedInputTokens}, Вихід ~${estimatedOutputTokens}`);
  console.log(`💸 Вартість 1 прогону: $${costPerSession.toFixed(5)}`);
  console.log(`⏱ Максимальна кількість сесій за $${BUDGET_USD}: ${totalSessions} прогонів!`);
  const isFullRun = process.argv.includes('--full-run');
  
  const model = genAI.getGenerativeModel({ 
    model: MODEL_NAME,
    systemInstruction: megaContext
  });

  const questions = [
    "Сформулюй головну мету на місяць 5-6 згідно стратегії '🦆🔥' та як маркетинг має цьому допомогти?",
    "Як пов'язані УТОС (legal) та UGC (marketing)? В чому математичний і PR прибуток?",
    "Що буде, якщо ми запишемо add_to_cart на загальне завантаження сторінки відповідно до Neo-Industrial E-Commerce Protocol?",
    "Опиши пайплайн створення газованого чаю 0.33, враховуючи ХАСП та якість інгредієнтів від Віктора.",
    "Як Валєра-бот має спілкуватися з Микитою щодо блогер-боксів (враховуючи тон голосу з boostertea_context.js)?"
  ];

  const loopLimit = isFullRun ? totalSessions : questions.length;
  
  if (isFullRun) {
     console.log(`\\n🔥 УВАГА: Запущено режим FULL RUN на ${loopLimit} ітерацій. Це займе ~9 годин (Rate limit protections).`);
  } else {
     console.log(`\\nПочинаємо екзаменацію/аудит (прогонимо 5 тестових сесій для перевірки)...\\n`);
  }

  // Проводимо навчальні сесії
  for (let i = 0; i < loopLimit; i++) {
    const qIndex = i % questions.length;
    console.log(`\\n[Сесія ${i+1}/${totalSessions}] Запит: ${questions[qIndex]}`);
    try {
      const result = await model.generateContent(questions[qIndex]);
      console.log(`✅ Відповідь ValeraGPT:\\n${result.response.text().substring(0, 500)}...\\n(Далі обрізано)`);
      
      // Затримка між запитами щоб не вбити rate limits (4 секунди)
      await new Promise(resolve => setTimeout(resolve, 4000));
    } catch (error) {
      console.error(`❌ Помилка в сесії ${i+1}:`, error.message);
      await new Promise(resolve => setTimeout(resolve, 10000)); // Довша пауза при помилці
    }
  }
  
  console.log(`\\n🏁 Тренувальний цикл завершено. Загалом пройдено ${loopLimit} сесій.`);
}

runTrainingSimulation();
