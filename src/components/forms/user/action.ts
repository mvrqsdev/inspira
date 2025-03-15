'use server'

import { actionClient } from '@/actions/safe-action'
import { join } from 'node:path'
import { writeFile, mkdir, unlink } from 'node:fs/promises'
import { z } from 'zod'

const base64Regex = /^data:image\/(png|jpeg|jpg);base64,/
const testeSchema = z.object({
  avatar: z
    .string()
    .regex(base64Regex, { message: 'Formato de imagem inválido' })
    .refine(
      (value) => {
        const match = value.match(base64Regex)
        return !!match // Retorna true se o formato estiver correto
      },
      { message: 'A imagem deve estar no formato PNG, JPEG ou JPG' },
    ),
})

export const testeAction = actionClient
  .schema(testeSchema)
  .action(async ({ parsedInput: { avatar } }) => {
    const attachmentsDir = join(process.cwd(), 'public/uploads')
    await mkdir(attachmentsDir, { recursive: true })

    const base64Data = avatar.replace(base64Regex, '')
    const buffer = Buffer.from(base64Data, 'base64')
    const fileType = avatar.split(';')[0].split('/')[1]

    const fileName = `${crypto.randomUUID()}.${fileType}`
    const filePath = join(process.cwd(), 'public/uploads', fileName)
    await writeFile(filePath, buffer)
  })
