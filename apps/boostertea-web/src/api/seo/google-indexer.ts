import { google } from 'googleapis';
// @ts-ignore
import key from './service_account_key.json'; 

// Налаштування доступу до Indexing API
const jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/indexing'],
  null
);

/**
 * Функція для миттєвого пінг-запиту в Google
 * @param {string} url - Повне посилання на товар (напр., https://www.boostertea.com.ua/products/puer)
 * @param {string} type - 'URL_UPDATED' (оновилась ціна/наявність) або 'URL_DELETED' (товар знято з продажу)
 */
export async function notifyGoogle(url: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED') {
  try {
    await jwtClient.authorize();
    
    // @ts-ignore - indexing API requires older typings or correct version
    const response = await google.indexing('v3').urlNotifications.publish({
      auth: jwtClient,
      requestBody: {
        url: url,
        type: type,
      },
    });

    console.log(`[SEO API] Google успішно повідомлено про: ${url}`);
    return response.data;
  } catch (error: any) {
    console.error(`[SEO API] Помилка відправки в Google: ${error.message}`);
  }
}
