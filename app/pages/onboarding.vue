<script setup lang="ts">
import type { ContentCategory } from '#shared/content'
import {
  viewerOnboardingSchema,
  type ViewerOnboardingInput,
  type ViewerPreferences
} from '#shared/viewer'
import { contentCategoryOptions } from '~/lib/channel-appearance'
import { authClient } from '~/lib/auth-client'

definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'Make Hoot yours',
  description: 'Choose what you want to see in your Hoot feed.',
  robots: 'noindex, nofollow'
})

const { data: session } = await authClient.useSession(useFetch)
const { data: preferences } = await useFetch<ViewerPreferences>('/api/preferences/me')

if (preferences.value?.onboardingCompleted) {
  await navigateTo('/')
}

const state = reactive<ViewerOnboardingInput>({ interests: [] })
const isSubmitting = ref(false)
const submitError = ref('')
const firstName = computed(() => session.value?.user.name.split(/\s+/)[0] || 'there')
const selectionIsValid = computed(() => state.interests.length === 0 || state.interests.length >= 2)

function toggleInterest(interest: ContentCategory) {
  submitError.value = ''
  const index = state.interests.indexOf(interest)

  if (index >= 0) {
    state.interests.splice(index, 1)
    return
  }

  if (state.interests.length < 4) state.interests.push(interest)
}

async function finish(interests: ContentCategory[]) {
  submitError.value = ''
  isSubmitting.value = true

  try {
    const payload = viewerOnboardingSchema.parse({ interests })
    await $fetch('/api/preferences/me', { method: 'PUT', body: payload })
    await navigateTo('/')
  } catch {
    submitError.value = 'We could not save your interests. Try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="min-h-dvh bg-[#0d0e11] px-5 py-7 text-[#f5f5f7] sm:px-8">
    <header class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2.25 no-underline"
        aria-label="Hoot home"
      >
        <img
          src="/favicon.svg"
          alt=""
          class="size-7.5"
          width="30"
          height="30"
        />
        <span class="text-[1.75rem] leading-none font-[850] tracking-[-.065em]">hoot</span>
      </NuxtLink>
      <p class="text-xs font-semibold tracking-wide text-muted">YOUR FEED</p>
    </header>

    <div class="mx-auto w-full max-w-6xl py-14 sm:py-18">
      <section class="max-w-3xl">
        <p class="text-xs font-bold tracking-[.16em] text-primary">
          WELCOME, {{ firstName.toUpperCase() }}
        </p>
        <h1 class="mt-4 text-4xl leading-[1.06] font-extrabold tracking-[-.045em] sm:text-6xl">
          What keeps you watching?
        </h1>
        <p class="mt-5 max-w-2xl text-[15px] leading-7 text-muted sm:text-base">
          Pick two to four interests. We’ll use them to put better streams near the top of your
          feed.
        </p>
      </section>

      <section
        class="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Choose your interests"
      >
        <button
          v-for="option in contentCategoryOptions"
          :key="option.value"
          type="button"
          :aria-pressed="state.interests.includes(option.value)"
          :disabled="state.interests.length >= 4 && !state.interests.includes(option.value)"
          class="group relative flex min-h-40 cursor-pointer flex-col items-start overflow-hidden rounded-2xl border p-5 text-left transition disabled:cursor-not-allowed disabled:opacity-35"
          :class="
            state.interests.includes(option.value)
              ? 'border-primary bg-primary/8'
              : 'border-white/8 bg-[#15161b] hover:border-white/18 hover:bg-[#191a20]'
          "
          @click="toggleInterest(option.value)"
        >
          <span :class="['grid size-11 place-items-center rounded-xl', option.surfaceClass]">
            <UIcon
              :name="option.icon"
              class="size-5"
            />
          </span>
          <strong class="mt-5 text-base">{{ option.label }}</strong>
          <span class="mt-1.5 pr-8 text-xs leading-5 text-muted">{{ option.description }}</span>
          <span
            class="absolute top-5 right-5 grid size-6 place-items-center rounded-full border"
            :class="
              state.interests.includes(option.value)
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
      </section>

      <div
        class="mt-8 flex flex-col gap-4 border-t border-white/8 pt-6 sm:flex-row sm:items-center"
      >
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold">{{ state.interests.length }}/4 selected</p>
          <p
            v-if="state.interests.length === 1"
            class="mt-1 text-xs text-primary"
          >
            Pick one more to continue.
          </p>
          <p
            v-else
            class="mt-1 text-xs text-muted"
          >
            You can change these later.
          </p>
          <p
            v-if="submitError"
            role="alert"
            class="mt-2 text-sm text-error"
          >
            {{ submitError }}
          </p>
        </div>
        <div class="flex flex-col-reverse gap-2 sm:flex-row">
          <UButton
            color="neutral"
            variant="ghost"
            size="xl"
            :disabled="isSubmitting"
            @click="finish([])"
          >
            Skip for now
          </UButton>
          <UButton
            size="xl"
            trailing-icon="i-lucide-arrow-right"
            :loading="isSubmitting"
            :disabled="!state.interests.length || !selectionIsValid"
            class="min-h-12 rounded-[9px] px-7 text-[15px] font-bold text-[#20140e]"
            @click="finish([...state.interests])"
          >
            Build my feed
          </UButton>
        </div>
      </div>
    </div>
  </main>
</template>
