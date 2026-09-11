import { getOwnChannel } from '../../services/channels'
import { requireAuthSession } from '../../services/session'

export default defineEventHandler(async (event) => {
  const session = await requireAuthSession(event)
  return { channel: await getOwnChannel(session.user.id) }
})
