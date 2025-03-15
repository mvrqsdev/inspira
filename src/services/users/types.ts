import { Prisma } from '@prisma/client'
export const select = {
  id: true,
  image: true,
  name: true,
  email: true,
  status: true,
  master: true,
  createdAt: true,
  updatedAt: true,
  ActiveCustomer: {
    select: {
      id: true,
      name: true,
      logo: true,
      status: true,
      updatedAt: true,
      createdAt: true,
      Details: true,
    },
  },
  Permissions: {
    select: {
      slug: true,
    },
  },
} satisfies Prisma.UserSelect

export type User = Prisma.UserGetPayload<{ select: typeof select }>
export type Where = Prisma.UserWhereInput
export type OrderBy = Prisma.UserOrderByWithRelationInput
