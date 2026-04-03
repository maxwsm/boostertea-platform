require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  console.log('4️⃣ Перевірка з\'єднання з Gemini AI:');
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    await model.generateContent("Test");
    console.log(`   ✅ З'єднано успішно (gemini-1.5-flash-latest).`);
  } catch (err) {
    console.log(`   ❌ Помилка: ${err.message}`);
  }
}
testGemini();
