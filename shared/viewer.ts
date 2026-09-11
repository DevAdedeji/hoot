import { z } from 'zod'
import { contentCategorySchema, type ContentCategory } from './content'

export const viewerOnboardingSchema = z.object({
  interests: z
    .array(contentCategorySchema)
    .max(4, 'Choose up to 4 interests.')
    .refine(
      (interests) => interests.length === 0 || interests.length >= 2,
      'Choose at least 2 interests, or skip for now.'
    )
})

export type ViewerOnboardingInput = z.output<typeof viewerOnboardingSchema>

export type ViewerPreferences = {
  interests: ContentCategory[]
  onboardingCompleted: boolean
}
