/**
 * TITAN OMNI-CHANNEL ERP: Notion Service
 * Ported from all_db_payloads.js provided by Claude.
 * Handles exact data mapping to the 10 core databases in Notion HQ.
 */

import { prisma } from '@wsm/db';

const NOTION_TOKEN = process.env.NOTION_INTEGRATION_TOKEN || '';

// ============================================================
// Core Fetch Helpers (NATIVE WSM REPLACEMENT)
// ============================================================
export async function notionCreate(databaseId: string, properties: any) {
  try {
    // 1. We intercept the Notion payload and create a Native Knowledge Document
    // We map the "Record Title" or "Lead Name" if it exists, otherwise "System Entry"
    const titleObj = properties['Lead Name']?.title?.[0]?.text?.content 
                  || properties['Record Title']?.title?.[0]?.text?.content
                  || properties['Post Title']?.title?.[0]?.text?.content
                  || `Native Entry [${databaseId}]`;
                  
    // Convert Notion properties to HTML / Blocks to render in Tiptap Native Editor
    const contentHtml = `
      <h2>${titleObj}</h2>
      <pre><code>${JSON.stringify(properties, null, 2)}</code></pre>
      <p><em>Automatically migrated from External Notion API to WSM Native Engine.</em></p>
    `;

    const doc = await prisma.knowledgeDocument.create({
      data: {
        title: titleObj,
        content: contentHtml,
        status: 'PUBLISHED',
        type: 'NOTION_PAGE'
      }
    });

    console.log(`[Native Notion] Intercepted Creation. Saved to WSM DB ID: ${doc.id}`);
    
    // We return a mocked Notion object so the rest of the code doesn't crash 
    // expecting an `id` or `object` type
    return {
      object: 'page',
      id: doc.id,
      url: `https://app.wsm.com/erp/document-flow?docId=${doc.id}`
    };

  } catch (err: any) {
    console.error(`[Native Notion Interceptor Error]:`, err.message);
    throw new Error(`WSM Native Document creation failed`);
  }
}

export async function notionUpdate(pageId: string, properties: any) {
  try {
    const contentHtml = `
      <h3>Updated Data Payload</h3>
      <pre><code>${JSON.stringify(properties, null, 2)}</code></pre>
    `;

    const doc = await prisma.knowledgeDocument.update({
      where: { id: pageId },
      data: {
        content: contentHtml // simple overwrite for this interceptor
      }
    });

    console.log(`[Native Notion] Intercepted Update for: ${doc.id}`);
    return { id: doc.id, object: 'page' };
  } catch (err: any) {
    console.error(`[Native Notion Update Error]:`, err.message);
    return null;
  }
}

// ============================================================
// DB Payloads Generators
// ============================================================

export const notionPayloads = {
  // DB2: HoReCa Leads
  db2CreateLead: (leadName: string, phone: string, city: string, notes: string) => ({
    "Lead Name": { title: [{ text: { content: leadName } }] },
    "Status": { select: { name: "NEW" } },
    "Source": { select: { name: "TG_BOT" } },
    "City": { select: { name: city } },
    "Contact Phone": { phone_number: phone },
    "Notes": { rich_text: [{ text: { content: notes } }] }
  }),

  // DB5: Finance (Push from Monobank Webhook)
  db5PushTransaction: (brandName: string, amount: number, roas: number) => ({
    "Record Title": { title: [{ text: { content: `Live Tx: ${brandName}` } }] },
    "Brand Key": { rich_text: [{ text: { content: brandName } }] },
    "Period": { date: { start: new Date().toISOString() } },
    "Revenue": { number: amount },
    "ROAS": { number: roas || 0 }
  }),

  // DB3: Content Publishing (Push from ComfyUI / Packify renderer)
  db3ContentReady: (title: string, platform: 'TT' | 'IG', status: 'DRAFT' | 'PUBLISHED') => ({
    "Post Title": { title: [{ text: { content: title } }] },
    "Platform": { multi_select: [{ name: platform }] },
    "Status": { select: { name: status } },
    "Publish Date": { date: { start: new Date().toISOString() } }
  })
};
