import { prisma } from '@wsm/db';

export type EventPayloads = {
  ORDER_CREATED: {
    orderId: string;
    userId: string;
    amount: number;
    items?: any[];
  };
  TRANSACTION_CREATED: {
    transactionId: string;
    userId: string;
    amount: number;
    orderIds?: string[];
  };
};

export type EventName = keyof EventPayloads;

/**
 * WsmEventBus (Architect Skill)
 * 
 * Handles cross-brand, event-driven processes.
 * When an order is created, it reactive updates the unified User Wallet and gamifies the backend.
 */
export class WsmEventBus {
  private db = prisma;

  constructor(db?: any) {
    if (db) this.db = db;
  }

  async publish<T extends EventName>(event: T, payload: EventPayloads[T]) {
    console.log(`[EVENT_BUS] Emitting ${event}:`, payload);
    
    try {
      // Synchronous inline processing for monorepo scale
      if (event === 'ORDER_CREATED') {
        await this.handleOrderCreated(payload as EventPayloads['ORDER_CREATED']);
      }
      
      if (event === 'TRANSACTION_CREATED') {
        await this.handleTransactionCreated(payload as EventPayloads['TRANSACTION_CREATED']);
      }
    } catch (error: any) {
      console.error(`[EVENT_BUS] 🚨 FATAL CRASH catching ${event}:`, error.message);
    }
  }

  private async handleOrderCreated(payload: EventPayloads['ORDER_CREATED']) {
    console.log(`[EVENT_BUS] Processing ORDER_CREATED for ${payload.orderId}`);
    
    // 1. Cross-Brand Loyalty: Calculate points (e.g., 10% of total amount)
    const pointsAwarded = Math.floor(payload.amount * 0.1);

    // 2. Gamification & SSO: Add to Unified Global Wallet
    await this.db.wallet.upsert({
      where: { userId: payload.userId },
      update: {
        balance: { increment: pointsAwarded },
        totalEarned: { increment: pointsAwarded },
      },
      create: {
        user: { connect: { id: payload.userId } },
        balance: pointsAwarded,
        totalEarned: pointsAwarded,
      }
    });

    console.log(`[EVENT_BUS] ✅ Awarded ${pointsAwarded} points to user ${payload.userId}`);
    
    // 3. Stub for Logistics Gamification trigger
    // await this.triggerCarrierScoreEvaluation(payload.orderId);
  }

  private async handleTransactionCreated(payload: EventPayloads['TRANSACTION_CREATED']) {
    console.log(`[EVENT_BUS] Processing TRANSACTION_CREATED for ${payload.transactionId}`);
    
    // Unified Wallet calculation on the Master Transaction level
    const pointsAwarded = Math.floor(payload.amount * 0.1);

    await this.db.wallet.upsert({
      where: { userId: payload.userId },
      update: {
        balance: { increment: pointsAwarded },
        totalEarned: { increment: pointsAwarded },
      },
      create: {
        user: { connect: { id: payload.userId } },
        balance: pointsAwarded,
        totalEarned: pointsAwarded,
      }
    });

    console.log(`[EVENT_BUS] ✅ Transaction rewards: ${pointsAwarded} points to user ${payload.userId}`);
  }
}
