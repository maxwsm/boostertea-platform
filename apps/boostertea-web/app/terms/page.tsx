'use client'

import { Providers } from '../providers';
import dynamic from 'next/dynamic'


const Page = dynamic(() => import('../../src/web/pages/terms'), { ssr: false })

export default function TermsPage() {
  return <Providers><Page /></Providers>
}
