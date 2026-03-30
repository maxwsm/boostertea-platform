'use client'

import { Providers } from '../providers';
import dynamic from 'next/dynamic'

const Page = dynamic(() => import('../../src/web/pages/login'), { ssr: false })

export function LoginClient() {
  return <Providers><Page /></Providers>
}
