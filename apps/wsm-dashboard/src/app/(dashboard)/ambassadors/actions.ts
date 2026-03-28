'use server';

import { prisma } from '@wsm/db';
import crypto from 'crypto';

// Get or Create Ambassador Profile
export async function fetchAmbassadorProfile(userId: string) {
  try {
    const profile = await prisma.ambassadorProfile.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    return { profile };
  } catch (error: any) {
    return { error: error.message };
  }
}

// Generate New Ambassador Link
export async function generateAmbassadorLink(userId: string) {
  try {
    // Generate a secure but readable hash (first 6 chars)
    const rawRef = crypto.randomBytes(4).toString('hex').toUpperCase();
    const referralCode = `TITAN-\${rawRef}`;

    const profile = await prisma.ambassadorProfile.upsert({
      where: { userId },
      update: { referralCode },
      create: {
        userId,
        referralCode,
        commissionRate: 0.15,
        totalClicks: 0,
        totalSalesAmount: 0.0
      }
    });

    return { success: true, profile };
  } catch (error: any) {
    return { error: error.message };
  }
}
