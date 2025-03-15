import { Card, CardContent } from '@/components/ui/card'
import { LoginForm } from '@/components/forms/user/login-form'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10 ">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col">
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <LoginForm />
              <div className="relative hidden bg-muted md:block ">
                <Image
                  width={1600}
                  height={900}
                  src="/login-image.jpg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary mt-6">
            Desenvolvido por <a href="#">Pedro Marques</a>.
          </div>
        </div>
      </div>
    </div>
  )
}
