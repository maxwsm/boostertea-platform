import type { Metadata, Viewport } from 'next'
import { Providers } from './providers'
import '../src/web/styles.css'

const SITE_URL = 'https://www.boostertea.com.ua'
const SITE_NAME = 'BoosterTea'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'BoosterTea — Преміальні чайні концентрати з Китаю',
    template: '%s | BoosterTea',
  },
  description:
    'BoosterTea — преміальні концентрати китайського чаю. PU-ERH, DA HONG PAO, GABA. Готовий напій за 15 секунд. Доставка по Україні.',
  keywords: [
    'чайний концентрат',
    'пу-ер купити',
    'да хун пао',
    'GABA чай',
    'чай для кафе',
    'BoosterTea',
    'boostertea',
    'преміальний чай Україна',
  ],
  authors: [{ name: 'BoosterTea', url: SITE_URL }],
  creator: 'BoosterTea',
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'BoosterTea — Преміальні чайні концентрати з Китаю',
    description:
      'Готовий чай за 15 секунд. PU-ERH, DA HONG PAO, GABA. 40+ порцій з 1 пляшки. Доставка по Україні.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BoosterTea — преміальні чайні концентрати',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BoosterTea — Преміальні чайні концентрати',
    description: 'Готовий чай за 15 секунд. PU-ERH, DA HONG PAO, GABA.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-64.png', sizes: '64x64', type: 'image/png' },
      { url: '/favicon-128.png', sizes: '128x128', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
  width: 'device-width',
  initialScale: 1,
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BoosterTea',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon-128.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+380963109622',
    contactType: 'customer service',
    areaServed: 'UA',
    availableLanguage: ['Ukrainian', 'English'],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'вул. Богдана Хмельницького 66а',
    addressLocality: 'Львів',
    addressCountry: 'UA',
  },
  sameAs: [
    'https://www.instagram.com/booster_tea_ua',
    'https://www.tiktok.com/@booster_tea',
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/catalog?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
