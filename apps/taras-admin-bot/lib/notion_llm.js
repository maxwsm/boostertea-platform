const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// ALL 10 Notion databases registered
const DB = {
  TASKS:      process.env.NOTION_TASKS_DB,
  TEAM:       process.env.NOTION_TEAM_DB,
  OPS:        process.env.NOTION_OPS_DB,
  LEGAL:      process.env.NOTION_LEGAL_DB,
  CONTENT:    process.env.NOTION_CONTENT_DB,
  INFLUENCER: process.env.NOTION_INFLUENCER_DB,
  B2B:        process.env.NOTION_B2B_DB,
  LOG:        process.env.NOTION_LOG_DB,
  ACADEMY:    process.env.NOTION_ACADEMY_DB,
  RESOURCE:   process.env.NOTION_RESOURCE_DB,
};

async function fetchNotionData(dbKey, filter = null) {
  const databaseId = DB[dbKey];
  if (!databaseId) throw new Error(`Notion DB ID for ${dbKey} not found in .env`);

  try {
    const payload = { database_id: databaseId };
    if (filter) payload.filter = filter;
    else payload.page_size = 50; // default limit to avoid huge context

    const response = await notion.databases.query(payload);
    
    // Parse results to a clean JSON structure for LLM
    return response.results.map(page => {
      const props = page.properties;
      const cleanProps = { id: page.id };
      
      for (const [key, prop] of Object.entries(props)) {
        if (prop.type === 'title' && prop.title.length > 0) cleanProps[key] = prop.title[0].plain_text;
        else if (prop.type === 'rich_text' && prop.rich_text.length > 0) cleanProps[key] = prop.rich_text.map(t => t.plain_text).join('');
        else if (prop.type === 'select' && prop.select) cleanProps[key] = prop.select.name;
        else if (prop.type === 'multi_select') cleanProps[key] = prop.multi_select.map(s => s.name).join(', ');
        else if (prop.type === 'status' && prop.status) cleanProps[key] = prop.status.name;
        else if (prop.type === 'checkbox') cleanProps[key] = prop.checkbox;
        else if (prop.type === 'number') cleanProps[key] = prop.number;
        else if (prop.type === 'url') cleanProps[key] = prop.url;
        else if(prop.type === 'date' && prop.date) cleanProps[key] = prop.date.start;
      }
      return cleanProps;
    });
  } catch (error) {
    console.error(`Notion Fetch Error (${dbKey}):`, error.message);
    return [];
  }
}

async function updateNotionPage(pageId, properties) {
  try {
    const response = await notion.pages.update({ page_id: pageId, properties });
    return response;
  } catch (error) {
    console.error(`Notion Update Error:`, error.message);
    throw error;
  }
}

async function logBotAction(eventTitle, details, member = 'System') {
  if (!DB.LOG) return;
  try {
    await notion.pages.create({
      parent: { database_id: DB.LOG },
      properties: {
        'Event': { title: [{ text: { content: eventTitle } }] },
        'Details': { rich_text: [{ text: { content: details } }] },
        'Member': { select: { name: member } },
        'Timestamp': { date: { start: new Date().toISOString() } }
      }
    });
  } catch (error) {
    console.error('Notion Log Error:', error.message);
  }
}

// Sync a Prisma contact to Notion B2B or Influencer board
async function createNotionContact(contact) {
  // Route to the right DB: influencer category → INFLUENCER, everything else → B2B
  const dbKey = contact.contactRole === 'influencer' || contact.category === 'influencer'
    ? 'INFLUENCER'
    : 'B2B';
  const databaseId = DB[dbKey];
  if (!databaseId) return; // silently skip if DB not configured

  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        'Name':        { title: [{ text: { content: contact.name } }] },
        'Phone':       { phone_number: contact.phone || '' },
        'Category':    { select: { name: contact.category || 'other' } },
        'Description': { rich_text: [{ text: { content: contact.description || '' } }] },
        'Status':      { select: { name: 'Новий' } },
      }
    });
    console.log(`✅ [Notion Sync] Contact "${contact.name}" pushed to ${dbKey} board.`);
    return response.id;
  } catch (error) {
    console.error(`Notion createNotionContact Error (${dbKey}):`, error.message);
    return null;
  }
}

module.exports = {
  DB,
  fetchNotionData,
  updateNotionPage,
  logBotAction,
  createNotionContact,
};
