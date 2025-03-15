'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ModeToggle } from '@/components/ui/mode-toggle'

import { loginAction } from '@/actions/user'
import { loginSchema } from '@/actions/user/schema'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const { form, handleSubmitWithAction } = useHookFormAction(
    loginAction,
    zodResolver(loginSchema),
    {
      actionProps: {
        onError: ({ error }) => {
          if (error) {
            toast.error('☹️ Credenciais Inválidas', {
              description: 'Verifique seu e-mail e senha.',
              duration: 1500,
              position: 'bottom-center',
            })
          }
        },
        onSuccess: () => {
          toast.success('🎉 Logado com Sucesso', {
            description: 'Bem-vindo ao sistema de Gestão da Medvia.',
            duration: 1500,
            position: 'bottom-center',
          })
          window.location.href = '/dashboard'
        },
      },
      formProps: {
        defaultValues: {
          email: '',
          password: '',
        },
      },
    },
  )
  return (
    <Form {...form}>
      <form
        id="login-user-form"
        onSubmit={handleSubmitWithAction}
        className={cn('p-6 md:p-8 relative', className)}
        {...props}
      >
        <div className="absolute top-2 right-2">
          <ModeToggle type="button" />
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">Bem-vindo</h1>
            <p className="text-balance text-muted-foreground">
              Faça login com sua conta da Inspira
            </p>
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1.5">
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@exemplo.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1.5">
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input placeholder="Sua senha" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="w-full" form="login-user-form" type="submit">
            Login
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              OU
            </span>
          </div>

          <div className="text-center text-sm ">
            <a href="#">Recupere sua conta</a>
          </div>
        </div>
      </form>
    </Form>
  )
}
