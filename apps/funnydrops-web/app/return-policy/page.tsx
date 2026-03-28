'use client'

import dynamic from 'next/dynamic'


const Page = dynamic(() => import('../../src/web/pages/return-policy'), { ssr: false })

export default function ReturnPolicyPage() {
  return <Page />
}
