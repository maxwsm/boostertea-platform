'use client'

import dynamic from 'next/dynamic'

const Page = dynamic(() => import('../../src/web/pages/login'), { ssr: false })

export function LoginClient() {
  return <Page />
}
