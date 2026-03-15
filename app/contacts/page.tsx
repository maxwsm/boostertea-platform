'use client'

import dynamic from 'next/dynamic'


const Page = dynamic(() => import('../../src/web/pages/contacts'), { ssr: false })

export default function ContactsPage() {
  return <Page />
}
