import * as crypto from 'crypto';

/**
 * DeepMind Level Security: Telegram WebApp initData Validator
 * Забороняє доступ до внутрішніх API, якщо хеш-підпис не збігається з секретом Бота.
 */
export function validateTelegramWebAppData(telegramInitData: string, botToken: string): boolean {
  if (!telegramInitData || !botToken) return false;

  try {
    const urlParams = new URLSearchParams(telegramInitData);
    const hash = urlParams.get('hash');
    
    if (!hash) return false;

    // Видаляємо хеш, щоб перевірити решту даних
    urlParams.delete('hash');
    urlParams.sort();

    // Формуємо data-check-string
    let dataCheckString = '';
    for (const [key, value] of urlParams.entries()) {
      dataCheckString += `\n\${key}=\${value}`;
    }
    dataCheckString = dataCheckString.substring(1);

    // Створюємо секретний ключ з токена Бота
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    
    // Перевіряємо хеш
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    return calculatedHash === hash;
  } catch (error) {
    console.error('[TMA Security] Signature Validation Failed:', error);
    return false;
  }
}

/**
 * Парсер юзера з initData після валідації
 */
export function getTelegramUserFromData(telegramInitData: string) {
  try {
    const urlParams = new URLSearchParams(telegramInitData);
    const userString = urlParams.get('user');
    if (!userString) return null;
    return JSON.parse(decodeURIComponent(userString));
  } catch {
    return null;
  }
}
