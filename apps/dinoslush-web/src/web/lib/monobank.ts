/**
 * Monobank Payment Integration
 * 
 * Monobank Acquiring API for payment processing
 * Documentation: https://api.monobank.ua/docs/acquiring.html
 */

export interface MonobankInvoiceRequest {
  amount: number; // Amount in kopecks (1 UAH = 100 kopecks)
  ccy?: number; // Currency code (980 = UAH)
  merchantPaymInfo?: {
    reference?: string;
    destination?: string;
    comment?: string;
    customerEmails?: string[];
    basketOrder?: Array<{
      name: string;
      qty: number;
      sum: number; // In kopecks
      icon?: string;
      unit?: string;
      code?: string;
    }>;
  };
  redirectUrl?: string;
  webHookUrl?: string;
  validity?: number; // Invoice validity in seconds (default 24h)
  paymentType?: 'debit' | 'hold';
  qrId?: string;
  saveCardData?: {
    saveCard: boolean;
    walletId?: string;
  };
}

export interface MonobankInvoiceResponse {
  invoiceId: string;
  pageUrl: string;
}

export interface MonobankInvoiceStatus {
  invoiceId: string;
  status: 'created' | 'processing' | 'hold' | 'success' | 'failure' | 'reversed' | 'expired';
  failureReason?: string;
  errCode?: string;
  amount: number;
  ccy: number;
  finalAmount?: number;
  createdDate: string;
  modifiedDate: string;
  reference?: string;
  cancelList?: Array<{
    status: string;
    amount: number;
    ccy: number;
    createdDate: string;
    modifiedDate: string;
    approvalCode?: string;
    rrn?: string;
    extRef?: string;
  }>;
}

export interface MonobankWebhookPayload {
  invoiceId: string;
  status: 'created' | 'processing' | 'hold' | 'success' | 'failure' | 'reversed' | 'expired';
  failureReason?: string;
  errCode?: string;
  amount: number;
  ccy: number;
  finalAmount?: number;
  createdDate: string;
  modifiedDate: string;
  reference?: string;
  payMethod?: string;
  fee?: number;
  paymentInfo?: {
    maskedPan?: string;
    terminal?: string;
    paymentSystem?: string;
    paymentMethod?: string;
    fee?: number;
  };
}

// Monobank API base URL
const MONOBANK_API_URL = 'https://api.monobank.ua/api/merchant/invoice';

/**
 * Create a new invoice for payment
 */
export const createInvoice = async (
  token: string,
  amount: number, // Amount in UAH
  orderId: string,
  redirectUrl: string,
  webhookUrl: string,
  items?: Array<{ name: string; quantity: number; price: number }>
): Promise<MonobankInvoiceResponse> => {
  const amountInKopecks = Math.round(amount * 100);
  
  const requestBody: MonobankInvoiceRequest = {
    amount: amountInKopecks,
    ccy: 980, // UAH
    merchantPaymInfo: {
      reference: orderId,
      destination: `Оплата замовлення ${orderId}`,
      comment: `BoosterTea - Замовлення ${orderId}`,
      basketOrder: items?.map(item => ({
        name: item.name,
        qty: item.quantity,
        sum: Math.round(item.price * 100), // Convert to kopecks
        unit: 'шт'
      }))
    },
    redirectUrl,
    webHookUrl: webhookUrl,
    validity: 3600, // 1 hour
    paymentType: 'debit'
  };

  const response = await fetch(`${MONOBANK_API_URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Token': token
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Monobank API error: ${response.status} - ${errorText}`);
  }

  return response.json();
};

/**
 * Get invoice status
 */
export const getInvoiceStatus = async (
  token: string,
  invoiceId: string
): Promise<MonobankInvoiceStatus> => {
  const response = await fetch(`${MONOBANK_API_URL}/status?invoiceId=${invoiceId}`, {
    method: 'GET',
    headers: {
      'X-Token': token
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Monobank API error: ${response.status} - ${errorText}`);
  }

  return response.json();
};

/**
 * Cancel (void) a held payment
 */
export const cancelInvoice = async (
  token: string,
  invoiceId: string,
  extRef?: string,
  amount?: number // Partial cancel amount in UAH
): Promise<{ status: string }> => {
  const body: Record<string, string | number> = { invoiceId };
  if (extRef) body.extRef = extRef;
  if (amount) body.amount = Math.round(amount * 100);

  const response = await fetch(`${MONOBANK_API_URL}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Token': token
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Monobank API error: ${response.status} - ${errorText}`);
  }

  return response.json();
};

/**
 * Verify webhook signature (ECDSA)
 * Note: In production, implement proper signature verification
 * using the public key from Monobank
 */
export const verifyWebhookSignature = async (
  signature: string,
  body: string,
  publicKeyBase64: string
): Promise<boolean> => {
  try {
    // Convert base64 public key to CryptoKey
    const publicKeyBuffer = Uint8Array.from(atob(publicKeyBase64), c => c.charCodeAt(0));
    
    const publicKey = await crypto.subtle.importKey(
      'spki',
      publicKeyBuffer,
      {
        name: 'ECDSA',
        namedCurve: 'P-256'
      },
      false,
      ['verify']
    );

    // Convert signature from base64
    const signatureBuffer = Uint8Array.from(atob(signature), c => c.charCodeAt(0));

    // Convert body to ArrayBuffer
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(body);

    // Verify signature
    const isValid = await crypto.subtle.verify(
      {
        name: 'ECDSA',
        hash: 'SHA-256'
      },
      publicKey,
      signatureBuffer,
      dataBuffer
    );

    return isValid;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
};

/**
 * Get Monobank public key for webhook verification
 */
export const getPublicKey = async (token: string): Promise<string> => {
  const response = await fetch('https://api.monobank.ua/api/merchant/pubkey', {
    method: 'GET',
    headers: {
      'X-Token': token
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get Monobank public key');
  }

  const data = await response.json();
  return data.key;
};

/**
 * Map Monobank status to internal payment status
 */
export const mapMonobankStatusToPaymentStatus = (
  monobankStatus: MonobankInvoiceStatus['status']
): 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' => {
  switch (monobankStatus) {
    case 'created':
    case 'processing':
      return 'processing';
    case 'hold':
    case 'success':
      return 'completed';
    case 'failure':
    case 'expired':
      return 'failed';
    case 'reversed':
      return 'refunded';
    default:
      return 'pending';
  }
};

/**
 * Map Monobank status to order status
 */
export const mapMonobankStatusToOrderStatus = (
  monobankStatus: MonobankInvoiceStatus['status']
): 'pending' | 'processing' | 'paid' | 'cancelled' => {
  switch (monobankStatus) {
    case 'success':
    case 'hold':
      return 'paid';
    case 'failure':
    case 'expired':
    case 'reversed':
      return 'cancelled';
    case 'processing':
      return 'processing';
    default:
      return 'pending';
  }
};
