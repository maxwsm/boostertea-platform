import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const usersCount = await prisma.user.count();
  const ordersCount = await prisma.order.count();
  const transactionsCount = await prisma.transaction.count();
  const shadowsCount = await prisma.shadowCart.count();
  const b2bleadsCount = await prisma.b2BLead.count();
  const b2bPartnersCount = await prisma.b2BPartner.count();

  console.log(`Users: ${usersCount}`);
  console.log(`Orders: ${ordersCount}`);
  console.log(`Transactions: ${transactionsCount}`);
  console.log(`Shadow Carts: ${shadowsCount}`);
  console.log(`B2B Leads: ${b2bleadsCount}`);
  console.log(`B2B Partners: ${b2bPartnersCount}`);
  
  const latestUsers = await prisma.user.findMany({ take: 3, orderBy: { createdAt: 'desc' } });
  console.log('Latest Users:', JSON.stringify(latestUsers, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
