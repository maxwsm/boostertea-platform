// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { prisma as db } from '@wsm/db';
import { google } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { z } from 'zod';

// Advanced Omni-Channel Webhook with Gemini Function Calling
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    
    // Abstract platform detection
    const platform = req.headers.get('x-platform-identifier') || 'UNKNOWN';

    // 1. Find matching AI Agent
    const integration = await db.aiIntegration.findFirst({
      where: { platform, webhookUrl: { not: null } },
      include: { agent: true }
    });

    if (!integration || !integration.agent.isActive) {
      return NextResponse.json({ error: 'No active AI Agent configured for this platform' }, { status: 404 });
    }

    const { agent } = integration;

    // 2. Extract message & user ID
    const incomingText = payload.text || payload.message || 'Ping';
    const userId = payload.userId || 'anonymous-user';

    // 3. Fetch Agent's isolated memory with the user
    const memory = await db.agentMemory.findUnique({
      where: { agentId_userId: { agentId: agent.id, userId } }
    });

    let messages: any[] = [];
    if (memory) {
      try {
        messages = JSON.parse(memory.context);
        if (!Array.isArray(messages)) messages = [];
      } catch (e) {
        messages = [{ role: 'system', content: 'Legacy context format: ' + memory.context }];
      }
    }

    // Append current user message
    messages.push({ role: 'user', content: incomingText });

    // --- PHASE 13: FOUNDER OS BEHAVIORAL ARCHIVE MIRRORING ---
    // Log the user's incoming raw message for behavioral analysis
    await db.behavioralArchive.create({
      data: {
        userId,
        platform,
        message: incomingText,
        role: 'user',
        intent: 'processing', // Could use secondary LLM to detect intent here
        sentiment: 0.0 // Default neutral
      }
    });

    // 4. Feed to Google Gemini with TOOLS (Function Calling)
    const { text: aiResponse, steps } = await generateText({
      model: google(agent.provider || 'gemini-1.5-pro-latest'),
      system: `${agent.systemPrompt}\n\nINSTRUCTION: You are speaking natively to a user on ${platform}. If the user asks about products, prices, or availability, you MUST use the searchCatalog tool to find accurate information before replying. Do not guess prices.`,
      messages,
      tools: {
        searchCatalog: tool({
          description: 'Пошук товарів у базі даних (каталозі) за ключовим словом (наприклад: тапіока, сироп, чай, кульки, boba, mango). Використовувати щоб надати клієнту точну ціну та наявність.',
          parameters: z.object({
            query: z.string().describe('Пошуковий запит (слово або категорія)')
          }),
          // @ts-ignore
          execute: async ({ query }: { query: string }) => {
            console.log(`[AI TOOL EXECUTION] Searching catalog for: ${query}`);
            const results = await db.product.findMany({
              where: {
                OR: [
                  { nameUk: { contains: query } },
                  { category: { contains: query } }
                ]
              },
              take: 5
            });
            return results.map(r => ({ name: r.nameUk, price: r.price, desc: r.descriptionUk }));
          }
        })
      }
    });

    // 5. Append AI response back to memory
    messages.push({ role: 'assistant', content: aiResponse });
    
    // Log the AI's outgoing message to the Behavioral Archive
    await db.behavioralArchive.create({
      data: {
        userId,
        platform,
        message: aiResponse,
        role: 'ai'
      }
    });

    // Prune history if it gets too large (keep last 20 messages to save tokens)
    if (messages.length > 20) {
      messages = messages.slice(-20);
    }
    
    await db.agentMemory.upsert({
      where: { agentId_userId: { agentId: agent.id, userId } },
      create: { agentId: agent.id, userId, context: JSON.stringify(messages) },
      update: { context: JSON.stringify(messages) }
    });

    // 6. Return response to Webhook provider
    return NextResponse.json({ success: true, reply: aiResponse, toolCalls: steps.length - 1 });

  } catch (error) {
    console.error('[Omni-Channel Webhook Error]', error);
    return NextResponse.json({ error: 'Failed to process Omni-Channel webhook' }, { status: 500 });
  }
}
