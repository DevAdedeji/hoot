<script setup lang="ts">
import type { FormErrorEvent } from '@nuxt/ui'
import { z } from 'zod'

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

function focusError(event: FormErrorEvent): void {
  const id = event.errors[0]?.id
  if (id) document.getElementById(id)?.focus()
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
    <p class="mt-3.5 text-[15px] leading-[1.7] text-muted">
      It happens. Enter the email you use for Hoot.
    </p>

    <UForm
      :schema="schema"
      :state="state"
      :validate-on="['blur', 'change']"
      class="mt-7.25 flex flex-col gap-5.25"
      @error="focusError"
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
  </div>
</template>
