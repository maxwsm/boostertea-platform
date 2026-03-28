import * as fs from 'fs';
import * as path from 'path';

function escapeSql(str: string): string {
    return str.replace(/'/g, "''");
}

function processCatalogToSql() {
    console.log('🏛️ БАЗА КОЛІЗЕЮ: Генерація SQL-скрипта імпорту...');
    
    const jsonPath = path.join(__dirname, '../../../full_pan_gurman.json');
    if (!fs.existsSync(jsonPath)) throw new Error('full_pan_gurman.json not found!');
    const masterCatalog = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    let sql = `
DO $$
DECLARE
    fd_brand_id TEXT;
BEGIN
    -- Намагаємось знайти існуючий Brand "funnydrops". Оскільки ID в Prisma зазвичай cuid() або UUID(). 
    -- Для безпеки будемо вважати id як VARCHAR(191) або Text (в залежності від схеми).
    SELECT id INTO fd_brand_id FROM "Brand" WHERE slug = 'funnydrops';
    IF NOT FOUND THEN
        -- Згенеруємо простий CUID-подібний ID для безпеки (якщо сервер використовує CUID)
        -- Але простіше вставити хардкод: gen_random_uuid()::text, якщо база підтримує uuid_generate_v4() або gen_random_uuid.
        fd_brand_id := 'cuid_funnydrops_0011223389';
        INSERT INTO "Brand" ("id", "slug", "name", "domain", "isActive") 
        VALUES (fd_brand_id, 'funnydrops', 'FunnyDrops', 'funnydrops.com.ua', true);
    END IF;

`;

    // 1. Прайс B2C
    const b2cSheet = masterCatalog.find((s: any) => s.source === 'Прайси, Ціноутворення.xlsx' && s.sheet === 'Ціноутворення');
    let upserts = 0;

    if (b2cSheet && b2cSheet.data) {
        for (let i = 2; i < b2cSheet.data.length; i++) {
            const row = b2cSheet.data[i];
            if (!row || row.length === 0 || !row[0]) continue;
            const name = String(row[0]).trim();
            if (name === 'B2C' || name === 'SKU' || name === '') continue;

            let basePrice = Number(row[13]) || Number(row[5]);
            if (isNaN(basePrice) || basePrice === 0) basePrice = 100.0;
            const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const cat = name.toLowerCase().includes('набір') ? 'kits' : 'drops';

            sql += `
    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '${escapeSql(slug)}', '${escapeSql(name)}', 'Преміальний концентрат FunnyDrops. ${escapeSql(name)}', ${basePrice}, '${cat}', 500, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";
`;
            upserts++;
        }
    }

    // 2. ІНВЕНТАРИЗАЦІЯ B2B
    const invSheet = masterCatalog.find((s: any) => s.source === 'Інвентаризація.xlsx' && s.sheet === '19.06');
    if (invSheet && invSheet.data) {
        for (let i = 1; i < invSheet.data.length; i++) {
            const row = invSheet.data[i];
            if (!row || row.length === 0 || !row[0]) continue;
            const rawName = String(row[0]).trim();
            if (rawName.length < 3 || rawName === 'Номенклатура') continue;
            
            if (rawName.startsWith('Ароматизатор') || rawName.includes('Сироп')) {
                const stockQty = Number(row[1]) || 0;
                const basePrice = Number(row[2]) || Number(row[3]) || 150.0;
                if (stockQty <= 0) continue; 
                
                const slug = rawName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 50);
                const cat = rawName.toLowerCase().includes('сироп') ? 'syrups' : 'aroma';

                sql += `
    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '${escapeSql(slug)}', '${escapeSql(rawName)}', 'Ексклюзивна сировина Пан Гурман: ${escapeSql(rawName)}', ${basePrice}, '${cat}', ${stockQty}, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";
`;
                upserts++;
            }
        }
    }

    sql += `
END $$;
`;

    fs.writeFileSync(path.join(__dirname, 'upsert_pan_gurman.sql'), sql);
    console.log(`✅ Згенеровано ${upserts} UPSERT операцій до upsert_pan_gurman.sql!`);
}

processCatalogToSql();
