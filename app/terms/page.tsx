'use client'

import dynamic from 'next/dynamic'


const Page = dynamic(() => import('../../src/web/pages/terms'), { ssr: false })

export default function TermsPage() {
  return <Page />
}
