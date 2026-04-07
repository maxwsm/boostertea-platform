import { Hono } from 'hono';
import { cors } from "hono/cors";
import { sign, verify } from 'hono/jwt';
import { prisma } from '@wsm/db';
import { products, accessoryProducts } from '@wsm/config';
import { WsmEventBus } from '@wsm/events';
import { startBot } from './bot';
import { startWorker } from './worker';
import { retentionTriggerQueue } from './redis';

// Background AI processes are now handled by @wsm-telegram/bot-gateway and dedicated PM2 workers
// to prevent Vercel Serverless timeout and multiple instance conflicts.

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
app.use('*', cors({
  origin: ['https://boostertea.com.ua', 'https://funnydrop.com.ua', 'https://tai-drink.com.ua', 'http://localhost:3000', 'http://localhost:3011', 'http://localhost:3014'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_wsm_cart_testing_only';
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is missing. Using unsafe development fallback secret.');
}

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

app.get('/test/products', async (c) => {
  try {
    let brand = await prisma.brand.findUnique({ where: { slug: 'boostertea' } });
    if (!brand) {
      brand = await prisma.brand.create({
        data: {
          slug: 'boostertea',
          name: 'BoosterTea',
          domain: 'boostertea.com.ua',
          isActive: true
        }
      });
    }

    const testProducts = [
      { slug: 'test-1-uah', nameUk: 'Тестовий товар 1 грн', descriptionUk: 'Товар для перевірки платежів на 1 грн', price: 1, category: 'test', stockStatus: true, stockQuantity: 999, brandId: brand.id },
      { slug: 'test-2-uah', nameUk: 'Тестовий товар 2 грн', descriptionUk: 'Товар для перевірки платежів на 2 грн', price: 2, category: 'test', stockStatus: true, stockQuantity: 999, brandId: brand.id },
      { slug: 'test-3-uah', nameUk: 'Тестовий товар 3 грн', descriptionUk: 'Товар для перевірки платежів на 3 грн', price: 3, category: 'test', stockStatus: true, stockQuantity: 999, brandId: brand.id },
      { slug: 'test-4-uah', nameUk: 'Тестовий товар 4 грн', descriptionUk: 'Товар для перевірки платежів на 4 грн', price: 4, category: 'test', stockStatus: true, stockQuantity: 999, brandId: brand.id }
    ];

    for (const p of testProducts) {
      await prisma.product.upsert({
        where: { brandId_slug: { brandId: brand.id, slug: p.slug } },
        update: { price: p.price, stockStatus: true, stockQuantity: 999 },
        create: p
      });
    }
    return c.json({ success: true });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// Nova Poshta Proxy
app.post('/novaposhta', async (c) => {
  try {
    const body = await c.req.json();
    // Usually Nova Poshta requires apiKey in body. If not provided from frontend, we could inject from env.
    const apiKey = process.env.NOVAPOSHTA_API_KEY || '';
    const payload = apiKey ? { ...body, apiKey } : body;

    const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    return c.json(data);
  } catch (e: any) {
    return c.json({ success: false, errors: [e.message] }, 500);
  }
});

// WSM Gamification & Order Processing
app.post('/orders', async (c) => {
  try {
    const body = await c.req.json();
    
    // Guard: items must be a non-empty array
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return c.json({ error: 'Кошик порожній або відсутній' }, 400);
    }

    // Calculate total securely using backend config
    const total = body.items.reduce((acc: number, item: any) => {
      let price = 0;
      const productIdStr = String(item.productId || '');
      if (productIdStr.startsWith('acc-')) {
         const accItem = accessoryProducts.find(a => a.id === productIdStr);
         if (accItem) price = accItem.price;
      } else {
         const prodItem = products.find(p => p.id === productIdStr);
         if (prodItem) {
           price = item.volume === '1L' ? prodItem.price1L : prodItem.price025L;
         }
      }
      return acc + (price * item.quantity);
    }, 0);
    
    let resolvedUserId = body.userId ? String(body.userId) : null;
    
    // Telegram Guest Auto-Registration Protocol (Golden Grail)
    if (!resolvedUserId && body.telegramId) {
      const tgId = String(body.telegramId);
      let tgUser = await prisma.user.findUnique({ where: { telegramId: tgId } });
      if (!tgUser) {
         tgUser = await prisma.user.create({
           data: {
             telegramId: tgId,
             name: body.telegramFirstName || body.telegramUsername || 'Telegram Guest',
             phone: body.customerPhone || null,
             languageCode: 'uk',
           }
         });
         await prisma.wallet.create({
           data: { userId: tgUser.id, balance: 200.0 }
         });
         console.log(`[TMA Auth] Auto-created new Telegram Guest User: ${tgUser.id}`);
      }
      resolvedUserId = tgUser.id;
    }

    // Guest User Creation if no userId and no telegramId
    if (!resolvedUserId) {
      // Basic formatting to ensure phone is correct
      const phone = body.customerPhone?.replace(/[^\d+]/g, '');
      if (phone) {
        let guestUser = await prisma.user.findUnique({ where: { phone } });
        if (!guestUser && body.customerEmail) {
           guestUser = await prisma.user.findUnique({ where: { email: body.customerEmail } });
        }
        if (!guestUser) {
          guestUser = await prisma.user.create({
            data: {
              name: body.customerName || 'Guest User',
              phone,
              email: body.customerEmail ? body.customerEmail : null,
              languageCode: 'uk'
            }
          });
        }
        resolvedUserId = guestUser.id;
      } else {
        // Absolute fallback if no phone (should not happen with basic validation)
        const guestUser = await prisma.user.create({
          data: {
            name: body.customerName || 'Anonymous Guest',
            languageCode: 'uk'
          }
        });
        resolvedUserId = guestUser.id;
      }
    }
    
    const safeUserIdStr = resolvedUserId;
    
    // 1. Determine active brand for this sub-order
    // 1. Multi-Brand Cart Check removed for seamless cross-brand checkout
    const brandsInCart = Array.from(new Set(body.items.map((i: any) => i.brandId).filter(Boolean)));

    const merchantId = body.merchantId || 'boostertea';
    let brand = await prisma.brand.findUnique({ where: { slug: merchantId } });
    if (!brand) {
      brand = await prisma.brand.create({
        data: { slug: merchantId, name: merchantId.charAt(0).toUpperCase() + merchantId.slice(1) }
      });
    }
    
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
    // The items are now safely created as FROZEN. Cargo will be decremented upon SHIPPED transition.
    
    let finalTotal = total;
    // Server-side Promo Evaluation (Phase 18 Audit)
    if (body.promoCode === 'WSM_PARTNER_2026') {
      finalTotal = Math.floor(total * 0.85); // 15% off
    } else if (referredById) {
      finalTotal = Math.floor(total * 0.90); // 10% off for valid ambassador
    }

    // Ensure all products exist in DB to satisfy Foreign Key constraints
    for (const item of body.items) {
      let existingProduct = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!existingProduct) {
        // Upsert product from config to fix FK constraint
        const confProd = products.find(p => p.id === item.productId) || accessoryProducts.find(a => a.id === item.productId);
        if (confProd) {
          const isAccessory = !!(confProd as any).subcategory;
          await prisma.product.create({
            data: {
              id: confProd.id,
              brandId: brand.id,
              slug: confProd.slug || confProd.id,
              nameUk: confProd.nameUk,
              descriptionUk: confProd.descriptionUk || '',
              price: isAccessory ? (confProd as any).price : ((confProd as any).price1L || 0),
              image: confProd.image || '',
              category: isAccessory ? (confProd as any).subcategory : (confProd as any).category,
              metadata: JSON.stringify(confProd)
            }
          });
        }
      }
    }

    const deliveryData = JSON.stringify({
      method: body.deliveryMethod,
      city: body.deliveryCity,
      cityRef: body.deliveryCityRef,
      warehouse: body.deliveryWarehouse,
      warehouseRef: body.deliveryWarehouseRef,
      address: body.deliveryAddress,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
    });

    const transaction = await prisma.transaction.create({
      data: {
        userId: safeUserIdStr,
        brandId: brand.id,
        totalAmount: finalTotal,
        ipAddress,
        deviceId,
        referredById,
        status: 'PENDING'
      }
    });

    const order = await prisma.order.create({
      data: {
        userId: safeUserIdStr,
        brandId: brand.id,
        transactionId: transaction.id,
        status: 'PENDING',
        totalAmount: finalTotal,
        discountAmount: total - finalTotal,
        deliveryData,
        items: {
          create: body.items.map((i: any) => {
            const confProd = products.find(p => p.id === i.productId) || accessoryProducts.find(a => a.id === i.productId);
            const isAccessory = !!(confProd as any)?.subcategory;
            const itemPrice = isAccessory ? (confProd as any)?.price : (i.volume === '1L' ? (confProd as any)?.price1L : (confProd as any)?.price025L);
            return {
              productId: i.productId,
              quantity: i.quantity,
              priceAtBuy: itemPrice || 0,
              variant: i.volume || 'unit'
            };
          })
        }
      }
    });

    // Update telemetry for known user (Moved out of transaction to avoid blocking main path)
    if (resolvedUserId) {
       await prisma.user.update({
          where: { id: resolvedUserId },
          data: { lastIpAddress: ipAddress, lastDeviceId: deviceId }
       });
    }

    // 4. Trigger Event-Driven Gamification Logic at Transaction level
    if (resolvedUserId) {
      await eventBus.publish('TRANSACTION_CREATED', {
        transactionId: transaction.id,
        userId: resolvedUserId,
        amount: total,
        orderIds: [order.id]
      });

      await eventBus.publish('ORDER_CREATED', {
        orderId: order.id,
        userId: resolvedUserId,
        amount: finalTotal,
        items: body.items
      });

      // 5. Predictive Consumption: Schedule 14-day retention trigger
      if (retentionTriggerQueue) {
        await retentionTriggerQueue.add(
          'retention-push', 
          { 
            userId: resolvedUserId, 
            transactionId: transaction.id, 
            phone: body.customerPhone || "0000000000"
          }, 
          { delay: 14 * 24 * 60 * 60 * 1000 } // 14 Days delay
        );
        console.log(`[BullMQ] Predictive Retention Job scheduled for 14-days for User: ${resolvedUserId}`);
      }
    }

    // 6. Telegram Notification to Admin/Manager Hub
    try {
      const { bot } = require('./bot');
      const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
      
      if (chatId) {
        const itemsList = body.items.map((i: any) => `▪ ${i.productId} (x${i.quantity})`).join('\n');
        const deliveryText = body.deliveryMethod === 'nova_poshta' 
          ? `Нова Пошта\n📍 ${body.deliveryCity}, ${body.deliveryWarehouse}` 
          : 'Самовивіз (Львів)';

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
     
     const totalSalesAmount = completed.reduce((sum, t) => sum + Number(t.totalAmount), 0);
     const frozenSalesAmount = frozen.reduce((sum, t) => sum + Number(t.totalAmount), 0);

     return c.json({ 
       profile: {
         ...profile,
         totalSalesAmount, // overriding internal raw value for frontend
         frozenSalesAmount,
         totalLockedCommissions: frozenSalesAmount * Number(profile.commissionRate)
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

// Real MonoBank Payment Endpoint for Sequential Checkout
app.post('/payment/create-invoice', async (c) => {
  try {
    const { transactionId, merchantId, redirectUrl, totalAmount } = await c.req.json();
    
    // Parse totalAmount received from the checkout body, fallback to 500 if missing or invalid
    const parsedTransactionTotal = Number(totalAmount) || 500; 
    
    // Use different tokens based on the merchant FOP
    const token = merchantId === 'funnydrops' 
      ? process.env.MONOBANK_TOKEN_FUNNYDROPS || process.env.MONOBANK_TOKEN_BOOSTERTEA
      : process.env.MONOBANK_TOKEN_BOOSTERTEA;

    if (!token) {
      console.warn('[MonoBank] Token missing. Returning error 503 instead of bypassing for real payment.');
      return c.json({ success: false, error: 'MONOBANK_TOKEN is missing. Payment gateway is not configured.' }, 503);
    }

    const mBody = {
      amount: Math.round(Number(parsedTransactionTotal) * 100), // in kopecks
      ccy: 980,
      merchantPaymInfo: {
        reference: transactionId || 'unknown',
        destination: `Оплата замовлення ${(transactionId || 'UNKNOWN').slice(0, 8).toUpperCase()}`,
      },
      redirectUrl,
      webHookUrl: `https://boostertea.com.ua/api/webhooks/monobank`
    };

    const monoRes = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
      method: 'POST',
      headers: {
        'X-Token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mBody)
    });

    if (!monoRes.ok) {
      const errTxt = await monoRes.text();
      console.error('[MonoBank] API Error:', errTxt);
      return c.json({ success: false, error: 'Payment gateway error' }, 500);
    }

    const monoData = await monoRes.json();

    // Зберегти Mono invoiceId у paymentRef для webhook lookup
    await prisma.transaction.update({
      where: { id: transactionId },
      data: { 
        paymentRef: monoData.invoiceId,
        paymentGateway: 'monobank'
      }
    });
    console.log(`[MonoBank] Invoice created: ${monoData.invoiceId} for transaction ${transactionId}`);

    return c.json({ success: true, transactionId, pageUrl: monoData.pageUrl });

  } catch (e: any) {
    console.error('[MonoBank] Create Invoice Error:', e.message);
    return c.json({ success: false, error: e.message }, 500);
  }
});

// GET /api/orders/:id — for order-success page
app.get('/orders/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const order = await prisma.order.findUnique({
      where: { id },
      include: { 
        items: { include: { product: true } }, 
        transaction: true 
      }
    });
    if (!order) return c.json({ error: 'Not found' }, 404);
    
    const deliveryData = order.deliveryData ? JSON.parse(order.deliveryData as string) : {};
    
    return c.json({
      order: {
        orderNumber: order.id.slice(0, 8).toUpperCase(),
        status: order.status.toLowerCase(),
        total: Number(order.totalAmount),
        paymentStatus: order.transaction?.status?.toLowerCase() || 'pending',
        customerName: deliveryData.customerName || '',
        customerEmail: deliveryData.customerEmail || '',
        deliveryMethod: deliveryData.method || 'nova_poshta',
        deliveryCity: deliveryData.city || '',
        deliveryWarehouse: deliveryData.warehouse || '',
        createdAt: order.createdAt?.toISOString() || new Date().toISOString()
      },
      items: order.items.map((i: any) => ({
        productName: i.product?.nameUk || i.productId,
        volume: i.variant || 'unit',
        quantity: i.quantity,
        totalPrice: Number(i.priceAtBuy) * i.quantity
      }))
    });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
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
// Google Merchant Center & SEO
// ----------------------------------------------------

app.get('/feed.xml', (c) => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
  <title>BoosterTea Omniverse Market</title>
  <link>https://boostertea.com.ua</link>
  <description>Енергетичні концентрати, адапктогени та аксесуари</description>
`;
  
  for (const product of products) {
    if (product.price025L) {
      xml += `  <item>
    <g:id>${product.id}-025L</g:id>
    <g:title>${product.nameUk} (0.25L)</g:title>
    <g:description>${product.descriptionUk || 'Концентрат'}</g:description>
    <g:link>https://boostertea.com.ua/product/${product.id}</g:link>
    <g:image_link>https://boostertea.com.ua/assets/products/${product.image}</g:image_link>
    <g:condition>new</g:condition>
    <g:availability>in stock</g:availability>
    <g:price>${product.price025L} UAH</g:price>
    <g:brand>${product.merchantId || 'BoosterTea'}</g:brand>
  </item>\n`;
    }
    if (product.price1L) {
      xml += `  <item>
    <g:id>${product.id}-1L</g:id>
    <g:title>${product.nameUk} (1L)</g:title>
    <g:description>${product.descriptionUk || 'Концентрат'}</g:description>
    <g:link>https://boostertea.com.ua/product/${product.id}</g:link>
    <g:image_link>https://boostertea.com.ua/assets/products/${product.image}</g:image_link>
    <g:condition>new</g:condition>
    <g:availability>in stock</g:availability>
    <g:price>${product.price1L} UAH</g:price>
    <g:brand>${product.merchantId || 'BoosterTea'}</g:brand>
  </item>\n`;
    }
  }

  xml += `</channel>\n</rss>`;
  return c.text(xml, 200, {
    'Content-Type': 'application/xml',
    'Cache-Control': 's-maxage=3600, stale-while-revalidate'
  });
});

// ----------------------------------------------------
// Payment Webhooks (Monobank)
// ----------------------------------------------------

app.post('/webhooks/monobank', async (c) => {
  try {
    const signature = c.req.header('x-sign');
    if (!signature && process.env.NODE_ENV === 'production') {
      console.warn('[MonoBank] Missing X-Sign. Proceeding (ECDSA verification TBD)...');
    }
    
    const body = await c.req.json();
    console.log(`[MonoBank] Webhook received for invoice ${body.invoiceId || 'UNKNOWN'}, status: ${body.status}`);

    const monoInvoiceId = body.invoiceId;
    const mbStatus = body.status;

    if (!monoInvoiceId) {
      console.error('[MonoBank] Webhook missing invoiceId');
      return c.json({ status: 'ok' });
    }

    // Lookup transaction by paymentRef (where we stored monobank invoiceId)
    const transaction = await prisma.transaction.findFirst({
      where: { paymentRef: monoInvoiceId }
    });

    if (!transaction) {
      console.error(`[MonoBank] Transaction not found for invoiceId: ${monoInvoiceId}`);
      return c.json({ status: 'ok' }); // Still 200 to Mono to prevent retries
    }

    if (mbStatus === 'success') {
      // 1. Mark Transaction as COMPLETED
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'COMPLETED' }
      });

      // 2. Mark related Order as PAID
      await prisma.order.updateMany({
        where: { transactionId: transaction.id },
        data: { status: 'PAID' }
      });
      console.log(`✅ [Ecosystem ERP] Order paid successfully. Transaction ${transaction.id} is COMPLETED.`);

      // 3. Telegram notification about successful payment
      try {
        const { bot } = require('./bot');
        const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
        if (chatId && bot) {
          const order = await prisma.order.findFirst({ where: { transactionId: transaction.id } });
          const deliveryData = order?.deliveryData ? JSON.parse(order.deliveryData as string) : {};
          await bot.telegram.sendMessage(chatId,
            `✅ *Оплата отримана!* 💳\n\n` +
            `💰 Сума: *${transaction.totalAmount} ₴*\n` +
            `👤 Клієнт: ${deliveryData.customerName || 'N/A'}\n` +
            `📞 Тел: ${deliveryData.customerPhone || 'N/A'}\n` +
            `🔗 ID: \`${transaction.id.slice(0,8)}\`\n` +
            `🏦 Mono Invoice: \`${monoInvoiceId}\``,
            { parse_mode: 'Markdown' });
        }
      } catch(tgErr) {
        console.error('[MonoBank] Telegram notification error:', tgErr);
      }
         
      // 4. META CAPI & GA4 Server-Side Purchase Event
      try {
        const metaPixelId = process.env.META_PIXEL_ID || 'dummy_pixel';
        const metaToken = process.env.META_CAPI_TOKEN || 'dummy_token';
        
        if (metaToken !== 'dummy_token') {
          const hour = new Date().getHours();
          let timeContext = 'ACTIVE';
          if (hour >= 22 || hour <= 4) timeContext = 'NIGHT_CODING';
          else if (hour > 4 && hour <= 10) timeContext = 'SYSTEM_START';

          const capiPayload = {
            data: [
              {
                event_name: 'Purchase',
                event_time: Math.floor(Date.now() / 1000),
                action_source: 'website',
                user_data: { client_ip_address: transaction.ipAddress || '0.0.0.0' },
                custom_data: { 
                  currency: 'UAH', 
                  value: Number(transaction.totalAmount), 
                  order_id: transaction.id,
                  creative_time_context: timeContext
                }
              }
            ]
          };
          
          fetch(`https://graph.facebook.com/v19.0/${metaPixelId}/events?access_token=${metaToken}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(capiPayload)
          }).catch(e => console.error('[Meta CAPI] Network drift error:', e));
          
          console.log(`🎯 [Meta CAPI] Purchase event dispatched to server!`);
        }
      } catch (capiErr) {
        console.error(`[Meta CAPI] Failed to trigger server purchase:`, capiErr);
      }

    } else if (mbStatus === 'failure' || mbStatus === 'expired' || mbStatus === 'reversed') {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'CANCELLED' }
      });
      await prisma.order.updateMany({
        where: { transactionId: transaction.id },
        data: { status: 'CANCELLED' }
      });
      console.warn(`[Ecosystem ERP] Transaction ${transaction.id} CANCELLED by Monobank (status: ${mbStatus}).`);
    }
    
    return c.json({ status: 'ok' }); // Mono expects 200 OK
  } catch (e: any) {
    console.error('[MonoBank] Webhook Database Error:', e.message);
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

export const honoApp = app;

export default {
  port: 3001,
  fetch: app.fetch,
};
