/**
 * OMNIVERSE 360° STRESS TEST SIMULATOR - PHASE 2 (SEO & BEHAVIOR)
 * Grail Architecture Standard v3.1 Pro 
 * Waves: 400-500 requests/min. Cycles: 5 min -> stop -> analyze.
 */

import { prisma as db } from '@wsm/db';
import { randomUUID } from 'crypto';

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3014';
const SIM_PREFIX = '[SIM]-';
const WAVE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// Configuration Phase 2
const RPM = 450; 
const MS_PER_REQUEST = 60000 / RPM;
const CONVERSION_RATE = 0.50; // 50% conversion / 50% ShadowCart Bounce
const BRANDS = ['boostertea', 'dinoslush', 'funnydrops', 'tlab'];
const CITIES = ['Київ', 'Львів', 'Одеса', 'Дніпро', 'Харків'];
const NAMES = ['Марія SEO', 'Іван Pixel', 'Олексій Bot', 'Олена Ads', 'Тарас CAPI'];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Safe DB Wrapper to keep simulator alive if localhost:5432 is down
async function safeDbStore(model: string, action: string, data: any) {
  try {
    return await (db as any)[model][action]({ data });
  } catch (e: any) {
    if (e.message && e.message.includes('Can\'t reach database server')) {
      // Dry-Run Console Log instead of crash
      console.log(`    [Dry-Run DB] -> ${model}.${action} generated successfully (Local DB offline)`);
      return { id: `mock-${Date.now()}` }; 
    }
    throw e;
  }
}

function generateTrackingPixels() {
  const isGoogle = Math.random() > 0.5;
  return {
    fbp: `fb.1.${Date.now()}.${Math.floor(Math.random() * 1000000)}`,
    fbc: isGoogle ? null : `fb.1.${Date.now()}.${Math.floor(Math.random() * 10000)}`,
    gclid: isGoogle ? `Cj0KCQ_${Math.floor(Math.random() * 100000)}` : null,
    userAgent: Math.random() < 0.05 ? 'Googlebot/2.1 (+http://www.google.com/bot.html)' : 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4)'
  };
}

async function simulateVisitorWorkflow(visitorId: number) {
  const brandId = BRANDS[Math.floor(Math.random() * BRANDS.length)];
  const isConverted = Math.random() < CONVERSION_RATE;
  const tracking = generateTrackingPixels();
  
  const isBot = tracking.userAgent.includes('Googlebot');
  if (isBot) {
    console.log(`[Visitor #${visitorId}] 🕷️ SEO Bot crawling /sitemap.xml for ${brandId}...`);
    // Minimal impact DB logs for bots
    await safeDbStore('telemetryLog', 'create', {
        brandId,
        eventType: 'SEO_CRAWL',
        eventData: JSON.stringify({ path: '/sitemap.xml', bot: 'Googlebot' })
    });
    return { success: true };
  }

  console.log(`\n[Visitor #${visitorId}] 🌎 Landing on ${brandId} (fbp: ${tracking.fbp})`);
  
  try {
    // 1. Precise Telemetry & Scroll
    const events = ['PAGE_VIEW', 'SCROLL_BOTTOM', isConverted ? 'ADD_TO_CART' : 'BOUNCE'];
    for(const e of events) {
      await safeDbStore('telemetryLog', 'create', {
          brandId,
          eventType: e,
          eventData: JSON.stringify({ fbp: tracking.fbp, gclid: tracking.gclid, ms: Math.random() * 5000 })
      });
    }

    // 2. Chat with Gemini / Telegram Bot
    if (Math.random() > 0.3) {
      console.log(`[Visitor #${visitorId}] 🤖 Asking AI for advice...`);
      await fetch(`${API_BASE}/api/chat/gemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `sim.ip.${visitorId}` },
        body: JSON.stringify({ brandId, messages: [{ role: 'user', content: 'Допоможіть' }], isSim: true })
      }).catch(() => {});
    }

    if (!isConverted) {
      // Create a Shadow Cart for Retargeting (Behavior trigger)
      const shadowRef = `${SIM_PREFIX}bounce-${visitorId}`;
      console.log(`[Visitor #${visitorId}] 🛒 Left Cart! Triggering Event for Retargeting/ShadowCart...`);
      await safeDbStore('shadowCart', 'create', {
          sessionId: shadowRef,
          payload: JSON.stringify({ fbp: tracking.fbp, intent: 'purchase_intent_high' }),
          status: 'abandoned',
          triggerAt: new Date(Date.now() + 1000 * 60 * 45) // 45 mins from now
      });
      return { success: false, reason: 'shadow_cart_bounced' };
    }

    // 3. E-commerce Checkout with Retargeting Pixels
    const orderRef = `${SIM_PREFIX}${randomUUID()}`;
    console.log(`[Visitor #${visitorId}] 💳 Checkout. Triggering Meta CAPI -> Purchase`);
    
    // Simulate CAPI console log
    if (tracking.fbc || tracking.fbp) {
      console.log(`  [CAPI] -> Event sent to Facebook Graph API: Purchase (ID: ${orderRef}, fbp: ${tracking.fbp})`);
    }

    const user = await safeDbStore('user', 'create', {
        name: `${NAMES[Math.floor(Math.random() * NAMES.length)]}`,
        phone: `+380${Math.floor(Math.random() * 90000000 + 10000000)}`,
        lastIpAddress: `sim.ip.${visitorId}`,
        fbp: tracking.fbp,
        fbc: tracking.fbc,
        gclid: tracking.gclid
    });

    const transaction = await safeDbStore('transaction', 'create', {
       id: orderRef, userId: user.id || 1, brandId, totalAmount: 2200, status: 'COMPLETED' 
    });

    await safeDbStore('order', 'create', {
        userId: user.id || 1, brandId, transactionId: transaction.id || 1, status: 'PAID',
        totalAmount: 2200, deliveryData: CITIES[Math.floor(Math.random() * CITIES.length)]
    });

    // 4. Logistics & ERP (StockMove) simulation
    await safeDbStore('stockMove', 'create', { productId: `prod-sim-${brandId}`, sourceLocId: 'WH/Kyiv', destLocId: 'Customers', qty: 2, state: 'DONE' });

    console.log(`[Visitor #${visitorId}] ✅ Full 360 Cycle completed`);
    return { success: true };
  } catch (err: any) {
    console.error(`[Visitor #${visitorId}] 🚨 Error during workflow:`, err.message);
    return { success: false, reason: 'error' };
  }
}

async function runWaveTwo() {
  console.log(`\n🌊 [WAVE 2] INIT. Target: ${RPM} RPM. Duration: 5 mins.`);
  console.log(`🛡️ RTK Cache / CAPI Tracking Active. Prefix: ${SIM_PREFIX}\n`);
  
  const startTime = Date.now();
  let visitorCount = 0;
  let bounces = 0;

  while (Date.now() - startTime < WAVE_DURATION_MS) {
    visitorCount++;
    simulateVisitorWorkflow(visitorCount).then(res => {
      if (res.reason === 'shadow_cart_bounced') bounces++;
    });
    await delay(MS_PER_REQUEST);
  }

  console.log(`\n🛑 [WAVE 2] COMPLETED.`);
  console.log(`Total Simulated Traffic: ${visitorCount}`);
  console.log(`High-Intent Abandoned Carts (Retargeting Generated): ${bounces}`);
  console.log(`\n[ACTION REQUIRED] Run Analytics. Check Shadow Carts queue inside Telegram Dashboard.`);
  process.exit(0);
}

runWaveTwo();
