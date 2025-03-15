'use client'

import { z } from 'zod'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const CustomerSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  logo: z.string(),
  email: z.string().email(),
  cnpj: z.string(),
  status: z.string(),
  myRole: z.string(),
})

export type CustomerContextType = z.infer<typeof CustomerSchema>

type ActionProps = {
  setCustomer: (customer: CustomerContextType) => void
}

type StoreProps = {
  state: {
    customer: CustomerContextType
  }
  actions: ActionProps
  _hasHydrated: boolean // Estado de hidratação
}

export const useCustomer = create<StoreProps>()(
  persist(
    (set) => ({
      state: {
        customer: {
          id: '',
          name: '',
          logo: '',
          email: '',
          cnpj: '',
          status: '',
          myRole: '',
        },
      },
      actions: {
        setCustomer: (customer) =>
          set((state) => ({
            state: {
              customer: {
                ...state.state.customer,
                ...customer,
              },
            },
          })),
      },
      _hasHydrated: false, // Inicialmente, o estado não está hidratado
    }),
    {
      name: 'customer-storage', // Nome da chave no localStorage
      storage: createJSONStorage(() => localStorage), // Usar localStorage
      partialize: (state) => ({ state: state.state }), // Persistir apenas o estado
      onRehydrateStorage: () => (state) => {
        // Quando o estado é recuperado do localStorage, marcar como hidratado
        if (state) {
          state._hasHydrated = true
        }
      },
    },
  ),
)

// Função para recuperar o estado do localStorage manualmente
// export const hydrateCustomerStore = () => {
//   const storedState = localStorage.getItem('customer-storage')
//   if (storedState) {
//     const parsedState = JSON.parse(storedState)
//     useCustomer.setState({ state: parsedState.state, _hasHydrated: true })
//   }
// }
