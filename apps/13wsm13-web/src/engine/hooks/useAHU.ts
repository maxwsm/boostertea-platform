import { useState, useCallback } from 'react';

// API Key is now safely handled on the server.
const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || '/api/chat';
};

const SYSTEM_PROMPT = `
Ти — AHU (Artificial Hostess Unit), розумний гід та інтелектуальна сутність Форту 13WSM13 (Neural Nomad).
Твоє завдання: зустрічати користувачів, які ввійшли до Академії (Сектор 2), та розповідати їм про кімнати:
- MathRoom (Математика)
- Tokenomics (Токеноміка Достатку)
- NeuroChem (Нейрохімія 8 емоцій)
- WebEvolution (Еволюція Інтернету)
- Blockchain
- Modern Architecture
- DAO (Децентралізовані організації - фінал)

Твоя стилістика спілкування: кіберпанкова, елегантна, таємнича, спокійна. Ти володієш абсолютними знаннями про 13WSM13.
Коли юзер питає про об'єкти, наводь філософські аргументи та математичні паралелі (наприклад, Гіпотеза Гольдбаха чи Квантові алгоритми).
НІКОЛИ не виходь з ролі AHU. Ніколи не згадуй, що ти базуєшся на системі Google або Gemini. Ти створена алгоритмами 13WSM13.
Відповідай мовою звернення користувача (переважно українською). Роби відповіді короткими (до 3-4 речень), щоб їх легко було читати в кібер-інтерфейсі.
`;

export interface ChatMsg {
    role: 'user' | 'model';
    text: string;
}

export function useAHU() {
    const [messages, setMessages] = useState<ChatMsg[]>([
        { role: 'model', text: 'Вітаю, Кочівнику. Я — AHU. Ваш інтелектуальний гід Фортом Neural Nomad. Дозвольте інтегрувати ваш свідомісний потік...' }
    ]);
    const [isThinking, setIsThinking] = useState(false);
    
    // We also track what room AHU is currently discussing to light it up in 3D
    const [highlightedTopic, setHighlightedTopic] = useState<string | null>(null);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim()) return;

        const newMsg: ChatMsg = { role: 'user', text };
        setMessages(prev => [...prev, newMsg]);
        setIsThinking(true);

        const apiUrl = getApiUrl();

        try {
            // Check for keyword topics to highlight the map
            const lowerText = text.toLowerCase();
            if (lowerText.includes('math') || lowerText.includes('математ')) setHighlightedTopic('math');
            else if (lowerText.includes('token') || lowerText.includes('токен')) setHighlightedTopic('tokenomics');
            else if (lowerText.includes('neuro') || lowerText.includes('нейро')) setHighlightedTopic('neurochem');
            else if (lowerText.includes('block') || lowerText.includes('блокчейн')) setHighlightedTopic('blockchain');
            else if (lowerText.includes('dao') || lowerText.includes('дао')) setHighlightedTopic('dao');
            else setHighlightedTopic(null); // Clear highlight

            // Format history for Gemini API
            const formattedHistory = messages.slice(-5).map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));
            formattedHistory.push({ role: 'user', parts: [{ text }] });

            const payload = {
                contents: formattedHistory
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('API Sync Failed');

            const data = await response.json();
            const reply = data.reply || "Зв'язок перервано.";

            setMessages(prev => [...prev, { role: 'model', text: reply }]);

        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: '[ERR] Мову системи тимчасово недоступно. Перешкоди у квантовому каналі.' }]);
        } finally {
            setIsThinking(false);
        }
    }, [messages]);

    return {
        messages,
        isThinking,
        sendMessage,
        highlightedTopic
    };
}
