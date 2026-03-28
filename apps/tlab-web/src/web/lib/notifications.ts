/**
 * Notifications Library for BoosterTea
 * Handles Telegram notifications and browser push notifications
 */

// Types
export interface TelegramNotificationConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
  newOrderEnabled: boolean;
  paymentReceivedEnabled: boolean;
  orderShippedEnabled: boolean;
}

export interface OrderNotificationData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  total: number;
  items: {
    name: string;
    quantity: number;
    volume: string;
    price: number;
  }[];
  deliveryMethod?: string;
  deliveryCity?: string;
  deliveryWarehouse?: string;
  promoCode?: string;
  bonusPointsUsed?: number;
}

export interface PaymentNotificationData {
  orderNumber: string;
  customerName: string;
  total: number;
  paymentMethod: string;
}

export interface ShippingNotificationData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  trackingNumber: string;
  deliveryCity: string;
}

/**
 * Format order notification message for Telegram
 */
export const formatNewOrderMessage = (data: OrderNotificationData): string => {
  const itemsList = data.items
    .map(item => `  • ${item.name} ${item.volume} x${item.quantity} — ${item.price.toLocaleString()}₴`)
    .join('\n');

  let message = `📦 *Нове замовлення ${data.orderNumber}*\n\n`;
  message += `👤 *Клієнт:* ${escapeMarkdown(data.customerName)}\n`;
  message += `📱 *Телефон:* ${escapeMarkdown(data.customerPhone)}\n`;
  
  if (data.customerEmail) {
    message += `📧 *Email:* ${escapeMarkdown(data.customerEmail)}\n`;
  }
  
  message += `\n🍵 *Товари:*\n${itemsList}\n`;
  message += `\n💰 *Сума:* ${data.total.toLocaleString()}₴`;
  
  if (data.promoCode) {
    message += `\n🏷️ *Промокод:* ${escapeMarkdown(data.promoCode)}`;
  }
  
  if (data.bonusPointsUsed && data.bonusPointsUsed > 0) {
    message += `\n⭐ *Бонусів використано:* ${data.bonusPointsUsed}`;
  }
  
  if (data.deliveryMethod) {
    message += `\n\n🚚 *Доставка:* ${escapeMarkdown(data.deliveryMethod)}`;
    if (data.deliveryCity) {
      message += `\n📍 *Місто:* ${escapeMarkdown(data.deliveryCity)}`;
    }
    if (data.deliveryWarehouse) {
      message += `\n🏢 *Відділення:* ${escapeMarkdown(data.deliveryWarehouse)}`;
    }
  }
  
  return message;
};

/**
 * Format payment received notification
 */
export const formatPaymentReceivedMessage = (data: PaymentNotificationData): string => {
  let message = `💳 *Оплата отримана*\n\n`;
  message += `📦 *Замовлення:* ${data.orderNumber}\n`;
  message += `👤 *Клієнт:* ${escapeMarkdown(data.customerName)}\n`;
  message += `💰 *Сума:* ${data.total.toLocaleString()}₴\n`;
  message += `💳 *Спосіб:* ${escapeMarkdown(data.paymentMethod)}`;
  
  return message;
};

/**
 * Format shipping notification
 */
export const formatShippingMessage = (data: ShippingNotificationData): string => {
  let message = `🚚 *Замовлення відправлено*\n\n`;
  message += `📦 *Замовлення:* ${data.orderNumber}\n`;
  message += `👤 *Клієнт:* ${escapeMarkdown(data.customerName)}\n`;
  message += `📱 *Телефон:* ${escapeMarkdown(data.customerPhone)}\n`;
  message += `📍 *Місто:* ${escapeMarkdown(data.deliveryCity)}\n`;
  message += `📋 *ТТН:* \`${data.trackingNumber}\``;
  
  return message;
};

/**
 * Escape markdown special characters for Telegram
 */
const escapeMarkdown = (text: string): string => {
  return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
};

/**
 * Send Telegram notification via API
 */
export const sendTelegramNotification = async (
  botToken: string,
  chatId: string,
  message: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'MarkdownV2',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.description || 'Failed to send message' };
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    };
  }
};

/**
 * Browser Push Notification helpers
 */
export const requestPushPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    console.warn('Browser does not support notifications');
    return 'denied';
  }
  
  return await Notification.requestPermission();
};

export const isPushSupported = (): boolean => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

export const showBrowserNotification = (
  title: string,
  options?: NotificationOptions
): void => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });
  }
};

/**
 * Format simple notification message (no markdown)
 */
export const formatSimpleNewOrderMessage = (data: OrderNotificationData): string => {
  const itemsList = data.items
    .map(item => `  • ${item.name} ${item.volume} x${item.quantity} — ${item.price.toLocaleString()}₴`)
    .join('\n');

  let message = `📦 Нове замовлення ${data.orderNumber}\n\n`;
  message += `👤 Клієнт: ${data.customerName}\n`;
  message += `📱 Телефон: ${data.customerPhone}\n`;
  
  if (data.customerEmail) {
    message += `📧 Email: ${data.customerEmail}\n`;
  }
  
  message += `\n🍵 Товари:\n${itemsList}\n`;
  message += `\n💰 Сума: ${data.total.toLocaleString()}₴`;
  
  if (data.promoCode) {
    message += `\n🏷️ Промокод: ${data.promoCode}`;
  }
  
  if (data.bonusPointsUsed && data.bonusPointsUsed > 0) {
    message += `\n⭐ Бонусів використано: ${data.bonusPointsUsed}`;
  }
  
  if (data.deliveryMethod) {
    message += `\n\n🚚 Доставка: ${data.deliveryMethod}`;
    if (data.deliveryCity) {
      message += `\n📍 Місто: ${data.deliveryCity}`;
    }
    if (data.deliveryWarehouse) {
      message += `\n🏢 Відділення: ${data.deliveryWarehouse}`;
    }
  }
  
  return message;
};

/**
 * Show browser notification for new order (admin)
 */
export const showNewOrderBrowserNotification = (orderNumber: string, total: number, customerName: string): void => {
  showBrowserNotification(`📦 Нове замовлення ${orderNumber}`, {
    body: `${customerName} • ${total.toLocaleString()}₴`,
    tag: `order-${orderNumber}`,
    requireInteraction: true,
  });
};

/**
 * Show browser notification for payment received (admin)
 */
export const showPaymentReceivedBrowserNotification = (orderNumber: string, total: number): void => {
  showBrowserNotification(`💳 Оплата отримана`, {
    body: `Замовлення ${orderNumber} • ${total.toLocaleString()}₴`,
    tag: `payment-${orderNumber}`,
  });
};

/**
 * Show browser notification for order status change (customer)
 */
export const showOrderStatusBrowserNotification = (
  orderNumber: string, 
  status: 'processing' | 'paid' | 'shipped' | 'delivered'
): void => {
  const statusMessages = {
    processing: { title: '⏳ Замовлення обробляється', body: `Замовлення ${orderNumber} прийнято в роботу` },
    paid: { title: '✅ Оплата підтверджена', body: `Замовлення ${orderNumber} оплачено` },
    shipped: { title: '🚚 Замовлення відправлено', body: `Замовлення ${orderNumber} вже в дорозі` },
    delivered: { title: '🎉 Замовлення доставлено', body: `Замовлення ${orderNumber} чекає на вас` },
  };

  const message = statusMessages[status];
  showBrowserNotification(message.title, {
    body: message.body,
    tag: `status-${orderNumber}-${status}`,
  });
};

/**
 * Email notification placeholder structure
 */
export interface EmailNotificationConfig {
  enabled: boolean;
  recipient: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
}

export interface EmailNotificationData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Placeholder for email sending - to be implemented with actual SMTP provider
 */
export const sendEmailNotification = async (
  _config: EmailNotificationConfig,
  _data: EmailNotificationData
): Promise<{ success: boolean; error?: string }> => {
  // This is a placeholder - implement with actual email provider
  // Options: SendGrid, Resend, AWS SES, or direct SMTP
  console.log('Email notification placeholder - implement with actual provider');
  return { success: false, error: 'Email notifications not yet implemented' };
};

/**
 * Initialize notification system - call on app load
 */
export const initNotifications = (): void => {
  // Request permission on first visit (optional - can be triggered by user action)
  if ('Notification' in window && Notification.permission === 'default') {
    // Don't auto-request, wait for user to enable in settings
    console.log('Push notifications available, permission:', Notification.permission);
  }
};

