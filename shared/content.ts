import { z } from 'zod'

export const contentCategoryValues = [
  'gaming',
  'music',
  'creative',
  'chatting',
  'sports',
  'irl'
] as const

export const contentCategorySchema = z.enum(contentCategoryValues)

export type ContentCategory = z.output<typeof contentCategorySchema>
