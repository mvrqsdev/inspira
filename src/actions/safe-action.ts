import { auth } from '@/auth'
import { logger } from '@/lib/utils'
import { rateLimiter } from '@/lib/rate-limiter'
import { z } from 'zod'
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action'
import { prisma } from '@/lib/db'

export enum PermissionStrategy {
  ALL = "ALL",
  SOME = "SOME"
}

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    if(error instanceof Error){
      return error.message
    }

    return DEFAULT_SERVER_ERROR_MESSAGE
  }
})

export const actionClientWithMeta = createSafeActionClient({
  handleServerError(error){
    if(error instanceof Error){
      return error.message
    }
    return DEFAULT_SERVER_ERROR_MESSAGE
  },
  defineMetadataSchema() {
    return z.object({
      name: z.string(),
      requeriments: z.object({
        strategy: z.enum(['ALL','SOME']),
        permissions: z.array(z.string())
      }).optional()
    })
  }
})
.use(async ({next, metadata}) => {
  const {headers} = await import('next/headers')
  const ip = (await headers()).get('x-forwarded-for') as string
  const { success, remaining} = await rateLimiter(
    `${ip}-${metadata.name}`
  )

  return next({
    ctx: {
      ratelimit: {
        remaining,
        success
      }
    }
  })
})
.use(async ({next, clientInput, metadata, ctx: {
  ratelimit
}}) => {
  const result = await next()

  if(process.env.NODE_ENV === 'development'){
    logger("Input ->", clientInput)
    logger("Result ->", result.data)
    logger("Metadata ->", metadata)
    logger('RateLimit ->', ratelimit)
  }
  if(!ratelimit.success){
    throw new Error('Excedeu o limite de requisições... Tente novamente mais tarde!')
  }

  return result
})

export const authActionClient = actionClientWithMeta
.use( async ({next, metadata}) => {
  const authenticated = await auth()
  if(!authenticated?.user){
    throw new Error('Unauthorized')
  }

  const { user } = authenticated
  if(metadata.requeriments){
    const { permissions, strategy} = metadata.requeriments
    let hasPermissions = false
    if(strategy === 'ALL'){
      hasPermissions = permissions.every((permission) => user.permissions.includes(permission))
    }
    if(strategy === 'SOME'){
      hasPermissions = permissions.some((permission) => user.permissions.includes(permission))
    }

    if(!hasPermissions){
      throw new Error('Você não tem permissão para realizar esta ação')
    }
  }

  return next({ctx: { user }})
})

export const authCustomerActionClient = authActionClient
.use( async ({next, ctx: {user}}) => {
  const customer = await prisma.user.findFirstOrThrow({
    where: {
      id: user.id,
    },
    select: {
      ActiveCustomer: true,
    }
  })

  const activeCustomer = customer.ActiveCustomer

  if(!activeCustomer || activeCustomer.status === 'Inactive'){
    throw new Error('Você não tem acesso a este cliente ou o cliente esta Inativo')
  }

  return next({ctx: {customer: activeCustomer}})
})