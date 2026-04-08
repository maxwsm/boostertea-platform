const { GoogleGenerativeAI } = require('@google/generative-ai');

async function extractFinanceData(fileBuffer, mimeType, geminiKey) {
  const genAI = new GoogleGenerativeAI(geminiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
Ти — фінансовий аналітик. 
Проаналізуй це фото (чек, інвойс, виписка з банку, тощо). 
Витягни інформацію і поверни СУТО валідний JSON у форматі:
{
  "amount": 15000, 
  "type": "income", 
  "description": "Продаж товару B2B"
}

Правила:
- amount має бути числом (без пробілів, без значків валют).
- type: "income" (дохід/поповнення) або "expense" (витрата/переказ).
- description: коротко, що це за платіж.
- Якщо це не чек, або там взагалі немає інформації про гроші, поверни: { "error": "Це не фінансовий скріншот" }.

НЕ додавай жодного форматування типу \`\`\`json. Тільки текст JSON.
  `;

  const imageParts = [
    {
      inlineData: {
        data: Buffer.from(fileBuffer).toString("base64"),
        mimeType
      }
    }
  ];

  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    let text = result.response.text();
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini Vision Error:", err);
    return null;
  }
}

module.exports = { extractFinanceData };
