/**
 * TITAN OMNI-CHANNEL ERP: Notion Service
 * Ported from all_db_payloads.js provided by Claude.
 * Handles exact data mapping to the 10 core databases in Notion HQ.
 */

const NOTION_TOKEN = process.env.NOTION_INTEGRATION_TOKEN || '';

// ============================================================
// Core Fetch Helpers
// ============================================================
export async function notionCreate(databaseId: string, properties: any) {
  if (!NOTION_TOKEN) {
    console.warn('[Notion SDK] NOTION_INTEGRATION_TOKEN is missing. Skipping create.');
    return null;
  }
  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ parent: { database_id: databaseId }, properties })
  });
  if (!res.ok) {
    const err = await res.json();
    console.error(`[Notion SDK Error]:`, err);
    throw new Error(`Notion POST failed`);
  }
  return res.json();
}

export const notionPayloads = {
  db5PushTransaction: (brandName: string, amount: number) => ({
    "Record Title": { title: [{ text: { content: `Live Tx: ${brandName}` } }] },
    "Brand Key": { rich_text: [{ text: { content: brandName } }] },
    "Period": { date: { start: new Date().toISOString() } },
    "Revenue": { number: amount },
    "ROAS": { number: 0 }
  })
};
