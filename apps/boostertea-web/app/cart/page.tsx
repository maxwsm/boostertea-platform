'use client'

import { Providers } from '../providers';
import dynamic from 'next/dynamic'


const Page = dynamic(() => import('../../src/web/pages/cart'), { ssr: false })

export default function CartPage() {
  return <Providers><Page /></Providers>
}
