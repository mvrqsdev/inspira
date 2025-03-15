import { z } from 'zod'
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: 'Você precisa preencher o campo login.',
    })
    .email({
      message: 'Informe um e-mail válido',
    })
    .nonempty({
      message: 'O campo não pode ser vazio.',
    }),
  password: z
    .string()
    .min(10, { message: 'A senha deve ter no mínimo 10 caracteres' })
    .nonempty({
      message: 'O campo não pode ser vazio.',
    })
    .regex(/[A-Z]/, {
      message: 'A senha deve conter pelo menos uma letra maiúscula',
    })
    .regex(/[a-z]/, {
      message: 'A senha deve conter pelo menos uma letra minúscula',
    })
    .regex(/\d/, { message: 'A senha deve conter pelo menos um número' })
    .regex(/[^A-Za-z0-9]/, {
      message: 'A senha deve conter pelo menos um caractere especial',
    }),
})

export const setActiveCustomerSchema = z.object({
  userId: z.string().cuid(),
  customerId: z.string().cuid(),
})
