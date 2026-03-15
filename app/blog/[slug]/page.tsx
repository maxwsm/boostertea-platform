'use client'

import dynamic from 'next/dynamic'


const Page = dynamic(() => import('../../../src/web/pages/blog-post'), { ssr: false })

export default function BlogPostPage() {
  return <Page />
}
