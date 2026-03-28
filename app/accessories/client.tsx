'use client'

import { Providers } from '../providers';
import dynamic from 'next/dynamic'

const Page = dynamic(() => import('../../src/web/pages/accessories'), { ssr: false })

export function AccessoriesClient() {
  return <Providers><Page /></Providers>
}
