<script setup lang="ts">
import type { StreamPreview } from '~/types/discovery'

defineProps<{
  stream: StreamPreview
}>()
</script>

<template>
  <NuxtLink
    to="/signup"
    class="group min-w-0"
  >
    <div class="relative aspect-video overflow-hidden rounded-xl bg-[#18191e]">
      <img
        :src="stream.image"
        :alt="`${stream.creator} streaming ${stream.category}`"
        class="size-full object-cover transition duration-300 group-hover:scale-[1.035] motion-reduce:transition-none"
        width="1200"
        height="800"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />
      <span
        class="absolute top-3 left-3 rounded-md bg-red-500 px-2 py-1 text-[9px] font-bold tracking-[.08em]"
        >LIVE</span
      >
      <span class="absolute bottom-3 left-3 rounded bg-black/65 px-2 py-1 text-[10px]"
        >{{ stream.viewers }} watching</span
      >
      <span
        class="absolute right-3 bottom-3 grid size-8 translate-y-2 place-items-center rounded-full bg-white text-[#17181d] opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100"
      >
        <UIcon
          name="i-lucide-play"
          class="size-3 fill-current"
        />
      </span>
    </div>

    <div class="mt-3 flex min-w-0 items-start gap-3">
      <span
        class="grid size-10 shrink-0 place-items-center rounded-full text-[10px] font-bold"
        :class="stream.avatar"
        >{{ stream.initials }}</span
      >
      <div class="min-w-0">
        <h3 class="truncate text-sm font-semibold group-hover:text-primary">
          {{ stream.title }}
        </h3>
        <p class="mt-1 truncate text-xs text-muted">{{ stream.creator }}</p>
        <p class="mt-1 text-[11px] text-dimmed">{{ stream.category }}</p>
      </div>
      <UButton
        icon="i-lucide-ellipsis-vertical"
        color="neutral"
        variant="ghost"
        size="xs"
        aria-label="More options"
        class="ml-auto shrink-0"
        @click.prevent
      />
    </div>
  </NuxtLink>
</template>
