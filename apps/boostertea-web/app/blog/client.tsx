'use client'

import { Providers } from '../providers';
import dynamic from 'next/dynamic'

const Page = dynamic(() => import('../../src/web/pages/blog'), { ssr: false })

export function BlogClient() {
  return <Providers><Page /></Providers>
}
