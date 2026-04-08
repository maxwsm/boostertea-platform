const { PrismaClient } = require('/opt/wsm-ecosystem/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const brand = await prisma.brand.findUnique({ where: { slug: 'boostertea' } });
  if (!brand) {
    console.error("Brand 'boostertea' not found!");
    process.exit(1);
  }

  const testProducts = [
    {
      slug: 'test-1-uah',
      nameUk: 'Тестовий товар 1 грн',
      descriptionUk: 'Товар для перевірки платежів на 1 грн',
      price: 1,
      category: 'test',
      stockStatus: true,
      stockQuantity: 999,
      brandId: brand.id
    },
    {
      slug: 'test-2-uah',
      nameUk: 'Тестовий товар 2 грн',
      descriptionUk: 'Товар для перевірки платежів на 2 грн',
      price: 2,
      category: 'test',
      stockStatus: true,
      stockQuantity: 999,
      brandId: brand.id
    },
    {
      slug: 'test-3-uah',
      nameUk: 'Тестовий товар 3 грн',
      descriptionUk: 'Товар для перевірки платежів на 3 грн',
      price: 3,
      category: 'test',
      stockStatus: true,
      stockQuantity: 999,
      brandId: brand.id
    },
    {
      slug: 'test-4-uah',
      nameUk: 'Тестовий товар 4 грн',
      descriptionUk: 'Товар для перевірки платежів на 4 грн',
      price: 4,
      category: 'test',
      stockStatus: true,
      stockQuantity: 999,
      brandId: brand.id
    }
  ];

  for (const product of testProducts) {
    await prisma.product.upsert({
      where: {
        brandId_slug: {
          brandId: brand.id,
          slug: product.slug
        }
      },
      update: {
        price: product.price,
        stockStatus: true,
        stockQuantity: 999
      },
      create: product
    });
    console.log(`Created/Updated: ${product.nameUk}`);
  }

  console.log("All test products ready.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
