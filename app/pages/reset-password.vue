<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'
import { authClient } from '@/lib/auth-client'

definePageMeta({ layout: 'auth' })

useSeoMeta({
  title: 'Choose a new password — Hoot',
  description: 'Choose a new password for your Hoot account.',
  robots: 'noindex, nofollow'
})

const route = useRoute()
const token = computed(() => (typeof route.query.token === 'string' ? route.query.token : ''))
const invalidToken = computed(() => !token.value || Boolean(route.query.error))

const schema = z
  .object({
    password: z
      .string()
      .min(10, 'Use at least 10 characters for your password.')
      .max(200, 'Use 200 characters or fewer.'),
    confirmPassword: z.string().min(1, 'Confirm your new password.')
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'The passwords do not match.',
    path: ['confirmPassword']
  })

type Schema = z.output<typeof schema>

const state = reactive<Schema>({ password: '', confirmPassword: '' })
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isSubmitting = ref(false)
const submitError = ref('')

function focusError(event: FormErrorEvent): void {
  const id = event.errors[0]?.id
  if (id) document.getElementById(id)?.focus()
}

async function submit(event: FormSubmitEvent<Schema>) {
  if (!token.value) return

  submitError.value = ''
  isSubmitting.value = true

  try {
    const { error } = await authClient.resetPassword({
      newPassword: event.data.password,
      token: token.value
    })

    if (error) {
      submitError.value = 'This reset link is invalid or has expired. Request a new one.'
      return
    }

    await navigateTo('/login?reset=1')
  } catch {
    submitError.value = 'We could not reach Hoot. Try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-101.25 max-[761px]:max-w-107.5">
    <p class="mb-3.5 text-[11px] font-bold tracking-[.15em] text-primary">ONE LAST STEP</p>
    <h1
      class="text-[clamp(1.9rem,2.8vw,2.5rem)] leading-[1.15] font-[750] tracking-tighter max-[761px]:text-[2.3rem]"
    >
      Choose a new password.
    </h1>

    <template v-if="invalidToken">
      <p
        role="alert"
        class="mt-6 rounded-lg border border-error/25 bg-error/10 px-3.5 py-3 text-sm text-error"
      >
        This reset link is invalid or has expired.
      </p>
      <UButton
        to="/forgot-password"
        block
        size="xl"
        trailing-icon="i-lucide-arrow-right"
        class="mt-8 min-h-12.25 rounded-[9px] text-[15px] font-bold text-[#20140e]"
      >
        Request a new link
      </UButton>
    </template>

    <template v-else>
      <p class="mt-3.5 text-[15px] leading-[1.7] text-muted">
        Use at least 10 characters. Existing Hoot sessions will be signed out after the change.
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
          label="New password"
          name="password"
          required
        >
          <UInput
            v-model="state.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Create a new password"
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
                :aria-label="showPassword ? 'Hide passwords' : 'Show passwords'"
                :aria-pressed="showPassword"
                type="button"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </UFormField>

        <UFormField
          label="Confirm new password"
          name="confirmPassword"
          required
        >
          <UInput
            v-model="state.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Enter it again"
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
                :icon="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="
                  showConfirmPassword ? 'Hide confirmed password' : 'Show confirmed password'
                "
                :aria-pressed="showConfirmPassword"
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
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
          Update password
        </UButton>
      </UForm>
    </template>
  </div>
</template>
