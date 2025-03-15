'use client'

import * as UserServices from '@/services/customers'
import * as React from 'react'
import { ChevronsUpDown, Plus } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useUserAuth } from '@/store/user'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  // hydrateCustomerStore,
  useCustomer,
  type CustomerContextType,
} from '@/store/customer'
import { setActiveCustomerAction } from '@/actions/user'
import { signOut } from 'next-auth/react'

export function TeamSwitcher({
  customer: initialCustomer,
}: {
  customer: CustomerContextType
}) {
  const [selectedCustomer, setSelectedCustomer] =
    React.useState(initialCustomer)
  const { isMobile } = useSidebar()
  const {
    state: { user },
  } = useUserAuth()

  const {
    actions: { setCustomer },
  } = useCustomer()

  const { data, isLoading } = useQuery<UserServices.CustomersByUserIdData>({
    queryKey: ['teamSwitcher', user],
    queryFn: async () => {
      return await UserServices.getByUserId(user.sub)
    },
    placeholderData: keepPreviousData,
  })

  React.useEffect(() => {
    if (!isLoading && data) {
      const { items } = data
      if (items.length === 0) {
        signOut()
        localStorage.removeItem('customer-storage')
        window.location.href = '/login'
      }
    }
  }, [data, isLoading])

  React.useEffect(() => {
    setCustomer(initialCustomer)
  }, [setCustomer, initialCustomer])

  const activeTeam = data
    ? data.items.find((item) => item.id === selectedCustomer.id)
    : initialCustomer

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={activeTeam?.logo ? activeTeam.logo : undefined}
                      alt={
                        activeTeam?.name
                          ? activeTeam.name
                          : initialCustomer.name
                      }
                    />
                    <AvatarFallback className="rounded-lg">
                      {(activeTeam?.name
                        ? activeTeam.name
                        : initialCustomer.name
                      )
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent
                  align="center"
                  side="right"
                  className=" flex flex-col"
                >
                  <span>
                    {activeTeam?.name ? activeTeam.name : initialCustomer.name}
                  </span>
                </TooltipContent>
              </Tooltip>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam?.name ? activeTeam.name : initialCustomer.name}
                </span>
                <span className="truncate text-xs">
                  {activeTeam?.cnpj ? activeTeam.cnpj : initialCustomer.cnpj}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Empresas
            </DropdownMenuLabel>
            {data &&
              data.items
                .filter((team) => team.id !== activeTeam?.id)
                .map((team) => (
                  <DropdownMenuItem
                    key={team.id}
                    onClick={async () => {
                      setCustomer({
                        id: team.id,
                        email: team.email,
                        cnpj: team.cnpj,
                        logo: team.logo,
                        name: team.name,
                        status: team.status,
                        myRole: team.myRole,
                      })
                      setSelectedCustomer({
                        id: team.id,
                        email: team.email,
                        cnpj: team.cnpj,
                        logo: team.logo,
                        name: team.name,
                        status: team.status,
                        myRole: team.myRole,
                      })
                      await setActiveCustomerAction({
                        userId: user.sub,
                        customerId: team.id,
                      })
                    }}
                    className="gap-2 p-2 truncate"
                  >
                    {team.logo ? (
                      <Image
                        src={team.logo}
                        className="flex aspect-square size-7 items-center justify-center rounded-sm border border-input bg-white p-0.5"
                        alt=""
                        width={180}
                        height={180}
                      />
                    ) : (
                      <div className="flex aspect-square size-7 items-center justify-center rounded-sm border border-input bg-white p-0.5"></div>
                    )}
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{team.name}</span>
                      <span className="truncate text-xs">{team.cnpj}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Novo Cliente
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
