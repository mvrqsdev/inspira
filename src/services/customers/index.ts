'use server'

import { prisma } from '@/lib/db'
import { z } from 'zod'
import * as CustomerTypes from './types'
import * as CustomerSchemas from './schema'
import type { CustomerContextType } from '@/store/customer'

export interface CustomerContextExtendedType extends CustomerContextType {
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  country: string
  postalCode: string
}
export interface CustomersByUserIdData {
  items: CustomerContextExtendedType[]
  meta: {
    count: number
  }
}

export async function getByUserId(
  userId: z.infer<typeof CustomerSchemas.getByUserIdSchema>,
): Promise<CustomersByUserIdData> {
  const { customers } = await prisma.$transaction(async (tx) => {
    const fetchCustomer = await tx.customer.findMany({
      where: {
        status: 'Active',
        Users: {
          some: {
            userId,
          },
        },
      },
      select: {
        Details: true,
        id: true,
        name: true,
        logo: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    const customers: CustomerContextExtendedType[] = []
    for (const customer of fetchCustomer) {
      const userCustomer = await tx.customerUser.findFirst({
        where: {
          userId,
          customerId: customer.id,
        },
      })

      if (!userCustomer) {
        throw new Error(
          `Falha ao encontrar o usuário na empresa ${customer.name}`,
        )
      }
      const myRole = userCustomer.status

      customers.push({
        id: customer.id,
        name: customer.name,
        logo: customer.logo,
        myRole,
        email: customer.Details?.email ?? '',
        cnpj: customer.Details?.cnpj ?? '',
        status: customer.status,
        city: customer.Details?.city ?? '',
        complement: customer.Details?.complement ?? '',
        country: customer.Details?.country ?? '',
        neighborhood: customer.Details?.neighborhood ?? '',
        number: customer.Details?.number ?? '',
        state: customer.Details?.state ?? '',
        postalCode: customer.Details?.postalCode ?? '',
        street: customer.Details?.street ?? '',
      })
    }

    return {
      customers,
    }
  })

  return {
    items: customers,
    meta: {
      count: customers.length,
    },
  }
}
