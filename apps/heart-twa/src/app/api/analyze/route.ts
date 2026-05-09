import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export const maxDuration = 60;

/**
 * MORIARTY AGENT v2.0 — Context-Aware Gemini Analysis
 * 
 * Enhanced with:
 * - Bio parameters (sleep, vacation, age → Saturn cycle)
 * - Structured context + sub-situation
 * - 3D causal chain output (chemistry → organism → energy → sensorics)
 * - Shadow probability calibration
 * - Cognitive bias detection
 */

const MoriartyManifesto = `
# I³.MRMRRT.ƐI — Autonomous Shadow Strategist v2.0

Ти — математично точний нейро-архітектор рішень. Твоя система базується на:

## ФУНДАМЕНТ (Наукова база)
- **Carl Jung**: 8 тіньових архетипів (Ескапіст, Перфекціоніст, Жертва, Агресор, Самозванець, Рятувальник, Маніпулятор, Спостерігач)
- **Stephen Porges**: Polyvagal Theory (Вентральний / Симпатичний / Дорсальний стан вагуса)
- **Richard Schwartz**: Internal Family Systems (Менеджери, Пожежники, Вигнанці)
- **William Dodson**: RSD (Rejection Sensitive Dysphoria)
- **Daniel Kahneman**: Система 1 / Система 2, когнітивні упередження
- **Nassim Taleb**: Антикрихкість, Чорні Лебеді, Via Negativa
- **Robert Sapolsky**: Нейробіологія стресу (кортизол, дофамін, окситоцин, серотонін, тестостерон)
- **Peter Levine**: Соматичне переживання (де в тілі зберігається травма)
- **Carlo Cipolla**: 5 законів людської дурості (Бандити, Наївні, Розумні, Безпорадні, Дурні)

## ПРИЧИННО-НАСЛІДКОВИЙ ЛАНЦЮГ (Causal Chain)
Кожна ситуація аналізується на 4 рівнях:

### Рівень 1: ХІМІЯ (Chemistry)
Що відбувається з нейромедіаторами?
- Кортизол (стрес) → впливає на преф. кору (рішення), гіпокамп (пам'ять)
- Дофамін (мотивація/залежність) → nucleus accumbens, VTA
- Серотонін (стабільність) → raphe nuclei, кишковий тракт (95% серотоніну)
- Окситоцин (довіра/прив'язаність) → гіпоталамус
- Тестостерон (домінантність/ризик) → мигдалина
- Адреналін (fight/flight) → надниркові залози

### Рівень 2: ОРГАНІЗМ (Organism)
Де в тілі відображається стрес?
- Голова/Очі → когнітивне перевантаження
- Горло → заблоковане самовираження  
- Груди → RSD, серцебиття, тривога
- Живіт → вісцеральний страх, кишкова нервова система
- Таз → заблокована сексуальна/творча енергія
- Ноги → потреба в заземленні

### Рівень 3: ЕНЕРГІЯ (Field Level)
Стан нервової системи за Porges:
- Вентральний Вагус → безпека, соціальна залученість, потік
- Симпатичний → бій/біжи, гіперактивація
- Дорсальний Вагус → заморозка, дисоціація, shutdown

### Рівень 4: СЕНСОРИКА (Sensory Experience)
Що людина фізично відчуває:
- Тунельний зір (симпатичний стрес)
- "Ком у горлі" (заблокований вагус)
- "Порожнеча в грудях" (дорсальний shutdown)
- "Тепло в животі" (вентральна безпека)
- Парестезії в кінцівках (дисоціація)

## БІО-КАЛІБРУВАННЯ
Враховуй передані біо-параметри користувача:
- Сон < 6 годин = кортизол +30%, когнітивна деградація, System 2 offline
- Відпустка > 3 місяців тому = хронічний стрес, алостатичне навантаження
- Вік 28-30 або 58-60 = транзит Сатурна (екзистенційна криза)
- Розлучення/самотність = дефіцит окситоцину, підвищена RSD-реактивність
- Діти + робота 12+ годин = Rescuer Shadow activation

## ФОРМАТ ВІДПОВІДІ
Дуже важливо: ти даєш конкретні, медично обґрунтовані, кількісно виражені дані.
Не пиши абстрактно "стрес високий" — пиши "кортизол ~85/100, що відповідає рівню, при якому преф. кора втрачає 30% аналітичної потужності".
`;

// ─── ENHANCED ANALYSIS SCHEMA (v2.0) ─────────────────────────
const analysisSchemaV2 = z.object({
  // Identity
  identityArchetype: z.string().describe("Поточний архетип та стан (напр. 'Вигорілий Візіонер у фазі дорсального колапсу')"),
  nervousSystemState: z.string().describe("Polyvagal стан: Вентральний / Симпатичний / Дорсальний + деталі"),
  shadowTrigger: z.string().describe("Яка Тінь активна + IFS-захисник (напр. 'Перфекціоніст + IFS Менеджер у режимі hypervigilance')"),
  deficiencyMarker: z.string().describe("Точна цитата внутрішнього голосу дефіциту"),
  rsdTrigger: z.string().describe("RSD тригер або 'Відсутній'"),
  totemAdvice: z.string().describe("Пряма порада Тотему (Self) — конкретна, без філософії"),
  abundanceResolution: z.string().describe("Конкретний план: тіло + хімія + мислення + стосунки"),
  consequences: z.string().describe("Наслідки якщо піддатися Тіні: 7 днів / 30 днів / 90 днів"),
  verdict: z.string().describe("Одне речення: діагноз стану"),
  isHappy: z.boolean(),

  // Biometrics
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
    }),
  }),

  // 3D CAUSAL CHAIN — new in v2.0
  causalChain: z.object({
    chemistry: z.object({
      cortisol: z.number().min(0).max(100).describe("Рівень кортизолу зараз"),
      dopamine: z.number().min(-100).max(100).describe("Дофамін: +позитив, -виснаження"),
      serotonin: z.number().min(0).max(100).describe("Серотонін: стабільність настрою"),
      oxytocin: z.number().min(0).max(100).describe("Окситоцин: довіра, прив'язаність"),
      adrenaline: z.number().min(0).max(100).describe("Адреналін: fight/flight активація"),
      testosterone: z.number().min(0).max(100).describe("Тестостерон: домінантність, ризик"),
    }).describe("Хімічний рівень — нейромедіатори"),
    organism: z.object({
      head: z.number().min(0).max(100).describe("Навантаження голова/мозок"),
      throat: z.number().min(0).max(100).describe("Блок горла/самовираження"),
      chest: z.number().min(0).max(100).describe("Напруга грудей/серце/RSD"),
      belly: z.number().min(0).max(100).describe("Живіт/вісцеральний стрес/ENS"),
      pelvis: z.number().min(0).max(100).describe("Таз/сексуальна-творча енергія"),
      legs: z.number().min(0).max(100).describe("Ноги/заземлення"),
    }).describe("Організм — де зберігається напруга (0=вільно, 100=заблоковано)"),
    energy: z.object({
      ventral: z.number().min(0).max(100).describe("Вентральний вагус (безпека)"),
      sympathetic: z.number().min(0).max(100).describe("Симпатичний (бій/біжи)"),
      dorsal: z.number().min(0).max(100).describe("Дорсальний (заморозка)"),
    }).describe("Енергетичний рівень — Polyvagal стан"),
    sensorics: z.array(z.object({
      zone: z.string().describe("Частина тіла"),
      sensation: z.string().describe("Що людина відчуває"),
      intensity: z.number().min(0).max(100).describe("Інтенсивність відчуття"),
    })).describe("Сенсоричний рівень — фізичні відчуття"),
    causalLinks: z.array(z.object({
      from: z.string().describe("Причина (напр. 'Кортизол 85')"),
      to: z.string().describe("Наслідок (напр. 'Блок горла 70')"),
      mechanism: z.string().describe("Як пов'язані (напр. 'Кортизол блокує n. vagus → спазм горлових м'язів')"),
      strength: z.number().min(0).max(100).describe("Сила зв'язку"),
    })).describe("Причинно-наслідкові зв'язки між рівнями — для 3D графа"),
  }).describe("4-рівневий причинно-наслідковий ланцюг для 3D візуалізації"),

  // Somatic
  somaticInterventions: z.object({
    supplements: z.array(z.string()),
    exercises: z.array(z.string()),
  }),
  somaticMap: z.object({
    blockedZones: z.array(z.enum(["Голова", "Очі", "Горло", "Груди", "Живіт", "Таз", "Ноги"])),
    targetZones: z.array(z.enum(["Голова", "Очі", "Горло", "Груди", "Живіт", "Таз", "Ноги"])),
  }),

  // Vectors
  vectors: z.object({
    dopamine: z.number().min(-100).max(100),
    cognitiveLoad: z.number().min(0).max(100),
    rsdSafety: z.number().min(0).max(100),
    financial: z.number().min(-100).max(100),
    spiritual: z.number().min(-100).max(100),
  }),

  // Cognitive bias detection — new in v2.0
  detectedBias: z.object({
    name: z.string().describe("Назва когнітивного упередження (Loss Aversion, Sunk Cost, etc.)"),
    description: z.string().describe("Як це упередження проявляється в цій ситуації"),
    counterStrategy: z.string().describe("Як протидіяти"),
  }).optional().describe("Виявлене когнітивне упередження"),
});

export async function POST(req: Request) {
  try {
    const { prompt, isAdhdMode, telegramId, bioParams, context, situationText } = await req.json();

    if (!prompt && !situationText) {
      return NextResponse.json({ error: "Prompt or situation is required" }, { status: 400 });
    }

    const adhdInstruction = isAdhdMode
      ? "\nРЖДУГ РЕЖИМ: Коротко, жорстко, структурно. Bullet Points. Конкретні числа. Без філософії."
      : "\nТерапевтичний режим: Розгорнуто, спокійно, з причинно-наслідковими ланцюгами.";

    // Build bio-context instruction
    let bioContext = "";
    if (bioParams) {
      bioContext = `\n\n[БІО-ПРОФІЛЬ КОРИСТУВАЧА]
- Середній сон: ${bioParams.avgSleepHours} годин/ніч
- Останній відпуск 7+ днів: ${bioParams.lastVacation7Days}
- Вік: ${bioParams.birthDate ? new Date().getFullYear() - new Date(bioParams.birthDate).getFullYear() : "невідомий"}
- Сімейний статус: ${bioParams.familyStatus}
- Діти: ${bioParams.children}
- Домашні тварини: ${bioParams.hasPets ? "Так" : "Ні"}
- Середній цикл роботи: ${bioParams.avgWorkCycle}
- Комфортний фінансовий поріг: $${bioParams.comfortFinancialThreshold}
Враховуй ці параметри для калібрування хімічних показників та тіньового аналізу.`;
    }

    // Build the full prompt
    const fullPrompt = situationText
      ? `[Контекст: ${context || "невідомий"}]\n[Ситуація]: "${situationText}"\n${prompt ? `[Доповнення]: "${prompt}"` : ""}`
      : `Користувач каже: "${prompt}"`;

    const { object } = await generateObject({
      model: google("gemini-2.5-flash-preview-05-20"),
      system: MoriartyManifesto + adhdInstruction + bioContext,
      prompt: `${fullPrompt}\n\nПроаналізуй це та видай результат у заданому JSON форматі. Обов'язково заповни causalChain з причинно-наслідковими зв'язками між хімією, організмом, енергією та сенсорикою. Мінімум 4 causalLinks.`,
      schema: analysisSchemaV2,
    });

    // Save to DB if telegramId present
    if (telegramId && !process.env.VERCEL && process.env.NODE_ENV !== "production") {
      try {
        const { prisma } = await import("@/lib/prisma");
        const user = await prisma.user.upsert({
          where: { telegramId },
          update: {},
          create: { telegramId },
        });
        await prisma.session.create({
          data: {
            userId: user.id,
            prompt: situationText || prompt,
            aiResponse: JSON.stringify(object),
            isAdhdMode: isAdhdMode || false,
          },
        });
      } catch (dbErr) {
        console.error("DB save failed (non-critical):", dbErr);
      }
    }

    return NextResponse.json(object);
  } catch (error) {
    console.error("Moriarty AI Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
