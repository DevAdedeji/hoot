import type { AvatarTheme } from '#shared/channel'
import type { ContentCategory } from '#shared/content'

export const avatarThemeOptions: Array<{
  avatarClass: string
  bannerClass: string
  label: string
  value: AvatarTheme
}> = [
  {
    value: 'orange',
    label: 'Ember',
    avatarClass: 'bg-[#ff7a45] text-[#20140e]',
    bannerClass: 'bg-[#302019] text-[#ff7a45]'
  },
  {
    value: 'gold',
    label: 'Gold',
    avatarClass: 'bg-[#f5c451] text-[#1c160a]',
    bannerClass: 'bg-[#302a18] text-[#f5c451]'
  },
  {
    value: 'rose',
    label: 'Rose',
    avatarClass: 'bg-[#ef6f91] text-[#240e15]',
    bannerClass: 'bg-[#301b23] text-[#ef6f91]'
  },
  {
    value: 'violet',
    label: 'Violet',
    avatarClass: 'bg-[#9b87f5] text-[#150f2a]',
    bannerClass: 'bg-[#241f3b] text-[#9b87f5]'
  },
  {
    value: 'blue',
    label: 'Blue',
    avatarClass: 'bg-[#65a9ff] text-[#0b1727]',
    bannerClass: 'bg-[#192839] text-[#65a9ff]'
  },
  {
    value: 'mint',
    label: 'Mint',
    avatarClass: 'bg-[#62cfaa] text-[#091d16]',
    bannerClass: 'bg-[#192e28] text-[#62cfaa]'
  }
]

export const contentCategoryOptions: Array<{
  icon: string
  label: string
  description: string
  surfaceClass: string
  value: ContentCategory
}> = [
  {
    value: 'gaming',
    label: 'Gaming',
    description: 'Ranked runs, speedruns, and co-op chaos',
    icon: 'i-lucide-gamepad-2',
    surfaceClass: 'bg-[#27213c] text-[#b9a8ff]'
  },
  {
    value: 'music',
    label: 'Music',
    description: 'Live sets, beat making, and listening rooms',
    icon: 'i-lucide-headphones',
    surfaceClass: 'bg-[#38221c] text-[#ff9b72]'
  },
  {
    value: 'creative',
    label: 'Creative',
    description: 'Drawing, design, making, and experiments',
    icon: 'i-lucide-palette',
    surfaceClass: 'bg-[#19322b] text-[#75d9b7]'
  },
  {
    value: 'chatting',
    label: 'Just Chatting',
    description: 'Stories, reactions, and good conversation',
    icon: 'i-lucide-messages-square',
    surfaceClass: 'bg-[#38252b] text-[#f395ac]'
  },
  {
    value: 'sports',
    label: 'Sports',
    description: 'Watch-alongs, analysis, and competition',
    icon: 'i-lucide-trophy',
    surfaceClass: 'bg-[#332d19] text-[#edcb64]'
  },
  {
    value: 'irl',
    label: 'IRL',
    description: 'Travel, food, daily life, and the unexpected',
    icon: 'i-lucide-map-pin',
    surfaceClass: 'bg-[#192d3b] text-[#77bdf0]'
  }
]

export function getAvatarTheme(theme: AvatarTheme) {
  return avatarThemeOptions.find((option) => option.value === theme) ?? avatarThemeOptions[0]!
}

export function getContentCategory(category: ContentCategory) {
  return contentCategoryOptions.find((option) => option.value === category)!
}
