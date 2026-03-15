'use client'

import dynamic from 'next/dynamic'

const Home = dynamic(() => import('../src/web/pages/index'), { ssr: false })

export default function HomePage() {
  return <Home />
}
