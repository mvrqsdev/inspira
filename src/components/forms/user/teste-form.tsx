'use client'
import React from 'react'
import { ImageCropper } from '@/components/ui/image-cropper'
import { cn } from '@/lib/utils'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { testeAction } from './action'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const testeSchema = z.object({
  avatar: z.string().regex(/^data:image\/(png|jpeg|jpg);base64,/, {
    message: 'Formato de Imagem Inválido',
  }),
})

export function InviteUserForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const { form, handleSubmitWithAction } = useHookFormAction(
    testeAction,
    zodResolver(testeSchema),
    {
      formProps: {
        defaultValues: {
          avatar: '',
        },
      },
      actionProps: {
        onError: ({ error }) => {
          console.log(error)
        },
      },
    },
  )

  return (
    <Form {...form}>
      <form
        id="teste-form"
        onSubmit={handleSubmitWithAction}
        className={cn(
          'flex flex-col justify-center gap-2 px-6 pb-1',
          className,
        )}
        {...props}
      >
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col gap-1.5">
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <ImageCropper
                    value={field.value}
                    onChange={field.onChange}
                    aspectRatio={1}
                  >
                    {field.value ? (
                      <Image
                        src={field.value} // Adiciona o prefixo de volta
                        width={100}
                        height={100}
                        className="w-[300px]"
                        alt="Imagem cortada"
                      />
                    ) : (
                      <Button type="button">
                        Clique aqui para selecionar uma imagem e cortá-la
                      </Button>
                    )}
                  </ImageCropper>
                </FormControl>
                <pre>{JSON.stringify(field.value, null, 2)}</pre>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <Button type="submit" form="teste-form">
          Salvar
        </Button>
      </form>
    </Form>
  )
}
