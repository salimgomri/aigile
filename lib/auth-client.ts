import { createAuthClient } from 'better-auth/react'

// Use current origin in browser (fixes prod: same build works for localhost and aigile.lu)
const getBaseURL = () => {
  if (typeof window !== 'undefined') return window.location.origin
  return process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || (process.env.NODE_ENV === 'production' ? 'https://aigile.lu' : 'http://localhost:3010')
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
})

export const { 
  signIn, 
  signUp, 
  signOut, 
  useSession,
  getSession,
  requestPasswordReset,
  resetPassword,
} = authClient
