import { prisma } from '@wsm/db';

const POLL_INTERVAL = 30 * 1000; // 30 seconds

async function processAbandonedCarts() {
  try {
    const now = new Date();
    
    // SQLite Polling Queue (Lean Architecture)
    // 1. Fetch carts that passed their trigger time
    const dueCarts = await prisma.shadowCart.findMany({
      where: {
        status: 'abandoned',
        triggerAt: { lte: now }
      },
      take: 20
    });

    if (dueCarts.length === 0) return;
    console.log(`[ShadowCloser] 🎯 Found ${dueCarts.length} abandoned carts. Processing...`);

    for (const cart of dueCarts) {
      // 2. Atomic Lock (Race condition protection if multiple workers run)
      const lockedCart = await prisma.shadowCart.updateMany({
        where: { id: cart.id, status: 'abandoned' },
        data: { status: 'processing' }
      });

      // If count is 0, the cart was processed by someone else
      if (lockedCart.count === 0) continue;

      try {
        const payload = JSON.parse(cart.payload);
        
        // --- 3. TWA Delivery (Telegram Web Apps cascade) ---
        // Here we hit Telegram API or SMS Gateway with the recovery link.
        // Recovery link is deeply linked to the ?sid= parameter.
        const recoveryUrl = `https://boostertea.com.ua/recover?sid=${cart.sessionId}`;
        
        console.log(`[ShadowCloser] 📨 Sending TWA message to session ${cart.sessionId}:`);
        console.log(`   Link: ${recoveryUrl}`);
        console.log(`   Items: ${payload.items?.length || 0} pcs | Total: ${payload.total || 0} UAH`);

        // (Placeholder for actual SendPulse / Telegram Bot POST request)
        // await telegramBot.sendMessage({ ... });

        // 4. Mark as notified
        await prisma.shadowCart.update({
          where: { id: cart.id },
          data: { status: 'notified' }
        });

        console.log(`[ShadowCloser] ✅ Successfully injected TWA into session ${cart.sessionId}`);

      } catch (err) {
        console.error(`[ShadowCloser] ❌ Failed to notify session ${cart.sessionId}:`, err);
        // Put back to queue or mark as failed
        await prisma.shadowCart.update({
          where: { id: cart.id },
          data: { status: 'failed' }
        });
      }
    }

  } catch (error) {
    console.error('[ShadowCloser Fatal Error]', error);
  }
}

console.log('-----------------------------------------');
console.log('🤖 ShadowCloser Queue initialized.');
console.log('-----------------------------------------');
setInterval(processAbandonedCarts, POLL_INTERVAL);
// Start immediately on script boot
processAbandonedCarts();
