import { NextResponse } from 'next/server';

/**
 * Backend Proxy для Packify.ai
 * Приховує реальний Business API Key від браузера (заборонено слати ключ на фронт).
 */
export async function GET() {
  const apiKey = process.env.PACKIFY_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ 
      error: 'PACKIFY_API_KEY не знайдено в оточенні сервера.' 
    }, { status: 500 });
  }

  try {
    // У майбутньому тут робимо HTTP запит на API Packify для обміну ключа на тимчасовий токен
    // const res = await fetch('https://api.packify.ai/v1/auth/token', {
    //   headers: { 'Authorization': `Bearer ${apiKey}` }
    // });
    // const data = await res.json();
    
    return NextResponse.json({ 
      // Емуляція безпечного клієнтського токена:
      token: apiKey.substring(0, 5) + '..._safe_client_token',
      status: 'authenticated',
      provider: 'Packify.ai Business'
    });
  } catch (error) {
    console.error('[Packify API Error]:', error);
    return NextResponse.json({ error: 'Збій комунікації із Packify API' }, { status: 500 });
  }
}
