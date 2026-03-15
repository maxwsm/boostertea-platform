import type { Metadata } from 'next'
import { B2BClient } from './client'

export const metadata: Metadata = {
  title: 'B2B партнерство — Чай для кафе та бізнесу | BoosterTea',
  description: 'Оптові поставки чайних концентратів для HoReCa, кафе, ресторанів, офісів. Висока маржинальність, без обладнання.',
}

export default function B2BPage() {
  return <B2BClient />
}
