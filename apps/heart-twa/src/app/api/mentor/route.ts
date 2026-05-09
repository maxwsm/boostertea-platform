import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import fs from 'fs/promises';
import path from 'path';

// Load Knowledge Base
async function getKnowledgeBase() {
  try {
    const dataDir = path.join(process.cwd(), 'src', 'data', 'gemini');
    const systemPrompt = await fs.readFile(path.join(dataDir, 'system_prompt.txt'), 'utf-8');
    const hzFrequencies = await fs.readFile(path.join(dataDir, 'hz_frequencies.txt'), 'utf-8');
    const totemsAndShadows = await fs.readFile(path.join(dataDir, 'totems_and_shadows.txt'), 'utf-8');
    const dictionaryMarkers = await fs.readFile(path.join(dataDir, 'dictionary_markers.txt'), 'utf-8');
    const neurochemistry = await fs.readFile(path.join(dataDir, 'neurochemistry_sapolsky.txt'), 'utf-8');
    const polyvagal = await fs.readFile(path.join(dataDir, 'polyvagal_theory.txt'), 'utf-8');
    const negotiation = await fs.readFile(path.join(dataDir, 'negotiation_model.txt'), 'utf-8');
    const adhdRsd = await fs.readFile(path.join(dataDir, 'adhd_rsd_protocols.txt'), 'utf-8');
    const dailyLife = await fs.readFile(path.join(dataDir, 'daily_life_scenarios.txt'), 'utf-8');
    const attachment = await fs.readFile(path.join(dataDir, 'attachment_styles.txt'), 'utf-8');
    const cogDistortions = await fs.readFile(path.join(dataDir, 'cognitive_distortions.txt'), 'utf-8');
    const sleepCircadian = await fs.readFile(path.join(dataDir, 'sleep_circadian.txt'), 'utf-8');

    return `
${systemPrompt}

[БАЗА ЗНАНЬ: АУДІО-ТЕРАПІЯ (Hz ЧАСТОТИ)]
${hzFrequencies}

[БАЗА ЗНАНЬ: ТІНІ ТА ТОТЕМИ ЮНГА]
${totemsAndShadows}

[БАЗА ЗНАНЬ: СЛОВА-МАРКЕРИ (ДЕФІЦИТ/ПРОФІЦИТ)]
${dictionaryMarkers}

[БАЗА ЗНАНЬ: НЕЙРОХІМІЯ (САПОЛСКІ)]
${neurochemistry}

[БАЗА ЗНАНЬ: ПОЛІВАГАЛЬНА ТЕОРІЯ (PORGES)]
${polyvagal}

[БАЗА ЗНАНЬ: ПЕРЕГОВОРНА МОДЕЛЬ]
${negotiation}

[БАЗА ЗНАНЬ: РДУГ ТА RSD ПРОТОКОЛИ]
${adhdRsd}

[БАЗА ЗНАНЬ: ЩОДЕННІ ЖИТТЄВІ СИТУАЦІЇ]
${dailyLife}

[БАЗА ЗНАНЬ: СТИЛІ ПРИВ'ЯЗАНОСТІ (Bowlby)]
${attachment}

[БАЗА ЗНАНЬ: КОГНІТИВНІ СПОТВОРЕННЯ (Beck/Burns/Kahneman)]
${cogDistortions}

[БАЗА ЗНАНЬ: СОН ТА ЦИРКАДНІ РИТМИ]
${sleepCircadian}
    `;
  } catch (error) {
    console.error('Failed to load knowledge base', error);
    return 'Fallback: You are a helpful AI assistant. (Error loading knowledge base)';
  }
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response('Missing prompt', { status: 400 });
    }

    const systemInstruction = await getKnowledgeBase();

    const result = streamText({
      model: google('gemini-2.5-pro'), // Or gemini-1.5-pro if 2.5 is not available in the region
      system: systemInstruction,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Error in Gemini API route:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
