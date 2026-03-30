'use client'

import { Providers } from '../providers';
import dynamic from 'next/dynamic'


const Page = dynamic(() => import('../../src/web/pages/certificates'), { ssr: false })

export default function CertificatesPage() {
  return <Providers><Page /></Providers>
}
