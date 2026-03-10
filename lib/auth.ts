/**
 * Better Auth configuration for AIgile
 * Uses PostgreSQL (Supabase) - Pool recommended for connection stability
 */
import dns from 'node:dns'
dns.setDefaultResultOrder('ipv4first')

import { betterAuth } from 'better-auth'
import { createAuthMiddleware } from 'better-auth/api'
import { Pool } from 'pg'
import { getDatabaseUrl } from './db'
import { sendVerificationEmail as sendVerificationEmailFn } from './email'
import { sendPasswordResetEmail } from './email'
import { nextCookies } from 'better-auth/next-js'
import { ensureUserCredits } from './credits/manager'

const databaseUrl = getDatabaseUrl()
const baseURL = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010'

// Production: trustedOrigins requis pour OAuth (sign-in Google)
const trustedOrigins = [
  'https://aigile.lu',
  'https://www.aigile.lu',
  'http://localhost:3010',
  'http://127.0.0.1:3010',
]

export const auth = betterAuth({
  baseURL,
  trustedOrigins,
  database: new Pool({
    connectionString: databaseUrl,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  }),

  plugins: [nextCookies()],

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const isSignUp = ctx.path.startsWith('/sign-up')
      const isSignIn = ctx.path.startsWith('/sign-in')
      const isOAuthCallback = ctx.path.startsWith('/callback/')
      if (isSignUp || isSignIn || isOAuthCallback) {
        const newSession = ctx.context.newSession
        if (newSession?.user?.id) {
          await ensureUserCredits(newSession.user.id)
        }
      }
    }),
  },

  user: {
    additionalFields: {
      firstName: { type: 'string', required: false },
      lastName: { type: 'string', required: false },
      role: { type: 'string', required: false },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      const name = (user as { firstName?: string; name?: string }).firstName || user.name?.split(' ')[0]
      void sendPasswordResetEmail({ to: user.email, url, userName: name })
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const name = (user as { firstName?: string; name?: string }).firstName || user.name?.split(' ')[0] || ''
      void sendVerificationEmailFn({ to: user.email, url, userName: name })
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || 'placeholder',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder',
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },

  advanced: {
    cookiePrefix: 'aigile',
    useSecureCookies: process.env.NODE_ENV === 'production',
  },
})

export type Session = typeof auth.$Infer.Session
