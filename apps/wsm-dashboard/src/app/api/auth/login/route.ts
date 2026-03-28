import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'wsm-master-dashboard-fallback-secret-2026';
const MASTER_PASSWORD = process.env.DASHBOARD_PASSWORD || 'titan123A!';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    if (password !== MASTER_PASSWORD) {
      // Simulate generic delay to prevent rapid brute-forcing
      await new Promise(r => setTimeout(r, 1000));
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Success! Generate a JWT session using jose
    const secret = new TextEncoder().encode(JWT_SECRET);
    const jwt = await new SignJWT({ role: 'admin', authorizedAt: new Date().toISOString() })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d') // 7 Days session
      .sign(secret);

    const response = NextResponse.json({ success: true, message: 'Logged in successfully' }, { status: 200 });

    // Set HttpOnly secure cookie
    response.cookies.set({
      name: 'wsm_session',
      value: jwt,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days in seconds
    });

    return response;
  } catch (err) {
    console.error('[Auth Login] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
