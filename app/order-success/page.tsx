import type { Metadata } from 'next'
import { OrderSuccessClient } from './client'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function OrderSuccessPage() {
  return <OrderSuccessClient />
}
