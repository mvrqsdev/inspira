import { auth } from '@/auth'
import { NextResponse } from 'next/server'

const publicRoutes = [
  { path: '/login', whenAuthenticated: 'redirect' },
  { path: '/reset-password', whenAuthenticated: 'redirect' },
] as const

const privateRoutes = [{ path: '/dashboard', permissions: [] }] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED = '/login'
export default auth((req) => {
  const pathname = req.nextUrl.pathname
  const publicRoute = publicRoutes.find((route) =>
    pathname.startsWith(route.path),
  )
  const privateRoute = privateRoutes.find((route) =>
    pathname.startsWith(route.path),
  )
  const redirectUrl = req.nextUrl.clone()
  const session = req.auth

  if (pathname === '/') {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api')) {
    if (pathname.startsWith('/api/auth/')) {
      return NextResponse.next()
    }

    if (session) {
      return NextResponse.next()
    }

    // Adicionar Validação de API aqui futuramente
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED
    return NextResponse.redirect(redirectUrl)
  }

  if (!session && publicRoute) {
    return NextResponse.next()
  }

  if (!session && privateRoute) {
    if (pathname.startsWith('/api')) {
      // ADICIONAR VALIDAÇÃO DE ROTAS DE API
      return NextResponse.next()
    }
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED
    return NextResponse.redirect(redirectUrl)
  }

  if (session && publicRoute && publicRoute.whenAuthenticated === 'redirect') {
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  if (session && privateRoute) {
    // ESTRATÉGIA DE REFRESH TOKEN E VALIDAÇÃO DE PERMISSIONS

    if (privateRoute.permissions.length === 0) {
      return NextResponse.next()
    }

    const hasPermission = privateRoute.permissions.some((permission) =>
      session.user.permissions.includes(permission),
    )
    if (!hasPermission) {
      redirectUrl.pathname = '/dashboard'
      return NextResponse.redirect(redirectUrl)
    }

    return NextResponse.next()
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
