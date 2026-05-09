/**
 * MAIN MENU — Service Branches
 * 
 * Each branch has sub-items, DB references,
 * and links to specific engines/flows.
 */

export type BranchId =
  | "decision"
  | "meeting_prep"
  | "family_council"
  | "explain_kids_kids"
  | "explain_adults_kids"
  | "explain_kids_adults";

export type CategoryId =
  | "decisions"
  | "meetings"
  | "family"
  | "explanations";

export interface MenuCategory {
  id: CategoryId;
  title: string;
  description: string;
  lucideIcon: string;
  branches: MenuBranch[];
}

export interface MenuBranch {
  id: BranchId;
  title: string;
  subtitle: string;
  description: string;
  /** What engine/flow this branch opens */
  engine: "intake" | "negotiation" | "family" | "explain";
  /** Tags for filtering */
  tags: string[];
  /** Somatic zones most relevant */
  somaticFocus: string[];
  /** Key shadows likely to activate */
  shadowFocus: string[];
  /** Example prompts user might have */
  examplePrompts: string[];
}

export const MENU_CATEGORIES: MenuCategory[] = [
  // ─── 1. РІШЕННЯ ─────────────────────────
  {
    id: "decisions",
    title: "Допомога в прийнятті рішення",
    description: "Аналіз ситуації через Юнга, Polyvagal та біохімію. Визначення тіні, наслідків та маршруту до Профіциту.",
    lucideIcon: "Brain",
    branches: [
      {
        id: "decision",
        title: "Аналіз ситуації",
        subtitle: "Що робити? Яке рішення правильне?",
        description: "Повний 4-рівневий аналіз: Хімія → Організм → Енергія → Сенсорика. Виявлення когнітивних упереджень. Конкретний план дій.",
        engine: "intake",
        tags: ["робота", "бізнес", "фінанси", "стосунки", "здоров'я"],
        somaticFocus: ["Голова", "Груди", "Живіт"],
        shadowFocus: ["escapist", "perfectionist", "impostor"],
        examplePrompts: [
          "Мені пропонують нову роботу, але я боюсь звільнитись",
          "Партнер хоче розійтись, я не знаю що робити",
          "Взяти кредит на бізнес чи ні?",
        ],
      },
    ],
  },

  // ─── 2. ЗУСТРІЧІ ─────────────────────────
  {
    id: "meetings",
    title: "Підготовка до зустрічі",
    description: "Симуляція переговорів. Аналіз опонентів, їх тіней, вірогідності маніпуляцій. Матриця впливу.",
    lucideIcon: "Swords",
    branches: [
      {
        id: "meeting_prep",
        title: "Симулятор переговорів",
        subtitle: "До 4 учасників · Тіньовий аналіз кожного",
        description: "Побудова профілів опонентів: візуальні сигнали, соціальні факти, домінантна тінь. Розрахунок вірогідності Тінь vs Тотем. Матриця впливу N×N.",
        engine: "negotiation",
        tags: ["переговори", "бізнес", "конфлікт", "партнерство"],
        somaticFocus: ["Горло", "Груди", "Живіт"],
        shadowFocus: ["aggressor", "manipulator", "victim", "impostor"],
        examplePrompts: [
          "Завтра зустріч з інвестором, він тисне на оцінку",
          "Переговори з постачальником який маніпулює цінами",
          "Збори правління де двоє проти мене",
        ],
      },
    ],
  },

  // ─── 3. СІМЕЙНА НАРАДА ─────────────────────────
  {
    id: "family",
    title: "Сімейна нарада",
    description: "Структурований процес прийняття рішень у сім'ї. Врахування потреб кожного члена, вікових особливостей, емоційних станів.",
    lucideIcon: "Users",
    branches: [
      {
        id: "family_council",
        title: "Сімейна нарада",
        subtitle: "Структурований діалог для всієї родини",
        description: "Визначення ролей (Ініціатор, Опонент, Модератор, Спостерігач). Карта потреб кожного. Пошук рішення де виграють усі. Врахування дитячої психіки.",
        engine: "family",
        tags: ["сім'я", "діти", "виховання", "стосунки", "рішення"],
        somaticFocus: ["Груди", "Живіт", "Горло"],
        shadowFocus: ["rescuer", "victim", "aggressor", "perfectionist"],
        examplePrompts: [
          "Переїзд в інше місто — діти проти",
          "Підліток хоче кинути школу",
          "Розподіл бюджету на відпустку",
          "Бабуся й дідусь втручаються у виховання",
        ],
      },
    ],
  },

  // ─── 4. ПОЯСНЕННЯ ─────────────────────────
  {
    id: "explanations",
    title: "Пояснення",
    description: "Адаптивне пояснення складних тем. Вікова адаптація мови, метафор та глибини.",
    lucideIcon: "MessageCircle",
    branches: [
      {
        id: "explain_kids_kids",
        title: "Дітям про дітей",
        subtitle: "Чому друг злиться? Чому я плачу?",
        description: "Пояснення дитячих емоцій та поведінки мовою, зрозумілою дитині 4-12 років. Метафори через тварин, казки та кольори. Соматичне усвідомлення: 'Де ти це відчуваєш у тілі?'",
        engine: "explain",
        tags: ["діти", "емоції", "друзі", "школа", "булінг"],
        somaticFocus: ["Живіт", "Груди", "Очі"],
        shadowFocus: ["victim", "aggressor", "escapist"],
        examplePrompts: [
          "Чому Петрик мене ображає?",
          "Я боюсь темряви",
          "Чому мама та тато сваряться?",
          "Мене не беруть у гру",
        ],
      },
      {
        id: "explain_adults_kids",
        title: "Дорослим про дітей",
        subtitle: "Чому дитина так робить?",
        description: "Нейробіологічне пояснення дитячої поведінки для батьків. Префронтальна кора дозріває до 25 років — дитина НЕ може 'просто заспокоїтись'. Практичні інструменти замість покарань.",
        engine: "explain",
        tags: ["батьки", "виховання", "підлітки", "неслухняність", "тривога"],
        somaticFocus: ["Голова", "Горло", "Груди"],
        shadowFocus: ["perfectionist", "rescuer", "aggressor"],
        examplePrompts: [
          "Дитина 3 роки — істерики кожен день",
          "Підліток 14 — замкнувся, не спілкується",
          "Дитина бреше — як реагувати?",
          "РДУГ у дитини — як жити?",
        ],
      },
      {
        id: "explain_kids_adults",
        title: "Дітям про дорослих",
        subtitle: "Чому мама плаче? Чому тато працює допізна?",
        description: "Пояснення дорослої поведінки мовою дитини. Зняття відчуття провини ('Це не через тебе'). Нормалізація дорослих емоцій. Безпечна прив'язаність.",
        engine: "explain",
        tags: ["діти", "батьки", "розлучення", "стрес", "тривога"],
        somaticFocus: ["Груди", "Живіт", "Ноги"],
        shadowFocus: ["victim", "rescuer", "dissociator"],
        examplePrompts: [
          "Чому мама завжди втомлена?",
          "Тато пішов — це через мене?",
          "Чому дорослі плачуть?",
          "Бабуся захворіла — що буде?",
        ],
      },
    ],
  },
];

/**
 * Flatten all branches for search/routing
 */
export function getAllBranches(): MenuBranch[] {
  return MENU_CATEGORIES.flatMap((c) => c.branches);
}

export function getBranchById(id: BranchId): MenuBranch | undefined {
  return getAllBranches().find((b) => b.id === id);
}
