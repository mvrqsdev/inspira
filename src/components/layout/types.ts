type BaseNavItem = {
  title: string
  badge?: string
  icon?: React.ElementType
  role?: string[]
  permissions?: string[]
}

type NavLink = BaseNavItem & {
  url?: string
  submenu?: never
  permissions?: string[]
}

type NavCollapsible = BaseNavItem & {
  submenu: (BaseNavItem & { url: string; permissions?: string[] })[]
  url?: never
  permissions?: string[]
}

type NavItem = NavCollapsible | NavLink

type NavGroup = {
  title: string
  menus: NavItem[]
}

export type { NavGroup, NavItem, NavCollapsible, NavLink, BaseNavItem }
