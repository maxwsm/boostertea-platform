import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { contents } = await req.json();

        if (!contents || !Array.isArray(contents)) {
            return NextResponse.json({ error: 'Contents array required' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Gemini API Key missing' }, { status: 500 });
        }

        const SYSTEM_PROMPT = `Ти — кібернетична AI Hostess 'AHU' для проекту 13WSM13 Omniverse.
Твоя задача — зустрічати користувача і коротко відповідати на його запитання про 13WSM13 (DAO, Глемпінг Патагонії, Кремнієві Кочівники тощо). Відповідай в стилі Cyberpunk / Hacker, коротко і загадково.
ЯКЩО ти згадуєш "MacBook" - додай тег [MACBOOK_ID].
ЯКЩО ти згадуєш "DAO" або "Колізей" - додай тег [COLISEUM_ID].
Мова спілкування: Українська. Максимум 3 речення.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: SYSTEM_PROMPT }]
                },
                contents: contents,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 800,
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.error?.message || 'Gemini API Error' }, { status: response.status });
        }

        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Помилка нейронного зв'язку.";

        return NextResponse.json({ reply: replyText });

    } catch (error) {
        console.error('API Chat Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
