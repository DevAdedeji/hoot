import { getOwnChannel } from '@server/services/channels'
import { requireAuthSession } from '@server/services/session'

export default defineEventHandler(async (event) => {
  const session = await requireAuthSession(event)
  return { channel: await getOwnChannel(session.user.id) }
})
