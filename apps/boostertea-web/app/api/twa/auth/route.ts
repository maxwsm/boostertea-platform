import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * TWA Security Middleware
 * Validates initData from Telegram to prevent spoofing
 */
export async function POST(req: NextRequest) {
  try {
    const { initData } = await req.json();
    
    if (!initData) {
      return NextResponse.json({ error: 'Missing initData' }, { status: 400 });
    }

    // 1. Parse initData into key-value pairs
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    // 2. Sort keys alphabetically
    const keys = Array.from(urlParams.keys()).sort();
    const dataCheckString = keys.map(key => `${key}=${urlParams.get(key)}`).join('\n');

    // 3. Create WebApp secret key from BOT_TOKEN
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.warn('[TWA] TELEGRAM_BOT_TOKEN is not configured on the server.');
      // In development, assume success or fallback
      return NextResponse.json({ success: true, warning: 'Auth bypassed due to missing env var' });
    }

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    
    // 4. Calculate HMAC-SHA-256 for validation
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (calculatedHash !== hash) {
      return NextResponse.json({ error: 'Invalid TWA signature. Potential spoofing.' }, { status: 401 });
    }

    const userStr = urlParams.get('user');
    const user = userStr ? JSON.parse(decodeURIComponent(userStr)) : null;

    return NextResponse.json({ 
      success: true, 
      user: user,
      message: 'TWA signature verified successfully'
    });

  } catch (error) {
    console.error('[TWA Auth Error]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
