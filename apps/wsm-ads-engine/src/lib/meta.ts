import bizSdk from 'facebook-nodejs-business-sdk';

// Ініціалізація Meta Business SDK
const accessToken = process.env.META_ACCESS_TOKEN;
const adAccountId = process.env.META_AD_ACCOUNT_ID;
const pageId = process.env.META_PAGE_ID;
const pixelId = process.env.META_PIXEL_ID;

if (!accessToken || !adAccountId || !pageId || !pixelId) {
  throw new Error('Meta environment variables are not set!');
}

const AdAccount = bizSdk.AdAccount;
const Campaign = bizSdk.Campaign;
const AdSet = bizSdk.AdSet;
const AdCreative = bizSdk.AdCreative;
const Ad = bizSdk.Ad;
const api = bizSdk.FacebookAdsApi.init(accessToken);

// Увімкніть логування для дебагу
// api.setDebug(true);

interface CampaignDetails {
  headline: string;
  primaryText: string;
  dailyBudget: number; // в центах
  audience: string; // поки що рядок, в майбутньому ID
  cta: string;
}

/**
 * Створює повну рекламну кампанію в Meta: Campaign -> AdSet -> Ad
 * @param details - Об'єкт з даними для кампанії
 */
export async function createMetaCampaign(details: CampaignDetails) {
  const account = new AdAccount(`act_${adAccountId}`);

  try {
    // --- Крок 1: Створення Кампанії (Campaign) ---
    const campaign = await account.createCampaign([], {
      [Campaign.Fields.name]: `WSM | AI Generated | ${details.headline.slice(0, 30)}...`,
      [Campaign.Fields.objective]: 'OUTCOME_SALES',
      [Campaign.Fields.status]: Campaign.Status.paused, // Створюємо як чернетку
      [Campaign.Fields.special_ad_categories]: [],
    });
    console.log(`Campaign created with ID: ${campaign.id}`);

    // --- Крок 2: Створення Групи Оголошень (AdSet) ---
    const adSet = await account.createAdSet([], {
      [AdSet.Fields.name]: `AdSet for ${campaign.id}`,
      [AdSet.Fields.campaign_id]: campaign.id,
      [AdSet.Fields.daily_budget]: details.dailyBudget,
      [AdSet.Fields.billing_event]: AdSet.BillingEvent.impressions,
      [AdSet.Fields.optimization_goal]: AdSet.OptimizationGoal.offsite_conversions,
      [AdSet.Fields.promoted_object]: { 'pixel_id': pixelId, 'custom_event_type': 'PURCHASE' },
      [AdSet.Fields.targeting]: {
        // TODO: Замінити на реальні ID аудиторій з Vertex AI
        geo_locations: { countries: ['UA'] },
        age_min: 25,
        age_max: 45,
      },
      [AdSet.Fields.status]: AdSet.Status.paused,
    });
    console.log(`AdSet created with ID: ${adSet.id}`);

    // --- Крок 3: Створення Креативу (AdCreative) ---
    // TODO: Додати логіку для отримання image_hash з медіатеки
    const creative = await account.createAdCreative([], {
      [AdCreative.Fields.name]: `Creative for ${details.headline}`,
      [AdCreative.Fields.object_story_spec]: {
        [bizSdk.ObjectStorySpec.Fields.page_id]: pageId,
        [bizSdk.ObjectStorySpec.Fields.link_data]: {
          [bizSdk.LinkData.Fields.message]: details.primaryText,
          [bizSdk.LinkData.Fields.link]: 'https://booster.co.ua/', // TODO: Зробити динамічним
          [bizSdk.LinkData.Fields.name]: details.headline,
          [bizSdk.LinkData.Fields.call_to_action]: { type: details.cta.toUpperCase() },
          [bizSdk.LinkData.Fields.image_hash]: 'YOUR_IMAGE_HASH_HERE', // ВАЖЛИВО: Потрібно завантажити зображення і отримати його хеш
        },
      },
    });
    console.log(`AdCreative created with ID: ${creative.id}`);

    // --- Крок 4: Створення Оголошення (Ad) ---
    const ad = await account.createAd([], {
      [Ad.Fields.name]: `Ad for ${campaign.id}`,
      [Ad.Fields.adset_id]: adSet.id,
      [Ad.Fields.creative]: { creative_id: creative.id },
      [Ad.Fields.status]: Ad.Status.paused, // Запускати вручну після перевірки
    });
    console.log(`Ad created with ID: ${ad.id}`);

    return {
      campaignId: campaign.id,
      adSetId: adSet.id,
      adId: ad.id,
    };

  } catch (error) {
    console.error('Error creating Meta campaign:', JSON.stringify(error, null, 2));
    throw error;
  }
}
