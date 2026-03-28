'use client'

import dynamic from 'next/dynamic'
import { Providers } from '../providers'

const Page = dynamic(() => import('../../src/web/pages/account'), { ssr: false })

export function AccountClient() {
  return (
    <Providers>
      <Page />
    </Providers>
  )
}
