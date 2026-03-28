'use client'

import dynamic from 'next/dynamic'


const Page = dynamic(() => import('../../src/web/pages/mlm'), { ssr: false })

export default function MLMPage() {
  return <Page />
}
