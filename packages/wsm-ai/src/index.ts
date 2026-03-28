import { PrismaClient } from '@prisma/client';

export class AiGuardrail {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  /**
   * Humanize Guardrail (WSM Founder Logic)
   * Prevents AI bots from sounding too robotic or "OpenAI-like".
   */
  async humanizeResponse(
    userId: string | null,
    brandId: string | null,
    rawText: string,
    modelUsed: string = 'gpt-4-turbo',
    tokensEstimated: number = 0
  ): Promise<string> {
    
    // 1. Basic syntatic transformations mimicking founder tone
    let humanized = (rawText || '')
      .replace(/По-перше,/g, "Отже,")
      .replace(/Звичайно, чим я можу допомогти\?/g, "Привіт! Що підказати?")
      .replace(/Я штучний інтелект/g, "Я ваш помічник");

    // Randomize a slight casual tone (if short message)
    if (humanized.length < 50 && !humanized.includes('Привіт')) {
      const prefixes = ["Окей, ", "Добре, дивись: ", ""];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      humanized = prefix + humanized;
    }

    // 2. Log Telemetry to AiResponseAudit table to track economics
    const costUsd = tokensEstimated * 0.00001; // Fake pricing for example
    
    await this.db.aiResponseAudit.create({
      data: {
        userId,
        brandId,
        modelUsed,
        tokensInput: tokensEstimated,
        tokensOutput: humanized.length / 4, // rough estimate
        costUsd,
      }
    });

    return humanized;
  }

  /**
   * TAI_COO: Pure Profit 7% Rule
   * Automatically calculates the learning/coaching budget based on ecosystem telemetry.
   */
  calculateLearningBudget(totalRevenue: number, totalCosts: number): number {
    const pureProfit = totalRevenue - totalCosts;
    if (pureProfit > 0) {
      const budget = pureProfit * 0.07; // 7% of pure profit
      console.log(`[TAI_COO] Ecosystem in green! Allocating ${budget.toFixed(2)}$ to Elite Team Mentoring.`);
      return budget;
    }
    console.log(`[TAI_COO] Ecosystem operating in deficit. Training budget suspended until threshold broken.`);
    return 0;
  }

  /**
   * Team Mirroring & Archival 
   * Studies the thought patterns, decision trees, and intent of the user.
   */
  async mirrorBehavior(userId: string, context: string, sentiment: number) {
    await this.db.behavioralArchive.create({
      data: {
        userId,
        platform: 'SYSTEM_INTERNAL',
        message: context,
        role: 'USER_EVALUATION',
        intent: 'COGNITIVE_MIRROR',
        sentiment,
      }
    });
    console.log(`[AI_LOG] Context mirrored for user ${userId}. Persona profile updated.`);
  }
}
