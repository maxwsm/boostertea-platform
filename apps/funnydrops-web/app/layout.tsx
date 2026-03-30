import type { Metadata, Viewport } from 'next'
import '../src/web/styles.css'

const SITE_URL = 'https://www.funnydrop.com.ua'
const SITE_NAME = 'FunnyDrops'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'FunnyDrops — Адаптогенні краплі та сиропи',
    template: '%s | ' + SITE_NAME,
  },
  description: 'FunnyDrops — інноваційні концентрати та краплі для настрою. Швидке приготування, заряд енергії на весь день.',
  keywords: ['адаптогенні краплі', 'funnydrops', 'смішні краплі', 'бади', 'сироп'],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'FunnyDrops — Твоя енергія у краплях',
    description: 'Натуральні адапктогени.',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{ url: '/favicon-128.webp', width: 1200, height: 630, alt: SITE_NAME }],
    locale: 'uk_UA',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export const viewport: Viewport = {
  themeColor: '#0D0D0D',
  width: 'device-width',
  initialScale: 1,
}

import { headers } from 'next/headers'
import Script from 'next/script'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX';
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1234567890';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const deviceOs = headersList.get('x-device-os') || 'macos';
  const deviceTier = headersList.get('x-device-tier') || 'cinematic-3d';

  return (
    <html lang="uk">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body data-device-os={deviceOs} data-device-tier={deviceTier}>
        <div id="root">{children}</div>

        {/* --- Global Telemetry Injected via Next.js Script --- */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": SITE_NAME,
                "url": SITE_URL,
                "logo": `${SITE_URL}/favicon-128.webp`,
                "description": "Виробник інноваційних крапель",
                "contactPoint": { "@type": "ContactPoint", "contactType": "sales", "areaServed": "UA" }
              }),
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var isTwa = document.referrer.includes('t.me') || window.location.search.includes('tgWebAppStartParam');
                    if (isTwa) {
                      window.sessionStorage.setItem('wsm_twa_visitor', 'true');
                      var checkFbq = setInterval(function() {
                        if (typeof window.fbq === 'function') {
                          window.fbq('trackCustom', 'TWAVisitor');
                          clearInterval(checkFbq);
                        }
                      }, 500);
                      setTimeout(function() { clearInterval(checkFbq); }, 10000);
                    }
                  } catch(e) {}
                })();
              `
            }}
          />
        </body>
      </html>
    )
  }
