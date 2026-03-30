'use client'

import dynamic from 'next/dynamic'

const NotFound = dynamic(() => import('../src/web/pages/404'), { ssr: false })

export default function NotFoundPage() {
  return <NotFound />
}
