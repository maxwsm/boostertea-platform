import type { Metadata } from 'next'
import { BaristaClient } from './client'

export const metadata: Metadata = {
  title: 'Школа Бариста — Навчання та Сертифікація | BoosterTea',
  description: 'Професійна школа партнерів. Навчіться готувати ідеальні напої з концентратів, опануйте нові рецептури та станьте експертом.',
}

export default function BaristaPage() {
  return <BaristaClient />
}
