import { eq } from 'drizzle-orm'
import type { ViewerOnboardingInput } from '#shared/viewer'
import { user } from '@server/database/schema'
import { db } from '@server/utils/db'

export function findViewerPreferences(userId: string) {
  return db.query.user.findFirst({
    columns: { interests: true, onboardingCompleted: true },
    where: eq(user.id, userId)
  })
}

export async function saveViewerPreferences(userId: string, input: ViewerOnboardingInput) {
  const [updated] = await db
    .update(user)
    .set({
      interests: input.interests,
      onboardingCompleted: true,
      updatedAt: new Date()
    })
    .where(eq(user.id, userId))
    .returning({
      interests: user.interests,
      onboardingCompleted: user.onboardingCompleted
    })

  return updated
}
