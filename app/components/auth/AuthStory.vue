<script setup lang="ts">
const slides = [
  {
    category: 'Music',
    image: '/images/music-unsplash.jpg',
    position: 'object-[40%_center]',
    icon: 'i-lucide-headphones',
    tagline: 'FIND YOUR FREQUENCY',
    heading: ['Your next', 'favourite song.'],
    highlight: 'One stream away.',
    description: 'Late-night sets. Just-one-more records. Find the people who hear what you hear.',
    headingColor: 'text-orange-50',
    accentColor: 'text-orange-300',
    bodyColor: 'text-orange-100/80',
    indicatorColor: 'bg-orange-300',
    creator: 'ada.wav',
    initials: 'aw',
    color: 'bg-[#6d3d28] text-[#ffd9bd]',
    caption: 'For the love of the late-night set.'
  },
  {
    category: 'Gaming',
    image: '/images/gaming-unsplash.jpg',
    position: 'object-[55%_center]',
    icon: 'i-lucide-gamepad-2',
    tagline: 'FIND YOUR NEXT PLAYER TWO',
    heading: ['One more', 'round together.'],
    highlight: 'Find your crew.',
    description:
      'Close calls. Big wins. The friends who stay for another round, whatever the score.',
    headingColor: 'text-violet-50',
    accentColor: 'text-violet-300',
    bodyColor: 'text-violet-100/80',
    indicatorColor: 'bg-violet-300',
    creator: 'jayplays',
    initials: 'jp',
    color: 'bg-[#453266] text-[#e6d6ff]',
    caption: 'Good games. Even better company.'
  },
  {
    category: 'Creative',
    image: '/images/creative-unsplash.jpg',
    position: 'object-center',
    icon: 'i-lucide-palette',
    tagline: 'MAKE SOMETHING TOGETHER',
    heading: ['A little spark.', 'A blank page.'],
    highlight: 'Make it yours.',
    description:
      'Messy first drafts. Happy accidents. A little encouragement to make your next idea real.',
    headingColor: 'text-emerald-50',
    accentColor: 'text-emerald-300',
    bodyColor: 'text-emerald-100/80',
    indicatorColor: 'bg-emerald-300',
    creator: 'mika.makes',
    initials: 'mm',
    color: 'bg-[#294c41] text-[#d3f4e7]',
    caption: 'A blank page. A little possibility.'
  }
]
const carousel = useTemplateRef('carousel')
const selectedIndex = ref(0)
const activeSlide = computed(() => slides[selectedIndex.value] ?? slides[0]!)
const paused = ref(false)
const reducedMotion = ref(true)
const desktop = ref(false)
const autoplay = computed(() =>
  desktop.value && !reducedMotion.value
    ? { delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true, stopOnFocusIn: true }
    : false
)

let removeMediaListeners: (() => void) | undefined
onMounted(() => {
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const desktopQuery = window.matchMedia('(min-width: 761px)')
  const updateMedia = () => {
    reducedMotion.value = motionQuery.matches
    desktop.value = desktopQuery.matches
  }
  updateMedia()
  motionQuery.addEventListener('change', updateMedia)
  desktopQuery.addEventListener('change', updateMedia)
  removeMediaListeners = () => {
    motionQuery.removeEventListener('change', updateMedia)
    desktopQuery.removeEventListener('change', updateMedia)
  }
})
onBeforeUnmount(() => removeMediaListeners?.())

function selectSlide(index: number) {
  const api = carousel.value?.emblaApi
  api?.scrollTo(index, reducedMotion.value)
  api?.plugins().autoplay?.stop()
  paused.value = true
}

function toggleAutoplay() {
  const autoplayPlugin = carousel.value?.emblaApi?.plugins().autoplay

  if (paused.value) autoplayPlugin?.play()
  else autoplayPlugin?.stop()

  paused.value = !paused.value
}
</script>

<template>
  <aside
    class="relative h-full min-h-0 overflow-hidden border-r border-white/6 max-[761px]:hidden"
    aria-label="Welcome to Hoot"
  >
    <UCarousel
      ref="carousel"
      v-slot="{ item, index }"
      :items="slides"
      :ui="{ viewport: 'h-full', container: 'h-full m-0', item: 'relative h-full basis-full p-0' }"
      :autoplay="autoplay"
      :duration="reducedMotion ? 0 : 20"
      :watch-drag="false"
      loop
      fade
      class="absolute inset-0"
      aria-label="Discover music, gaming, and creative streams"
      @select="selectedIndex = $event"
    >
      <div
        class="relative h-full"
        :aria-hidden="index !== selectedIndex"
      >
        <img
          class="absolute inset-0 size-full object-cover"
          :src="item.image"
          :class="item.position"
          alt=""
        />
        <div
          class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#0b0c0e7d,#0b0c0e12_25%,#0b0c0e9c_48%,#0b0c0eeb)]"
        />
        <div
          class="absolute right-10.5 bottom-25.5 left-11 max-[1000px]:right-6 max-[1000px]:left-7.5 min-[1600px]:bottom-32.5 min-[1600px]:left-17.5 [@media(max-height:650px)]:bottom-21.5"
        >
          <div
            class="inline-flex items-center gap-2 rounded-[7px] border border-current/20 bg-black/40 px-2.75 py-2 text-[11px] font-semibold tracking-widest"
            :class="item.accentColor"
          >
            <UIcon :name="item.icon" /> {{ item.tagline }}
          </div>
          <h2
            class="my-6 text-[clamp(2.65rem,4vw,4rem)] leading-[1.07] font-extrabold tracking-[-.055em] max-[1000px]:text-[2.65rem] min-[1600px]:text-[4.8rem] [@media(max-height:650px)]:my-4 [@media(max-height:650px)]:text-4xl"
            :class="item.headingColor"
          >
            <span
              v-for="line in item.heading"
              :key="line"
              class="block"
              >{{ line }}</span
            >
            <span
              class="block"
              :class="item.accentColor"
              >{{ item.highlight }}</span
            >
          </h2>
          <p
            class="max-w-105 text-[15px] leading-[1.8] [@media(max-height:650px)]:hidden"
            :class="item.bodyColor"
          >
            {{ item.description }}
          </p>
          <div
            class="mt-7 flex max-w-90 items-center gap-3 border-t border-white/13 pt-6 [@media(max-height:650px)]:mt-4 [@media(max-height:650px)]:pt-4"
          >
            <span
              class="grid size-10 shrink-0 place-items-center rounded-full border border-white/13 text-xs font-bold"
              :class="item.color"
              >{{ item.initials }}</span
            >
            <div>
              <strong
                class="block text-sm"
                :class="item.headingColor"
                >{{ item.creator }}</strong
              >
              <span
                class="mt-1 block text-xs"
                :class="item.bodyColor"
                >{{ item.caption }}</span
              >
            </div>
            <UIcon
              :name="item.icon"
              class="ml-auto shrink-0"
              :class="item.accentColor"
            />
          </div>
        </div>
      </div>
    </UCarousel>
    <div
      class="absolute top-10 left-11 max-[1000px]:left-7.5 min-[1600px]:left-17.5 [@media(max-height:650px)]:top-6"
    >
      <NuxtLink
        to="/"
        class="inline-flex w-fit shrink-0 items-center gap-2.25 no-underline"
        aria-label="Hoot home"
      >
        <img
          src="/favicon.svg"
          alt=""
          class="size-9"
          width="36"
          height="36"
        />
        <span class="text-[2rem] leading-none font-[850] tracking-[-.065em] text-[#f5f5f7]"
          >hoot</span
        >
      </NuxtLink>
    </div>
    <div
      class="absolute right-7.5 bottom-6.5 left-11 flex items-center justify-between gap-3 max-[1000px]:left-7.5 min-[1600px]:left-17.5"
    >
      <span
        class="text-[9px] tracking-[.12em] transition-colors duration-300 motion-reduce:transition-none max-[1000px]:hidden"
        :class="activeSlide.bodyColor"
        >{{ activeSlide.category }} / GOOD COMPANY</span
      >
      <div
        class="flex shrink-0 items-center"
        role="group"
        aria-label="Photo carousel controls"
      >
        <button
          v-for="(slide, index) in slides"
          :key="slide.category"
          type="button"
          class="grid h-9 w-7 cursor-pointer place-items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current"
          :class="activeSlide.accentColor"
          :aria-label="`Show ${slide.category.toLowerCase()} photo`"
          :aria-pressed="selectedIndex === index"
          @click="selectSlide(index)"
        >
          <span
            class="h-1.5 rounded-[10px] transition-[width,background-color] duration-250 motion-reduce:transition-none"
            :class="selectedIndex === index ? ['w-5', slide.indicatorColor] : 'w-1.5 bg-white/35'"
          />
        </button>
        <UButton
          v-if="!reducedMotion"
          :icon="paused ? 'i-lucide-play' : 'i-lucide-pause'"
          :aria-label="paused ? 'Start automatic photo rotation' : 'Pause automatic photo rotation'"
          color="neutral"
          variant="ghost"
          class="ml-2 size-9"
          :class="activeSlide.accentColor"
          @click="toggleAutoplay"
        />
      </div>
    </div>
  </aside>
</template>
