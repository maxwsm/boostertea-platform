import type { Metadata, Viewport } from 'next'
import '../src/web/styles.css'
import { Providers } from './providers'
import { LivePurchasesPopup } from '../src/web/components/LivePurchasesPopup'
import { CharityDroneStrike } from '../src/web/components/CharityDroneStrike'

const SITE_URL = 'https://www.boostertea.com.ua'
const SITE_NAME = 'BoosterTea'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'BoosterTea — Преміальні чайні концентрати з Китаю',
    template: '%s | BoosterTea',
  },
  description: 'BoosterTea — преміальні концентрати китайського чаю. PU-ERH, DA HONG PAO, GABA. Готовий напій за 15 секунд. Доставка по Україні.',
  keywords: ['чайний концентрат', 'пу-ер купити', 'да хун пао', 'GABA чай', 'чай для кафе', 'boostertea', 'енергетичний чай'],
  authors: [{ name: 'BoosterTea', url: SITE_URL }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'BoosterTea — Твоя чайна енергія',
    description: 'Натуральні чайні концентрати з Китаю за 15 секунд.',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{ url: '/boostertea-premium-tea-concentrate.webp', width: 1200, height: 630, alt: 'BoosterTea Premium' }],
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // In Next.js 15 headers() is a Promise
  const headersList = await headers();
  const deviceOs = headersList.get('x-device-os') || 'macos';
  const deviceTier = headersList.get('x-device-tier') || 'cinematic-3d';

  return (
    <html lang="uk">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body data-device-os={deviceOs} data-device-tier={deviceTier}>
        <Providers>
          <div id="root">{children}</div>
          <LivePurchasesPopup />
          {/* <CharityDroneStrike /> Disabled as per Phase 36 */}
        </Providers>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "BoosterTea",
                "url": SITE_URL,
                "logo": `${SITE_URL}/favicon-128.webp`,
                "description": "Виробник преміальних чайних концентратів",
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
