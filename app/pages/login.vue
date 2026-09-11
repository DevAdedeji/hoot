<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'
import { authClient } from '@/lib/auth-client'

definePageMeta({ layout: 'auth' })

useSeoMeta({
  title: 'Log in — Hoot',
  description: 'Log in to your corner of live.',
  robots: 'noindex, nofollow'
})

const schema = z.object({
  email: z
    .string()
    .trim()
    .email('Enter a valid email address.')
    .max(254, 'Use 254 characters or fewer.'),
  password: z.string().min(1, 'Enter your password.').max(200, 'Use 200 characters or fewer.')
})
type Schema = z.output<typeof schema>

const state = reactive<Schema>({ email: '', password: '' })
const showPassword = ref(false)
const isSubmitting = ref(false)
const isGoogleSubmitting = ref(false)
const submitError = ref('')
const route = useRoute()
const passwordWasReset = computed(() => route.query.reset === '1')

const redirectTo = computed(() => {
  const redirect = route.query.redirect
  return typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
    ? redirect
    : '/'
})

function focusError(event: FormErrorEvent): void {
  const id = event.errors[0]?.id
  if (id) document.getElementById(id)?.focus()
}

async function submit(event: FormSubmitEvent<Schema>) {
  submitError.value = ''
  isSubmitting.value = true

  try {
    const { error } = await authClient.signIn.email({
      email: event.data.email,
      password: event.data.password,
      callbackURL: redirectTo.value
    })

    if (error) {
      if (error.status === 403) {
        await navigateTo({ path: '/verify-email', query: { email: event.data.email } })
        return
      }

      submitError.value = 'We could not log you in with those details.'
      return
    }

    await navigateTo(redirectTo.value)
  } catch {
    submitError.value = 'We could not reach Hoot. Try again.'
  } finally {
    isSubmitting.value = false
  }
}

async function continueWithGoogle() {
  submitError.value = ''
  isGoogleSubmitting.value = true

  try {
    const { error } = await authClient.signIn.social({
      provider: 'google',
      callbackURL: redirectTo.value
    })

    if (error) {
      submitError.value = 'Google sign-in is unavailable right now.'
    }
  } catch {
    submitError.value = 'We could not reach Google sign-in. Try again.'
  } finally {
    isGoogleSubmitting.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-101.25 max-[761px]:max-w-107.5">
    <p class="mb-3.5 text-[11px] font-bold tracking-[.15em] text-primary">GOOD TO HAVE YOU BACK</p>
    <h1
      class="text-[clamp(1.9rem,2.8vw,2.5rem)] leading-[1.15] font-[750] tracking-tighter max-[761px]:text-[2.3rem]"
    >
      Welcome home.
    </h1>
    <p class="mt-3.5 text-[15px] leading-[1.7] text-muted">
      Your people. Your streams. Right where you left them.
    </p>

    <div class="mt-8">
      <UButton
        block
        color="neutral"
        variant="solid"
        size="xl"
        type="button"
        :loading="isGoogleSubmitting"
        class="min-h-12.25 gap-3 rounded-[9px] border border-white bg-[#f2f2f4] text-sm font-[650] text-[#242529] hover:bg-[#dcdce0]"
        leading-icon="i-simple-icons-google"
        :ui="{ leadingIcon: 'size-[18px]' }"
        @click="continueWithGoogle"
      >
        Continue with Google
      </UButton>
      <USeparator
        label="or continue with email"
        :ui="{ label: 'text-xs text-[#9297a3]' }"
        class="my-6.25"
      />
    </div>

    <p
      v-if="submitError"
      role="alert"
      class="mb-5 rounded-lg border border-error/25 bg-error/10 px-3.5 py-3 text-sm text-error"
    >
      {{ submitError }}
    </p>
    <p
      v-else-if="passwordWasReset"
      role="status"
      class="mb-5 rounded-lg border border-success/25 bg-success/10 px-3.5 py-3 text-sm text-success"
    >
      Your password has been updated. Log in with the new one.
    </p>

    <UForm
      :schema="schema"
      :state="state"
      :validate-on="['blur', 'change']"
      class="flex flex-col gap-5.25"
      @error="focusError"
      @submit="submit"
    >
      <UFormField
        label="Email address"
        name="email"
        required
      >
        <UInput
          v-model="state.email"
          type="email"
          placeholder="you@example.com"
          autocomplete="email"
          inputmode="email"
          :maxlength="254"
          size="xl"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="Password"
        name="password"
        required
      >
        <template #hint>
          <NuxtLink
            to="/forgot-password"
            class="font-[550] text-[#ffab83] hover:text-[#ffc3a7] hover:underline hover:underline-offset-4"
            >Forgot password?</NuxtLink
          >
        </template>
        <UInput
          v-model="state.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Enter your password"
          autocomplete="current-password"
          :maxlength="200"
          size="xl"
          class="w-full"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              :aria-pressed="showPassword"
              type="button"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </UFormField>
      <UButton
        type="submit"
        block
        size="xl"
        :loading="isSubmitting"
        trailing-icon="i-lucide-arrow-right"
        class="mt-1 min-h-12.25 rounded-[9px] text-[15px] font-bold text-[#20140e]"
      >
        Log in
      </UButton>
    </UForm>

    <p class="mt-6.25 text-center text-sm leading-[1.7] text-muted [&_a]:ml-1">
      New around here?
      <NuxtLink
        to="/signup"
        class="font-[550] text-[#ffab83] hover:text-[#ffc3a7] hover:underline hover:underline-offset-4"
        >Join Hoot</NuxtLink
      >
    </p>
  </div>
</template>
