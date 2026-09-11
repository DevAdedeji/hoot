<script setup lang="ts">
import type { ChannelProfile } from '#shared/channel'
import Header from '@/components/discovery/Header.vue'
import { getAvatarTheme, getContentCategory } from '@/lib/channel-appearance'

const route = useRoute()
const handle = computed(() => String(route.params.handle).toLowerCase())
const { data: channel, error } = await useFetch<ChannelProfile>(
  () => `/api/channels/${encodeURIComponent(handle.value)}`
)

if (error.value || !channel.value) {
  throw createError({ statusCode: 404, statusMessage: 'Channel not found' })
}

const initials = computed(() =>
  channel
    .value!.displayName.split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
)
const appearance = computed(() => getAvatarTheme(channel.value!.avatarTheme))

useSeoMeta({
  title: () => `${channel.value?.displayName} — Hoot`,
  description: () => channel.value?.bio || `Watch ${channel.value?.displayName} live on Hoot.`
})
</script>

<template>
  <div class="min-h-dvh bg-[#0d0e11] text-[#f5f5f7]">
    <Header />

    <main>
      <section
        :class="[
          'relative h-52 overflow-hidden border-b border-white/8 sm:h-72',
          appearance.bannerClass
        ]"
      >
        <img
          v-if="channel!.bannerUrl"
          :src="channel!.bannerUrl"
          alt=""
          class="size-full object-cover"
        />
        <div
          v-else
          class="absolute inset-0"
          aria-hidden="true"
        >
          <span class="absolute top-10 left-[12%] size-28 rounded-full border border-current/25" />
          <span
            class="absolute right-[18%] bottom-8 size-44 rounded-full border border-current/15"
          />
          <span class="absolute top-1/2 left-1/2 h-px w-2/3 -translate-x-1/2 bg-current/20" />
        </div>
      </section>

      <div class="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
        <section class="relative -mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end">
          <div
            :class="[
              'grid size-24 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-[#0d0e11] text-2xl font-extrabold sm:size-28',
              appearance.avatarClass
            ]"
          >
            <img
              v-if="channel!.avatarUrl"
              :src="channel!.avatarUrl"
              :alt="`${channel!.displayName}'s avatar`"
              class="size-full object-cover"
            />
            <span v-else>{{ initials }}</span>
          </div>
          <div class="min-w-0 pb-1">
            <h1 class="truncate text-3xl font-extrabold tracking-[-.035em] sm:text-4xl">
              {{ channel!.displayName }}
            </h1>
            <p class="mt-1 text-sm font-semibold text-muted">@{{ channel!.handle }}</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <span
                v-for="topic in channel!.topics"
                :key="topic"
                class="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-toned"
              >
                <UIcon
                  :name="getContentCategory(topic).icon"
                  class="size-3"
                />
                {{ getContentCategory(topic).label }}
              </span>
            </div>
          </div>
        </section>

        <div class="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section
            class="grid aspect-video min-h-70 place-items-center overflow-hidden rounded-2xl border border-white/8 bg-[#15161b] text-center"
          >
            <div class="max-w-sm px-6">
              <span
                class="mx-auto grid size-12 place-items-center rounded-full bg-white/6 text-muted"
              >
                <UIcon
                  name="i-lucide-radio"
                  class="size-5"
                />
              </span>
              <h2 class="mt-5 text-xl font-bold">{{ channel!.displayName }} is offline</h2>
              <p class="mt-2 text-sm leading-6 text-muted">
                Check back later for the next live stream.
              </p>
            </div>
          </section>

          <aside class="rounded-2xl border border-white/8 bg-[#15161b] p-6">
            <p class="text-xs font-bold tracking-[.14em] text-primary">ABOUT THE CHANNEL</p>
            <p
              v-if="channel!.bio"
              class="mt-4 whitespace-pre-line text-sm leading-6 text-toned"
            >
              {{ channel!.bio }}
            </p>
            <p
              v-else
              class="mt-4 text-sm leading-6 text-muted"
            >
              This channel has not added a bio yet.
            </p>
            <div class="mt-6 border-t border-white/8 pt-5 text-xs text-muted">
              Joined Hoot
              {{
                new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(
                  new Date(channel!.createdAt)
                )
              }}
            </div>
          </aside>
        </div>
      </div>
    </main>
  </div>
</template>
