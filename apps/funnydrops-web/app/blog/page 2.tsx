import type { Metadata } from 'next'
import { BlogClient } from './client'

export const metadata: Metadata = {
  title: 'Блог про чай — BoosterTea',
  description: 'Статті про китайський чай: техніки заварювання, корисні властивості, порівняння сортів. Блог BoosterTea.',
}

export default function BlogPage() {
  return <BlogClient />
}
