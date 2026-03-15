'use client'

import dynamic from 'next/dynamic'


const Page = dynamic(() => import('../../src/web/pages/order-success'), { ssr: false })

export default function OrderSuccessPage() {
  return <Page />
}
