'use client'

import dynamic from 'next/dynamic'


const Page = dynamic(() => import('../../src/web/pages/certificates'), { ssr: false })

export default function CertificatesPage() {
  return <Page />
}
