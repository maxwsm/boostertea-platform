/**
 * TITAN OMNI-CHANNEL ERP: Vercel AI Gateway Config
 * Proxies requests to Google Gemini via Vercel for caching, rate-limiting, and analytics.
 */

import { GoogleGenAI } from '@google/genai';

const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID || 'prj_bc42PPlgi2p4ZU3ovxlLMq3jJF2v';
const AI_GATEWAY_ID = process.env.VERCEL_AI_GATEWAY_ID || 'wsm-brain'; // Replace with real Vercel AI Gateway ID

// 1. Створюємо клієнт з кастомним Base URL, який веде на Vercel Gateway
export const createGeminiGatewayClient = () => {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    baseUrl: `https://gateway.vercel.com/v1/projects/${VERCEL_PROJECT_ID}/${AI_GATEWAY_ID}/google-gemini`,
  });
};

export const generateAudienceSuggestion = async (prompt: string) => {
  const ai = createGeminiGatewayClient();
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-pro-latest',
    contents: prompt,
  });
  return response.text;
};
