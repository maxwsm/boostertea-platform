import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const telegramId = searchParams.get('telegramId');

    if (!telegramId) {
      return NextResponse.json({ error: "telegramId is required" }, { status: 400 });
    }

    // SQLite is not fully supported for Vercel Edge Serverless persistence.
    // We return mock data to demonstrate the History/Trends UI on Vercel.
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      const { MOCK_SCENARIOS } = await import('@/data/scenarios');
      const mockHistory = MOCK_SCENARIOS.map((s, idx) => ({
        id: `mock-${idx}`,
        prompt: "Аудіо запис",
        timestamp: new Date(Date.now() - idx * 86400000).toISOString(),
        aiResponse: s
      }));
      return NextResponse.json({ sessions: mockHistory });
    }

    const { prisma } = await import('@/lib/prisma');
    const user = await prisma.user.findUnique({
      where: { telegramId },
      include: {
        sessions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        }
      }
    });

    if (!user) {
      return NextResponse.json({ sessions: [] });
    }

    const history = user.sessions.map(s => ({
      id: s.id,
      prompt: s.prompt,
      timestamp: s.createdAt,
      aiResponse: JSON.parse(s.aiResponse)
    }));

    return NextResponse.json({ sessions: history });
  } catch (error) {
    console.error("History fetching error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
