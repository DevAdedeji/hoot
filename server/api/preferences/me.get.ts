import { getViewerPreferences } from '@server/services/viewer-preferences'
import { requireAuthSession } from '@server/services/session'

export default defineEventHandler(async (event) => {
  const session = await requireAuthSession(event)
  return getViewerPreferences(session.user.id)
})
