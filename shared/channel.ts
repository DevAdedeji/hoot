import { z } from 'zod'
import { contentCategorySchema, type ContentCategory } from './content'

export const reservedChannelHandles = new Set([
  '_nuxt',
  'account',
  'api',
  'creator',
  'forgot-password',
  'login',
  'onboarding',
  'reset-password',
  'signup',
  'verify-email'
])

export const channelHandleSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'Use at least 3 characters.')
  .max(24, 'Use 24 characters or fewer.')
  .regex(/^[a-z0-9][a-z0-9_]*$/, 'Use lowercase letters, numbers, and underscores only.')
  .refine((handle) => !reservedChannelHandles.has(handle), 'That handle is reserved.')

export const avatarThemeSchema = z.enum(['orange', 'gold', 'rose', 'violet', 'blue', 'mint'])

export const channelIdentitySchema = z.object({
  handle: channelHandleSchema,
  displayName: z
    .string()
    .trim()
    .min(2, 'Use at least 2 characters.')
    .max(50, 'Use 50 characters or fewer.')
})

export const channelDetailsSchema = z.object({
  avatarTheme: avatarThemeSchema,
  topics: z
    .array(contentCategorySchema)
    .min(1, 'Choose at least one thing you plan to stream.')
    .max(3, 'Choose up to 3 topics.'),
  bio: z.string().trim().max(300, 'Use 300 characters or fewer.').default('')
})

export const createChannelSchema = channelIdentitySchema.extend(channelDetailsSchema.shape)

export const updateChannelSchema = createChannelSchema
  .partial()
  .refine((input) => Object.keys(input).length > 0, 'Include at least one field to update.')

export const channelAvailabilitySchema = z.object({ handle: channelHandleSchema })

export type ChannelProfile = {
  avatarTheme: AvatarTheme
  avatarUrl: string | null
  bannerUrl: string | null
  bio: string
  topics: ContentCategory[]
  createdAt: string
  displayName: string
  handle: string
  id: string
}

export type AvatarTheme = z.output<typeof avatarThemeSchema>
export type ChannelDetailsInput = z.output<typeof channelDetailsSchema>
export type ChannelIdentityInput = z.output<typeof channelIdentitySchema>
export type CreateChannelInput = z.output<typeof createChannelSchema>
export type UpdateChannelInput = z.output<typeof updateChannelSchema>
