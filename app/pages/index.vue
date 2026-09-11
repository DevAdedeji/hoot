<script setup lang="ts">
import type { ContentCategory } from '#shared/content'
import type { ViewerPreferences } from '#shared/viewer'
import CategoryCard from '@/components/discovery/CategoryCard.vue'
import FeaturedStream from '@/components/discovery/FeaturedStream.vue'
import Footer from '@/components/discovery/Footer.vue'
import Header from '@/components/discovery/Header.vue'
import Sidebar from '@/components/discovery/Sidebar.vue'
import StreamCard from '@/components/discovery/StreamCard.vue'
import { authClient } from '@/lib/auth-client'
import type {
  FeaturedStream as FeaturedStreamItem,
  StreamCategory,
  StreamPreview
} from '@/types/discovery'

useSeoMeta({
  title: 'Discover live — Hoot',
  description: 'Find live games, music, creative sessions, and communities on Hoot.'
})

const featuredStreams: FeaturedStreamItem[] = [
  {
    creator: 'ada.wav',
    initials: 'aw',
    title: 'Vinyl after dark — records for the quiet hours',
    category: 'Music',
    viewers: '1.8K',
    image: '/images/music-unsplash.jpg',
    accent: 'text-orange-300',
    avatar: 'bg-orange-400/20 text-orange-200',
    interest: 'music'
  },
  {
    creator: 'jayplays',
    initials: 'jp',
    title: 'One last ranked game with the whole crew',
    category: 'Gaming',
    viewers: '824',
    image: '/images/gaming-unsplash.jpg',
    accent: 'text-violet-300',
    avatar: 'bg-violet-400/20 text-violet-200',
    interest: 'gaming'
  },
  {
    creator: 'mika.makes',
    initials: 'mm',
    title: 'Drawing places that only exist in my head',
    category: 'Creative',
    viewers: '536',
    image: '/images/creative-unsplash.jpg',
    accent: 'text-emerald-300',
    avatar: 'bg-emerald-400/20 text-emerald-200',
    interest: 'creative'
  }
]

const liveStreams: StreamPreview[] = [
  {
    creator: 'ada.wav',
    title: 'Vinyl after dark',
    category: 'Music',
    viewers: '1.8K',
    image: '/images/music-unsplash.jpg',
    avatar: 'bg-orange-400/20 text-orange-200',
    initials: 'aw',
    interest: 'music'
  },
  {
    creator: 'jayplays',
    title: 'One more ranked game',
    category: 'Gaming',
    viewers: '824',
    image: '/images/gaming-unsplash.jpg',
    avatar: 'bg-violet-400/20 text-violet-200',
    initials: 'jp',
    interest: 'gaming'
  },
  {
    creator: 'mika.makes',
    title: 'Sketching imaginary places',
    category: 'Creative',
    viewers: '536',
    image: '/images/creative-unsplash.jpg',
    avatar: 'bg-emerald-400/20 text-emerald-200',
    initials: 'mm',
    interest: 'creative'
  },
  {
    creator: 'luna.loops',
    title: 'Building a beat from scratch',
    category: 'Music',
    viewers: '312',
    image: '/images/music-unsplash.jpg',
    avatar: 'bg-rose-400/20 text-rose-200',
    initials: 'll',
    interest: 'music'
  },
  {
    creator: 'santi.gg',
    title: 'Learning the new patch together',
    category: 'Gaming',
    viewers: '241',
    image: '/images/gaming-unsplash.jpg',
    avatar: 'bg-sky-400/20 text-sky-200',
    initials: 'sg',
    interest: 'gaming'
  },
  {
    creator: 'nia.draws',
    title: 'Tiny characters, big personalities',
    category: 'Creative',
    viewers: '188',
    image: '/images/creative-unsplash.jpg',
    avatar: 'bg-amber-400/20 text-amber-200',
    initials: 'nd',
    interest: 'creative'
  }
]

const categories: StreamCategory[] = [
  {
    name: 'Just Chatting',
    viewers: '12.4K watching',
    icon: 'i-lucide-messages-square',
    interest: 'chatting',
    surface: 'bg-[#38251f]',
    color: 'text-orange-200'
  },
  {
    name: 'Gaming',
    viewers: '8.7K watching',
    icon: 'i-lucide-gamepad-2',
    interest: 'gaming',
    surface: 'bg-[#27213c]',
    color: 'text-violet-200'
  },
  {
    name: 'Music',
    viewers: '3.2K watching',
    icon: 'i-lucide-headphones',
    interest: 'music',
    surface: 'bg-[#38221c]',
    color: 'text-rose-200'
  },
  {
    name: 'Creative',
    viewers: '2.1K watching',
    icon: 'i-lucide-palette',
    interest: 'creative',
    surface: 'bg-[#19322b]',
    color: 'text-emerald-200'
  },
  {
    name: 'IRL',
    viewers: '1.6K watching',
    icon: 'i-lucide-map-pin',
    interest: 'irl',
    surface: 'bg-[#192d3b]',
    color: 'text-sky-200'
  },
  {
    name: 'Sports',
    viewers: '1.1K watching',
    icon: 'i-lucide-trophy',
    interest: 'sports',
    surface: 'bg-[#332d19]',
    color: 'text-amber-200'
  }
]

const { data: session } = await authClient.useSession(useFetch)
const viewerPreferences = ref<ViewerPreferences | null>(null)

if (session.value) {
  try {
    viewerPreferences.value = await useRequestFetch()('/api/preferences/me')
  } catch {
    viewerPreferences.value = null
  }
}

const interestRank = computed(() => {
  const rank = new Map<ContentCategory, number>()
  viewerPreferences.value?.interests.forEach((interest, index) => rank.set(interest, index))
  return rank
})
const hasPersonalizedFeed = computed(() => interestRank.value.size > 0)

function rankFor(interest: ContentCategory) {
  return interestRank.value.get(interest) ?? Number.MAX_SAFE_INTEGER
}

const sortedFeaturedStreams = computed(() =>
  [...featuredStreams].sort((left, right) => rankFor(left.interest) - rankFor(right.interest))
)
const sortedLiveStreams = computed(() =>
  [...liveStreams].sort((left, right) => rankFor(left.interest) - rankFor(right.interest))
)
const sortedCategories = computed(() =>
  [...categories].sort((left, right) => rankFor(left.interest) - rankFor(right.interest))
)
const recommended = computed(() => sortedLiveStreams.value.slice(0, 5))
</script>

<template>
  <div class="min-h-dvh bg-[#0d0e11] text-[#f5f5f7]">
    <a
      href="#discover-content"
      class="fixed -top-20 left-3 z-100 rounded-lg bg-primary px-4 py-3 font-semibold text-[#1c110c] focus:top-3"
      >Skip to streams</a
    >

    <Header />

    <div class="grid grid-cols-[248px_minmax(0,1fr)] max-[1024px]:grid-cols-1">
      <Sidebar
        :channels="recommended"
        :is-authenticated="Boolean(session)"
        :onboarding-completed="Boolean(viewerPreferences?.onboardingCompleted)"
      />

      <main
        id="discover-content"
        class="min-w-0 overflow-hidden"
      >
        <FeaturedStream :streams="sortedFeaturedStreams" />

        <section
          class="mx-auto w-full max-w-370 px-8 py-12 max-[640px]:px-4 max-[640px]:py-9"
          aria-labelledby="live-title"
        >
          <div class="mb-5 flex items-end justify-between gap-4">
            <div>
              <p class="text-[10px] font-bold tracking-[.15em] text-primary">DON’T MISS A MOMENT</p>
              <h2
                id="live-title"
                class="mt-1.5 text-2xl font-[760] tracking-[-.035em]"
              >
                {{
                  hasPersonalizedFeed
                    ? 'Live in your interests'
                    : 'Live channels we think you’ll like'
                }}
              </h2>
            </div>
            <UButton
              color="neutral"
              variant="ghost"
              trailing-icon="i-lucide-arrow-right"
              class="shrink-0"
              >See all</UButton
            >
          </div>

          <div
            class="grid grid-cols-3 gap-x-5 gap-y-8 max-[1200px]:grid-cols-2 max-[640px]:grid-cols-1"
          >
            <StreamCard
              v-for="stream in sortedLiveStreams"
              :key="stream.creator"
              :stream="stream"
            />
          </div>
        </section>

        <section class="border-y border-white/6 bg-white/2.5">
          <div class="mx-auto w-full max-w-370 px-8 py-12 max-[640px]:px-4 max-[640px]:py-9">
            <div class="mb-5 flex items-end justify-between">
              <h2 class="text-2xl font-[760] tracking-[-.035em]">Explore categories</h2>
              <UButton
                color="neutral"
                variant="ghost"
                trailing-icon="i-lucide-arrow-right"
                >Browse all</UButton
              >
            </div>

            <div
              class="grid grid-cols-5 gap-4 max-[1100px]:grid-cols-3 max-[640px]:grid-cols-2 max-[400px]:grid-cols-1"
            >
              <CategoryCard
                v-for="category in sortedCategories"
                :key="category.name"
                :category="category"
              />
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  </div>
</template>
