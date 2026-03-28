'use server';

import { prisma } from '@wsm/db';
import { revalidatePath } from 'next/cache';

export async function moveProductionOrderAction(orderId: string, newStatus: string) {
  try {
    const order = await prisma.manufacturingOrder.findUnique({
      where: { id: orderId },
      include: {
        techCard: {
          include: { items: true }
        }
      }
    });

    if (!order) throw new Error('Order not found');

    // Update status
    await prisma.manufacturingOrder.update({
      where: { id: orderId },
      data: { 
        status: newStatus,
        startedAt: order.status === 'DRAFT' && newStatus !== 'DRAFT' ? new Date() : undefined,
        completedAt: newStatus === 'DONE' ? new Date() : undefined
      }
    });

    // ==========================================
    // 1C & INVENTORY TRIGGER (ONLY ON DONE)
    // ==========================================
    if (newStatus === 'DONE' && order.status !== 'DONE') {
      
      // 1. Double Entry (AccountMove) - Cost of Goods Manufactured
      // Debit: Finished Goods Inventory, Credit: Raw Material Inventory
      const totalCost = Number(order.totalLaborCost) + Number(order.totalMaterialCost);
      const accMove = await prisma.accountMove.create({
        data: {
          type: 'MANUFACTURING_ENTRY',
          reference: `MO-COST-${order.orderRef}`,
          state: 'POSTED',
          lines: {
            create: [
              { accountId: '1000 Finished Goods', debit: totalCost, credit: 0 },
              { accountId: '1010 Raw Materials', debit: 0, credit: totalCost }
            ]
          }
        }
      });
      
      // 2. Stock Deduction (FEFO Algorithm)
      // For each ingredient in the BOM (TechCard), we deduct from the oldest LotReceipt
      for (const item of order.techCard.items) {
        const requiredQty = Number(item.quantity) * Number(order.targetQty);
        let remainingToDeduct = requiredQty;

        // Fetch lots in FEFO order (Oldest expiration first)
        const lots = await prisma.lotReceipt.findMany({
          where: { 
            productId: item.rawProductId,
            remainingQty: { gt: 0 }
          },
          orderBy: { expirationDate: 'asc' }
        });

        for (const lot of lots) {
          if (remainingToDeduct <= 0) break;
          const lotQty = Number(lot.remainingQty);
          
          if (lotQty >= remainingToDeduct) {
            // Deduct fully from this lot
            await prisma.lotReceipt.update({
              where: { id: lot.id },
              data: { remainingQty: lotQty - remainingToDeduct }
            });
            remainingToDeduct = 0;
          } else {
            // Deplete this lot entirely and continue
            await prisma.lotReceipt.update({
              where: { id: lot.id },
              data: { remainingQty: 0 }
            });
            remainingToDeduct -= lotQty;
          }
        }

        if (remainingToDeduct > 0) {
          console.warn(`[FEFO Warning] Shortage of ingredient: ${item.rawProductId}. Negative stock allowed for simulation.`);
        }
      }

      console.log(`[ERP] Auto-executed 1C Financials and FEFO deduction for MO: ${order.orderRef}`);
    }

    revalidatePath('/erp/production-board');
    return { success: true };
  } catch (error: any) {
    console.error('[Production Board Action Error]', error.message);
    return { error: error.message };
  }
}

export async function notifyExpirationCron() {
  // Demo Cron-like logic that fetches Lots expiring within 3 days
  const expiringLots = await prisma.lotReceipt.findMany({
    where: {
      remainingQty: { gt: 0 },
      expirationDate: {
        lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
      }
    },
    include: { product: true }
  });

  if (expiringLots.length > 0) {
    console.log(`[Telegraf Push Trigger] Found ${expiringLots.length} expiring lots. Pushing to Telegram Bot.`);
    // A simple mock for telegraf.telegram.sendMessage(CHAT_ID, "Увага! Сироп...")
  }
}
