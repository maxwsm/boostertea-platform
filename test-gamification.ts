import { WsmEventBus } from '@wsm/events';
import { prisma } from '@wsm/db';

async function testEvent() {
  console.log('🧪 Testing Gamification Event Bus...');
  const eventBus = new WsmEventBus();

  // Find the test admin from DB seeding
  const admin = await prisma.user.findFirst({ where: { email: 'admin@boostertea.com.ua' } });
  
  if (!admin) {
    console.error('❌ Admin not found! Did you seed the DB?');
    process.exit(1);
  }

  const initialWallet = await prisma.wallet.findUnique({ where: { userId: admin.id } });
  console.log(`Initial Balance: ${initialWallet?.balance} WSM`);

  // Publish event simulating an order of 1000 UAH
  await eventBus.publish('ORDER_CREATED', {
    orderId: 'test-order-999',
    userId: admin.id,
    amount: 1000,
    items: []
  });

  // Wait a little bit for async event handler if needed
  await new Promise(resolve => setTimeout(resolve, 500));

  const updatedWallet = await prisma.wallet.findUnique({ where: { userId: admin.id } });
  console.log(`Updated Balance: ${updatedWallet?.balance} WSM`);
  
  if (updatedWallet && initialWallet && updatedWallet.balance > initialWallet.balance) {
    console.log('✅ Gamification Success: Points Awarded!');
  } else {
    console.log('❌ Failed: Points not awarded.');
  }
}

testEvent().catch(console.error).finally(() => prisma.$disconnect());
