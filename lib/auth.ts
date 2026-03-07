import { betterAuth } from 'better-auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

// Extract Supabase Project Ref from URL (e.g., "kobtkicnitovssyuxcno" from "https://kobtkicnitovssyuxcno.supabase.co")
const projectRef = supabaseUrl.replace('https://', '').split('.')[0]
const supabaseDbUrl = `postgresql://postgres.${projectRef}:${process.env.SUPABASE_DB_PASSWORD}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`

export const auth = betterAuth({
  database: {
    provider: 'postgres',
    url: supabaseDbUrl,
  },
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      // TODO: Send email via Resend
      console.log('Reset password email:', { user, url })
    },
  },
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || 'placeholder',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder',
    },
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // Update every 24 hours
  },
  
  advanced: {
    cookiePrefix: 'aigile',
    useSecureCookies: process.env.NODE_ENV === 'production',
  },
})

export type Session = typeof auth.$Infer.Session
