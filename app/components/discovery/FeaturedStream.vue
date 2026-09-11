<script setup lang="ts">
import type { FeaturedStream } from '@/types/discovery'

const props = defineProps<{
  streams: FeaturedStream[]
}>()

const activeIndex = ref(0)
const activeStream = computed(() => props.streams[activeIndex.value] ?? props.streams[0]!)
</script>

<template>
  <section
    class="mx-auto w-full max-w-[1480px] px-8 pt-8 max-[640px]:px-4 max-[640px]:pt-5"
    aria-labelledby="featured-title"
  >
    <div class="mb-4 flex items-center justify-between">
      <div>
        <p class="text-[10px] font-bold tracking-[.15em] text-primary">LIVE ON HOOT</p>
        <h1
          id="featured-title"
          class="mt-1.5 text-2xl font-[760] tracking-[-.035em]"
        >
          Something worth dropping into
        </h1>
      </div>
      <div
        class="flex items-center gap-1"
        role="group"
        aria-label="Choose featured stream"
      >
        <button
          v-for="(stream, index) in streams"
          :key="stream.creator"
          type="button"
          class="grid size-8 place-items-center rounded-lg"
          :aria-label="`Show ${stream.creator}`"
          :aria-pressed="activeIndex === index"
          @click="activeIndex = index"
        >
          <span
            class="h-1.5 rounded-full transition-all"
            :class="activeIndex === index ? 'w-5 bg-primary' : 'w-1.5 bg-white/25'"
          />
        </button>
      </div>
    </div>

    <NuxtLink
      to="/signup"
      class="group grid min-h-[430px] grid-cols-[minmax(0,1.6fr)_minmax(300px,.7fr)] overflow-hidden rounded-3xl border border-white/[0.08] bg-[#15161b] shadow-[0_24px_100px_#0005] max-[850px]:grid-cols-1"
    >
      <div class="relative min-h-[430px] overflow-hidden max-[640px]:min-h-[300px]">
        <img
          :src="activeStream.image"
          :alt="`${activeStream.creator}'s featured stream`"
          class="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
          width="1400"
          height="934"
        />
        <div class="absolute inset-0 bg-black/25" />
        <span
          class="absolute top-5 left-5 flex items-center gap-2 rounded-lg bg-red-500 px-3 py-1.5 text-[10px] font-bold tracking-[.1em] text-white"
        >
          <i class="size-1.5 animate-pulse rounded-full bg-white motion-reduce:animate-none" />
          LIVE
        </span>
        <span class="absolute bottom-5 left-5 rounded-md bg-black/70 px-2.5 py-1.5 text-[11px]"
          >{{ activeStream.viewers }} watching</span
        >
        <span
          class="absolute right-5 bottom-5 grid size-11 place-items-center rounded-full border border-white/30 bg-black/40 backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-primary group-hover:text-[#1c110c]"
        >
          <UIcon
            name="i-lucide-play"
            class="size-4 fill-current"
          />
        </span>
      </div>

      <div class="relative flex flex-col p-8 max-[640px]:p-6">
        <div class="flex items-center gap-3">
          <span
            class="grid size-11 place-items-center rounded-full text-xs font-bold"
            :class="activeStream.avatar"
            >{{ activeStream.initials }}</span
          >
          <div>
            <strong class="block text-sm">{{ activeStream.creator }}</strong>
            <span
              class="mt-1 block text-xs"
              :class="activeStream.accent"
              >{{ activeStream.category }}</span
            >
          </div>
          <UIcon
            name="i-lucide-badge-check"
            class="ml-auto size-5 text-primary"
          />
        </div>
        <h2
          class="mt-9 text-[clamp(2rem,3.2vw,3.4rem)] leading-[1.02] font-[780] tracking-[-.055em]"
        >
          {{ activeStream.title }}
        </h2>
        <p class="mt-5 text-sm leading-7 text-muted">
          The room is open. Come for the stream, stay because the chat feels like your people.
        </p>
        <div class="mt-auto flex flex-wrap gap-2 pt-8">
          <span
            class="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1.5 text-[10px] text-[#c5c7ce]"
            >English</span
          >
          <span
            class="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1.5 text-[10px] text-[#c5c7ce]"
            >Good company</span
          >
        </div>
      </div>
    </NuxtLink>
  </section>
</template>
