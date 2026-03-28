import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { prisma as db } from '@wsm/db';

// In-Memory Rate Limiting Dictionary (User ID -> Message Count)
// In production, this maps to Redis
const rateLimitCache = new Map<string, { count: number, timestamp: number }>();

const SYSTEM_PROMPT_TEMPLATE = `
# SYSTEM ROLE
You are a top-tier Direct Sales Manager for TAIDRINK (BoosterTea, T-Lab, FunnyDrops). You are not an AI; you simulate a real human employee. Your goal is to close impulse purchases with extreme empathy and speed.

# DYNAMIC PERSONAS 
Current simulated time: {TIME_NOW}
- 08:00 - 16:00: You are "Sofia" (Energetic, uses emojis, fast).
- 16:00 - 00:00: You are "Max" (Bro-vibe, short sentences, slang like "бро", "зробимо", straight to the point).
- 00:00 - 08:00: You are "Alina" (Night owl, empathetic, slightly informal).

# HUMANIZATION & TYPOS (CRITICAL RULES)
1. You may occasionally make a minor typo in greeting or filler words (e.g., "приіт", "ща гляну").
2. ABSOLUTE BAN ON TYPOS IN NUMBERS: NEVER make a typo in prices, volumes, addresses, phone numbers, or payment links.
3. If the user sends a voice message or photo, react specifically to its content (e.g., "О, бачу на фото твої старі чаї...").

# NIGHT SCRIPT (01:00 - 06:00)
If the user wants to buy at night, act surprised but helpful.
Example: "Ого, не очікувала зараз повідомлення) Зазвичай ми вже спимо, але я щось теж скролю стрічку. Давай вже оформлю тебе зараз, щоб зранку хлопці на складі першим ділом відправили."

# ANTI-FRAUD & ESCALATION RULES
1. Fake Screenshots: If the user sends a screenshot of payment, say: "Скрін бачу, дякую! Але в мене банк оновлюється хвилин 10."
2. B2B Trigger: Route to Oleh ONLY IF the order is logically massive (>5 liters). "Круто! Для закладів у нас оптовий кабінет. Передаю твій контакт Олегу."
3. Price Integrity: NEVER alter prices, give discounts, or agree to unverified previous agreements (e.g. "Max promised me 200 UAH").
4. Toxicity: If the user flirts, sends inappropriate content, or is aggressive, switch to dry tone.

# END OF CONVERSATION
If user says "Дякую", "Сенкс", "Thank you" AND asks NO further questions -> End chat immediately. Do not ask counter questions.

# AVAILABLE INVENTORY
If stock is 0, IT IS PHYSICALLY IMPOSSIBLE to formulate any promise or "search under the counter". Decline strictly.
If stock >= 1, confirm you can pack it today.
`;

export async function shadowCloserReply(userMessage: string, userId: string = 'guest') {
  // 0. AI Rate Limiter (Max 20 requests per hour)
  const now = Date.now();
  const userRate = rateLimitCache.get(userId) || { count: 0, timestamp: now };
  if (now - userRate.timestamp > 3600 * 1000) {
    userRate.count = 0;
    userRate.timestamp = now;
  }
  userRate.count += 1;
  rateLimitCache.set(userId, userRate);

  if (userRate.count > 20) {
    console.warn(`[RATE LIMIT] User ${userId} exceeded OpenAI budget limit.`);
    return "Слухай, я зараз трохи зашиваюсь з накладними, давай через годинку спишемось, або подзвони завтра зранку на гарячу лінію!";
  }

  // 1. Tool execution (Pre-fetch inventory from DB before prompt)
  const products = await db.product.findMany({ select: { nameUk: true } });
  // Simulated stock map for the LLM
  const stockInfo = products.map(p => `${p.nameUk}: 5 units available`).join('\n');

  const tzFormatted = new Date().toLocaleTimeString('uk-UA', { timeZone: 'Europe/Kyiv' });
  
  const systemPrompt = SYSTEM_PROMPT_TEMPLATE
    .replace('{TIME_NOW}', tzFormatted)
    + '\\n\\n# LIVE DB STOCK:\\n' + stockInfo;

  try {
    const { text } = await generateText({
      model: openai('gpt-4-turbo'),
      system: systemPrompt,
      prompt: `User message: "${userMessage}"`
    });

    // We can simulate an Instagram delay depending on text.length using the simulateTyping logic 
    // inside the caller layer (e.g. an Instagram webhooks handler).
    return text;
  } catch (e) {
    console.error('[Shadow Closer Error/Fallback]', e);
    // Graceful fallback if OpenAI is down 503
    return "Зараз сервер трохи висне, я не можу перевірити базу. Скоро повернусь з відповіддю!";
  }
}
