import type { Metadata } from 'next'
import { Providers } from './providers'
import { ColorModeScript } from '@chakra-ui/react'

export const metadata: Metadata = {
  title: 'CyberQP - Privileged Access Management',
  description: 'Privileged Access Management Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorModeScript initialColorMode="light" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

