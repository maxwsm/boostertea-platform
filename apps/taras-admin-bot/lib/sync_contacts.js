const { fetchNotionData } = require('./notion_llm');
const { PrismaClient } = require('../prisma/client');

// Calculate B2B Progress
function getB2BPct(status) {
  const map = {
    'Новий': 10,
    'Лід (думає)': 25,
    'Зустріч': 50,
    'Пробна партія': 75,
    'Договір': 100,
    'Відмова': 0
  };
  return map[status] || 10;
}

// Calculate Influencer Progress
function getInfluencerPct(status) {
  const map = {
    'Новий': 10,
    'Надіслано': 30,
    'Відповів': 50,
    'Отримав бокс': 80,
    'Опублікував': 100,
    'Відмова': 0
  };
  return map[status] || 10;
}

async function syncContactsWithNotion(prismaInstance) {
  const prisma = prismaInstance || new PrismaClient();
  let updatedCount = 0;
  let newXPUsers = []; // Collect IDs to award XP if status is 100%
  
  try {
    console.log('[Sync Engine] Starting Notion -> Prisma contacts sync');
    
    // FETCH B2B
    const b2bData = await fetchNotionData('B2B');
    for (const row of b2bData) {
      if (!row.id || !row.Name) continue;
      
      const newStatus = row.Status || 'Новий';
      const pct = getB2BPct(newStatus);
      
      // Try to find if we already have it linked by notionId
      let contact = await prisma.contact.findUnique({ where: { notionId: row.id } });
      
      // Fallback: match by exact Name and unlinked
      if (!contact) {
        contact = await prisma.contact.findFirst({
          where: { name: row.Name, notionId: null }
        });
      }
      
      if (contact) {
        const wasBelow100 = contact.progressPct < 100;
        await prisma.contact.update({
          where: { id: contact.id },
          data: {
            notionId: row.id,
            status: newStatus,
            progressPct: pct,
          }
        });
        updatedCount++;

        // Add to XP reward pool if freshly hit 100%
        if (wasBelow100 && pct === 100) {
          newXPUsers.push({ userId: contact.createdById, type: 'b2b_closed', name: row.Name });
        }
      }
    }
    
    // FETCH INFLUENCERS
    const infData = await fetchNotionData('INFLUENCER');
    for (const row of infData) {
      if (!row.id || !row.Name) continue;
      
      const newStatus = row.Status || 'Новий';
      const pct = getInfluencerPct(newStatus);
      
      let contact = await prisma.contact.findUnique({ where: { notionId: row.id } });
      if (!contact) {
        contact = await prisma.contact.findFirst({
          where: { name: row.Name, notionId: null }
        });
      }
      
      if (contact) {
        const wasBelow100 = contact.progressPct < 100;
        await prisma.contact.update({
          where: { id: contact.id },
          data: {
            notionId: row.id,
            status: newStatus,
            progressPct: pct,
          }
        });
        updatedCount++;
        
        if (wasBelow100 && pct === 100) {
          newXPUsers.push({ userId: contact.createdById, type: 'influencer_published', name: row.Name });
        }
      }
    }
    
    console.log(`[Sync Engine] Successfully synced ${updatedCount} contacts.`);
    if (!prismaInstance) await prisma.$disconnect();
    
    return { success: true, updated: updatedCount, newXPUsers };
  } catch (error) {
    console.error('[Sync Engine] Error syncing contacts:', error.message);
    if (!prismaInstance) await prisma.$disconnect();
    return { success: false, error: error.message };
  }
}

// In case it's run manually: node lib/sync_contacts.js
if (require.main === module) {
  syncContactsWithNotion().then(() => process.exit(0));
}

module.exports = { syncContactsWithNotion };
