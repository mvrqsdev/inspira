'use client'
import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  IconArrowRightDashed,
  IconDeviceLaptop,
  IconMoon,
  IconSun,
} from '@tabler/icons-react'
import { useSearch } from '@/providers/search-provider'
import { useTheme } from 'next-themes'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { getSidebarData } from './sidebar-data'
import { ScrollArea } from '../ui/scroll-area'
import { useSession } from 'next-auth/react'

export function CommandMenu() {
  const { data } = useSession()
  const navigate = useRouter()
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen],
  )

  const menus = useMemo(() => {
    return getSidebarData({ permissions: data?.user.permissions ?? [] })
  }, [data?.user.permissions])

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Escreva um comando ou pesquise..." />
      <CommandList>
        <ScrollArea type="hover" className="h-72 pr-1">
          <CommandEmpty>Nenhum resultado encontrado</CommandEmpty>
          {menus &&
            menus.map((group) => {
              if (group.menus.length > 0) {
                return (
                  <CommandGroup key={group.title} heading={group.title}>
                    {group.menus.map((navItem, i) => {
                      if (!navItem.submenu)
                        return (
                          <CommandItem
                            key={`${navItem.url}-${i}`}
                            value={navItem.title}
                            className="cursor-pointer"
                            onSelect={() => {
                              runCommand(() => {
                                if (navItem.url) {
                                  navigate.push(navItem.url ? navItem.url : '#')
                                }
                              })
                            }}
                          >
                            <div className="mr-2 flex h-4 w-4 items-center justify-center">
                              <IconArrowRightDashed className="size-2 text-muted-foreground/80" />
                            </div>
                            {navItem.title}
                          </CommandItem>
                        )

                      return navItem.submenu?.map((subItem, i) => (
                        <CommandItem
                          key={`${subItem.url}-${i}`}
                          value={subItem.title}
                          className="cursor-pointer"
                          onSelect={() => {
                            runCommand(() => navigate.push(subItem.url))
                          }}
                        >
                          <div className="mr-2 flex h-4 w-4 items-center justify-center">
                            <IconArrowRightDashed className="size-2 text-muted-foreground/80" />
                          </div>
                          {subItem.title}
                        </CommandItem>
                      ))
                    })}
                  </CommandGroup>
                )
              }
              return null
            })}
          <CommandSeparator />
          <CommandGroup heading="Tema">
            <CommandItem
              className="cursor-pointer"
              onSelect={() => runCommand(() => setTheme('light'))}
            >
              <IconSun /> <span>Claro</span>
            </CommandItem>
            <CommandItem
              className="cursor-pointer"
              onSelect={() => runCommand(() => setTheme('dark'))}
            >
              <IconMoon className="scale-90" />
              <span>Escuro</span>
            </CommandItem>
            <CommandItem
              className="cursor-pointer"
              onSelect={() => runCommand(() => setTheme('system'))}
            >
              <IconDeviceLaptop />
              <span>Sistema</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}
