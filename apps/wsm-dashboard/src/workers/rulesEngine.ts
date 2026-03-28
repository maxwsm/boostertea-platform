import { Worker, Queue } from 'bullmq';
import IORedis from 'ioredis';
import bizSdk from 'facebook-nodejs-business-sdk';
import { sendNotification } from '../lib/telegram';

const connection = ({} as any) || new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');
export const rulesQueue = false ? new Queue('rules-engine', { connection }) : {} as any;

// Запускаємо перевірку щогодини
rulesQueue.add('check-campaign-rules', {}, { repeat: { pattern: '0 * * * *' } });

const STOP_LOSS_SPEND = 15.0; // Макс. витрати без продажів
const TARGET_CPA = 5.0; // Цільова ціна за клієнта (купівлю 'пакуночка')
const SCALE_FACTOR = 1.2; // Збільшення бюджету на 20%

export const rulesWorker = ({} as any) || new Worker('rules-engine', async (job) => {
  console.log('[RULES ENGINE] Сканування кампаній...');

  if (process.env.META_ACCESS_TOKEN && process.env.META_AD_ACCOUNT_ID) {
    bizSdk.FacebookAdsApi.init(process.env.META_ACCESS_TOKEN);
    const AdAccount = bizSdk.AdAccount;
    const Campaign = bizSdk.Campaign;
    const account = new AdAccount(`act_${process.env.META_AD_ACCOUNT_ID}`);

    try {
      // Отримуємо активні кампанії з їхньою статистикою за сьогодні
      const campaigns = await account.getCampaigns(['id', 'name', 'status', 'daily_budget'], {
        effective_status: ['ACTIVE']
      });

      for (const camp of campaigns) {
        const insights = await camp.getInsights(['spend', 'actions'], { date_preset: 'today' });
        if (!insights || insights.length === 0) continue;

        const data = insights[0];
        const spend = parseFloat(data.spend || '0');
        
        // Шукаємо покупки (Purchase) серед дій
        const purchaseAction = data.actions?.find((a: any) => a.action_type === 'purchase');
        const purchases = purchaseAction ? parseInt(purchaseAction.value, 10) : 0;
        const cpa = purchases > 0 ? spend / purchases : spend;

        // ПРАВИЛО 1: STOP-LOSS (Палимо гроші без результату)
        if (purchases === 0 && spend >= STOP_LOSS_SPEND) {
          console.log(`[STOP-LOSS] Вимикаємо кампанію ${camp.name}`);
          await camp.update({ status: Campaign.Status.paused });
          await sendNotification(`🚨 <b>Аварійна зупинка!</b>\nКампанія: <i>${camp.name}</i>\nВитрачено: $${spend}\nПродажів: 0 пакуночків.\nРішення: <b>ПАУЗА</b> ⏸️`);
          continue;
        }

        // ПРАВИЛО 2: SCALE (Масштабування успішних зв'язок)
        if (purchases >= 2 && cpa <= TARGET_CPA && camp.daily_budget) {
          const currentBudget = parseInt(camp.daily_budget, 10);
          const newBudget = Math.floor(currentBudget * SCALE_FACTOR);
          
          console.log(`[SCALE] Збільшуємо бюджет кампанії ${camp.name} до ${newBudget}`);
          await camp.update({ daily_budget: newBudget });
          await sendNotification(`🚀 <b>Масштабуємо чисту енергію!</b>\nКампанія: <i>${camp.name}</i>\nCPA: $${cpa.toFixed(2)} (Ціль: $${TARGET_CPA})\nПродажів: ${purchases} пакуночків.\nСтарий бюджет: $${currentBudget / 100}\nНовий бюджет: <b>$${newBudget / 100}</b> 📈`);
        }
      }
    } catch (error) {
      console.error('❌ Помилка Rules Engine (Meta):', error);
      await sendNotification(`⚠️ <b>Помилка Rules Engine:</b> Не вдалося просканувати Meta Ads.`);
    }
  }
}, { connection });

rulesWorker.on('failed', (job, err) => console.error(`Rules Job failed:`, err));
