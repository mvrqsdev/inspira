import { Prisma } from '@prisma/client'
import * as UserTypes from '@/services/users/types'
export const select = {
  id: true,
  name: true,
  logo: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  Details: true,
  Metadatas: true,
  Users: {
    select: {
      status: true,
      User: {
        select: UserTypes.select,
      },
    },
  },
  Works: true,
  Exams: true,
  Patients: true,
  PatientsExams: true,
} satisfies Prisma.CustomerSelect

export type Customer = Prisma.CustomerGetPayload<{ select: typeof select }>
export type Where = Prisma.CustomerWhereInput
export type OrderBy = Prisma.CustomerOrderByWithRelationInput
