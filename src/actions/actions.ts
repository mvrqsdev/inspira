'use server'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { actionClientWithMeta } from './safe-action'

export const firstAccessSchema = zfd
  .formData({
    name: z
      .string()
      .min(1, { message: 'O nome é obrigatório' })
      .transform((name) => {
        return name
          .trim()
          .split(' ')
          .map((word) => {
            return word[0]
              .toLocaleUpperCase()
              .concat(word.substring(1).toLocaleLowerCase())
          })
          .join(' ')
      }),
    email: z
      .string()
      .min(1, { message: 'O email não pode ser vazio' })
      .email({ message: 'Precisa ser informado um e-mail válido.' }),
    password: z
      .string()
      .min(12, { message: 'A senha deve ter no mínimo 12 caracteres.' })
      .regex(/[A-Z]/, {
        message: 'A senha deve conter pelo menos uma letra maiúscula.',
      })
      .regex(/[a-z]/, {
        message: 'A senha deve conter pelo menos uma letra minúscula.',
      })
      .regex(/[0-9]/, { message: 'A senha deve conter pelo menos um número.' })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'A senha deve conter pelo menos um caractere especial.',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'], // Caminho do erro para o campo confirmPassword
  })

export const empresa = zfd.formData({
  customerImage: z.string().base64(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  customerPhone: z.string(),
  customerCnpj: z.string(),
})

export const firstAccessAction = actionClientWithMeta.metadata({
  name: 'Primeiro Acesso',
})
