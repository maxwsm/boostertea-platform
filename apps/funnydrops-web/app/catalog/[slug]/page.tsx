import type { Metadata } from 'next'
import { ProductClient } from './client'

const SITE_URL = 'https://www.funnydrop.com.ua'

const products = [
  {
    slug: 'volt-energy',
    name: 'VOLT ENERGY',
    nameUk: 'Вольт Енергія',
    description: 'Інтенсивний рідкий енергетик з високим вмістом кофеїну та таурину. Миттєвий заряд бадьорості для кіберспорту та нічних проектів.',
    price: 650,
    image: '/funnydrops_neon_bottle.png',
  },
  {
    slug: 'cyber-focus',
    name: 'CYBER FOCUS',
    nameUk: 'Кібер Фокус',
    description: 'Преміальні ноотропні краплі для максимальної концентрації. Містить L-теанін та екстракт гінкго білоба.',
    price: 780,
    image: '/funnydrops_neon_bottle.png',
  },
  {
    slug: 'night-rush',
    name: 'NIGHT RUSH',
    nameUk: 'Нічний Ривок',
    description: 'Екстремальний бустер витривалості з додаванням вітамінів групи B та гуарани.',
    price: 820,
    image: '/funnydrops_neon_bottle.png',
  },
]

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)
  if (!product) return {}

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nameUk,
    description: product.description,
    image: `${SITE_URL}${product.image}`,
    brand: { '@type': 'Brand', name: 'BoosterTea' },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/catalog/${slug}`,
      priceCurrency: 'UAH',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'BoosterTea' },
    },
  }

  return {
    title: `${product.name} — чайний концентрат BoosterTea`,
    description: product.description,
    other: {
      'application/ld+json': JSON.stringify(productSchema),
    },
    openGraph: {
      title: `${product.name} | BoosterTea`,
      description: product.description,
      url: `${SITE_URL}/catalog/${slug}`,
      images: [{ url: product.image, width: 800, height: 800, alt: product.nameUk }],
    },
  }
}

export default function ProductPage() {
  return <ProductClient />
}
