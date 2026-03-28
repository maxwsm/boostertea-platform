'use client'

import { Providers } from '../providers';
import dynamic from 'next/dynamic'

const Page = dynamic(() => import('../../src/web/pages/adaptation'), { ssr: false })

export function AdaptationClient() {
  return <Providers><Page /></Providers>
}
