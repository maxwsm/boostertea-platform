import type { Metadata } from 'next'
import { RegisterClient } from './client'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function RegisterPage() {
  return <RegisterClient />
}
