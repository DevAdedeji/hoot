import { channelAvailabilitySchema } from '#shared/channel'
import { channelHandleIsAvailable } from '../../services/channels'
import { getAuthSession } from '../../services/session'

export default defineEventHandler(async (event) => {
  const parsed = await getValidatedQuery(event, channelAvailabilitySchema.safeParse)

  if (!parsed.success) return { available: false }

  const session = await getAuthSession(event)
  return {
    available: await channelHandleIsAvailable(parsed.data.handle, session?.user.id)
  }
})
