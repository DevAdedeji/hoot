<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'
import { authClient } from '~/lib/auth-client'

definePageMeta({ layout: 'auth' })

useSeoMeta({
  title: 'Reset your password — Hoot',
  description: 'Recover access to your Hoot account.',
  robots: 'noindex, nofollow'
})

const schema = z.object({
  email: z
    .string()
    .trim()
    .email('Enter a valid email address.')
    .max(254, 'Use 254 characters or fewer.')
})
type Schema = z.output<typeof schema>

const state = reactive<Schema>({ email: '' })
const isSubmitting = ref(false)
const submitError = ref('')
const isComplete = ref(false)

function focusError(event: FormErrorEvent): void {
  const id = event.errors[0]?.id
  if (id) document.getElementById(id)?.focus()
}

async function submit(event: FormSubmitEvent<Schema>) {
  submitError.value = ''
  isSubmitting.value = true

  try {
    const { error } = await authClient.requestPasswordReset({
      email: event.data.email,
      redirectTo: '/reset-password'
    })

    if (error) {
      submitError.value = 'We could not send the reset link. Try again.'
      return
    }

    isComplete.value = true
  } catch {
    submitError.value = 'We could not reach Hoot. Try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-101.25 max-[761px]:max-w-107.5">
    <p class="mb-3.5 text-[11px] font-bold tracking-[.15em] text-primary">LET’S GET YOU BACK IN</p>
    <h1
      class="text-[clamp(1.9rem,2.8vw,2.5rem)] leading-[1.15] font-[750] tracking-tighter max-[761px]:text-[2.3rem]"
    >
      Forgot your password?
    </h1>
    <template v-if="isComplete">
      <p class="mt-3.5 text-[15px] leading-[1.7] text-muted">
        If an account uses that address, a reset link is on its way. Check your inbox and spam
        folder.
      </p>
      <UButton
        to="/login"
        block
        size="xl"
        trailing-icon="i-lucide-arrow-right"
        class="mt-8 min-h-12.25 rounded-[9px] text-[15px] font-bold text-[#20140e]"
      >
        Back to log in
      </UButton>
    </template>

    <template v-else>
      <p class="mt-3.5 text-[15px] leading-[1.7] text-muted">
        It happens. Enter the email you use for Hoot.
      </p>

      <p
        v-if="submitError"
        role="alert"
        class="mt-6 rounded-lg border border-error/25 bg-error/10 px-3.5 py-3 text-sm text-error"
      >
        {{ submitError }}
      </p>

      <UForm
        :schema="schema"
        :state="state"
        :validate-on="['blur', 'change']"
        class="mt-7.25 flex flex-col gap-5.25"
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
        <UButton
          type="submit"
          block
          size="xl"
          :loading="isSubmitting"
          trailing-icon="i-lucide-arrow-right"
          class="mt-1 min-h-12.25 rounded-[9px] text-[15px] font-bold text-[#20140e]"
        >
          Send reset link
        </UButton>
      </UForm>

      <p class="mt-6.25 text-center text-sm leading-[1.7] text-muted [&_a]:ml-1">
        <NuxtLink
          to="/login"
          class="font-[550] text-[#ffab83] hover:text-[#ffc3a7] hover:underline hover:underline-offset-4"
          >Back to log in</NuxtLink
        >
      </p>
    </template>
  </div>
</template>
