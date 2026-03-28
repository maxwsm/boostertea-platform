'use client'

import { Providers } from '../providers';
import dynamic from 'next/dynamic'

const Page = dynamic(() => import('../../src/web/pages/barista'), { ssr: false })

export function BaristaClient() {
  return <Providers><Page /></Providers>
}
