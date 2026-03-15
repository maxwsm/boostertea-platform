'use client'

import dynamic from 'next/dynamic'


const Page = dynamic(() => import('../../src/web/pages/register'), { ssr: false })

export default function RegisterPage() {
  return <Page />
}
