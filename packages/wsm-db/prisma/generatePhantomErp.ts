import * as fs from 'fs';
import * as path from 'path';

function processPhantomErp() {
    console.log('🏭 БАЗА КОЛІЗЕЮ: Генерація ERP/BOM SQL-скрипта...');
    
    let sql = `
-- ==============================================
-- 1. СТВОРЕННЯ НОВИХ ТАБЛИЦЬ (SAFE MIGRATION)
-- ==============================================

CREATE TABLE IF NOT EXISTS "MeasurementUnit" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ratio" DECIMAL(65,30) NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MeasurementUnit_pkey" PRIMARY KEY ("id")
);
-- Ignore if exists syntax for indexes requires DO blocks or specific pg versions, but we can use IF NOT EXISTS
CREATE UNIQUE INDEX IF NOT EXISTS "MeasurementUnit_code_key" ON "MeasurementUnit"("code");

CREATE TABLE IF NOT EXISTS "TechCard" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "description" TEXT,
    "laborCost" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TechCard_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "TechCard_productId_key" ON "TechCard"("productId");

CREATE TABLE IF NOT EXISTS "TechCardItem" (
    "id" TEXT NOT NULL,
    "techCardId" TEXT NOT NULL,
    "rawProductId" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "uomId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TechCardItem_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "baseUomId" TEXT;

-- ==============================================
-- 2. ІНЖЕКЦІЯ ФАНТОМНИХ БАЗОВИХ ДАНИХ
-- ==============================================

DO $$
DECLARE
    uom_g_id TEXT := 'uom_g_000000000001';
    uom_ml_id TEXT := 'uom_ml_00000000002';
    uom_pcs_id TEXT := 'uom_pcs_0000000003';
    
    bt_brand_id TEXT;
    
    raw_cup_id TEXT := 'prd_raw_cup_000001';
    raw_straw_id TEXT := 'prd_raw_straw_0002';
    
    acc_user_id TEXT := 'usr_phantom_acc001';
    law_user_id TEXT := 'usr_phantom_law002';
BEGIN

    -- 2.1 Одиниці виміру (UOM)
    INSERT INTO "MeasurementUnit" ("id", "code", "name", "ratio", "updatedAt")
    VALUES 
        (uom_g_id, 'g', 'Грами', 1.0, NOW()),
        (uom_ml_id, 'ml', 'Мілілітри', 1.0, NOW()),
        (uom_pcs_id, 'pcs', 'Штуки', 1.0, NOW())
    ON CONFLICT ("code") DO NOTHING;

    -- 2.2 Фантомні Працівники (Users & Partners)
    INSERT INTO "User" ("id", "name", "email", "languageCode", "createdAt", "updatedAt", "lastActiveAt", "discountUsed", "horecaPoints")
    VALUES 
        (acc_user_id, 'Головний Бухгалтер (Фантом)', 'accountant@13wsm13.com', 'uk', NOW(), NOW(), NOW(), false, 0),
        (law_user_id, 'Головний Юрист (Фантом)', 'lawyer@13wsm13.com', 'uk', NOW(), NOW(), NOW(), false, 0)
    ON CONFLICT DO NOTHING;

    INSERT INTO "Partner" ("id", "name", "email", "isEmployee", "userId", "isCustomer", "isVendor", "createdAt", "updatedAt")
    VALUES 
        ('ptn_acc001', 'Бухгалтерія WSM', 'accountant@13wsm13.com', true, acc_user_id, false, false, NOW(), NOW()),
        ('ptn_law002', 'Юр. Відділ WSM', 'lawyer@13wsm13.com', true, law_user_id, false, false, NOW(), NOW()),
        ('ptn_sup003', 'Постачальник Тари НОУНЕЙМ', 'supplier@boxes.ua', false, NULL, false, true, NOW(), NOW())
    ON CONFLICT ("email") DO NOTHING;

    -- 2.3 Базові Сировинні Товари (для тех. карт)
    SELECT id INTO bt_brand_id FROM "Brand" WHERE slug = 'boostertea' LIMIT 1;
    IF bt_brand_id IS NULL THEN
        bt_brand_id := 'cuid_boostertea_001';
        INSERT INTO "Brand" ("id", "slug", "name", "domain", "isActive") 
        VALUES (bt_brand_id, 'boostertea', 'BoosterTea', 'boostertea.com.ua', true);
    END IF;

    -- Вставляємо стаканчики і трубочки як складське майно BoosterTea
    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "baseUomId", "createdAt", "updatedAt")
    VALUES 
        (raw_cup_id, bt_brand_id, 'sip-cup-500ml', 'Cup 500ml (Raw)', 'Стаканчик для Бабл Ті', 5.0, 'raw_materials', 10000, true, uom_pcs_id, NOW(), NOW()),
        (raw_straw_id, bt_brand_id, 'boba-straw-12mm', 'Straw 12mm (Raw)', 'Трубочка широка для боби', 1.0, 'raw_materials', 50000, true, uom_pcs_id, NOW(), NOW())
    ON CONFLICT ("brandId", "slug") DO NOTHING;

    -- 2.4 Створення ДЕМО Тех-Карти для "BoosterTea Strawberry" (якщо він існує)
    DECLARE
        target_product_id TEXT;
        tc_id TEXT := 'tc_boostertea_strawberry_01';
    BEGIN
        SELECT id INTO target_product_id FROM "Product" WHERE "brandId" = bt_brand_id AND slug ILIKE '%strawberry%' LIMIT 1;
        
        IF target_product_id IS NOT NULL THEN
            -- Створюємо саму техно-карту
            INSERT INTO "TechCard" ("id", "productId", "description", "laborCost", "isActive", "createdAt", "updatedAt")
            VALUES (tc_id, target_product_id, 'Базовий рецепт полуничного бабл ті (ФАНТОМ MOCK)', 15.0, true, NOW(), NOW())
            ON CONFLICT ("productId") DO NOTHING;

            -- Додаємо інгредієнти до рецептури
            INSERT INTO "TechCardItem" ("id", "techCardId", "rawProductId", "quantity", "uomId", "createdAt", "updatedAt")
            VALUES 
                ('tci_cup_001', tc_id, raw_cup_id, 1, uom_pcs_id, NOW(), NOW()),
                ('tci_straw_001', tc_id, raw_straw_id, 1, uom_pcs_id, NOW(), NOW())
            ON CONFLICT DO NOTHING;
        END IF;
    END;

END $$;
`;

    fs.writeFileSync(path.join(__dirname, 'upsert_phantom_erp.sql'), sql);
    console.log('✅ Згенеровано файл upsert_phantom_erp.sql з Phantom ERP архітектурою!');
}

processPhantomErp();
