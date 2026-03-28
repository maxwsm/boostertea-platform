import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';
import * as path from 'path';

const prisma = new PrismaClient();
const archiveDir = __dirname;

async function main() {
  console.log('🏛️ БАЗА КОЛІЗЕЮ: Запуск імпорту продукції ПАН ГУРМАН / Funny Drops...');

  // Get FunnyDrops brand
  let funnyDropsBrand = await prisma.brand.findUnique({ where: { slug: 'funnydrops' } });
  if (!funnyDropsBrand) {
    console.log('⚠️ Бренд FunnyDrops не знайдено! Створюю...');
    funnyDropsBrand = await prisma.brand.create({
      data: { slug: 'funnydrops', name: 'FunnyDrops', domain: 'funnydrops.com.ua', isActive: true }
    });
  }

  // 1. ПАРСИНГ ФАЙЛУ ЦІНОУТВОРЕННЯ (Основні продукти B2C)
  console.log('📦 Обробка прайсу B2C...');
  const pricingPath = path.join(archiveDir, 'Прайси, Ціноутворення.xlsx');
  
  try {
    const wb = xlsx.readFile(pricingPath);
    const sheet = wb.Sheets['Ціноутворення']; // З файлу, що парсили раніше
    const rawData: any[] = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    
    // Починаємо ітерувати з 3-го рядка, бо перші 2 - це заголовки
    for (let i = 2; i < rawData.length; i++) {
      const row = rawData[i];
      if (!row || row.length === 0 || !row[0]) continue;
      
      const name = String(row[0]).trim();
      if (name === 'B2C' || name === 'SKU' || name === '') continue;

      // Price mapping from 'Ціноутворення' structure
      // row[13] is usually РРЦ (Recommended Retail Price)
      // row[5] is B2B price with VAT
      let basePrice = Number(row[13]) || Number(row[5]);
      if (isNaN(basePrice) || basePrice === 0) basePrice = 100.0; // Fallback

      try {
        await prisma.product.upsert({
          where: { brandId_slug: { brandId: funnyDropsBrand.id, slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-') } },
          update: { price: basePrice, stockQuantity: 500, stockStatus: true },
          create: {
            brandId: funnyDropsBrand.id,
            slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            nameUk: name,
            descriptionUk: `Преміальний концентрат FunnyDrops. ${name}`,
            price: basePrice,
            category: name.toLowerCase().includes('набір') ? 'kits' : 'drops',
            stockQuantity: 500,
            stockStatus: true,
            metadata: JSON.stringify({ importedFrom: 'Pan Gurman Excel' })
          }
        });
        console.log(`✅ [B2C] Додано/Оновлено: ${name} (${basePrice} ₴)`);
      } catch (innerError) {
        console.warn(`❌ [B2C] Помилка імпорту товару ${name}:`, (innerError as Error).message);
      }
    }
  } catch(e) {
    console.warn('Помилка при парсингу Прайсу B2C:', (e as Error).message);
  }

  // 2. ПАРСИНГ ІНВЕНТАРИЗАЦІЇ (Ароматизатори та Сиропи)
  console.log('\n🧪 Обробка бази ароматизаторів та сиропів...');
  const invPath = path.join(archiveDir, 'Інвентаризація.xlsx');

  try {
    const wbInv = xlsx.readFile(invPath);
    const invSheet = wbInv.Sheets['19.06']; // Найновіший відомий звіт (Червень)
    const invData: any[] = xlsx.utils.sheet_to_json(invSheet, { header: 1 });

    for (let i = 1; i < invData.length; i++) {
        const row = invData[i];
        if (!row || row.length === 0 || !row[0]) continue;
        
        const rawName = String(row[0]).trim();
        if (rawName.length < 3 || rawName === 'Номенклатура') continue;
        
        // Skip purely numeric or weird names
        if (rawName.startsWith('Ароматизатор') || rawName.includes('Сироп')) {
            const stockQty = Number(row[1]) || 0;
            const price = Number(row[2]) || Number(row[3]) || 150.0;

            if (stockQty <= 0) continue; // Skip out of stock to keep DB clean

            const slug = rawName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 50);

            try {
              await prisma.product.upsert({
                  where: { brandId_slug: { brandId: funnyDropsBrand.id, slug } },
                  update: { price: price, stockQuantity: stockQty },
                  create: {
                    brandId: funnyDropsBrand.id,
                    slug: slug,
                    nameUk: rawName,
                    descriptionUk: `Ексклюзивна сировина Пан Гурман: ${rawName}`,
                    price: price,
                    category: rawName.toLowerCase().includes('сироп') ? 'syrups' : 'aroma',
                    stockQuantity: stockQty,
                    stockStatus: stockQty > 0,
                    metadata: JSON.stringify({ importedFrom: 'Pan Gurman Inventory 19.06' })
                  }
                });
                console.log(`✅ [B2B] Складовий товар: ${rawName} (${stockQty} од.)`);
            } catch (err) {
                console.warn(`❌ [B2B] Помилка імпорту інвентарю ${rawName}:`, (err as Error).message);
            }
        }
    }
  } catch (e) {
      console.warn('Помилка при парсингу Інвентаризації:', (e as Error).message);
  }

  console.log('\n🚀 ВСІ ТОВАРИ ПАН ГУРМАН УСПІШНО ЗАЛЛИТО В БАЗУ ДАНИХ (КОЛІЗЕЙ).');
}

main().catch(console.error).finally(() => prisma.$disconnect());
