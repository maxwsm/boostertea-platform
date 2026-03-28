import { Context } from 'telegraf';

/**
 * Calculates typing delay based on character count.
 * Rate: 1 second per 30 characters.
 */
export async function simulateTyping(ctx: Context, textLength: number): Promise<void> {
  if (!ctx.chat) return;
  
  // Calculate delay in milliseconds
  // Limit max reasonable delay to 8 seconds so user doesn't think bot died
  const msDelay = Math.min((textLength / 30) * 1000, 8000); 

  try {
    await ctx.sendChatAction('typing');
    
    // Non-blocking sleep
    await new Promise((resolve) => setTimeout(resolve, msDelay));
  } catch (err) {
    console.error('[simulateTyping] Error sending chat action:', err);
  }
}
