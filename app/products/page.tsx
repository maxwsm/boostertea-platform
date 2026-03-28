import type { Metadata } from 'next'
import { CatalogClient } from './client'

export const metadata: Metadata = {
  title: 'Каталог — Чайні концентрати BoosterTea',
  description:
    'Каталог чайних концентратів BoosterTea: PU-ERH (Пуер), DA HONG PAO (Да Хун Пао), GABA. Ціни, склад, ефекти. Доставка по Україні.',
  openGraph: {
    title: 'Каталог чайних концентратів | BoosterTea',
    description: 'PU-ERH, DA HONG PAO, GABA — преміальні китайські чаї за 15 секунд.',
    url: 'https://www.boostertea.com.ua/products',
  },
}

export default function CatalogPage() {
  return <CatalogClient />
}
