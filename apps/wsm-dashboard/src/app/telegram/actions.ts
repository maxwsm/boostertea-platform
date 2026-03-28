'use server';

import { prisma } from '@wsm/db';
import crypto from 'crypto';

/**
 * Валідує Telegram WebApp initData (Алгоритм HMAC-SHA256)
 * @param initData сирий рядок від WebApp.initData
 */
export async function validateAndAuthTmaUser(initData: string) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.warn("No TELEGRAM_BOT_TOKEN set. Using Development Mock Auth.");
      // Fallback for local development WITHOUT token
      return performMockAuth(initData);
    }

    // Parse initData
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');
    
    // Check Date to prevent replay attacks (older than 24h)
    const authDate = Number(urlParams.get('auth_date'));
    if (Date.now() / 1000 - authDate > 86400) {
      return { error: 'Session expired. Restart the Mini App.' };
    }

    // Re-pack keys alphabetically to form data-check-string
    const keys = Array.from(urlParams.keys()).sort();
    const dataCheckArr = keys.map(k => `\${k}=\${urlParams.get(k)}`);
    const dataCheckString = dataCheckArr.join('\n');

    // Generate secret key by HMAC-SHA256ing the bot token with the string 'WebAppData'
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    
    // Hash the data_check_string using the secret key
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (calculatedHash !== hash) {
      return { error: 'Data integrity check failed. Possible spoofing detected.' };
    }

    // If perfectly valid, we sync the user to Prisma!
    const userStr = urlParams.get('user');
    if (!userStr) return { error: 'No user data provided.' };
    
    const tgUser = JSON.parse(userStr);
    
    // Sync to Core DB
    const dbUser = await syncTmaUserToDb(tgUser);
    return { success: true, role: dbUser.role };

  } catch (err: any) {
    return { error: 'Internal Auth Error: ' + err.message };
  }
}

async function performMockAuth(initData: string) {
  // Parsing the unverified Data to find the ID (Development Mode)
  const urlParams = new URLSearchParams(initData);
  const userStr = urlParams.get('user');
  if (!userStr) return { error: 'No user data provided in Mock Auth.' };
  
  const tgUser = JSON.parse(userStr);
  const dbUser = await syncTmaUserToDb(tgUser);
  return { success: true, role: dbUser.role };
}

async function syncTmaUserToDb(tgUser: any) {
  const telegramId = tgUser.id.toString();
  
  // Find existing
  const existingUser = await prisma.user.findFirst({
    where: { telegramId }
  });

  const FOUNDER_IDS = ['12345678', '431478143'];
  const PACKER_IDS = ['11111111'];

  let role = 'MEMBER';
  if (FOUNDER_IDS.includes(telegramId)) role = 'ADMIN';
  if (PACKER_IDS.includes(telegramId)) role = 'PACKER';

  if (existingUser) {
    // Return existing DB user ensuring we have role property added to the object
    return { ...existingUser, role };
  }

  const newUser = await prisma.user.create({
    data: {
      telegramId,
      name: `\${tgUser.first_name || ''} \${tgUser.last_name || ''}`.trim(),
    }
  });

  return { ...newUser, role };
}

/**
 * Generates a Transaction for TLab/BoosterTea Telegram Checkout
 */
export async function createTmaCheckoutAction(payload: { items: any[], totalAmount: number, initData: string }) {
  try {
    // 1. Auth the user executing checkout
    const urlParams = new URLSearchParams(payload.initData);
    const userStr = urlParams.get('user');
    if (!userStr) throw new Error("Unauthenticated checkout attempt.");
    const tgUser = JSON.parse(userStr);
    
    const dbUser = await prisma.user.findFirst({
      where: { telegramId: tgUser.id.toString() }
    });

    if (!dbUser) throw new Error("User not registered in WSM Core.");

    // Fetch a generic brand or specific one to satisfy relation
    const brand = await prisma.brand.findFirst() || await prisma.brand.create({
      data: { slug: 'tma-store', name: 'TMA Sync Store' }
    });

    // 2. Create the Transaction (Payment tracking mapping to Colosseum)
    const transaction = await prisma.transaction.create({
      data: {
        totalAmount: payload.totalAmount, // Fixed from `amount`
        status: 'PENDING',
        paymentGateway: 'WAYFORPAY_TG_INVOICE',
        userId: dbUser.id,           // Fixed from `customerId`
        brandId: brand.id            // Required by SCHEMA
      }
    });

    // 3. (MOCK) Simulation: 5 seconds later WayForPay invokes Webhook -> PAID
    // For this prototype, we will just auto-resolve it to PAID to simulate success
    setTimeout(async () => {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'COMPLETED' }
      });
      // Optionally notify via bot: await sendNotification(`Payment \${transaction.id} successful`);
    }, 5000);

    return { 
      success: true, 
      transactionId: transaction.id, 
      invoiceLink: `https://pay.wayforpay.com/invoice/mock-\${transaction.id}` 
    };

  } catch (err: any) {
    return { error: err.message };
  }
}
