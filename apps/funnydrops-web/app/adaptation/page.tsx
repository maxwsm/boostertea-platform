import type { Metadata } from 'next'
import { AdaptationClient } from './client'

export const metadata: Metadata = {
  title: 'Як адаптувати чайний концентрат — рецепти та подача | BoosterTea',
  description: 'Рецепти приготування напоїв з чайних концентратів BoosterTea: латте, смузі, коктейлі, холодний чай.',
}

export default function AdaptationPage() {
  return <AdaptationClient />
}
