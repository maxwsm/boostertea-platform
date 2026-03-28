'use client'

import { Providers } from '../providers';
import dynamic from 'next/dynamic'

const Page = dynamic(() => import('../../src/web/pages/checkout'), { ssr: false })

export function CheckoutClient() {
  return <Providers><Page /></Providers>
}
