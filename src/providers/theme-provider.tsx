'use client'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  dayjs.locale('pt-br')
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
