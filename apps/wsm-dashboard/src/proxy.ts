import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'wsm-master-dashboard-fallback-secret-2026';

export default async function proxy(req: NextRequest) {
  // Extract path to avoid redirecting assets or the login page itself
  const path = req.nextUrl.pathname;

  // Paths that do not require authentication
  const isPublicPath = path === '/login' || path.startsWith('/api/auth');
  
  // Public static assets
  const isAsset = path.startsWith('/_next') || path === '/favicon.ico' || path.startsWith('/sandbox');

  if (isAsset) {
    return NextResponse.next();
  }

  // Get the session cookie
  const sessionToken = req.cookies.get('wsm_session')?.value;

  // Unauthenticated user trying to access protected route
  if (!sessionToken && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // Verify the JWT if present
  if (sessionToken) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(sessionToken, secret);
      
      // If user is already authenticated and visits /login, redirect to Dashboard home
      if (isPublicPath && path === '/login') {
        return NextResponse.redirect(new URL('/', req.nextUrl));
      }
    } catch (err) {
      console.error('[Middleware] Invalid Token', err);
      // Token is invalid/expired. Delete the cookie and redirect to login if not public
      const response = NextResponse.redirect(new URL('/login', req.nextUrl));
      response.cookies.delete('wsm_session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
