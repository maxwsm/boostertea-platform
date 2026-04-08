const { getCurrentDay, ROLES } = require('./helpers');

const AGREEMENT_TERMS = [
  "погоджуюсь", "згоден", "згодна", "приймаю", "accepted", "agree", "ок", "ok", "окей", "+", "да"
];

/**
 * Перевіряє чи повідомлення є спробою прийняти умови
 * @returns {false | 'need_photo' | 'valid'}
 */
function isPartnershipAgreement(text, hasPhoto) {
  if (!text) return false;
  const lower = text.toLowerCase();
  
  // Якщо мінімум 1 ключове слово є в тексті або в підписі до фото
  const isMatch = AGREEMENT_TERMS.some(term => {
    // Точний метч слова або якщо воно частина речення (regex bound checks would be better but simple includes is fine for now, we just check bounded words if possible, but includes is safer for typos)
    return lower.includes(term);
  });
  
  if (isMatch) {
    if (!hasPhoto) return 'need_photo';
    return 'valid';
  }
  return false;
}

/**
 * Обробка тригеру
 */
async function triggerPartnershipTasks(userId, bot, prisma, roleKey) {
  const day = await getCurrentDay(prisma) || 1;
  const t1Day = day;
  const t2Day = day + 14;
  const t3Day = day + 31;

  // Перевірка чи не було прийнято раніше
  const existing = await prisma.task.findFirst({
    where: { ownerId: userId, text: { startsWith: 'ПАРТНЕРСТВО:' } }
  });
  
  if (existing) return 'already_accepted';

  // 1. Створюємо 3 завдання (Milestones)
  await prisma.task.createMany({
    data: [
      { day: t1Day, text: 'ПАРТНЕРСТВО: Написати Тарасу для узгодження часу зустрічі з юристом.', ownerId: userId, type: 'primary' },
      { day: t2Day, text: 'ПАРТНЕРСТВО: Узгодити всі умови договору та офіційно підписати його (Дедлайн 14 днів).', ownerId: userId, type: 'primary' },
      { day: t3Day, text: 'ПАРТНЕРСТВО: Завершити створення юридичної компанії (Дедлайн 31 день).', ownerId: userId, type: 'primary' }
    ]
  });

  // Додаємо жорсткий контекст із аудіо для Микити та Назара
  const isDelayRisk = (roleKey === 'mykyta' || roleKey === 'nazar');
  const roleName = ROLES[roleKey] || roleKey;

  const replyText = `✅ **ЗГОДУ ПРИЙНЯТО ТА ЗАФІКСОВАНО В СИСТЕМІ.**

Ви підтвердили прийняття **початкових умов**, на яких заходили в цей проєкт. 

⚠️ **УВАГА (${roleName}):** Система наголошує на тому, що ваші попередні зобов'язання **ВЖЕ ПРОСТРОЧЕНІ**. 
У вас є критична необхідність виконати ці нові умови ОБМЕЖЕНО ШВИДКО і без відмовок, щоб хоча б вписатися у закладені часові межі. Максимальне прискорення. 

Таймери поставлені у ваш особистий профіль:
**1.** Завдання на призначення зустрічі з юристом (вже сьогодні).
**2.** Дедлайн підписання договору — 14 днів.
**3.** Дедлайн реєстрації юр. особи — 31 день.

Хто конкретно є бенефіціарами та які частки виділяються — буде відкрито і зафіксовано **ВИКЛЮЧНО на зустрічі з юристом**. 

Таймер пішов.`;

  await bot.telegram.sendMessage(userId, replyText, { parse_mode: 'Markdown' });
  return 'success';
}

module.exports = { isPartnershipAgreement, triggerPartnershipTasks };
