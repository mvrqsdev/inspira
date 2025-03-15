import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Provider } from '@/providers'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({
  variable: '--font-inter-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Inspira Gestão',
  description: 'Portal de Gestão',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  dayjs.locale('pt-br')
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <Provider>{children}</Provider>
        <Toaster richColors />
      </body>
    </html>
  )
}
