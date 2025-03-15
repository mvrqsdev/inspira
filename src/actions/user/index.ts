'use server'

import { signIn } from '@/auth'
import { actionClient, authActionClient } from '../safe-action'
import * as UserSchemas from './schema'
import * as UserServices from '@/services/users'

export const loginAction = actionClient
  .schema(UserSchemas.loginSchema)
  .action(async ({ clientInput }) => {
    await signIn('credentials', clientInput)
  })

export const setActiveCustomerAction = authActionClient
  .schema(UserSchemas.setActiveCustomerSchema)
  .metadata({
    name: 'Selecionando Cliente Ativo',
  })
  .action(async ({ clientInput }) => {
    const { user } = await UserServices.setActiveCustomer(clientInput)

    return {
      user,
    }
  })
