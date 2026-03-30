import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const secChUaPlatform = request.headers.get('sec-ch-ua-platform') || '';
  const deviceMemory = request.headers.get('device-memory') || '4'; // fallback
  
  // Default values
  let os = 'unknown';
  let tier = 'low-end';

  // 1. TWA (Telegram Web App) Detection
  if (userAgent.includes('Telegram') || userAgent.includes('FBAV') || userAgent.includes('Instagram')) {
    os = 'social-webview';
    tier = 'twa-minimal';
  }
  // 2. iOS Devices
  else if (/iPhone|iPad|iPod/.test(userAgent) || secChUaPlatform.replace(/"/g, '') === 'iOS') {
    os = 'ios';
    tier = 'mobile-sequence'; // Scrollytelling instead of WebGL
  }
  // 3. macOS High-End
  else if (/Macintosh|Mac OS X/.test(userAgent) || secChUaPlatform.replace(/"/g, '') === 'macOS') {
    os = 'macos';
    tier = 'cinematic-3d'; // Full R3F
  }
  // 4. Android Devices
  else if (/Android/.test(userAgent) || secChUaPlatform.replace(/"/g, '') === 'Android') {
    os = 'android';
    // If we have DeviceMemory headers and it's less than 4GB, downgrade the tier.
    tier = parseInt(deviceMemory) >= 4 ? 'mobile-sequence' : 'low-end-mobile';
  }
  // 5. Windows / Desktop Linux
  else if (/Windows|Linux/.test(userAgent)) {
    os = 'desktop';
    tier = 'cinematic-3d'; // Assuming desktop has enough juice for 3D
  }

  // Rewrite headers and inject into Edge Context
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-device-os', os);
  requestHeaders.set('x-device-tier', tier);

  // You can also intercept specific heavy R3F JS chunks here in the future
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // Execute middleware purely on dynamic page requests, explicitly ignoring static/assets.
  matcher: ['/((?!api|_next/static|_next/image|_next/webpack|images|fonts|videos|favicon.ico|.*\\..*).*)'],
};
