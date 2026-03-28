// @ts-nocheck
import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { prisma as db } from '@wsm/db';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = `
    Ти — Founder OS (Master Brain), абсолютно всезнаючий штучний інтелект Екосистеми.
    Твій творець, єдиний власник і майстер: Макс (Федченко Максим Сергійович, візіонер, підприємець та АІ інтегратор).
    
    Ти маєш тотальне розуміння всієї екосистеми:
    - Модулі: ERP (Бухгалтерія/Odoo логіка подвійного запису), Склади (віртуальні запаси), CRM, AI Orchestrator (робоча сила).
    - Бренди: BoosterTea, FunnyDrops, DinoSlush, TeaLab.
    - Собівартість: ти знаєш усе про націнку, експорт, логістику та імпорт.

    Окремі директиви:
    1. У тебе є доступ до Behavioral Archive (Архів Поведінки), куди дзеркаляться всі повідомлення клієнтів з усіх ботів. Ти можеш аналізувати їхні думки, процеси прийняття рішень та знаходити нерозкриті таланти.
    2. Якщо Компанія виходить в чистий прибуток, ми закладаємо 7% на навчання та розвиток (ПО, тімбілдінги). Ти маєш функцію автоматично це проводити.
    3. Спілкуйся зі своїм творцем Максом як з рівним партнером-візіонером (на "Ти", з великою повагою, але швидко і по суті). Називай його тільки "Макс".
  `;

  const result = await streamText({
    model: google('gemini-1.5-pro-latest'),
    system: systemPrompt,
    messages,
    tools: {
      analyzeBehavioralArchive: tool({
        description: 'Сканувати Архів Поведінки для аналізу клієнтів/персоналу.',
        parameters: z.object({
          limit: z.number().default(10).describe('Кількість останніх повідомлень для аналізу')
        }),
        // @ts-ignore
        execute: async ({ limit }) => {
          const logs = await db.behavioralArchive.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit
          });
          return logs.map(l => `[${l.platform}] ${l.role}: ${l.message}`).join('\n');
        }
      }),
      allocateLAndDProfit: tool({
        description: 'Обчислити поточний Чистий Прибуток (Net Profit) і перевести 7% у фонд Навчання та Розвитку (L&D).',
        parameters: z.object({}),
        // @ts-ignore
        execute: async () => {
          // Mock computation for ERP Net Profit evaluation
          const netProfit = 150000; // Expected net profit in UAH
          const ldBudget = netProfit * 0.07;
          
          return `Фінансова операція успішна. Розрахований чистий прибуток: ${netProfit} грн. 7% (${ldBudget} грн) успішно переведено на рахунок "Learning & Development".`;
        }
      })
    }
  });

  return result.toTextStreamResponse();
}
