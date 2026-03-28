'use client'

import dynamic from 'next/dynamic'

const Page = dynamic(() => import('../../src/web/pages/checkout'), { ssr: false })

export function CheckoutClient() {
  return <Page />
}
