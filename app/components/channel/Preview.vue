<script setup lang="ts">
import type { AvatarTheme } from '#shared/channel'
import type { ContentCategory } from '#shared/content'
import { getAvatarTheme, getContentCategory } from '@/lib/channel-appearance'

const props = defineProps<{
  avatarTheme: AvatarTheme
  bio: string
  displayName: string
  handle: string
  topics: ContentCategory[]
}>()

const initials = computed(() =>
  (props.displayName || 'Your Channel')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
)
const appearance = computed(() => getAvatarTheme(props.avatarTheme))
</script>

<template>
  <section
    class="overflow-hidden rounded-3xl border border-white/10 bg-[#121318] shadow-2xl shadow-black/25"
    aria-label="Live channel preview"
  >
    <div class="flex items-center gap-2 border-b border-white/8 px-4 py-3">
      <span class="size-2 rounded-full bg-[#ef6f6f]" />
      <span class="size-2 rounded-full bg-[#e4b85e]" />
      <span class="size-2 rounded-full bg-[#62cfaa]" />
      <div class="mx-auto flex h-6 w-2/5 items-center justify-center rounded-md bg-white/5">
        <span class="max-w-full truncate px-2 text-[9px] text-muted"
          >hoot.live/{{ handle || 'your_handle' }}</span
        >
      </div>
      <span class="w-8" />
    </div>

    <div class="relative h-31 overflow-hidden sm:h-38">
      <div :class="['absolute inset-0', appearance.bannerClass]">
        <span class="absolute top-6 left-[11%] size-16 rounded-full border border-current/25" />
        <span class="absolute right-[10%] bottom-4 size-24 rounded-full border border-current/15" />
        <span class="absolute top-1/2 left-1/2 h-px w-2/3 -translate-x-1/2 bg-current/20" />
      </div>
    </div>

    <div class="px-5 pb-5 sm:px-6 sm:pb-6">
      <div class="relative -mt-8 flex items-end gap-3">
        <div
          :class="[
            'grid size-16 shrink-0 place-items-center rounded-full border-4 border-[#121318] text-lg font-extrabold',
            appearance.avatarClass
          ]"
        >
          {{ initials }}
        </div>
        <div class="min-w-0 pb-1">
          <p class="truncate text-lg font-bold tracking-tight">
            {{ displayName || 'Your channel name' }}
          </p>
          <p class="truncate text-xs text-muted">@{{ handle || 'your_handle' }}</p>
        </div>
      </div>

      <div
        class="mt-5 grid aspect-video min-h-36 place-items-center rounded-xl border border-white/8 bg-[#18191f] px-5 text-center"
      >
        <div>
          <span class="mx-auto grid size-9 place-items-center rounded-full bg-white/6 text-muted">
            <UIcon
              name="i-lucide-radio"
              class="size-4"
            />
          </span>
          <p class="mt-3 text-sm font-bold">Your first stream starts here.</p>
          <p class="mt-1 text-xs text-muted">Offline for now</p>
        </div>
      </div>

      <div class="mt-5">
        <p class="line-clamp-2 min-h-10 text-xs leading-5 text-toned">
          {{ bio || 'Your bio will tell viewers what makes this channel worth coming back to.' }}
        </p>
        <div class="mt-3 flex min-h-6 flex-wrap gap-1.5">
          <span
            v-for="topic in topics"
            :key="topic"
            class="inline-flex items-center gap-1 rounded-full border border-white/8 bg-white/5 px-2 py-1 text-[10px] font-semibold text-toned"
          >
            <UIcon
              :name="getContentCategory(topic).icon"
              class="size-3"
            />
            {{ getContentCategory(topic).label }}
          </span>
          <span
            v-if="!topics.length"
            class="text-[10px] text-muted"
            >Your channel topics will appear here</span
          >
        </div>
      </div>
    </div>
  </section>
</template>
