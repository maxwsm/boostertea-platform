
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


    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '------------50---', 'пляшка СКЛО 50 мл', 'Преміальний концентрат FunnyDrops. пляшка СКЛО 50 мл', 30, 'drops', 500, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '------fd-mini', 'набір FD mini', 'Преміальний концентрат FunnyDrops. набір FD mini', 187, 'kits', 500, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '-----------250----', 'пляшка ПЕТ 250 мл.', 'Преміальний концентрат FunnyDrops. пляшка ПЕТ 250 мл.', 43, 'drops', 500, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '------------700----', 'пляшка СКЛО 700 мл.', 'Преміальний концентрат FunnyDrops. пляшка СКЛО 700 мл.', 97, 'drops', 500, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, 'b2b', 'B2B', 'Преміальний концентрат FunnyDrops. B2B', 100, 'drops', 500, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '-----------1-0--', 'пляшка ПЕТ 1.0л.', 'Преміальний концентрат FunnyDrops. пляшка ПЕТ 1.0л.', 90.75519872, 'drops', 500, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '------------1-0---', 'пляшка СКЛО 1.0 л.', 'Преміальний концентрат FunnyDrops. пляшка СКЛО 1.0 л.', 101.6, 'drops', 500, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '---------5-0---', 'слаш ПЕТ 5.0 л.', 'Преміальний концентрат FunnyDrops. слаш ПЕТ 5.0 л.', 850, 'drops', 500, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '--------------------------654900', 'Ароматизатор Кокос-вершки 654900', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Кокос-вершки 654900', 1.1125, 'aroma', 2588, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '------------------------------------', 'Ароматизатор Айріш крем/Ірланд. крем', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Айріш крем/Ірланд. крем', 1.975, 'aroma', 2640, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '-----------------------675938', 'Ароматизатор Айс Кенді 675938', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Айс Кенді 675938', 1.46, 'aroma', 1160, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '----------------------682145', 'Ароматизатор Апельсин 682145', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Апельсин 682145', 1.375, 'aroma', 1860, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '---------------------', 'Ароматизатор Бабл Гам', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Бабл Гам', 2.19996, 'aroma', 91000, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '-------------------650818', 'Ароматизатор Банан 650818', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Банан 650818', 1.125, 'aroma', 5560, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '-------------------653602', 'Ароматизатор Банан 653602', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Банан 653602', 0.84375, 'aroma', 6000, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '-------------------872085', 'Ароматизатор Банан 872085', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Банан 872085', 0.675, 'aroma', 1225, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '---------------------------345449', 'Ароматизатор Ваніль-вершки 345449', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Ваніль-вершки 345449', 0.63, 'aroma', 2780, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '------------------------------654248', 'Ароматизатор Ваніль/Ванільний 654248', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Ваніль/Ванільний 654248', 1.175, 'aroma', 2280, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '---------------------------655004', 'Ароматизатор Вершки-молоко 655004', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Вершки-молоко 655004', 0.7875, 'aroma', 1000, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '-------------------836174', 'Ароматизатор Вишня 836174', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Вишня 836174', 0.7175, 'aroma', 4236, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '----------------------840103', 'Ароматизатор Гвоздика 840103', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Гвоздика 840103', 1.575, 'aroma', 906, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '-------------------652586', 'Ароматизатор Груша 652586', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Груша 652586', 0.8975, 'aroma', 7248, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '------------------674309', 'Ароматизатор Диня 674309', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Диня 674309', 1.125, 'aroma', 8218, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '---------------------100400', 'Ароматизатор Екзотик 100400', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Екзотик 100400', 2.19996, 'aroma', 4030, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '-----------------------808632', 'Ароматизатор Імбир сух 808632', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Імбир сух 808632', 1.1875, 'aroma', 24670, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '--------------------882859', 'Ароматизатор Кавун  882859', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Кавун  882859', 1.325, 'aroma', 7800, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '-------------------872200', 'Ароматизатор Какао 872200', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Какао 872200', 0.8, 'aroma', 802, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '---------------------------836173', 'Ароматизатор Карамель-крем 836173', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Карамель-крем 836173', 0.85, 'aroma', 2966, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '------------------654854', 'Ароматизатор Ківі 654854', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Ківі 654854', 1.2125, 'aroma', 994, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '------------------654650', 'Ароматизатор Кола 654650', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Кола 654650', 1.625, 'aroma', 2304, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '--------------------la-11-084', 'Ароматизатор Кориця LA 11.084', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Кориця LA 11.084', 0.55, 'aroma', 286, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '--------------------872214', 'Ароматизатор Малина 872214', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Малина 872214', 0.78, 'aroma', 2420, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '-------------------221109', 'Ароматизатор Манго 221109', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Манго 221109', 1.01, 'aroma', 2638, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '-------------------653392', 'Ароматизатор Манго 653392', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Манго 653392', 0.8975, 'aroma', 2014, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '----------------------288700', 'Ароматизатор Маракуйя 288700', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Маракуйя 288700', 0.91, 'aroma', 3702, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '----------------------------------652945', 'Ароматизатор Масло-ваніль/Пломбір 652945', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Масло-ваніль/Пломбір 652945', 1.1125, 'aroma', 1342, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '--------------------------------------223682', 'Ароматизатор Полуниця (Черв. ведмед.) 223682', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Полуниця (Черв. ведмед.) 223682', 1.625, 'aroma', 880, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '----------------------221047', 'Ароматизатор Полуниця 221047', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Полуниця 221047', 0.99, 'aroma', 3080, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '-----------------la-0329', 'Ароматизатор Ром LA 0329', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Ром LA 0329', 1.1, 'aroma', 686, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '----------------------134102', 'Ароматизатор Тірамісу 134102', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Тірамісу 134102', 1.37, 'aroma', 2000, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '--------------------872871', 'Ароматизатор Фундук 872871', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Фундук 872871', 0.8, 'aroma', 534, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '---------------------221106', 'Ароматизатор Чорниця 221106', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Чорниця 221106', 0.8, 'aroma', 980, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '---------------------986838', 'Ароматизатор Шоколад 986838', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Шоколад 986838', 1.15, 'aroma', 2198, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '----------------------------', 'Ароматизатор Яблуко-Апельсин', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Яблуко-Апельсин', 0.55, 'aroma', 1068, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '----------------------------633961', 'Ароматизатор Яблучний пиріг 633961', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Яблучний пиріг 633961', 1.575, 'aroma', 4344, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '-------------busquit-sel-250650', 'Ароматизатор Busquit Sel 250650', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Busquit Sel 250650', 2.16, 'aroma', 4994, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '-------------mint-sel-251331', 'Ароматизатор Mint SEL 251331', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Mint SEL 251331', 4.32, 'aroma', 4952, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '-------------------', 'Ароматизатор Кактус', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Кактус', 1.998, 'aroma', 754, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

    INSERT INTO "Product" ("id", "brandId", "slug", "nameUk", "descriptionUk", "price", "category", "stockQuantity", "stockStatus", "metadata", "createdAt", "updatedAt")
    VALUES ('prd_cuid_' || substr(md5(random()::text), 1, 10), fd_brand_id, '-----------------------', 'Ароматизатор Лимон-лайм', 'Ексклюзивна сировина Пан Гурман: Ароматизатор Лимон-лайм', 1.998, 'aroma', 210, true, '{"importedFrom":"Pan Gurman SQL Generator"}', NOW(), NOW())
    ON CONFLICT ("brandId", "slug") 
    DO UPDATE SET "price" = EXCLUDED."price", "stockQuantity" = EXCLUDED."stockQuantity", "stockStatus" = EXCLUDED."stockStatus";

END $$;
