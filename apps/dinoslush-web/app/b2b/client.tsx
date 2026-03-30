'use client'

import dynamic from 'next/dynamic'

const Page = dynamic(() => import('../../src/web/pages/b2b'), { ssr: false })

export function B2BClient() {
  return <Page />
}
