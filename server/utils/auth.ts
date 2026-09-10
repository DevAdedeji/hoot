import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import * as schema from '../database/schema'
import { sendPasswordResetEmail, sendVerificationEmail } from '../services/email'
import { db } from './db'

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
const baseURL = process.env.BETTER_AUTH_URL
const secret = process.env.BETTER_AUTH_SECRET

if (!baseURL) {
  throw new Error('BETTER_AUTH_URL is required')
}

if (
  !secret ||
  secret.length < 32 ||
  secret === 'replace-with-a-random-secret-at-least-32-characters-long'
) {
  throw new Error('BETTER_AUTH_SECRET must contain at least 32 characters')
}

if (Boolean(googleClientId) !== Boolean(googleClientSecret)) {
  throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured together')
}

export const auth = betterAuth({
  appName: 'Hoot',
  baseURL,
  secret,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
    maxPasswordLength: 200,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: 60 * 60,
    sendResetPassword: async ({ user, url }) => {
      void sendPasswordResetEmail(user.email, url).catch(() => {
        console.error('Failed to send a Hoot password-reset email')
      })
    }
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url }) => {
      void sendVerificationEmail(user.email, url).catch(() => {
        console.error('Failed to send a Hoot verification email')
      })
    }
  },
  socialProviders:
    googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret
          }
        }
      : undefined,
  advanced: {
    database: {
      joins: true
    }
  }
})
