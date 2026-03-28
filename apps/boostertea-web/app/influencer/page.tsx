import type { Metadata } from 'next'
import { InfluencerClient } from './client'

export const metadata: Metadata = {
  title: 'Для Інфлюенсерів — Партнерська програма | BoosterTea',
  description: 'Станьте послом бренду BoosterTea. Монетизуйте свою аудиторію з найкращими чайними концентратами. Ексклюзивні умови співпраці.',
}

export default function InfluencerPage() {
  return <InfluencerClient />
}
