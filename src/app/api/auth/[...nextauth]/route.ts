import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.passwordHash) {
          throw new Error('Invalid email or password')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!isPasswordValid) {
          throw new Error('Invalid email or password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // For OAuth providers (Google, GitHub), ensure user has a username
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            select: { id: true, username: true },
          })
          
          // If user exists but has no username, generate one
          if (existingUser && !existingUser.username) {
            const emailPrefix = user.email!.split('@')[0]
            const randomSuffix = Math.random().toString(36).substring(2, 6)
            const generatedUsername = `${emailPrefix}_${randomSuffix}`
            
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { username: generatedUsername },
            })
          }
          
          return true
        } catch (error) {
          console.error('Error in signIn callback:', error)
          return true // Still allow sign in even if username generation fails
        }
      }
      return true
    },
    async jwt({ token, user, trigger, session, account }) {
      if (user) {
        token.id = user.id
        
        // Check if user just signed in with OAuth
        if (account?.provider === 'google' || account?.provider === 'github') {
          // Fetch the user to check onboarding status
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { onboardingComplete: true },
          })
          token.onboardingComplete = dbUser?.onboardingComplete || false
        }
      }
      
      // Handle session updates
      if (trigger === 'update' && session) {
        token.name = session.name
        token.picture = session.image
        if (session.onboardingComplete !== undefined) {
          token.onboardingComplete = session.onboardingComplete
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.onboardingComplete = token.onboardingComplete as boolean
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
