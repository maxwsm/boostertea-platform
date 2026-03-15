import type { Metadata } from 'next'
import { CheckoutClient } from './client'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  return <CheckoutClient />
}
