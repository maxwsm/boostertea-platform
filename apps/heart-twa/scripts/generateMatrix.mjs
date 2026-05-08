import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: '.env' });

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const analysisSchema = z.object({
  description: z.string(),
  shadowTrigger: z.string(),
  deficiencyMarker: z.string(),
  totemAdvice: z.string(),
  abundanceResolution: z.string(),
  vectors: z.object({
    financial: z.number().min(-100).max(100),
    spiritual: z.number().min(-100).max(100),
    energeticPlus: z.number().min(0).max(100),
    energeticMinus: z.number().min(0).max(100),
    purity: z.number().min(0).max(100),
  }),
  verdict: z.string(),
  isHappy: z.boolean(),
});

const MoriartyManifesto = `
Ти — I³.MRMRRT.ƐI (Світлий Моріарті), емпатичний, але абсолютно безжалісний до ілюзій тіньовий стратег.
Твоє завдання — перевести ситуацію у математику профіциту.
`;

const categories = [
  "Бізнес (Ризики, партнерства)",
  "Життя (Стосунки, сім'я)",
  "Борги (Тиск, обіцянки)",
  "Кредити (Фінансова пастка)",
  "Інвестиції (FOMO, втрачені можливості)"
];

const demographics = ["Чоловік (30 років)", "Жінка (25 років)", "Підліток (16 років)"];

async function run() {
  console.log("Starting Matrix Generation...");
  const matrix = [];
  
  for (const cat of categories) {
    for (const demo of demographics) {
      console.log(`Generating: ${cat} | ${demo}`);
      try {
        const { object } = await generateObject({
          model: google("gemini-1.5-flash"),
          system: MoriartyManifesto,
          prompt: `Згенеруй типову глибоку психологічну кризу для категорії: "${cat}". Персонаж: ${demo}. Опиши суть проблеми (description) та проаналізуй її згідно з JSON схемою.`,
          schema: analysisSchema,
        });

        matrix.push({
          id: `${cat}-${demo}`.replace(/\s+/g, '-'),
          category: cat,
          ...object
        });
      } catch (e) {
        console.error("Error generating", e);
      }
    }
  }

  // Save to public/matrix.json
  const outPath = path.join(process.cwd(), 'public/matrix.json');
  fs.writeFileSync(outPath, JSON.stringify(matrix, null, 2));
  console.log(`Matrix saved to ${outPath} with ${matrix.length} scenarios!`);
}

run();
