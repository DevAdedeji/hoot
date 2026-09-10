export interface StreamPreview {
  creator: string
  initials: string
  title: string
  category: string
  viewers: string
  image: string
  avatar: string
}

export interface FeaturedStream extends StreamPreview {
  accent: string
}

export interface StreamCategory {
  name: string
  viewers: string
  icon: string
  gradient: string
  color: string
}
