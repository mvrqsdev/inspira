import { IconChartHistogram, IconUsers, IconLungs } from '@tabler/icons-react'
import {
  type NavCollapsible,
  type NavGroup,
  type NavItem,
  BaseNavItem,
} from './types'

interface getSidebarDataProps {
  permissions: string[]
  myRole?: string
}
export function getSidebarData({
  permissions = [],
  myRole = 'Employee',
}: getSidebarDataProps): NavGroup[] {
  const sidebarData: NavGroup[] = [
    {
      title: 'Principal',
      menus: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: IconChartHistogram,
        },
      ],
    },
    {
      title: 'Clínica',
      menus: [
        {
          title: 'Pacientes',
          icon: IconUsers,
          url: '#',
        },
        {
          title: 'Exames',
          icon: IconLungs,
          url: '#',
        },
        {
          title: 'Gestão',
          icon: IconUsers,
          submenu: [
            {
              title: 'Usuários',
              url: '#',
              role: ['Admin', 'Manager'],
            },
          ],
        },
      ],
    },
  ]

  // Função para filtrar os submenus
  const filterSubmenu = (submenu: BaseNavItem[] | undefined): BaseNavItem[] => {
    if (!submenu) return [] // Se não houver submenu, retorna um array vazio
    return submenu.filter(
      (item) =>
        (!item.permissions ||
          item.permissions.every((permission) =>
            permissions.includes(permission),
          )) &&
        (!item.role || item.role.includes(myRole)), // Verifica se o myRole está incluído na role do item
    )
  }

  // Função para filtrar os menus
  const filterMenu = (menu: NavItem): NavItem | null => {
    if ('submenu' in menu) {
      const filteredSubmenu = filterSubmenu(menu.submenu)
      if (filteredSubmenu.length > 0) {
        return { ...menu, submenu: filteredSubmenu } as NavCollapsible // Fazemos o cast explícito para NavCollapsible
      }
      return null
    } else if (menu.permissions || menu.role) {
      if (
        (!menu.permissions ||
          menu.permissions.some((permission) =>
            permissions.includes(permission),
          )) &&
        (!menu.role || menu.role.includes(myRole)) // Verifica se o myRole está incluído na role do menu
      ) {
        return menu
      }
      return null
    }
    return menu
  }

  // Filtrando os menus de cada grupo
  return sidebarData.map((group) => ({
    ...group,
    menus: group.menus
      .map(filterMenu)
      .filter((item): item is NavItem => item !== null), // Filtra os nulls e garante que o tipo de item seja NavItem
  }))
}
