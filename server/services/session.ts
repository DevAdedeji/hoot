import type { H3Event } from 'h3'
import { auth } from '@server/utils/auth'

export async function getAuthSession(event: H3Event) {
  return auth.api.getSession({ headers: event.headers })
}

export async function requireAuthSession(event: H3Event) {
  const session = await getAuthSession(event)

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Not signed in' })
  }

  return session
}

export async function requireVerifiedSession(event: H3Event) {
  const session = await requireAuthSession(event)

  if (!session.user.emailVerified) {
    throw createError({ statusCode: 403, statusMessage: 'Verify your email first' })
  }

  return session
}
