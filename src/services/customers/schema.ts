import { z } from 'zod'

export const getByUserIdSchema = z.string().cuid()
