<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from '@nuxt/ui'
import type { ContentCategory } from '#shared/content'
import {
  channelDetailsSchema,
  channelHandleSchema,
  channelIdentitySchema,
  createChannelSchema,
  type AvatarTheme,
  type ChannelDetailsInput,
  type ChannelIdentityInput,
  type CreateChannelInput
} from '#shared/channel'
import Preview from '~/components/channel/Preview.vue'
import { avatarThemeOptions, contentCategoryOptions } from '~/lib/channel-appearance'
import { authClient } from '~/lib/auth-client'

definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'Create your channel — Hoot',
  description: 'Claim your Hoot handle and shape your public channel.',
  robots: 'noindex, nofollow'
})

const { data: session } = await authClient.useSession(useFetch)
const { data: ownChannel } = await useFetch('/api/channels/me')

if (ownChannel.value?.channel) {
  await navigateTo(`/${ownChannel.value.channel.handle}`)
}

const step = ref<1 | 2>(1)
const identity = reactive<ChannelIdentityInput>({
  handle: '',
  displayName: session.value?.user.name ?? ''
})
const details = reactive<ChannelDetailsInput>({
  avatarTheme: 'orange',
  topics: [],
  bio: ''
})
const handleStatus = ref<'idle' | 'checking' | 'available' | 'unavailable'>('idle')
const isSubmitting = ref(false)
const submitError = ref('')
let availabilityRequest = 0
let availabilityTimer: ReturnType<typeof setTimeout> | undefined

watch(
  () => identity.handle,
  (value) => {
    const normalized = value.toLowerCase().replace(/[^a-z0-9_]/g, '')
    if (normalized !== value) {
      identity.handle = normalized
      return
    }

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

onBeforeUnmount(() => clearTimeout(availabilityTimer))

function focusError(event: FormErrorEvent): void {
  const id = event.errors[0]?.id
  if (id) document.getElementById(id)?.focus()
}

function continueToDetails() {
  submitError.value = ''
  step.value = 2
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function selectTheme(theme: AvatarTheme) {
  details.avatarTheme = theme
}

function toggleTopic(topic: ContentCategory) {
  const index = details.topics.indexOf(topic)

  if (index >= 0) {
    details.topics.splice(index, 1)
    return
  }

  if (details.topics.length < 3) details.topics.push(topic)
}

async function createChannel(event: FormSubmitEvent<ChannelDetailsInput>) {
  submitError.value = ''
  isSubmitting.value = true

  try {
    const payload: CreateChannelInput = createChannelSchema.parse({
      ...identity,
      ...event.data
    })
    const channel = await $fetch('/api/channels', { method: 'POST', body: payload })
    await navigateTo(`/${channel.handle}`)
  } catch (error) {
    const statusCode = (error as { statusCode?: number }).statusCode
    submitError.value =
      statusCode === 409
        ? 'That handle was just taken. Go back and choose another one.'
        : 'We could not create your channel. Try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="min-h-dvh bg-[#0d0e11] px-5 py-7 text-[#f5f5f7] sm:px-8">
    <header class="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
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
      <div class="flex items-center gap-3">
        <span class="text-xs font-semibold text-muted">{{ step }} of 2</span>
        <div class="flex gap-1.5">
          <span class="h-1.5 w-8 rounded-full bg-primary" />
          <span
            class="h-1.5 w-8 rounded-full"
            :class="step === 2 ? 'bg-primary' : 'bg-white/12'"
          />
        </div>
      </div>
    </header>

    <div
      class="mx-auto grid w-full max-w-7xl gap-10 py-12 lg:grid-cols-[minmax(340px,.85fr)_minmax(460px,1.15fr)] lg:gap-16 lg:py-16"
    >
      <aside class="order-2 lg:order-1 lg:sticky lg:top-10 lg:self-start">
        <div class="mb-4 flex items-center justify-between">
          <p class="text-[10px] font-bold tracking-[.16em] text-primary">LIVE PREVIEW</p>
          <p class="flex items-center gap-1.5 text-[10px] text-muted">
            <span class="size-1.5 rounded-full bg-success" /> Updates as you type
          </p>
        </div>
        <Preview
          :avatar-theme="details.avatarTheme"
          :bio="details.bio"
          :display-name="identity.displayName"
          :handle="identity.handle"
          :topics="details.topics"
        />
      </aside>

      <section class="order-1 lg:order-2">
        <template v-if="step === 1">
          <p class="text-xs font-bold tracking-[.16em] text-primary">CLAIM YOUR CORNER</p>
          <h1 class="mt-4 text-4xl leading-[1.06] font-extrabold tracking-[-.045em] sm:text-5xl">
            Start with a name people remember.
          </h1>
          <p class="mt-5 max-w-xl text-[15px] leading-7 text-muted">
            This is your public identity on Hoot. You can change both later in channel settings.
          </p>

          <UForm
            :schema="channelIdentitySchema"
            :state="identity"
            :validate-on="['blur', 'change']"
            class="mt-9 flex flex-col gap-6"
            @error="focusError"
            @submit="continueToDetails"
          >
            <UFormField
              label="Display name"
              name="displayName"
              required
            >
              <UInput
                v-model="identity.displayName"
                placeholder="How viewers will know you"
                autocomplete="nickname"
                :maxlength="50"
                size="xl"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Channel handle"
              name="handle"
              help="Your public address will be hoot.live/your_handle."
              required
            >
              <UInput
                v-model="identity.handle"
                placeholder="your_handle"
                autocomplete="off"
                :maxlength="24"
                size="xl"
                class="w-full"
              >
                <template #leading
                  ><span class="text-sm font-semibold text-muted">@</span></template
                >
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
                v-if="handleStatus === 'available'"
                class="mt-2 text-xs text-success"
              >
                @{{ identity.handle }} is yours to claim.
              </p>
              <p
                v-else-if="handleStatus === 'unavailable'"
                class="mt-2 text-xs text-error"
              >
                This handle is already in use.
              </p>
            </UFormField>

            <UButton
              type="submit"
              block
              size="xl"
              :disabled="handleStatus !== 'available'"
              trailing-icon="i-lucide-arrow-right"
              class="mt-1 min-h-12.25 rounded-[9px] text-[15px] font-bold text-[#20140e]"
            >
              Continue with @{{ identity.handle || 'your_handle' }}
            </UButton>
          </UForm>
        </template>

        <template v-else>
          <UButton
            color="neutral"
            variant="ghost"
            leading-icon="i-lucide-arrow-left"
            class="-ml-3"
            @click="step = 1"
          >
            Back
          </UButton>
          <p class="mt-6 text-xs font-bold tracking-[.16em] text-primary">MAKE IT FEEL LIKE YOU</p>
          <h1 class="mt-4 text-4xl leading-[1.06] font-extrabold tracking-[-.045em] sm:text-5xl">
            What happens on your channel?
          </h1>
          <p class="mt-5 max-w-xl text-[15px] leading-7 text-muted">
            Pick a colour and up to three topics. Viewers will see these on your channel.
          </p>

          <p
            v-if="submitError"
            role="alert"
            class="mt-6 rounded-xl border border-error/25 bg-error/10 px-4 py-3 text-sm text-error"
          >
            {{ submitError }}
          </p>

          <UForm
            :schema="channelDetailsSchema"
            :state="details"
            :validate-on="['blur', 'change']"
            class="mt-9 flex flex-col gap-7"
            @error="focusError"
            @submit="createChannel"
          >
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
                  :aria-checked="details.avatarTheme === theme.value"
                  :class="[
                    'grid size-11 cursor-pointer place-items-center rounded-full border-2 transition',
                    theme.avatarClass,
                    details.avatarTheme === theme.value
                      ? 'border-white ring-2 ring-white/20 ring-offset-2 ring-offset-[#0d0e11]'
                      : 'border-transparent hover:scale-105'
                  ]"
                  @click="selectTheme(theme.value)"
                >
                  <UIcon
                    v-if="details.avatarTheme === theme.value"
                    name="i-lucide-check"
                    class="size-4"
                  />
                </button>
              </div>
            </UFormField>

            <UFormField
              label="What will you stream?"
              name="topics"
              :help="`${details.topics.length}/3 selected`"
              required
            >
              <div class="grid gap-2 sm:grid-cols-2">
                <button
                  v-for="option in contentCategoryOptions"
                  :key="option.value"
                  type="button"
                  :aria-pressed="details.topics.includes(option.value)"
                  :disabled="details.topics.length >= 3 && !details.topics.includes(option.value)"
                  class="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-35"
                  :class="
                    details.topics.includes(option.value)
                      ? 'border-primary bg-primary/8'
                      : 'border-white/8 bg-[#15161b] hover:border-white/18'
                  "
                  @click="toggleTopic(option.value)"
                >
                  <UIcon
                    :name="option.icon"
                    class="size-4 shrink-0"
                    :class="details.topics.includes(option.value) ? 'text-primary' : 'text-muted'"
                  />
                  <span class="text-sm font-semibold">{{ option.label }}</span>
                  <UIcon
                    v-if="details.topics.includes(option.value)"
                    name="i-lucide-check"
                    class="ml-auto size-4 text-primary"
                  />
                </button>
              </div>
            </UFormField>

            <UFormField
              label="Bio"
              name="bio"
              help="Optional. Give viewers a reason to return."
            >
              <UTextarea
                v-model="details.bio"
                placeholder="What should people expect when you go live?"
                :maxlength="300"
                :rows="3"
                autoresize
                size="xl"
                class="w-full"
              />
              <p class="mt-2 text-right text-xs text-muted">{{ details.bio.length }}/300</p>
            </UFormField>

            <UButton
              type="submit"
              block
              size="xl"
              :loading="isSubmitting"
              trailing-icon="i-lucide-arrow-up-right"
              class="min-h-12.25 rounded-[9px] text-[15px] font-bold text-[#20140e]"
            >
              Open my channel
            </UButton>
          </UForm>
        </template>
      </section>
    </div>
  </main>
</template>
