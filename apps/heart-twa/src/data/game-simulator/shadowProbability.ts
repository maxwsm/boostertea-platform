/**
 * SHADOW PROBABILITY ENGINE
 * 
 * Calculates the probability of Shadow vs Totem (Self) activation
 * for each participant in a given negotiation context.
 * 
 * Based on:
 * - Bio parameters (sleep, vacation, age)
 * - Context factors (stakes, time pressure, authority)
 * - Shadow archetype tendencies
 * - Interaction dynamics between participants
 */

import type { BioParameters } from "@/data/intake/IntakeTypes";

export type ShadowId =
  | "escapist"
  | "perfectionist"
  | "victim"
  | "aggressor"
  | "impostor"
  | "rescuer"
  | "manipulator"
  | "dissociator";

export type InfluenceType =
  | "ДОМІНУВАННЯ"
  | "МАНІПУЛЯЦІЯ"
  | "КОАЛІЦІЯ"
  | "КОНФЛІКТ"
  | "ПІДПОРЯДКУВАННЯ"
  | "ІГНОРУВАННЯ"
  | "КОДЕПЕНДЕНЦІЯ";

export interface NegotiationContext {
  stakes: number;                 // Financial stakes in USD
  hasTimePressure: boolean;       // Deadline pressure
  hasAuthorityFigure: boolean;    // Is there a power imbalance?
  isLowStakes: boolean;           // Friendly/casual setting
  emotionalCharge: number;        // 0-100, how emotionally loaded
}

export interface ParticipantProfile {
  name: string;
  role: string;
  age?: number;
  
  // Observable signals
  visualCues: string[];
  socialFacts: string[];
  knownBehavior: string;
  
  // Shadow engine
  dominantShadow: ShadowId;
  secondaryShadow?: ShadowId;
  
  // Bio factors (estimated or known)
  avgSleep?: number;
  lastVacationDays?: number;      // days since last 7+ day vacation
  hasPartnerSupport?: boolean;
  recentLoss?: boolean;           // Recent breakup, death, financial loss
  meditationPractice?: boolean;
  comfortFinancialThreshold?: number;
}

export interface ShadowProbabilityResult {
  shadow: number;                 // 0-100%
  totem: number;                  // 0-100%
  dominantShadow: ShadowId;
  explanation: string;
}

export interface InfluenceEdge {
  from: string;                   // participant name/id
  to: string;
  type: InfluenceType;
  strength: number;               // 0-100%
  mechanism: string;              // "Through financial dependency"
}

// ─── SHADOW INTERACTION MATRIX ─────────────────────────
// Defines how shadow A interacts with shadow B
const SHADOW_INTERACTION: Record<string, Record<string, { type: InfluenceType; baseStrength: number }>> = {
  aggressor: {
    victim: { type: "ДОМІНУВАННЯ", baseStrength: 90 },
    impostor: { type: "ДОМІНУВАННЯ", baseStrength: 75 },
    rescuer: { type: "КОНФЛІКТ", baseStrength: 60 },
    perfectionist: { type: "КОНФЛІКТ", baseStrength: 70 },
    escapist: { type: "ДОМІНУВАННЯ", baseStrength: 80 },
    manipulator: { type: "КОНФЛІКТ", baseStrength: 55 },
    dissociator: { type: "ІГНОРУВАННЯ", baseStrength: 65 },
    aggressor: { type: "КОНФЛІКТ", baseStrength: 85 },
  },
  manipulator: {
    victim: { type: "МАНІПУЛЯЦІЯ", baseStrength: 85 },
    impostor: { type: "МАНІПУЛЯЦІЯ", baseStrength: 80 },
    rescuer: { type: "МАНІПУЛЯЦІЯ", baseStrength: 70 },
    perfectionist: { type: "КОАЛІЦІЯ", baseStrength: 45 },
    escapist: { type: "МАНІПУЛЯЦІЯ", baseStrength: 75 },
    aggressor: { type: "КОНФЛІКТ", baseStrength: 60 },
    dissociator: { type: "ІГНОРУВАННЯ", baseStrength: 55 },
    manipulator: { type: "КОНФЛІКТ", baseStrength: 50 },
  },
  perfectionist: {
    victim: { type: "ДОМІНУВАННЯ", baseStrength: 65 },
    impostor: { type: "ПІДПОРЯДКУВАННЯ", baseStrength: 40 },
    rescuer: { type: "КОАЛІЦІЯ", baseStrength: 55 },
    escapist: { type: "ДОМІНУВАННЯ", baseStrength: 70 },
    aggressor: { type: "КОНФЛІКТ", baseStrength: 60 },
    manipulator: { type: "ПІДПОРЯДКУВАННЯ", baseStrength: 45 },
    dissociator: { type: "ІГНОРУВАННЯ", baseStrength: 50 },
    perfectionist: { type: "КОНФЛІКТ", baseStrength: 70 },
  },
  victim: {
    aggressor: { type: "ПІДПОРЯДКУВАННЯ", baseStrength: 80 },
    manipulator: { type: "ПІДПОРЯДКУВАННЯ", baseStrength: 75 },
    rescuer: { type: "КОДЕПЕНДЕНЦІЯ", baseStrength: 85 },
    perfectionist: { type: "ПІДПОРЯДКУВАННЯ", baseStrength: 60 },
    escapist: { type: "КОАЛІЦІЯ", baseStrength: 45 },
    impostor: { type: "КОАЛІЦІЯ", baseStrength: 50 },
    dissociator: { type: "ІГНОРУВАННЯ", baseStrength: 40 },
    victim: { type: "КОАЛІЦІЯ", baseStrength: 55 },
  },
  rescuer: {
    victim: { type: "КОДЕПЕНДЕНЦІЯ", baseStrength: 85 },
    aggressor: { type: "ПІДПОРЯДКУВАННЯ", baseStrength: 50 },
    manipulator: { type: "ПІДПОРЯДКУВАННЯ", baseStrength: 55 },
    perfectionist: { type: "КОАЛІЦІЯ", baseStrength: 60 },
    escapist: { type: "КОДЕПЕНДЕНЦІЯ", baseStrength: 65 },
    impostor: { type: "КОАЛІЦІЯ", baseStrength: 50 },
    dissociator: { type: "ІГНОРУВАННЯ", baseStrength: 40 },
    rescuer: { type: "КОДЕПЕНДЕНЦІЯ", baseStrength: 70 },
  },
  impostor: {
    aggressor: { type: "ПІДПОРЯДКУВАННЯ", baseStrength: 75 },
    manipulator: { type: "ПІДПОРЯДКУВАННЯ", baseStrength: 70 },
    victim: { type: "КОАЛІЦІЯ", baseStrength: 50 },
    perfectionist: { type: "ПІДПОРЯДКУВАННЯ", baseStrength: 55 },
    rescuer: { type: "КОАЛІЦІЯ", baseStrength: 45 },
    escapist: { type: "КОАЛІЦІЯ", baseStrength: 40 },
    dissociator: { type: "КОАЛІЦІЯ", baseStrength: 35 },
    impostor: { type: "КОАЛІЦІЯ", baseStrength: 45 },
  },
  escapist: {
    aggressor: { type: "ПІДПОРЯДКУВАННЯ", baseStrength: 70 },
    manipulator: { type: "ПІДПОРЯДКУВАННЯ", baseStrength: 65 },
    perfectionist: { type: "ІГНОРУВАННЯ", baseStrength: 60 },
    victim: { type: "ІГНОРУВАННЯ", baseStrength: 50 },
    rescuer: { type: "ПІДПОРЯДКУВАННЯ", baseStrength: 55 },
    impostor: { type: "ІГНОРУВАННЯ", baseStrength: 40 },
    dissociator: { type: "КОАЛІЦІЯ", baseStrength: 55 },
    escapist: { type: "КОАЛІЦІЯ", baseStrength: 50 },
  },
  dissociator: {
    aggressor: { type: "ІГНОРУВАННЯ", baseStrength: 60 },
    manipulator: { type: "ІГНОРУВАННЯ", baseStrength: 55 },
    perfectionist: { type: "ІГНОРУВАННЯ", baseStrength: 50 },
    victim: { type: "ІГНОРУВАННЯ", baseStrength: 45 },
    rescuer: { type: "ІГНОРУВАННЯ", baseStrength: 50 },
    impostor: { type: "ІГНОРУВАННЯ", baseStrength: 40 },
    escapist: { type: "КОАЛІЦІЯ", baseStrength: 50 },
    dissociator: { type: "ІГНОРУВАННЯ", baseStrength: 65 },
  },
};

// ─── CORE ALGORITHM ─────────────────────────

/**
 * Calculate Shadow vs Totem probability for a participant
 * in a specific negotiation context.
 */
export function calculateShadowProbability(
  participant: ParticipantProfile,
  context: NegotiationContext
): ShadowProbabilityResult {
  let shadowScore = 50; // Base — equal chance
  const reasons: string[] = [];

  // ─── FACTORS THAT AMPLIFY SHADOW ─────────────────────────
  if (context.stakes > (participant.comfortFinancialThreshold || 5000)) {
    shadowScore += 15;
    reasons.push("Ставки перевищують комфортний поріг");
  }

  if (participant.lastVacationDays && participant.lastVacationDays > 90) {
    shadowScore += 10;
    reasons.push("Відпустка > 3 місяців тому");
  }

  if (participant.avgSleep && participant.avgSleep < 6) {
    shadowScore += 12;
    reasons.push("Критичний дефіцит сну");
  } else if (participant.avgSleep && participant.avgSleep < 7) {
    shadowScore += 5;
  }

  if (context.hasTimePressure) {
    shadowScore += 8;
    reasons.push("Тиск дедлайну");
  }

  if (context.hasAuthorityFigure) {
    shadowScore += 7;
    reasons.push("Присутність авторитету");
  }

  if (participant.recentLoss) {
    shadowScore += 15;
    reasons.push("Нещодавня втрата (стосунки/фінанси)");
  }

  if (context.emotionalCharge > 70) {
    shadowScore += 10;
    reasons.push("Висока емоційна напруга");
  }

  // ─── FACTORS THAT AMPLIFY TOTEM ─────────────────────────
  if (participant.avgSleep && participant.avgSleep >= 7.5) {
    shadowScore -= 10;
    reasons.push("Якісний сон ≥ 7.5 годин");
  }

  if (participant.hasPartnerSupport) {
    shadowScore -= 8;
    reasons.push("Підтримка партнера");
  }

  if (participant.meditationPractice) {
    shadowScore -= 12;
    reasons.push("Медитативна практика");
  }

  if (context.isLowStakes) {
    shadowScore -= 15;
    reasons.push("Низькі ставки — безпечне середовище");
  }

  // Clamp
  const shadow = Math.min(95, Math.max(5, shadowScore));
  const totem = 100 - shadow;

  return {
    shadow,
    totem,
    dominantShadow: participant.dominantShadow,
    explanation: reasons.join(". ") + ".",
  };
}

/**
 * Calculate influence edges between all participants
 */
export function calculateInfluenceMatrix(
  participants: ParticipantProfile[],
  context: NegotiationContext
): InfluenceEdge[] {
  const edges: InfluenceEdge[] = [];

  for (const from of participants) {
    for (const to of participants) {
      if (from.name === to.name) continue;

      const interaction = SHADOW_INTERACTION[from.dominantShadow]?.[to.dominantShadow];
      if (!interaction) continue;

      // Modify strength based on context
      let strength = interaction.baseStrength;
      
      // Higher stakes amplify dominant interactions
      if (context.stakes > 10000) strength = Math.min(95, strength + 10);
      
      // Time pressure amplifies aggressive patterns
      if (context.hasTimePressure && (from.dominantShadow === "aggressor" || from.dominantShadow === "manipulator")) {
        strength = Math.min(95, strength + 8);
      }

      // Build mechanism description
      const mechanism = buildMechanismDescription(from, to, interaction.type);

      edges.push({
        from: from.name,
        to: to.name,
        type: interaction.type,
        strength,
        mechanism,
      });
    }
  }

  return edges;
}

function buildMechanismDescription(
  from: ParticipantProfile,
  to: ParticipantProfile,
  type: InfluenceType
): string {
  const mechanisms: Record<InfluenceType, string[]> = {
    "ДОМІНУВАННЯ": [
      `${from.name} тисне через статусну перевагу`,
      `Використовує авторитет ролі ${from.role}`,
      `Застосовує тиск через ultimatums`,
    ],
    "МАНІПУЛЯЦІЯ": [
      `${from.name} грає на відчутті провини ${to.name}`,
      `Непрямий тиск через третіх осіб`,
      `Зміна правил гри в процесі`,
    ],
    "КОАЛІЦІЯ": [
      `${from.name} шукає підтримку ${to.name}`,
      `Спільний інтерес проти інших учасників`,
      `Неформальна домовленість за лаштунками`,
    ],
    "КОНФЛІКТ": [
      `Пряме зіткнення позицій ${from.name} та ${to.name}`,
      `Несумісні цілі створюють напругу`,
      `Боротьба за контроль над процесом`,
    ],
    "ПІДПОРЯДКУВАННЯ": [
      `${from.name} автоматично поступається ${to.name}`,
      `Уникає конфронтації через страх наслідків`,
      `Погоджується, але накопичує образу`,
    ],
    "ІГНОРУВАННЯ": [
      `${from.name} не враховує позицію ${to.name}`,
      `Емоційна дистанція як захисний механізм`,
      `Відключення від процесу`,
    ],
    "КОДЕПЕНДЕНЦІЯ": [
      `${from.name} бере на себе проблеми ${to.name}`,
      `Нездорова взаємозалежність у рішеннях`,
      `Самопожертва заради чужого комфорту`,
    ],
  };

  const options = mechanisms[type] || [`${type} між ${from.name} та ${to.name}`];
  return options[Math.floor(Math.random() * options.length)];
}
