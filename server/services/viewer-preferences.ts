import type { ViewerPreferences, ViewerOnboardingInput } from '#shared/viewer'
import { findViewerPreferences, saveViewerPreferences } from '../repositories/viewer-preferences'

export async function getViewerPreferences(userId: string): Promise<ViewerPreferences> {
  const preferences = await findViewerPreferences(userId)

  if (!preferences) {
    throw createError({ statusCode: 404, statusMessage: 'Account not found' })
  }

  return preferences
}

export async function completeViewerOnboarding(
  userId: string,
  input: ViewerOnboardingInput
): Promise<ViewerPreferences> {
  const preferences = await saveViewerPreferences(userId, input)

  if (!preferences) {
    throw createError({ statusCode: 404, statusMessage: 'Account not found' })
  }

  return preferences
}
