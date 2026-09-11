<script setup lang="ts">
import type { StreamPreview } from '~/types/discovery'

defineProps<{
  channels: StreamPreview[]
  isAuthenticated: boolean
  onboardingCompleted: boolean
}>()
</script>

<template>
  <aside
    class="sticky top-17 h-[calc(100dvh-68px)] overflow-y-auto border-r border-white/[0.07] bg-[#101115] p-4 max-[1024px]:hidden"
    aria-label="Discovery sidebar"
  >
    <nav
      class="space-y-3"
      aria-label="Discover sections"
    >
      <UButton
        block
        color="neutral"
        variant="soft"
        leading-icon="i-lucide-house"
        class="justify-start"
        >For you</UButton
      >
      <UButton
        block
        color="neutral"
        variant="ghost"
        leading-icon="i-lucide-heart"
        class="justify-start"
        >Following</UButton
      >
      <UButton
        block
        color="neutral"
        variant="ghost"
        leading-icon="i-lucide-layout-grid"
        class="justify-start"
        >Categories</UButton
      >
    </nav>

    <div class="mt-7 border-t border-white/[0.07] pt-6">
      <div class="mb-3 flex items-center justify-between px-2">
        <h2 class="text-[10px] font-bold tracking-[.14em] text-[#8f939f]">RECOMMENDED</h2>
        <UIcon
          name="i-lucide-chevrons-up-down"
          class="size-3.5 text-muted"
        />
      </div>

      <NuxtLink
        v-for="channel in channels"
        :key="channel.creator"
        to="/signup"
        class="group flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-white/5"
      >
        <span
          class="grid size-9 shrink-0 place-items-center rounded-full text-[10px] font-bold"
          :class="channel.avatar"
          >{{ channel.initials }}</span
        >
        <span class="min-w-0 flex-1">
          <strong class="block truncate text-xs font-semibold group-hover:text-primary">{{
            channel.creator
          }}</strong>
          <span class="mt-0.5 block truncate text-[10px] text-muted">{{ channel.category }}</span>
        </span>
        <span class="flex items-center gap-1 text-[10px] text-muted">
          <i class="size-1.5 rounded-full bg-red-400" />{{ channel.viewers }}
        </span>
      </NuxtLink>
    </div>

    <div
      class="mt-7 rounded-2xl border p-4"
      :class="
        isAuthenticated && !onboardingCompleted
          ? 'border-primary/35 bg-primary/10'
          : 'border-white/10 bg-white/[0.035]'
      "
    >
      <UIcon
        :name="
          isAuthenticated && !onboardingCompleted
            ? 'i-lucide-list-checks'
            : 'i-lucide-sliders-horizontal'
        "
        :class="isAuthenticated && !onboardingCompleted ? 'text-primary' : 'text-orange-300'"
      />
      <p class="mt-3 text-xs font-semibold">
        {{
          !isAuthenticated
            ? 'Make this feed yours.'
            : onboardingCompleted
              ? 'Fine-tune your feed.'
              : 'Your feed is not tuned yet.'
        }}
      </p>
      <p class="mt-1.5 text-[11px] leading-5 text-muted">
        {{
          !isAuthenticated
            ? 'Follow creators and Hoot will learn what feels like home.'
            : onboardingCompleted
              ? 'Update your interests whenever your mood changes.'
              : 'Pick a few interests so Hoot can put better streams first.'
        }}
      </p>
      <UButton
        :to="
          !isAuthenticated ? '/signup' : onboardingCompleted ? '/account#interests' : '/onboarding'
        "
        size="sm"
        block
        class="mt-4 font-bold text-[#1c110c]"
        >{{
          !isAuthenticated
            ? 'Create account'
            : onboardingCompleted
              ? 'Manage interests'
              : 'Finish setup'
        }}</UButton
      >
    </div>
  </aside>
</template>
