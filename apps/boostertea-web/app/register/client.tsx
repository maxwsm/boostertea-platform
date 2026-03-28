'use client'

import { Providers } from '../providers';
import dynamic from 'next/dynamic'

const Page = dynamic(() => import('../../src/web/pages/register'), { ssr: false })

export function RegisterClient() {
  return <Providers><Page /></Providers>
}
