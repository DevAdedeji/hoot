import type { ContentCategory } from '#shared/content'

export interface StreamPreview {
  creator: string
  initials: string
  title: string
  category: string
  viewers: string
  image: string
  avatar: string
  interest: ContentCategory
}

export interface FeaturedStream extends StreamPreview {
  accent: string
}

export interface StreamCategory {
  name: string
  viewers: string
  icon: string
  interest: ContentCategory
  surface: string
  color: string
}
