'use client'

import dynamic from 'next/dynamic'

const ProductsPage = dynamic(() => import('../../src/web/pages/products'), { ssr: false })

export function CatalogClient() {
  return <ProductsPage />
}
