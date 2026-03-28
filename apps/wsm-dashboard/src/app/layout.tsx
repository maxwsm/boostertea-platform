import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'WSM Neural Command Center',
  description: 'Enterprise ERP & Omnichannel AI Dashboard',
};

import { headers } from 'next/headers'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const deviceOs = headersList.get('x-device-os') || 'desktop';
  const deviceTier = headersList.get('x-device-tier') || 'cinematic-3d';

  return (
    <html lang="uk" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#0A0A0A] text-white antialiased`} data-device-os={deviceOs} data-device-tier={deviceTier}>
        {children}
      </body>
    </html>
  );
}
