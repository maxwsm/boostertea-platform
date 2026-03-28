import { Worker, Queue } from 'bullmq';
import IORedis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import bizSdk from 'facebook-nodejs-business-sdk';
import { GoogleAdsApi } from 'google-ads-api';
import axios from 'axios';

const db = new PrismaClient();
const connection = ({} as any) || new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

// 1. Створюємо чергу для агрегації витрат
export const spendQueue = false ? new Queue('spend-aggregation', { connection }) : {} as any;

// 2. Додаємо завдання, яке повторюється кожні 15 хвилин
spendQueue.add('sync-ad-spend', {}, { repeat: { pattern: '*/15 * * * *' } });

// 3. Створюємо Воркер, який виконує цю роботу у фоні
export const spendWorker = ({} as any) || new Worker('spend-aggregation', async (job) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateString = today.toISOString().split('T')[0];

  console.log(`[SPEND AGGREGATOR] Запуск синхронізації за ${dateString}`);

  // === META ADS SPEND ===
  if (process.env.META_ACCESS_TOKEN && process.env.META_AD_ACCOUNT_ID) {
    try {
      bizSdk.FacebookAdsApi.init(process.env.META_ACCESS_TOKEN);
      const AdAccount = bizSdk.AdAccount;
      const account = new AdAccount(`act_${process.env.META_AD_ACCOUNT_ID}`);

      const insights = await account.getInsights(['campaign_id', 'campaign_name', 'spend', 'impressions', 'clicks'], {
        time_range: { since: dateString, until: dateString },
        level: 'campaign'
      });

      for (const item of insights) {
        await db.adSpend.upsert({
          where: { platform_campaignId_date: { platform: 'META', campaignId: item.campaign_id, date: today } },
          update: {
            spend: parseFloat(item.spend),
            impressions: parseInt(item.impressions, 10),
            clicks: parseInt(item.clicks, 10),
            campaignName: item.campaign_name
          },
          create: {
            platform: 'META',
            campaignId: item.campaign_id,
            campaignName: item.campaign_name,
            date: today,
            spend: parseFloat(item.spend),
            impressions: parseInt(item.impressions, 10),
            clicks: parseInt(item.clicks, 10)
          }
        });
      }
      console.log('✅ Meta витрати синхронізовано');
    } catch (error) {
      console.error('❌ Помилка синхронізації Meta:', error);
    }
  }

  // === GOOGLE ADS SPEND ===
  if (process.env.GOOGLE_ADS_DEVELOPER_TOKEN && process.env.GOOGLE_ADS_CUSTOMER_ID) {
    try {
      const client = new GoogleAdsApi({
        client_id: process.env.GOOGLE_ADS_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
        developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || ''
      });
      const customer = client.Customer({
        customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID || '',
        refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN || ''
      });

      const query = `
        SELECT campaign.id, campaign.name, metrics.cost_micros, metrics.impressions, metrics.clicks
        FROM campaign
        WHERE segments.date = '${dateString}'
      `;
      const response = await customer.query(query);

      for (const row of response) {
        // Google Ads повертає гроші в мікро-одиницях (1$ = 1,000,000 micros)
        const spendReal = (row.metrics.cost_micros || 0) / 1000000;
        await db.adSpend.upsert({
          where: { platform_campaignId_date: { platform: 'GOOGLE', campaignId: row.campaign.id.toString(), date: today } },
          update: {
            spend: spendReal,
            impressions: parseInt(row.metrics.impressions || '0', 10),
            clicks: parseInt(row.metrics.clicks || '0', 10),
            campaignName: row.campaign.name
          },
          create: {
            platform: 'GOOGLE',
            campaignId: row.campaign.id.toString(),
            campaignName: row.campaign.name,
            date: today,
            spend: spendReal,
            impressions: parseInt(row.metrics.impressions || '0', 10),
            clicks: parseInt(row.metrics.clicks || '0', 10)
          }
        });
      }
      console.log('✅ Google Ads витрати синхронізовано');
    } catch (error) {
      console.error('❌ Помилка синхронізації Google Ads:', error);
    }
  }

  // === TIKTOK ADS SPEND ===
  if (process.env.TIKTOK_ACCESS_TOKEN && process.env.TIKTOK_ADVERTISER_ID) {
    try {
      const response = await axios.get('https://business-api.tiktok.com/open_api/v1.3/report/integrated/get/', {
        params: {
          advertiser_id: process.env.TIKTOK_ADVERTISER_ID,
          report_type: 'BASIC',
          data_level: 'AUCTION_CAMPAIGN',
          dimensions: JSON.stringify(['campaign_id']),
          metrics: JSON.stringify(['spend', 'impressions', 'clicks']),
          start_date: dateString,
          end_date: dateString,
          page_size: 1000
        },
        headers: { 'Access-Token': process.env.TIKTOK_ACCESS_TOKEN }
      });

      const list = response.data?.data?.list || [];
      for (const item of list) {
        const metrics = item.metrics;
        await db.adSpend.upsert({
          where: { platform_campaignId_date: { platform: 'TIKTOK', campaignId: item.dimensions.campaign_id.toString(), date: today } },
          update: {
            spend: parseFloat(metrics.spend || '0'),
            impressions: parseInt(metrics.impressions || '0', 10),
            clicks: parseInt(metrics.clicks || '0', 10)
          },
          create: {
            platform: 'TIKTOK',
            campaignId: item.dimensions.campaign_id.toString(),
            campaignName: 'TikTok Campaign ' + item.dimensions.campaign_id, // TikTok не завжди віддає name в BASIC репорті без додаткових налаштувань
            date: today,
            spend: parseFloat(metrics.spend || '0'),
            impressions: parseInt(metrics.impressions || '0', 10),
            clicks: parseInt(metrics.clicks || '0', 10)
          }
        });
      }
      console.log('✅ TikTok Ads витрати синхронізовано');
    } catch (error: any) {
      console.error('❌ Помилка синхронізації TikTok Ads:', error?.response?.data || error.message);
    }
  }

}, { connection });

spendWorker.on('failed', (job, err) => console.error(`Aggregator Job failed:`, err));
