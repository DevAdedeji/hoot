import { channelHandleSchema } from '#shared/channel'
import { getPublicChannel } from '@server/services/channels'

export default defineEventHandler(async (event) => {
  const parsed = channelHandleSchema.safeParse(getRouterParam(event, 'handle'))

  if (!parsed.success) {
    throw createError({ statusCode: 404, statusMessage: 'Channel not found' })
  }

  const channel = await getPublicChannel(parsed.data)
  if (!channel) throw createError({ statusCode: 404, statusMessage: 'Channel not found' })
  return channel
})
