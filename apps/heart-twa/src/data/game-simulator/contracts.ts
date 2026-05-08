/**
 * CONTRACT MECHANICS
 * GDD §5.1: Механіка вичитки договорів («Знайди пункт»)
 *
 * - Every deal has a contract with visible terms + hidden risk clauses
 * - Player can read carefully (mental cost) or skip (financial risk)
 * - Can delegate to a virtual lawyer (financial cost, zero mental cost)
 */

export type ContractRiskSeverity = "low" | "medium" | "high" | "critical";

export interface ContractClause {
  id: string;
  sectionTitle: string;
  visibleText: string;       // What player sees
  hiddenRisk?: string;       // The trap hidden in legalese
  riskSeverity?: ContractRiskSeverity;
  riskActivationCondition?: string; // When this activates
  riskFinancialImpact?: number;    // USD if triggered
}

export interface GameContract {
  id: string;
  title: string;
  counterparty: string;
  dealValue: number;
  mentalCostToRead: number;      // Mental energy to read carefully
  lawyerCostUSD: number;         // Pay to delegate to lawyer
  clauses: ContractClause[];
  readingBonus: {
    mentalDelta: number;
    message: string;
  };
  skipPenalty?: {
    probability: number;
    financialLoss: number;
    triggerMonth: number; // Month when hidden clause activates
    message: string;
  };
}

export const GAME_CONTRACTS: GameContract[] = [
  // ── VERTEX ARENA FRANCHISE CONTRACT ───────────────────────────
  {
    id: "contract_vertex_franchise",
    title: "Договір Франшизи Vertex Arena",
    counterparty: "Vertex Arena International LLC",
    dealValue: 58900,
    mentalCostToRead: 12,
    lawyerCostUSD: 500,
    readingBonus: {
      mentalDelta: 15,
      message: "Ти знайшов ключові пункти і захистив бізнес. Усвідомленість зростає.",
    },
    skipPenalty: {
      probability: 0.9,
      financialLoss: 8000,
      triggerMonth: 6,
      message: "П.7.3 активовано: Франчайзер підвищив роялті з 5% до 12% через 6 міс. Ти пропустив цей пункт при підписанні.",
    },
    clauses: [
      {
        id: "c1",
        sectionTitle: "§1. Паушальний внесок",
        visibleText: "Фрачайзі сплачує одноразовий вступний внесок у розмірі $12,000 протягом 5 банківських днів з моменту підписання.",
        // No hidden risk
      },
      {
        id: "c2",
        sectionTitle: "§3. Роялті та Маркетинговий Фонд",
        visibleText: "Щомісячне роялті встановлюється у розмірі 5% від валового обороту. Маркетинговий внесок: 2%.",
        hiddenRisk: "П.3.4 (дрібний шрифт): Франчайзер залишає за собою право переглядати ставку роялті не частіше ніж раз на 6 місяців, надавши повідомлення за 14 днів.",
        riskSeverity: "high",
        riskActivationCondition: "Через 6 місяців після підписання",
        riskFinancialImpact: 8000,
      },
      {
        id: "c3",
        sectionTitle: "§7. Розірвання договору",
        visibleText: "Договір укладається строком на 5 (п'ять) років з правом пролонгації.",
        hiddenRisk: "П.7.8: При достроковому розірванні з ініціативи Франчайзі, останній зобов'язаний сплатити штраф у розмірі 24 місячних роялті.",
        riskSeverity: "critical",
        riskActivationCondition: "При достроковому виході з франшизи",
        riskFinancialImpact: 15000,
      },
      {
        id: "c4",
        sectionTitle: "§11. Обладнання та постачання",
        visibleText: "Франчайзі зобов'язаний закуповувати обладнання виключно у затверджених постачальників.",
        hiddenRisk: "П.11.2: Список затверджених постачальників може змінюватись. Франчайзер не гарантує конкурентних цін цих постачальників.",
        riskSeverity: "medium",
        riskActivationCondition: "При необхідності заміни обладнання",
        riskFinancialImpact: 3000,
      },
    ],
  },

  // ── LEASE CONTRACT (Оренда приміщення) ──────────────────────
  {
    id: "contract_premises_lease",
    title: "Договір Оренди Комерційного Приміщення",
    counterparty: "ТОВ «Орендна Мережа Захід»",
    dealValue: 1800,
    mentalCostToRead: 8,
    lawyerCostUSD: 300,
    readingBonus: {
      mentalDelta: 10,
      message: "Ти помітив форс-мажорний пункт і заздалегідь узгодив умови. Захист закритий.",
    },
    skipPenalty: {
      probability: 0.75,
      financialLoss: 5400,
      triggerMonth: 3,
      message: "П.4.1 активовано: Орендодавець підвищив ставку вдвічі через 3 місяці — 'індексація за курсом EUR'. Ти не зафіксував ставку на 1 рік.",
    },
    clauses: [
      {
        id: "lc1",
        sectionTitle: "§1. Предмет та строк оренди",
        visibleText: "Орендодавець надає у тимчасове користування приміщення площею 120 м² за адресою вул. Технологічна, 14а.",
      },
      {
        id: "lc2",
        sectionTitle: "§4. Орендна плата",
        visibleText: "Місячна орендна плата становить $1,800 і сплачується до 5-го числа кожного місяця.",
        hiddenRisk: "П.4.1: Орендна плата індексується відповідно до офіційного курсу EUR/UAH станом на дату платежу, але не рідше ніж раз на квартал.",
        riskSeverity: "high",
        riskActivationCondition: "При девальвації гривні або щоквартально",
        riskFinancialImpact: 5400,
      },
      {
        id: "lc3",
        sectionTitle: "§8. Форс-мажор",
        visibleText: "Сторони звільняються від відповідальності при настанні обставин непереборної сили.",
        hiddenRisk: "П.8.4: Орендодавець залишає за собою право призупинити надання комунальних послуг на термін до 30 днів без компенсації орендарю.",
        riskSeverity: "medium",
        riskActivationCondition: "У разі технічних робіт або форс-мажору",
        riskFinancialImpact: 1800,
      },
    ],
  },

  // ── INVESTOR EQUITY CONTRACT ─────────────────────────────────
  {
    id: "contract_investor_equity",
    title: "Договір Купівлі-Продажу Корпоративних Прав",
    counterparty: "Інвестор Артем Коваль (приватна особа)",
    dealValue: 25000,
    mentalCostToRead: 15,
    lawyerCostUSD: 800,
    readingBonus: {
      mentalDelta: 20,
      message: "Ти прочитав умови дострокового виходу інвестора та захистив себе від примусового продажу.",
    },
    skipPenalty: {
      probability: 0.85,
      financialLoss: 20000,
      triggerMonth: 8,
      message: "П.9.2 активовано: Інвестор скористався правом 'drag-along' і змусив тебе продати 100% бізнесу третій стороні на невигідних умовах.",
    },
    clauses: [
      {
        id: "ic1",
        sectionTitle: "§2. Предмет угоди",
        visibleText: "Інвестор купує 25% корпоративних прав компанії за $25,000.",
      },
      {
        id: "ic2",
        sectionTitle: "§5. Права Інвестора",
        visibleText: "Інвестор має право на участь у розподілі прибутку пропорційно до частки.",
        hiddenRisk: "П.5.3: Інвестор має право вето на будь-які угоди вартістю понад $5,000 без його письмової згоди.",
        riskSeverity: "high",
        riskActivationCondition: "При будь-якій великій угоді",
        riskFinancialImpact: 5000,
      },
      {
        id: "ic3",
        sectionTitle: "§9. Право виходу",
        visibleText: "Інвестор має право на продаж своєї частки через 24 місяці.",
        hiddenRisk: "П.9.2 (Drag-Along Rights): У разі отримання Інвестором пропозиції від третьої сторони на купівлю 100% компанії, Засновник зобов'язаний продати свою частку на тих самих умовах.",
        riskSeverity: "critical",
        riskActivationCondition: "При наявності пропозиції на купівлю від третьої сторони",
        riskFinancialImpact: 20000,
      },
    ],
  },
];

// ─────────────────────────────────────────────
// CONTRACT RESOLUTION ENGINE
// ─────────────────────────────────────────────
export type ContractReadingChoice = "READ_CAREFULLY" | "SKIM" | "SKIP" | "DELEGATE_LAWYER";

export interface ContractResolution {
  choice: ContractReadingChoice;
  mentalDelta: number;
  financialDelta: number;
  foundRisks: ContractClause[];
  missedRisks: ContractClause[];
  message: string;
  pendingRisks: ContractClause[]; // These will activate later
}

export const resolveContract = (
  contract: GameContract,
  choice: ContractReadingChoice,
  playerMentalEnergy: number
): ContractResolution => {
  const allHiddenClauses = contract.clauses.filter(c => c.hiddenRisk);

  switch (choice) {
    case "READ_CAREFULLY": {
      const canAffordMentalCost = playerMentalEnergy >= contract.mentalCostToRead;
      return {
        choice,
        mentalDelta: canAffordMentalCost ? -contract.mentalCostToRead + contract.readingBonus.mentalDelta : -contract.mentalCostToRead,
        financialDelta: 0,
        foundRisks: allHiddenClauses,
        missedRisks: [],
        message: canAffordMentalCost
          ? `✅ ${contract.readingBonus.message} Знайдено ${allHiddenClauses.length} прихованих пунктів.`
          : "⚠️ Ти намагався читати, але виснаження не дозволило сконцентруватись. Деякі ризики пропущені.",
        pendingRisks: [],
      };
    }

    case "SKIM": {
      // Find ~50% of risks
      const foundCount = Math.ceil(allHiddenClauses.length * 0.5);
      const found = allHiddenClauses.slice(0, foundCount);
      const missed = allHiddenClauses.slice(foundCount);
      return {
        choice,
        mentalDelta: -Math.floor(contract.mentalCostToRead * 0.4),
        financialDelta: 0,
        foundRisks: found,
        missedRisks: missed,
        message: `📄 Швидкий перегляд. Знайдено ${found.length} з ${allHiddenClauses.length} прихованих ризиків.`,
        pendingRisks: missed,
      };
    }

    case "SKIP": {
      return {
        choice,
        mentalDelta: 5, // Small mental "savings" that's a trap
        financialDelta: 0,
        foundRisks: [],
        missedRisks: allHiddenClauses,
        message: "⏭️ Підписано без читання. Усі приховані ризики залишаться активними.",
        pendingRisks: allHiddenClauses,
      };
    }

    case "DELEGATE_LAWYER": {
      return {
        choice,
        mentalDelta: 5, // Positive: peace of mind
        financialDelta: -contract.lawyerCostUSD,
        foundRisks: allHiddenClauses,
        missedRisks: [],
        message: `⚖️ Юрист перевірив договір. Знайдено та нейтралізовано ${allHiddenClauses.length} ризиків. Вартість: -$${contract.lawyerCostUSD}. Ментальна енергія збережена.`,
        pendingRisks: [],
      };
    }
  }
};
