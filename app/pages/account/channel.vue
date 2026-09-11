<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from '@nuxt/ui'
import type { ContentCategory } from '#shared/content'
import {
  channelHandleSchema,
  updateChannelSchema,
  type AvatarTheme,
  type ChannelProfile,
  type UpdateChannelInput
} from '#shared/channel'
import { avatarThemeOptions, contentCategoryOptions } from '~/lib/channel-appearance'

definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'Channel settings — Hoot',
  robots: 'noindex, nofollow'
})

const { data } = await useFetch<{ channel: ChannelProfile | null }>('/api/channels/me')

if (!data.value?.channel) {
  await navigateTo('/creator/onboarding')
}

const originalHandle = data.value!.channel!.handle
const publicChannelHandle = ref(originalHandle)
const state = reactive({
  handle: originalHandle,
  displayName: data.value!.channel!.displayName,
  bio: data.value!.channel!.bio,
  avatarTheme: data.value!.channel!.avatarTheme,
  topics: [...data.value!.channel!.topics]
})
const handleStatus = ref<'idle' | 'checking' | 'available' | 'unavailable'>('available')
const isSubmitting = ref(false)
const submitError = ref('')
const saved = ref(false)
let availabilityRequest = 0
let availabilityTimer: ReturnType<typeof setTimeout> | undefined

watch(
  () => state.handle,
  (value) => {
    const normalized = value.toLowerCase().replace(/[^a-z0-9_]/g, '')
    if (normalized !== value) {
      state.handle = normalized
      return
    }

    saved.value = false
    clearTimeout(availabilityTimer)
    handleStatus.value = 'idle'
    if (!channelHandleSchema.safeParse(value).success) return

    const request = ++availabilityRequest
    handleStatus.value = 'checking'
    availabilityTimer = setTimeout(async () => {
      try {
        const result = await $fetch('/api/channels/handle-available', { query: { handle: value } })
        if (request === availabilityRequest) {
          handleStatus.value = result.available ? 'available' : 'unavailable'
        }
      } catch {
        if (request === availabilityRequest) handleStatus.value = 'idle'
      }
    }, 350)
  }
)

watch(
  () => [state.displayName, state.bio, state.avatarTheme, state.topics.join(',')],
  () => {
    saved.value = false
  }
)

onBeforeUnmount(() => clearTimeout(availabilityTimer))

function focusError(event: FormErrorEvent): void {
  const id = event.errors[0]?.id
  if (id) document.getElementById(id)?.focus()
}

function selectTheme(theme: AvatarTheme) {
  state.avatarTheme = theme
}

function toggleTopic(topic: ContentCategory) {
  const index = state.topics.indexOf(topic)

  if (index >= 0) {
    state.topics.splice(index, 1)
    return
  }

  if (state.topics.length < 3) state.topics.push(topic)
}

async function submit(event: FormSubmitEvent<UpdateChannelInput>) {
  submitError.value = ''
  saved.value = false
  isSubmitting.value = true

  try {
    const channel = await $fetch<ChannelProfile>('/api/channels/me', {
      method: 'PATCH',
      body: event.data
    })
    state.handle = channel.handle
    publicChannelHandle.value = channel.handle
    state.displayName = channel.displayName
    state.bio = channel.bio
    state.avatarTheme = channel.avatarTheme
    state.topics = [...channel.topics]
    saved.value = true
  } catch (error) {
    const statusCode = (error as { statusCode?: number }).statusCode
    submitError.value =
      statusCode === 409
        ? 'That handle was just taken. Choose another one.'
        : 'We could not save your channel. Try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="min-h-dvh bg-[#0d0e11] px-5 py-8 text-[#f5f5f7]">
    <div class="mx-auto w-full max-w-3xl">
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
          <span class="text-[1.75rem] leading-none font-[850] tracking-[-.065em]">hoot</span>
        </NuxtLink>
        <UButton
          color="neutral"
          variant="ghost"
          leading-icon="i-lucide-arrow-left"
          to="/account"
        >
          Back to account
        </UButton>
      </header>

      <section class="mt-16 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p class="text-xs font-bold tracking-[.16em] text-primary">CHANNEL SETTINGS</p>
          <h1 class="mt-3 text-4xl font-extrabold tracking-[-.04em]">Shape your public channel.</h1>
          <p class="mt-3 max-w-xl text-[15px] leading-7 text-muted">
            Update how viewers find you and what they see before your stream starts.
          </p>
        </div>
        <UButton
          color="neutral"
          variant="soft"
          trailing-icon="i-lucide-arrow-up-right"
          :to="`/${publicChannelHandle}`"
          class="shrink-0 self-start sm:self-auto"
        >
          View channel
        </UButton>
      </section>

      <section class="mt-10 rounded-3xl border border-white/8 bg-[#15161b] p-6 sm:p-8">
        <div
          v-if="saved"
          role="status"
          class="mb-6 flex items-start gap-3 rounded-xl border border-success/25 bg-success/10 px-4 py-3 text-sm text-success"
        >
          <UIcon
            name="i-lucide-circle-check"
            class="mt-0.5 size-5 shrink-0"
          />
          <div>
            <p class="font-bold">Channel updated</p>
            <p class="mt-0.5 text-success/80">Your public profile now shows these changes.</p>
          </div>
        </div>

        <p
          v-if="submitError"
          role="alert"
          class="mb-6 rounded-xl border border-error/25 bg-error/10 px-4 py-3 text-sm text-error"
        >
          {{ submitError }}
        </p>

        <UForm
          :schema="updateChannelSchema"
          :state="state"
          :validate-on="['blur', 'change']"
          class="flex flex-col gap-6"
          @error="focusError"
          @submit="submit"
        >
          <UFormField
            label="Channel handle"
            name="handle"
            help="Changing this also changes your public channel URL."
            required
          >
            <UInput
              v-model="state.handle"
              placeholder="your_handle"
              autocomplete="off"
              :maxlength="24"
              size="xl"
              class="w-full"
            >
              <template #leading><span class="text-sm font-semibold text-muted">@</span></template>
              <template #trailing>
                <UIcon
                  v-if="handleStatus === 'checking'"
                  name="i-lucide-loader-circle"
                  class="size-4 animate-spin text-muted"
                />
                <UIcon
                  v-else-if="handleStatus === 'available'"
                  name="i-lucide-circle-check"
                  class="size-4 text-success"
                />
                <UIcon
                  v-else-if="handleStatus === 'unavailable'"
                  name="i-lucide-circle-x"
                  class="size-4 text-error"
                />
              </template>
            </UInput>
            <p
              v-if="handleStatus === 'available' && state.handle !== originalHandle"
              class="mt-2 text-xs text-success"
            >
              This handle is available.
            </p>
            <p
              v-else-if="handleStatus === 'unavailable'"
              class="mt-2 text-xs text-error"
            >
              This handle is already in use.
            </p>
          </UFormField>

          <UFormField
            label="Display name"
            name="displayName"
            required
          >
            <UInput
              v-model="state.displayName"
              placeholder="How viewers will know you"
              autocomplete="nickname"
              :maxlength="50"
              size="xl"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Bio"
            name="bio"
            help="A short introduction for your channel page."
          >
            <UTextarea
              v-model="state.bio"
              placeholder="What do you stream? What should people expect?"
              :maxlength="300"
              :rows="4"
              autoresize
              size="xl"
              class="w-full"
            />
            <p class="mt-2 text-right text-xs text-muted">{{ state.bio.length }}/300</p>
          </UFormField>

          <UFormField
            label="Channel colour"
            name="avatarTheme"
            required
          >
            <div
              class="flex flex-wrap gap-3"
              role="radiogroup"
              aria-label="Channel colour"
            >
              <button
                v-for="theme in avatarThemeOptions"
                :key="theme.value"
                type="button"
                role="radio"
                :aria-label="theme.label"
                :aria-checked="state.avatarTheme === theme.value"
                :class="[
                  'grid size-11 cursor-pointer place-items-center rounded-full border-2 transition',
                  theme.avatarClass,
                  state.avatarTheme === theme.value
                    ? 'border-white ring-2 ring-white/20 ring-offset-2 ring-offset-[#15161b]'
                    : 'border-transparent hover:scale-105'
                ]"
                @click="selectTheme(theme.value)"
              >
                <UIcon
                  v-if="state.avatarTheme === theme.value"
                  name="i-lucide-check"
                  class="size-4"
                />
              </button>
            </div>
          </UFormField>

          <UFormField
            label="Channel topics"
            name="topics"
            :help="`${state.topics.length}/3 selected`"
            required
          >
            <div class="grid gap-2 sm:grid-cols-2">
              <button
                v-for="option in contentCategoryOptions"
                :key="option.value"
                type="button"
                :aria-pressed="state.topics.includes(option.value)"
                :disabled="state.topics.length >= 3 && !state.topics.includes(option.value)"
                class="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-35"
                :class="
                  state.topics.includes(option.value)
                    ? 'border-primary bg-primary/8'
                    : 'border-white/8 bg-[#111216] hover:border-white/18'
                "
                @click="toggleTopic(option.value)"
              >
                <UIcon
                  :name="option.icon"
                  class="size-4 shrink-0"
                  :class="state.topics.includes(option.value) ? 'text-primary' : 'text-muted'"
                />
                <span class="text-sm font-semibold">{{ option.label }}</span>
                <UIcon
                  v-if="state.topics.includes(option.value)"
                  name="i-lucide-check"
                  class="ml-auto size-4 text-primary"
                />
              </button>
            </div>
          </UFormField>

          <div
            class="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-6"
          >
            <p class="text-xs text-muted">Your handle can be changed later.</p>
            <UButton
              type="submit"
              size="xl"
              :loading="isSubmitting"
              :disabled="handleStatus === 'unavailable' || handleStatus === 'checking'"
              class="min-h-12 rounded-[9px] px-7 text-[15px] font-bold text-[#20140e]"
            >
              Save changes
            </UButton>
          </div>
        </UForm>
      </section>
    </div>
  </main>
</template>
