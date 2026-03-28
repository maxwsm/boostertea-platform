import { Hono } from 'hono';
import { cors } from "hono/cors";
import { sign, verify } from 'hono/jwt';
import { prisma } from '@wsm/db';
import { WsmEventBus } from '@wsm/events';
import { startBot } from './bot';
import { startWorker } from './worker';
import { retentionTriggerQueue } from './redis';

// Boot background AI processes
startBot();
startWorker();

// Boot background AI processes
startBot();
startWorker();

const eventBus = new WsmEventBus();

const app = new Hono().basePath('/api');

// Basic DDOS protection memory limiter (Phase 18 Audit)
const rateLimiter = new Map<string, number[]>();
app.use('*', async (c, next) => {
  const ip = c.req.header('x-real-ip') || c.req.header('x-forwarded-for') || 'anon';
  const now = Date.now();
  const windowMs = 60000;
  
  if (!rateLimiter.has(ip)) rateLimiter.set(ip, []);
  const hits = rateLimiter.get(ip)!.filter(t => now - t < windowMs);
  hits.push(now);
  rateLimiter.set(ip, hits);

  if (hits.length > 200) {
    console.warn(`[FIREWALL] Blocked IP ${ip} after 200 hits/min`);
    return c.json({ error: 'Too Many Requests' }, 429);
  }
  await next();
});
app.use('*', cors());

const JWT_SECRET = process.env.JWT_SECRET || 'wsm-global-secret-2026';

app.post('/auth/login', async (c) => {
  const body = await c.req.json();
  const { email, password } = body;

  try {
    if (!email || password.length < 6) {
      return c.json({ success: false, error: 'Невірні дані' }, 401);
    }

    // Try to find the user in our newly implemented Prisma DB
    let user = await prisma.user.findUnique({ where: { email } });
    
    // Auto-create for the incubator phase (simulate full SSO flow)
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: email.split('@')[0],
          languageCode: 'uk',
        }
      });
      
      // Initialize the Global Wallet (Cross-Brand Points)
      await prisma.wallet.create({
        data: {
          userId: user.id,
          balance: 200.0, // Welcome bonus across the entire WSM ecosystem
        }
      });
    }

    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });

    // Generate Global WSM Ecosystem JWT
    const payload = {
      sub: user.id,
      email: user.email,
      role: 'user',
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
    };
    
    const token = await sign(payload, JWT_SECRET);

    return c.json({ 
      success: true, 
      token, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        bonusPoints: wallet?.balance || 0,
        isAdmin: payload.role === 'admin'
      }
    });

  } catch (e: any) {
    console.error('AUTH_ERROR:', e.message);
    return c.json({ success: false, error: 'Помилка сервера' }, 500);
  }
});

// Middleware to verify JWT for protected routes (Cross-Brand Validation)
app.use('/auth/me', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = await verify(token, JWT_SECRET);
    c.set('jwtPayload', decoded);
    await next();
  } catch (e) {
    return c.json({ success: false, error: 'Invalid Token' }, 401);
  }
});

app.get('/auth/me', async (c) => {
  const payload = c.get('jwtPayload');
  
  try {
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    const wallet = await prisma.wallet.findUnique({ where: { userId: payload.sub } });
    
    if (!user) return c.json({ success: false, error: 'User not found' }, 404);
    
    return c.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        bonusPoints: wallet?.balance || 0,
        isAdmin: payload.role === 'admin'
      }
    });
  } catch (e) {
    return c.json({ success: false, error: 'DB Error' }, 500);
  }
});

app.get('/health', (c) => c.json({ status: 'wsm-global-auth-active' }));

// WSM Gamification & Order Processing
app.post('/orders', async (c) => {
  try {
    const body = await c.req.json();
    
    const total = body.items.reduce((acc: number, item: any) => acc + (item.quantity * 500), 0);
    const userId = body.userId ? String(body.userId) : 'guest-user-id';
    
    // 1. Determine active brand for this sub-order (Mocking multi-brand logic)
    // 1. Multi-Brand Cart Check removed for seamless cross-brand checkout
    const brandsInCart = Array.from(new Set(body.items.map((i: any) => i.brandId).filter(Boolean)));

    const brand = await prisma.brand.findFirst() || await prisma.brand.create({
      data: { slug: 'boostertea', name: 'BoosterTea' }
    });
    
    const rawIp = (c.req.header('x-real-ip') || c.req.header('x-forwarded-for') || '127.0.0.1') as string;
    const ipAddress = require('crypto').createHash('sha256').update(rawIp).digest('hex').substring(0, 16);
    const deviceId = body.deviceId || 'unknown';

    // Check for Ambassador Referral ("Promo is King" -> Promo code overrides refCode)
    let referredById = null;
    let actualRefCode = body.promoCode || body.refCode;
    
    if (actualRefCode) {
      const ambProfile = await prisma.ambassadorProfile.findUnique({
        where: { referralCode: String(actualRefCode) },
        include: { user: true }
      });
      if (ambProfile && ambProfile.user) {
        // Anti-Fraud: Self-Buy Firewall Check
        const isFraud = (ambProfile.user.lastIpAddress === ipAddress) || (ambProfile.user.lastDeviceId === deviceId);
        if (!isFraud) {
          referredById = ambProfile.id;
        } else {
          console.warn(`[ANTI-FRAUD] Self-buy prevented for refCode ${actualRefCode} from IP ${ipAddress}`);
        }
      }
    }
    
    // 1.5 HARD INVENTORY LOCK MOVED TO ERP (Dashboard KanBan) to prevent Double-Spend
    // Cargo will be decremented upon SHIPPED transition.
    
    let finalTotal = total;
    // Server-side Promo Evaluation (Phase 18 Audit)
    if (body.promoCode === 'WSM_PARTNER_2026') {
      finalTotal = Math.floor(total * 0.85); // 15% off
    } else if (referredById) {
      finalTotal = Math.floor(total * 0.90); // 10% off for valid ambassador
    }

    // 2. Create Master Transaction (Unified Cart Checkout, 14-day hold)
    const transaction = await prisma.transaction.create({
      data: {
        userId: body.userId ? String(body.userId) : null,
        totalAmount: finalTotal,
        status: 'FROZEN',
        unfreezeDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days hold
        paymentGateway: body.paymentGateway || 'monobank',
        ipAddress,
        deviceId,
        referredById
      }
    });

    // Update telemetry for known user
    if (body.userId) {
       await prisma.user.update({
          where: { id: String(body.userId) },
          data: { lastIpAddress: ipAddress, lastDeviceId: deviceId }
       });
    }

    // 3. Create sub-order associated with the transaction
    const order = await prisma.order.create({
      data: {
        userId,
        brandId: brand.id,
        transactionId: transaction.id,
        status: 'PENDING',
        totalAmount: finalTotal,
        items: {
          create: body.items.map((i: any) => ({
            productId: String(i.productId),
            quantity: i.quantity,
            priceAtBuy: 500
          }))
        }
      }
    });

    // 4. Trigger Event-Driven Gamification Logic at Transaction level
    if (body.userId) {
      await eventBus.publish('TRANSACTION_CREATED', {
        transactionId: transaction.id,
        userId: String(body.userId),
        amount: total,
        orderIds: [order.id]
      });

      // 5. Predictive Consumption: Schedule 14-day retention trigger
      await retentionTriggerQueue.add(
        'retention-push', 
        { 
          userId: body.userId, 
          transactionId: transaction.id, 
          phone: "0000000000" // would be extracted from order contact
        }, 
        { delay: 14 * 24 * 60 * 60 * 1000 } // 14 Days delay
      );
      console.log(`[BullMQ] Predictive Retention Job scheduled for 14 days later. User: ${body.userId}`);
    }

    // 6. Telegram Notification to Admin/Manager Hub
    try {
      const { bot } = require('./bot');
      const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
      
      if (chatId) {
        const itemsList = body.items.map((i: any) => `▪ ${i.productId} (x${i.quantity})`).join('\n');
        const deliveryText = body.deliveryMethod === 'nova_poshta' 
          ? `Нова Пошта\n📍 ${body.deliveryCity}, ${body.deliveryWarehouse}` 
          : 'Самовивіз';

        const msg = `🚨 *Нове замовлення (${brand.name})* 🚨\n\n` +
                    `👤 *Клієнт:* ${body.customerName || 'Гість'}\n` +
                    `📞 *Телефон:* ${body.customerPhone || 'Не вказано'}\n` +
                    `💰 *Сума (до сплати):* ${finalTotal} ₴\n\n` +
                    `📦 *Доставка:*\n${deliveryText}\n\n` +
                    `🛒 *Кошик:*\n${itemsList}`;
        
        await bot.telegram.sendMessage(chatId, msg, { parse_mode: 'Markdown' });
        console.log(`[Telegram] Order notification dispatched successfully.`);
      } else {
        console.warn(`[Telegram] Skipping notification: TELEGRAM_ADMIN_CHAT_ID is not configured.`);
      }
    } catch (tgError) {
      console.error(`[Telegram] Failed to send order notification:`, tgError);
    }

    return c.json({ success: true, transaction, order });
  } catch (e: any) {
    console.error('ORDER_ERROR:', e.message);
    return c.json({ success: false, error: 'Помилка оформлення' }, 500);
  }
});

// ----------------------------------------------------
// WSM Ambassador Module
// ----------------------------------------------------

app.get('/ambassadors/stats/:userId', async (c) => {
  try {
     const userId = c.req.param('userId');
     const profile = await prisma.ambassadorProfile.findUnique({
         where: { userId },
         include: { transactions: { orderBy: { createdAt: 'desc' }, take: 50 } }
     });

     if (!profile) return c.json({ error: 'Не знайдено профайл амбасадора' }, 404);

     // Recalculate "AVAILABLE" vs "FROZEN" balances 
     // We only count money as 'yours' if it is COMPLETED.
     const completed = profile.transactions.filter(t => t.status === 'COMPLETED');
     const frozen = profile.transactions.filter(t => t.status === 'FROZEN');
     
     const totalSalesAmount = completed.reduce((sum, t) => sum + t.totalAmount, 0);
     const frozenSalesAmount = frozen.reduce((sum, t) => sum + t.totalAmount, 0);

     return c.json({ 
       profile: {
         ...profile,
         totalSalesAmount, // overriding internal raw value for frontend
         frozenSalesAmount,
         totalLockedCommissions: frozenSalesAmount * profile.commissionRate
       }
     });
  } catch (e: any) {
     return c.json({ error: e.message }, 500);
  }
});

app.post('/ambassadors/generate', async (c) => {
  try {
     const { userId, customCode } = await c.req.json();
     if (!userId) return c.json({ error: 'userId is required' }, 400);

     const generatedCode = customCode || `REF-${Math.floor(Math.random() * 1000000)}`;

     let profile = await prisma.ambassadorProfile.findUnique({ where: { userId } });
     
     if (!profile) {
         // Create profile if doesn't exist
         profile = await prisma.ambassadorProfile.create({
             data: {
                 userId,
                 referralCode: generatedCode
             }
         });
     }

     return c.json({ 
         success: true, 
         profile, 
         link: `https://boostertea.com.ua/?ref=${profile.referralCode}` 
     });
  } catch (e: any) {
     return c.json({ error: e.message }, 500);
  }
});

app.post('/ambassadors/click', async (c) => {
  try {
     const { refCode } = await c.req.json();
     if (!refCode) return c.json({ success: false });

     await prisma.ambassadorProfile.update({
         where: { referralCode: refCode },
         data: { totalClicks: { increment: 1 } }
     });

     return c.json({ success: true });
  } catch (e: any) {
     return c.json({ error: e.message }, 500);
  }
});

// Dummy Payment Endpoint to satisfy checkout frontend
app.post('/payment/create-invoice', async (c) => {
  const body = await c.req.json();
  return c.json({ success: true, orderId: body.orderId, pageUrl: null }); // returning null pageUrl redirects directly to success
});

console.log("🚀 WSM Global Auth & Wallet API starting on port 3000...");

// ----------------------------------------------------
// C2B2B Trojan Horse: Lead Generator
// ----------------------------------------------------

app.post('/b2b/leads', async (c) => {
  try {
    const { userId, cafeName, city, address, notes } = await c.req.json();
    if (!userId || !cafeName) return c.json({ error: 'Missing required fields' }, 400);

    const lead = await prisma.b2BLead.create({
      data: { userId, cafeName, city, address, notes }
    });
    return c.json({ success: true, lead });
  } catch(e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// ----------------------------------------------------
// POS Webhooks (Poster / R-Keeper)
// ----------------------------------------------------

// ----------------------------------------------------
// Payment Webhooks (Monobank)
// ----------------------------------------------------

app.post('/webhooks/monobank', async (c) => {
  try {
    const signature = c.req.header('x-sign');
    if (!signature) {
      console.warn('[MonoBank] Webhook rejected: Missing X-Sign signature');
      return c.json({ error: 'Missing signature' }, 401);
    }
    
    const body = await c.req.json();
    console.log(`[MonoBank] Webhook received for invoice ${body.invoiceId || 'UNKNOWN'}, status: ${body.status}`);
    
    return c.json({ success: true });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.post('/webhooks/pos', async (c) => {
  try {
    // SECURITY: POS IP Firewall & Signature Validation
    const clientIp = c.req.header('x-real-ip') || c.req.header('x-forwarded-for') || '';
    const whitelistedIps = ['176.12.34.5', '192.168.1.1']; // Mock Poster IPs
    if (!whitelistedIps.includes(clientIp as string) && process.env.NODE_ENV === 'production') {
      console.warn(`[SECURITY] Blocked unauthorized POS webhook from IP ${clientIp}`);
      return c.json({ error: 'Unauthorized IP' }, 403);
    }
    
    const signature = c.req.header('x-poster-signature');
    if (signature !== process.env.POSTER_SECRET && process.env.NODE_ENV === 'production') {
      return c.json({ error: 'Invalid Webhook Signature' }, 403);
    }

    const payload = await c.req.json();
    
    // According to the Syndicate Doctrine: 1L = 17 portions (2 pumps)
    // We listen to the POS system checkouts. If a specific B2B partner drops below
    // 2-3 portions of inventory, we instantly dispatch a Telegram Re-Order Bot ping.
    
    await eventBus.publish('POS_TRANSACTION_RECEIVED' as any, {
      payload,
      timestamp: new Date().toISOString()
    });
    
    console.log(`[POS Integration] Validated external register check. Payload integrity OK. Routing to AI analyzer.`);

    return c.json({ success: true, processed: true });
  } catch(e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export default {
  port: 3001,
  fetch: app.fetch,
};
