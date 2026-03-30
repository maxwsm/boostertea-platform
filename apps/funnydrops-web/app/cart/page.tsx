'use client'

import dynamic from 'next/dynamic'


const Page = dynamic(() => import('../../src/web/pages/cart'), { ssr: false })

export default function CartPage() {
  return <Page />
}
