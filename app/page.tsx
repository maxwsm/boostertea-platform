'use client'

import dynamic from 'next/dynamic'

// Force CSR - no SSR for the main app
const Home = dynamic(() => import('../src/web/pages/index'), { 
  ssr: false,
  loading: () => (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0D0D0D',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ color: '#9FD356', fontSize: '18px' }}>Завантаження...</div>
    </div>
  )
})

export default function HomePage() {
  return <Home />
}
