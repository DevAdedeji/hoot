import { createChannelSchema } from '#shared/channel'
import { createChannelForUser } from '../../services/channels'
import { requireVerifiedSession } from '../../services/session'

export default defineEventHandler(async (event) => {
  const session = await requireVerifiedSession(event)
  const parsed = await readValidatedBody(event, createChannelSchema.safeParse)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues[0]?.message ?? 'Check your channel details.'
    })
  }

  const created = await createChannelForUser(session.user.id, parsed.data)
  setResponseStatus(event, 201)
  return created
})
