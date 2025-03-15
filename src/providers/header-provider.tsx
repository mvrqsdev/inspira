'use client'
import { createContext, useState, ReactNode } from 'react'

export interface BreadcrumbItemsProps {
  label: string
  path?: string
  principal?: boolean
}

interface HeaderContextProps {
  breadcrumb: BreadcrumbItemsProps[]
  setBreadcrumb: React.Dispatch<React.SetStateAction<BreadcrumbItemsProps[]>>
}

export const HeaderContext = createContext<HeaderContextProps | undefined>(
  undefined,
)

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItemsProps[]>([])

  return (
    <HeaderContext.Provider value={{ breadcrumb, setBreadcrumb }}>
      {children}
    </HeaderContext.Provider>
  )
}
