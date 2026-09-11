import { getViewerPreferences } from '../../services/viewer-preferences'
import { requireAuthSession } from '../../services/session'

export default defineEventHandler(async (event) => {
  const session = await requireAuthSession(event)
  return getViewerPreferences(session.user.id)
})
