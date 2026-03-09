import { betterAuth } from 'better-auth'
import { sendVerificationEmail as sendVerificationEmailFn } from './email'
import { sendPasswordResetEmail } from './email'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseDbPassword = process.env.SUPABASE_DB_PASSWORD!

if (!supabaseUrl || !supabaseServiceKey || !supabaseDbPassword) {
  throw new Error('Missing Supabase environment variables')
}

// Extract Supabase Project Ref from URL
const projectRef = supabaseUrl.replace('https://', '').split('.')[0]
const supabaseDbUrl = `postgresql://postgres.${projectRef}:${supabaseDbPassword}@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`

const appUrl = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010'

export const auth = betterAuth({
  database: {
    provider: 'postgres',
    url: supabaseDbUrl,
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
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      void sendPasswordResetEmail({ to: user.email, url })
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
