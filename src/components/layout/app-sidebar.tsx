'use client'
import { signOut, useSession } from 'next-auth/react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { TeamSwitcher } from '@/components/layout/team-switcher'
import { getSidebarData } from './sidebar-data'
import { useEffect } from 'react'
import { useUserAuth, type UserContextType } from '@/store/user'
import { useSocket } from '@/hooks/use-socket'
import { useCustomer, type CustomerContextType } from '@/store/customer'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

interface AppSidebarProps {
  user: UserContextType
  customer: CustomerContextType
}

export function AppSidebar({
  user,
  customer,
  ...props
}: AppSidebarProps & React.ComponentProps<typeof Sidebar>) {
  const {
    actions: { setUser },
    state: { user: userContext },
  } = useUserAuth()

  const {
    state: { customer: customerContext },
  } = useCustomer()

  const { data: menus } = useQuery({
    queryKey: ['fetchMenu', userContext, customerContext, customer],
    queryFn: async () => {
      return getSidebarData({
        permissions: userContext ? userContext.permissions : user.permissions,
        myRole: customerContext ? customerContext.myRole : customer.myRole,
      })
    },
    placeholderData: keepPreviousData,
  })

  const { update } = useSession()

  useEffect(() => {
    setUser(user)
  }, [user, setUser])

  const { socket } = useSocket({ userId: user.sub })

  useEffect(() => {
    if (!socket) return

    socket.on(`user-update-${user.sub}`, async (content: UserContextType) => {
      setUser(content, update)
      if (content.status === 'Inactive') {
        signOut()
      }
    })

    return () => {
      socket.off(`user-update-${user.sub}`)
    }
  }, [socket, user, update, setUser])

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <TeamSwitcher customer={customer} />
      </SidebarHeader>
      <SidebarContent>
        {menus &&
          menus.map((props, index) => {
            if (props.menus.length > 0) {
              return <NavGroup key={`${props.menus}-${index}`} {...props} />
            }
            return null
          })}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
