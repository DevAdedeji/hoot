<script setup lang="ts">
import type { FormErrorEvent } from '@nuxt/ui'
import { z } from 'zod'

definePageMeta({ layout: 'auth' })

useSeoMeta({
  title: 'Join Hoot',
  description: 'Find your people and make yourself at home on Hoot.',
  robots: 'noindex, nofollow'
})

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Enter a name with at least 2 characters.')
    .max(80, 'Use 80 characters or fewer.'),
  email: z
    .string()
    .trim()
    .email('Enter a valid email address.')
    .max(254, 'Use 254 characters or fewer.'),
  password: z
    .string()
    .min(10, 'Use at least 10 characters for your password.')
    .max(200, 'Use 200 characters or fewer.')
})
type Schema = z.output<typeof schema>

const state = reactive<Schema>({ name: '', email: '', password: '' })
const showPassword = ref(false)

function focusError(event: FormErrorEvent): void {
  const id = event.errors[0]?.id
  if (id) document.getElementById(id)?.focus()
}
</script>

<template>
  <div class="w-full max-w-101.25 max-[761px]:max-w-107.5">
    <p class="mb-3.5 text-[11px] font-bold tracking-[.15em] text-primary">YOUR CORNER IS WAITING</p>
    <h1
      class="text-[clamp(1.9rem,2.8vw,2.5rem)] leading-[1.15] font-[750] tracking-tighter max-[761px]:text-[2.3rem]"
    >
      Make yourself at home.
    </h1>
    <p class="mt-3.5 text-[15px] leading-[1.7] text-muted">A little more live looks good on you.</p>

    <div class="mt-8">
      <UButton
        block
        color="neutral"
        variant="solid"
        size="xl"
        class="min-h-12.25 gap-3 rounded-[9px] border border-white bg-[#f2f2f4] text-sm font-[650] text-[#242529] hover:bg-[#dcdce0]"
        leading-icon="i-simple-icons-google"
        :ui="{ leadingIcon: 'size-[18px]' }"
      >
        Continue with Google
      </UButton>
      <USeparator
        label="or continue with email"
        :ui="{ label: 'text-xs text-[#9297a3]' }"
        class="my-6.25"
      />
    </div>

    <UForm
      :schema="schema"
      :state="state"
      :validate-on="['blur', 'change']"
      class="flex flex-col gap-5.25"
      @error="focusError"
    >
      <UFormField
        label="Your name"
        name="name"
        required
      >
        <UInput
          v-model="state.name"
          placeholder="What should we call you?"
          autocomplete="name"
          :maxlength="80"
          size="xl"
          class="w-full"
        />
      </UFormField>
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
        help="At least 10 characters. Make it your own."
        required
      >
        <UInput
          v-model="state.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Create a password"
          autocomplete="new-password"
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
        trailing-icon="i-lucide-arrow-right"
        class="mt-1 min-h-12.25 rounded-[9px] text-[15px] font-bold text-[#20140e]"
      >
        Create account
      </UButton>
    </UForm>

    <p class="mt-6.25 text-center text-sm leading-[1.7] text-muted [&_a]:ml-1">
      Already part of the crew?
      <NuxtLink
        to="/login"
        class="font-[550] text-[#ffab83] hover:text-[#ffc3a7] hover:underline hover:underline-offset-4"
        >Log in</NuxtLink
      >
    </p>
  </div>
</template>
