import type { Metadata } from 'next'
import { ContactsClient } from './client'

export const metadata: Metadata = {
  title: 'Контакти BoosterTea — Адреса, телефон, email',
  description: "Зв'яжіться з BoosterTea: адреса у Львові, телефон, email, Instagram, TikTok, Telegram для B2B.",
}

export default function ContactsPage() {
  return <ContactsClient />
}
