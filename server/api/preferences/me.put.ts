import { viewerOnboardingSchema } from '#shared/viewer'
import { completeViewerOnboarding } from '@server/services/viewer-preferences'
import { requireVerifiedSession } from '@server/services/session'

export default defineEventHandler(async (event) => {
  const session = await requireVerifiedSession(event)
  const parsed = await readValidatedBody(event, viewerOnboardingSchema.safeParse)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues[0]?.message ?? 'Check your interests.'
    })
  }

  return completeViewerOnboarding(session.user.id, parsed.data)
})
