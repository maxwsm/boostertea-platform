import type { Metadata } from 'next'
import { ProductClient } from './client'

const SITE_URL = 'https://www.boostertea.com.ua'

const products = [
  {
    slug: 'pu-erh',
    name: 'PU-ERH',
    nameUk: 'Пуер',
    description: 'Преміальний витриманий чайний концентрат з глибокими земляними нотами та природним енергетичним зарядом.',
    price: 900,
    image: '/2c48187c-dfae-4491-8a85-29ceb65cf85c.png',
  },
  {
    slug: 'da-hong-pao',
    name: 'DA HONG PAO',
    nameUk: 'Да Хун Пао',
    description: 'Легендарний улун "Великий Червоний Халат" з насиченим смаком обсмаження та зігріваючими властивостями.',
    price: 936,
    image: '/e188ef51-7d4a-41dd-87fb-d6756d50f7b1.png',
  },
  {
    slug: 'gaba',
    name: 'GABA',
    nameUk: 'ГАБА',
    description: 'Унікальний чайний концентрат збагачений ГАМК для розслаблення без сонливості.',
    price: 1068,
    image: '/584c19ed-170d-4d1e-b258-5603552bab8d.png',
  },
  {
    slug: 'set-all-three',
    name: 'SET — All Three',
    nameUk: 'Сет «Три смаки»',
    description: 'Повна колекція: Пуер + Да Хун Пао + ГАБА. Економія 30% порівняно з окремою покупкою.',
    price: 2033,
    image: '/2c48187c-dfae-4491-8a85-29ceb65cf85c.png',
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
