import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import crypto from 'crypto';
import axios from 'axios';
import bizSdk from 'facebook-nodejs-business-sdk';
import { GoogleAdsApi } from 'google-ads-api';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
const connection = ({} as any) || new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');
const hashData = (data: string) => crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');

export const trackingWorker = ({} as any) || new Worker('tracking-events', async job => {
  const { eventName, email, phone, fbp, fbc, gclid, ttclid, clientIp, userAgent, referer, eventData } = job.data;
  const hashedEmail = email ? hashData(email) : undefined;
  const hashedPhone = phone ? hashData(phone) : undefined;

  // 1. Запис у БД (First-Party Data)
  await db.event.create({ data: { eventName, source: 's2s', eventData: eventData || {} } }).catch(console.error);

  // 2. Meta CAPI
  if (process.env.META_ACCESS_TOKEN && process.env.META_PIXEL_ID) {
    const { EventRequest, UserData, ServerEvent } = bizSdk;
    const userData = new UserData().setClientIpAddress(clientIp).setClientUserAgent(userAgent);
    if (hashedEmail) userData.setEmail(hashedEmail);
    if (hashedPhone) userData.setPhone(hashedPhone);
    if (fbc) userData.setFbc(fbc);
    if (fbp) userData.setFbp(fbp);

    const serverEvent = new ServerEvent().setEventName(eventName).setEventTime(Math.floor(Date.now() / 1000)).setUserData(userData).setEventSourceUrl(referer);
    new EventRequest(process.env.META_ACCESS_TOKEN, process.env.META_PIXEL_ID).setEvents([serverEvent]).execute().catch((e: any) => console.error('Meta CAPI Error', e));
  }

  // 3. TikTok Events API
  if (process.env.TIKTOK_ACCESS_TOKEN && process.env.TIKTOK_PIXEL_ID) {
    axios.post('https://business-api.tiktok.com/open_api/v1.3/pixel/track/', {
      pixel_code: process.env.TIKTOK_PIXEL_ID,
      event: eventName,
      event_id: job.id,
      timestamp: new Date().toISOString(),
      context: { ad: { callback: ttclid }, user: { emails: hashedEmail ? [hashedEmail] : [], phone_numbers: hashedPhone ? [hashedPhone] : [] }, ip: clientIp, user_agent: userAgent }
    }, { headers: { 'Access-Token': process.env.TIKTOK_ACCESS_TOKEN } }).catch((e: any) => console.error('TikTok API Error', e?.response?.data || e));
  }

  // 4. Google Enhanced Conversions (Offline Conversion Import via gclid)
  if (process.env.GOOGLE_ADS_DEVELOPER_TOKEN && gclid && (eventName === 'Purchase' || eventName === 'Lead')) {
    try {
      const client = new GoogleAdsApi({ client_id: process.env.GOOGLE_ADS_CLIENT_ID || '', client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '', developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '' });
      const customer = client.Customer({ customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID || '', refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN || '' });
      
      // Формат дати: yyyy-mm-dd hh:mm:ss+|-hh:mm
      const conversionDateTime = new Date().toISOString().replace('T', ' ').substring(0, 19) + '+00:00';
      
      await customer.clickConversions.upload([
        {
          conversion_action: `customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/conversionActions/${process.env.GOOGLE_ADS_CONVERSION_ACTION_ID}`,
          gclid: gclid,
          conversion_date_time: conversionDateTime,
          conversion_value: eventData?.value || 0,
          currency_code: 'UAH'
        }
      ]);
    } catch (e) { console.error('Google Ads Error', e); }
  }
}, { connection });

trackingWorker.on('failed', (job, err) => console.error(`Job ${job?.id} failed:`, err));
