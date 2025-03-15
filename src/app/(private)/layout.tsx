import { cookies } from 'next/headers'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { auth } from '@/auth'

import { cn } from '@/lib/utils'
import * as UserServices from '@/services/users'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookiesStore = await cookies()
  const defaultOpen = cookiesStore.get('sidebar_state')?.value
  const session = await auth()

  if (session) {
    const { user: userAuth } = session
    const { user, customer } = await UserServices.getContextsById(userAuth.sub)
    return (
      <SidebarProvider defaultOpen={defaultOpen === 'true'}>
        <AppSidebar user={user} customer={customer} />
        <div
          id="content"
          className={cn(
            'ml-auto w-full max-w-full',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'transition-[width] duration-200 ease-linear',
            'flex h-svh flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh',
          )}
        >
          {children}
        </div>
        {/* <GlobalSheets /> */}
      </SidebarProvider>
    )
  }
}
