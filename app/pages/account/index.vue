<script setup lang="ts">
import type { ContentCategory } from '#shared/content'
import type { ChannelProfile } from '#shared/channel'
import {
  viewerOnboardingSchema,
  type ViewerOnboardingInput,
  type ViewerPreferences
} from '#shared/viewer'
import { authClient } from '~/lib/auth-client'
import { contentCategoryOptions } from '~/lib/channel-appearance'

definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'Your account — Hoot',
  robots: 'noindex, nofollow'
})

const { data: session } = await authClient.useSession(useFetch)
const { data: preferences } = await useFetch<ViewerPreferences>('/api/preferences/me')
const { data: channelData } = await useFetch<{ channel: ChannelProfile | null }>('/api/channels/me')
const interestState = reactive<ViewerOnboardingInput>({
  interests: [...(preferences.value?.interests ?? [])]
})
const isSavingInterests = ref(false)
const interestError = ref('')
const interestsSaved = ref(false)
const isSigningOut = ref(false)
const interestSelectionIsValid = computed(
  () => interestState.interests.length === 0 || interestState.interests.length >= 2
)

function toggleInterest(interest: ContentCategory) {
  interestsSaved.value = false
  interestError.value = ''
  const index = interestState.interests.indexOf(interest)

  if (index >= 0) {
    interestState.interests.splice(index, 1)
    return
  }

  if (interestState.interests.length < 4) interestState.interests.push(interest)
}

async function saveInterests() {
  interestError.value = ''
  interestsSaved.value = false
  isSavingInterests.value = true

  try {
    const payload = viewerOnboardingSchema.parse({ interests: [...interestState.interests] })
    await $fetch('/api/preferences/me', { method: 'PUT', body: payload })
    interestsSaved.value = true
  } catch {
    interestError.value = 'We could not save your interests. Try again.'
  } finally {
    isSavingInterests.value = false
  }
}

async function signOut() {
  isSigningOut.value = true

  try {
    await authClient.signOut()
    await navigateTo('/')
  } finally {
    isSigningOut.value = false
  }
}
</script>

<template>
  <main class="min-h-dvh bg-[#0d0e11] px-5 py-8 text-[#f5f5f7]">
    <div class="mx-auto w-full max-w-4xl">
      <header class="flex items-center justify-between gap-4">
        <NuxtLink
          to="/"
          class="inline-flex w-fit shrink-0 items-center gap-2.25 no-underline"
          aria-label="Hoot home"
        >
          <img
            src="/favicon.svg"
            alt=""
            class="size-7.5"
            width="30"
            height="30"
          />
          <span class="text-[1.75rem] leading-none font-[850] tracking-[-.065em] text-[#f5f5f7]"
            >hoot</span
          >
        </NuxtLink>
        <UButton
          color="neutral"
          variant="ghost"
          leading-icon="i-lucide-arrow-left"
          to="/"
          >Back to discover</UButton
        >
      </header>

      <section class="mt-16 rounded-3xl border border-white/8 bg-[#15161b] p-8">
        <div class="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
          <div>
            <div
              class="grid size-14 place-items-center rounded-full bg-primary/15 text-lg font-bold text-primary"
            >
              {{ session?.user.name?.slice(0, 2).toUpperCase() }}
            </div>
            <p class="mt-8 text-[11px] font-bold tracking-[.15em] text-primary">YOUR ACCOUNT</p>
            <h1 class="mt-2 text-3xl font-bold tracking-tight">{{ session?.user.name }}</h1>
            <p class="mt-2 text-sm text-muted">{{ session?.user.email }}</p>
          </div>

          <div
            v-if="channelData?.channel"
            class="flex flex-wrap gap-2"
          >
            <UButton
              color="neutral"
              variant="soft"
              trailing-icon="i-lucide-arrow-up-right"
              :to="`/${channelData.channel.handle}`"
            >
              View channel
            </UButton>
            <UButton
              color="neutral"
              variant="ghost"
              leading-icon="i-lucide-settings-2"
              to="/account/channel"
            >
              Channel settings
            </UButton>
          </div>
          <UButton
            v-else
            color="neutral"
            variant="soft"
            leading-icon="i-lucide-circle-plus"
            to="/creator/onboarding"
            class="self-start"
          >
            Create channel
          </UButton>
        </div>
      </section>

      <section
        id="interests"
        class="mt-6 scroll-mt-8 rounded-3xl border border-white/8 bg-[#15161b] p-8"
      >
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p class="text-[11px] font-bold tracking-[.15em] text-primary">YOUR INTERESTS</p>
            <h2 class="mt-2 text-2xl font-bold tracking-tight">Tune your feed</h2>
            <p class="mt-2 max-w-xl text-sm leading-6 text-muted">
              Choose two to four interests, or clear everything for a broader mix.
            </p>
          </div>
          <p class="shrink-0 text-sm font-semibold text-muted">
            {{ interestState.interests.length }}/4 selected
          </p>
        </div>

        <div class="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button
            v-for="option in contentCategoryOptions"
            :key="option.value"
            type="button"
            :aria-pressed="interestState.interests.includes(option.value)"
            :disabled="
              interestState.interests.length >= 4 && !interestState.interests.includes(option.value)
            "
            class="group relative flex min-h-31 cursor-pointer flex-col items-start rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-35"
            :class="
              interestState.interests.includes(option.value)
                ? 'border-primary bg-primary/8'
                : 'border-white/8 bg-[#111217] hover:border-white/18'
            "
            @click="toggleInterest(option.value)"
          >
            <span :class="['grid size-9 place-items-center rounded-lg', option.surfaceClass]">
              <UIcon
                :name="option.icon"
                class="size-4"
              />
            </span>
            <strong class="mt-4 text-sm">{{ option.label }}</strong>
            <span class="mt-1 text-xs leading-5 text-muted">{{ option.description }}</span>
            <span
              class="absolute top-4 right-4 grid size-5.5 place-items-center rounded-full border"
              :class="
                interestState.interests.includes(option.value)
                  ? 'border-primary bg-primary text-[#20140e]'
                  : 'border-white/35 bg-black/15 text-transparent group-hover:border-white/60'
              "
            >
              <UIcon
                name="i-lucide-check"
                class="size-3.5"
              />
            </span>
          </button>
        </div>

        <div
          class="mt-7 flex flex-col gap-4 border-t border-white/8 pt-6 sm:flex-row sm:items-center"
        >
          <div class="min-h-10 flex-1">
            <p
              v-if="interestState.interests.length === 1"
              class="text-sm text-primary"
            >
              Select one more, or clear your selection.
            </p>
            <p
              v-if="interestsSaved"
              role="status"
              class="text-sm text-success"
            >
              Your feed has been updated.
            </p>
            <p
              v-if="interestError"
              role="alert"
              class="text-sm text-error"
            >
              {{ interestError }}
            </p>
          </div>
          <UButton
            size="xl"
            :loading="isSavingInterests"
            :disabled="!interestSelectionIsValid"
            class="min-h-12 rounded-[9px] px-7 text-[15px] font-bold text-[#20140e]"
            @click="saveInterests"
          >
            Save interests
          </UButton>
        </div>
      </section>

      <section
        id="security"
        class="mt-6 scroll-mt-8 rounded-3xl border border-white/8 bg-[#15161b] p-8"
      >
        <div class="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p class="text-[11px] font-bold tracking-[.15em] text-primary">CURRENT SESSION</p>
            <h2 class="mt-2 text-xl font-bold tracking-tight">Signed in on this device</h2>
            <p class="mt-2 text-sm leading-6 text-muted">
              Logging out will end your current Hoot session.
            </p>
          </div>
          <UButton
            color="error"
            variant="solid"
            size="lg"
            leading-icon="i-lucide-log-out"
            :loading="isSigningOut"
            class="self-start font-bold sm:self-auto"
            @click="signOut"
          >
            Log out
          </UButton>
        </div>
      </section>
    </div>
  </main>
</template>
