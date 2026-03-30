'use client'

import dynamic from 'next/dynamic'

const Page = dynamic(() => import('../../src/web/pages/contacts'), { ssr: false })

export function ContactsClient() {
  return <Page />
}
