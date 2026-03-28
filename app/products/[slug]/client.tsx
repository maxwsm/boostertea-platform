'use client'

import dynamic from 'next/dynamic'

const ProductDetailPage = dynamic(() => import('../../../src/web/pages/product-detail'), {
  ssr: false,
})

export function ProductClient() {
  return <ProductDetailPage />
}
