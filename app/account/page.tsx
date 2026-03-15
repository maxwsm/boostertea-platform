'use client'

import dynamic from 'next/dynamic'


const Page = dynamic(() => import('../../src/web/pages/account'), { ssr: false })

export default function AccountPage() {
  return <Page />
}
