'use client'

import { z } from 'zod'
import { create } from 'zustand'
import { Session } from 'next-auth'

export const UserSchema = z.object({
  sub: z.string().cuid(),
  name: z.string(),
  email: z.string().email(),
  image: z.string(),
  permissions: z.array(z.string()),
  status: z.string(),
})

export type UserContextType = z.infer<typeof UserSchema>

type ActionProps = {
  setUser: (
    user: UserContextType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateSession?: (data: any) => Promise<Session | null>,
  ) => Promise<void>
}

type StoreProps = {
  state: {
    user: UserContextType
  }
  actions: ActionProps
}

export const useUserAuth = create<StoreProps>((set) => ({
  state: {
    user: {
      sub: '',
      email: '',
      image: '',
      name: '',
      permissions: [''],
      status: '',
    },
  },
  actions: {
    setUser: async (user, updateSession) => {
      // Atualiza o estado do Zustand
      set((state) => ({
        state: {
          user: {
            ...state.state.user,
            ...user,
          },
        },
      }))

      // Se updateSession foi fornecido, atualiza a sessão do NextAuth.js
      if (updateSession) {
        await updateSession(user)
      }
    },
  },
}))
