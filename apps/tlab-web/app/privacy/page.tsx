'use client'

import dynamic from 'next/dynamic'


const Page = dynamic(() => import('../../src/web/pages/privacy'), { ssr: false })

export default function PrivacyPage() {
  return <Page />
}
