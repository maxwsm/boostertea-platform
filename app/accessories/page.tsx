import type { Metadata } from 'next'
import { AccessoriesClient } from './client'

export const metadata: Metadata = {
  title: 'Аксесуари для чаю — Термоси, стакани | BoosterTea',
  description: 'Термоси, стакани та аксесуари для приготування та подачі чайних концентратів BoosterTea.',
}

export default function AccessoriesPage() {
  return <AccessoriesClient />
}
