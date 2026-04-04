import CyberTourEngine from './CyberTourEngine';

export default function NeuralNomadTour({ onComplete }) {
  const steps = [
    {
      id: "overview",
      title: "SYSTEM OVERVIEW",
      content: "Вітаю, архітекторе (Андрію).\nЦя екосистема (13WSMEI) побудована на фундаменті твоїх знань Neural Nomad. Я проведу для тебе архітектурний Tour, щоб показати, як ми автоматизували та гейміфікували кожен процес.",
      icon: "🌐"
    },
    {
      id: "bots",
      title: "1. COMMAND & BOTS",
      content: "Логіка управління командою (Taras, Nazar, Mykyta) переведена в '3+2 спринти' (14 днів). Щоб виключити мікроменеджмент, бот щодня автоматично розсилає 3 первинні та 2 крос-задачі, контролює статус та карає XP-штрафами за провал дедлайнів.",
      icon: "🤖"
    },
    {
      id: "offline",
      title: "2. ЗНАННЯ (ОФЛАЙН)",
      content: "Ми відмовились від нестабільних запитів до Gemini для тестування. Натомість створено Global Skill Tree (Офлайн Термінал). Всі навички доступні одразу. Кожен клік ініціює 'хардкодний' Quiz, що математично рахує рівень (Goal: 80+ LVL).",
      icon: "🌳"
    },
    {
      id: "dopamine",
      title: "3. DOPAMINE SHOP",
      content: "У магазині 'Дофаміну' юзери можуть обмінювати зароблені XP на Day Off або Spa. Також ми зашили 'Пасхалку': якщо людина робить 5+ додаткових задач за день, їй прилітає 1000 бонусних XP, а керівникам іде ALARM про премію.",
      icon: "🛒"
    },
    {
      id: "syndicate",
      title: "4. SYNDICATE BLOCK",
      content: "Розроблено фінансовий фреймворк для B2B продажу. Є вбудований калькулятор інвестицій та інтерактивний модуль 'БАР'ЄРИ', де розбираються топові страхи клієнтів/інвесторів.\n\nТвій профіль налаштовано як Super-Admin. Welcome.",
      icon: "⚖️"
    }
  ];

  const focusOptions = [
    { id: 'focus_offline', label: "Власна Архітектура БД (Офлайн Скіли)", relatedStepId: "offline" },
    { id: 'focus_fin', label: "Фінанси та B2B продаж", relatedStepId: "syndicate" },
    { id: 'focus_bots', label: "Micro-management Bots (Контроль команди)", relatedStepId: "bots" },
    { id: 'focus_gamification', label: "Гейміфікація та Пасхалки", relatedStepId: "dopamine" }
  ];

  return (
    <CyberTourEngine 
      title="NEURAL NOMAD TOUR"
      themeColor="var(--neon-green)"
      focusOptions={focusOptions}
      steps={steps}
      onComplete={onComplete}
    />
  );
}
