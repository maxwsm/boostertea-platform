import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🏛️ БАЗА КОЛІЗЕЮ: Запуск імпорту продукції ПАН ГУРМАН (РЕМОУТ СЕЙДЕР)...');

  // Load JSON
  const jsonPath = path.join(__dirname, 'full_pan_gurman.json');
  if (!fs.existsSync(jsonPath)) throw new Error('full_pan_gurman.json not found!');
  const masterCatalog = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // Get FunnyDrops brand
  let funnyDropsBrand = await prisma.brand.findUnique({ where: { slug: 'funnydrops' } });
  if (!funnyDropsBrand) {
    funnyDropsBrand = await prisma.brand.create({
      data: { slug: 'funnydrops', name: 'FunnyDrops', domain: 'funnydrops.com.ua', isActive: true }
    });
  }

  // 1. B2C Прайс
  console.log('📦 Обробка прайсу B2C...');
  const b2cSheet = masterCatalog.find((s: any) => s.source === 'Прайси, Ціноутворення.xlsx' && s.sheet === 'Ціноутворення');
  if (b2cSheet && b2cSheet.data) {
    for (let i = 2; i < b2cSheet.data.length; i++) {
        const row = b2cSheet.data[i];
        if (!row || row.length === 0 || !row[0]) continue;
        const name = String(row[0]).trim();
        if (name === 'B2C' || name === 'SKU' || name === '') continue;

        let basePrice = Number(row[13]) || Number(row[5]);
        if (isNaN(basePrice) || basePrice === 0) basePrice = 100.0;

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
              metadata: JSON.stringify({ importedFrom: 'Pan Gurman JSON Payload' })
            }
          });
          console.log(`✅ [B2C] Додано/Оновлено: ${name} (${basePrice} ₴)`);
        } catch (innerError) {
          console.warn(`❌ [B2C] Помилка: ${name} -`, (innerError as Error).message);
        }
    }
  }

  // 2. Інвентаризація
  console.log('\n🧪 Обробка бази ароматизаторів та сиропів...');
  const invSheet = masterCatalog.find((s: any) => s.source === 'Інвентаризація.xlsx' && s.sheet === '19.06');
  if (invSheet && invSheet.data) {
      for (let i = 1; i < invSheet.data.length; i++) {
          const row = invSheet.data[i];
          if (!row || row.length === 0 || !row[0]) continue;
          
          const rawName = String(row[0]).trim();
          if (rawName.length < 3 || rawName === 'Номенклатура') continue;
          
          if (rawName.startsWith('Ароматизатор') || rawName.includes('Сироп')) {
              const stockQty = Number(row[1]) || 0;
              const price = Number(row[2]) || Number(row[3]) || 150.0;
              if (stockQty <= 0) continue; 

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
                      metadata: JSON.stringify({ importedFrom: 'Pan Gurman JSON Payload' })
                    }
                  });
                  console.log(`✅ [B2B] Складовий товар: ${rawName} (${stockQty} од.)`);
              } catch (err) {
                  console.warn(`❌ [B2B] Помилка ${rawName}:`, (err as Error).message);
              }
          }
      }
  }

  console.log('\n🚀 ВСІ ТОВАРИ ПАН ГУРМАН УСПІШНО ЗАЛЛИТО В БАЗУ ДАНИХ КОЛІЗЕЮ!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
