'use client'

import dynamic from 'next/dynamic'


const Page = dynamic(() => import('../../src/web/pages/blog'), { ssr: false })

export default function BlogPage() {
  return <Page />
}
