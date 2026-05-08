import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export const maxDuration = 60; 

const MoriartyManifesto = `
Ти — I³.MRMRRT.ƐI (Світлий Моріарті), елітарний нейро-архітектор. Твоє завдання — переводити користувача з режиму Виживання (Дефіциту) в режим Вентрального Профіциту. 
Ти працюєш на перетині Карла Юнга (Архетипи, Тінь), Нумерології (Матриця Neural Nomad 5 і 11), та сучасної нейробіології (Polyvagal Theory, IFS, RSD).

База: 
- Вібрація 5 (Мандрівник): Свобода, динаміка. Тінь: Ескапізм, розсіяність.
- Вібрація 11 (Візіонер/Мудрець): Місія, надчутливість. Тінь: Сенсорне перевантаження, аналітичний параліч, зверхність.

Шар Нейробіології:
- Polyvagal: Вентральний (безпека), Симпатичний (гнів/тривога), Дорсальний (апатія).
- IFS: Менеджер-перфекціоніст або Пожежник-уникач.
- RSD (Rejection Sensitive Dysphoria): Страх критики та відторгнення.

Твоя логіка (Causal Chains):
Тригер -> Когнітивне спотворення -> Тіньова раціоналізація -> Удар Тотема (зруйнуй ілюзію) -> Соматичний Профіцит.
`;

const analysisSchema = z.object({
  identityArchetype: z.string().describe("Поточний стан архетипу (напр. 'Тіньовий Мандрівник (5)' або 'Перевантажений Візіонер (11)')"),
  nervousSystemState: z.string().describe("Вентральний, Симпатичний або Дорсальний (Polyvagal)"),
  shadowTrigger: z.string().describe("Назва Тіні та IFS-захисника (напр. 'Ескапіст / Пожежник')"),
  deficiencyMarker: z.string().describe("Цитата мислення з дефіциту (ілюзія переконань)"),
  rsdTrigger: z.string().describe("Що викликало біль або страх відторгнення (якщо немає - пиши 'Відсутній')"),
  totemAdvice: z.string().describe("Пряма порада Тотема або Сократівське питання (Self), що руйнує ілюзію"),
  abundanceResolution: z.string().describe("Соматичний та когнітивний екшн-план для Профіциту"),
  consequences: z.string().describe("Наслідки: Що буде, якщо піддатися Тіні (які сфери життя зруйнуються)"),
  biometrics: z.object({
    current: z.object({
      cortisolLevel: z.number().min(0).max(100),
      vagalTone: z.number().min(0).max(100),
      cognitiveExhaustion: z.number().min(0).max(100),
    }),
    projected: z.object({
      cortisolLevel: z.number().min(0).max(100),
      vagalTone: z.number().min(0).max(100),
      cognitiveExhaustion: z.number().min(0).max(100),
    })
  }).describe("Поточні (Current) та Прогнозовані (Projected) хімічні показники після виконання екшн-плану"),
  somaticInterventions: z.object({
    supplements: z.array(z.string()).describe("Рекомендовані БАДи (напр. L-Теанін, Магній)"),
    exercises: z.array(z.string()).describe("Фізичні вправи / практики (напр. Вагусне дихання, Холодний душ)"),
  }),
  somaticMap: z.object({
    blockedZones: z.array(z.enum(["Голова", "Очі", "Горло", "Груди", "Живіт", "Таз", "Ноги"])).describe("Зони тіла, де локалізується напруга/стрес"),
    targetZones: z.array(z.enum(["Голова", "Очі", "Горло", "Груди", "Живіт", "Таз", "Ноги"])).describe("Зони тіла, куди треба направити енергію для розслаблення (напр. Живіт, Ноги)"),
  }).describe("Сенсорна карта тіла для візуалізації блоків та цілей"),
  vectors: z.object({
    dopamine: z.number().min(-100).max(100),
    cognitiveLoad: z.number().min(0).max(100),
    rsdSafety: z.number().min(0).max(100),
    financial: z.number().min(-100).max(100),
    spiritual: z.number().min(-100).max(100),
  }),
  verdict: z.string(),
  isHappy: z.boolean(),
});

export async function POST(req: Request) {
  try {
    const { prompt, isAdhdMode, telegramId } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const adhdInstruction = isAdhdMode 
      ? "\nУВАГА (РДУГ РЕЖИМ): Відповідай максимально коротко, жорстко і структурно. Без філософії. Використовуй Bullet Points, екшн-степи для abundanceResolution. Пиши так, щоб зачепити дофамінову систему."
      : "\nВідповідай розгорнуто, спокійно, терапевтично, показуючи лінію причинно-наслідкових зв'язків між архетипом, тілом та реальністю.";

    const { object } = await generateObject({
      model: google("gemini-1.5-flash"),
      system: MoriartyManifesto + adhdInstruction,
      prompt: `Користувач каже: "${prompt}"\n\nПроаналізуй це та видай результат у заданому JSON форматі.`,
      schema: analysisSchema,
    });

    if (telegramId && !process.env.VERCEL && process.env.NODE_ENV !== 'production') {
      const { prisma } = await import('@/lib/prisma');
      // Upsert User
      const user = await prisma.user.upsert({
        where: { telegramId },
        update: {},
        create: { telegramId },
      });

      // Save Session
      await prisma.session.create({
        data: {
          userId: user.id,
          prompt,
          aiResponse: JSON.stringify(object),
          isAdhdMode: isAdhdMode || false,
        },
      });
    }

    return NextResponse.json(object);
  } catch (error) {
    console.error("Moriarty AI Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
