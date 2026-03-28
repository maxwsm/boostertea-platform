'use client'

import { Providers } from '../providers';
import dynamic from 'next/dynamic'


const Page = dynamic(() => import('../../src/web/pages/privacy'), { ssr: false })

export default function PrivacyPage() {
  return <Providers><Page /></Providers>
}
