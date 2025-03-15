import NextAuth, { NextAuthConfig, Session, User as UserAuth } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import * as UserServices from '@/services/users'

import { JWT } from 'next-auth/jwt'

const nextAuthOptions: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  jwt: {
    maxAge: 60 * 60 * 24,
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: {
          label: 'Senha',
          type: 'password',
        },
      },
      authorize: async (credentials) => {
        const fetchUser = await UserServices.getByCredentials({
          email: credentials.email as string,
          password: credentials.password as string,
        })
        let user = null
        if (
          (fetchUser && fetchUser.status === 'Active') ||
          (fetchUser && fetchUser.master)
        ) {
          user = {
            sub: fetchUser.id,
            name: fetchUser.name,
            image: fetchUser.image,
            email: fetchUser.email,
            status: fetchUser.status,
            permissions: fetchUser.Permissions.map((item) => item.slug),
          }
        }

        return user
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      trigger,
      user,
      session,
    }: {
      token: JWT
      user: UserAuth
      trigger?: 'signIn' | 'signUp' | 'update'
      session?: Session
    }) {
      if (user) {
        token.sub = user.sub
        token.permissions = user.permissions
        token.image = user.image ? user.image : ''
        token.status = user.status
      }
      if (trigger === 'update') {
        token = { ...token, ...session }
      }

      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.sub = token.sub
        session.user.permissions = token.permissions
        session.user.image = token.image ? token.image : ''
        session.user.status = token.status
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/dashboard',
  },
}

export const { auth, handlers, signIn, signOut } = NextAuth(nextAuthOptions)
