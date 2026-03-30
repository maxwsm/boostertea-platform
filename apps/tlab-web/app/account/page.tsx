import type { Metadata } from 'next'
import { AccountClient } from './client'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AccountPage() {
  return <AccountClient />
}
