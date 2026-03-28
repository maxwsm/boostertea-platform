/**
 * TITAN OMNI-CHANNEL ERP: n8n Workflow Automation Engine
 * Тригерить воркфлоу на бекенді n8n.
 */

const N8N_API_KEY = process.env.N8N_API_KEY || '';
const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678';

/**
 * Sends a generic push to any n8n Webhook node.
 * 
 * @param webhookName - The endpoint path of the webhook (e.g. 'finance-sync', 'lead-notify')
 * @param payload - The JSON payload to pass down the n8n workflow
 */
export async function fireN8nWebhook(webhookName: string, payload: any) {
  if (!N8N_API_KEY) {
    console.warn('[n8n SDK] N8N_API_KEY is missing. Skipping webhook push.');
    return null;
  }

  // Usually n8n webhooks are shaped like /webhook/:path or /webhook-test/:path
  const url = `${N8N_BASE_URL}/webhook/${webhookName}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Якщо n8n налаштовано на аутентифікацію через Header Auth
        'X-N8N-API-KEY': N8N_API_KEY
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`n8n HTTP ${res.status}: ${err}`);
    }

    const data = await res.json();
    console.log(`[n8n SDK] Triggered workflow on /${webhookName} successfully.`);
    return data;
  } catch (err: any) {
    console.error(`[n8n Error]:`, err.message);
    return null;
  }
}
