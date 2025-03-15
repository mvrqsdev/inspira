'use client'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

import { ReactNode, useState } from 'react'
import { ThemeProvider } from '@/providers/theme-provider'
import { SessionProvider } from 'next-auth/react'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SearchProvider } from './search-provider'
import { TooltipProvider } from '@/components/ui/tooltip'

export function Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  dayjs.locale('pt-br')

  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <SessionProvider>
              <SearchProvider>{children}</SearchProvider>
            </SessionProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </NuqsAdapter>
  )
}
