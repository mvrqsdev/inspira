import { z } from 'zod'

export const getByCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const getContextsByIdSchema = z.string().cuid()

export const setActiveCustomerSchema = z.object({
  userId: z.string().cuid(),
  customerId: z.string().cuid(),
})
