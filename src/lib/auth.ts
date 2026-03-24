import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        type: { label: "Account Type", type: "text", value: "user" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('الرجاء إدخال البريد الإلكتروني وكلمة المرور')
        }

        const accountType = credentials.type === 'company' ? 'company' : 'user'

        if (accountType === 'company') {
          const company = await prisma.company.findUnique({ where: { email: credentials.email } })
          if (!company || !company.password) {
            throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة')
          }
          const isValid = await bcrypt.compare(credentials.password, company.password)
          if (!isValid) {
            throw new Error('كلمة المرور غير صحيحة')
          }
          return {
            id: company.id,
            email: company.email,
            name: company.name,
            role: company.role || 'COMPANY'
          }
        } else {
          const user = await prisma.user.findUnique({ where: { email: credentials.email } })
          if (!user || !user.password) {
            throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة')
          }
          const isValid = await bcrypt.compare(credentials.password, user.password)
          if (!isValid) {
            throw new Error('كلمة المرور غير صحيحة')
          }
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || 'USER'
          }
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async redirect({ url, baseUrl, token }: any) {
      if (url === '/' || url === '/dashboard' || url === baseUrl + '/dashboard') {
        if ((token as any)?.role === 'COMPANY') {
          return '/dashboard/company';
        }
      }
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.role = (user as any).role
        token.id = (user as any).id
      }
      if (!token.role && token.email) {
        const company = await prisma.company.findUnique({ where: { email: token.email as string }, select: { role: true, id: true } })
        if (company) {
          token.role = company.role || 'COMPANY'
          token.id = company.id
        } else {
          const userDb = await prisma.user.findUnique({ where: { email: token.email as string }, select: { role: true, id: true } })
          if (userDb) {
            token.role = userDb.role || 'USER'
            token.id = userDb.id
          }
        }
      }
      return token
    },
    async session({ session, token }: any) {
      if (session?.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }