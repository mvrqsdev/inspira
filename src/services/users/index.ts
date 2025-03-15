'use server'

import { prisma } from '@/lib/db'

import * as bcrypt from 'bcrypt-ts'
import { z } from 'zod'

import * as UserSchemas from './schema'
import * as UserTypes from './types'

export async function getByCredentials({
  email,
  password,
}: z.infer<typeof UserSchemas.getByCredentialsSchema>): Promise<
  (UserTypes.User & { password: string }) | null
> {
  let user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      ...UserTypes.select,
      password: true,
      activeCustomerId: true,
    },
  })

  if (!user) {
    return null
  }

  if (!user.ActiveCustomer) {
    const userCustomer = await prisma.customerUser.findFirst({
      where: {
        userId: user.id,
        Customer: {
          status: 'Active',
        },
      },
    })

    if (!userCustomer) {
      return null
    }

    user = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        activeCustomerId: userCustomer.customerId,
      },
      select: {
        ...UserTypes.select,
        password: true,
        activeCustomerId: true,
      },
    })
  }

  if (user.ActiveCustomer?.status === 'Inactive') {
    const userCustomer = await prisma.customerUser.findFirst({
      where: {
        userId: user.id,
        Customer: {
          status: 'Active',
        },
      },
    })

    if (!userCustomer) {
      return null
    }

    user = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        activeCustomerId: userCustomer.customerId,
      },
      select: {
        ...UserTypes.select,
        password: true,
        activeCustomerId: true,
      },
    })
  }

  const matchPassword = await bcrypt.compare(password, user.password)
  if (matchPassword) {
    return {
      ...user,
    }
  }

  return null
}

interface getContextsByIdData {
  user: {
    sub: string
    name: string
    email: string
    image: string
    permissions: string[]
    status: string
  }
  customer: {
    id: string
    name: string
    logo: string
    email: string
    cnpj: string
    myRole: string
    status: string
  }
}

export async function getContextsById(
  userId: z.infer<typeof UserSchemas.getContextsByIdSchema>,
): Promise<getContextsByIdData> {
  const { user, customer } = await prisma.$transaction(
    async (tx): Promise<getContextsByIdData> => {
      const user = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: UserTypes.select,
      })

      if (!user) {
        throw new Error('Usuário não encontrado')
      }

      const userCustomer = await tx.customerUser.findFirst({
        where: {
          userId: user.id,
          customerId: user.ActiveCustomer?.id ?? undefined,
        },
      })

      if (!userCustomer) {
        throw new Error(
          `Falha ao encontrar ${user.name} no cliente ${customer.name}`,
        )
      }

      return {
        user: {
          sub: user.id,
          name: user.name,
          image: user.image ?? '',
          email: user.email,
          status: user.status,
          permissions: user.Permissions.map((item) => item.slug),
        },
        customer: {
          id: user.ActiveCustomer?.id ?? '',
          name: user.ActiveCustomer?.name ?? '',
          logo: user.ActiveCustomer?.logo ?? '',
          myRole: userCustomer?.status,
          status: user.ActiveCustomer?.status ?? '',
          email: user.ActiveCustomer?.Details?.email ?? '',
          cnpj: user.ActiveCustomer?.Details?.cnpj ?? '',
        },
      }
    },
  )
  return {
    user,
    customer,
  }
}

export async function setActiveCustomer({
  userId,
  customerId,
}: z.infer<typeof UserSchemas.setActiveCustomerSchema>) {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      activeCustomerId: customerId,
    },
    select: UserTypes.select,
  })

  return {
    user,
  }
}
