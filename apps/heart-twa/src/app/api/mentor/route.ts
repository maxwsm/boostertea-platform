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

    return `
${systemPrompt}

[БАЗА ЗНАНИЙ: ЧАСТОТЫ (АУДИО-ТЕРАПИЯ)]
${hzFrequencies}

[БАЗА ЗНАНИЙ: ТЕНИ И ТОТЕМЫ ЮНГА]
${totemsAndShadows}

[БАЗА ЗНАНИЙ: СЛОВА-МАРКЕРЫ (ДЕФИЦИТ/ПРОФИЦИТ)]
${dictionaryMarkers}
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
