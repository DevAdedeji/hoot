<script setup lang="ts">
import { authClient } from '~/lib/auth-client'

definePageMeta({ layout: 'auth' })

useSeoMeta({
  title: 'Verify your email — Hoot',
  description: 'Verify the email address connected to your Hoot account.',
  robots: 'noindex, nofollow'
})

const route = useRoute()
const email = computed(() => (typeof route.query.email === 'string' ? route.query.email : ''))
const isVerified = computed(() => route.query.verified === '1' && !route.query.error)
const hasInvalidToken = computed(() => Boolean(route.query.error))
const isSubmitting = ref(false)
const submitError = ref('')
const hasResent = ref(false)
const usesLocalEmailPreview = import.meta.dev

const verificationCallback = computed(
  () => `/verify-email?verified=1&email=${encodeURIComponent(email.value)}`
)

async function resendVerification() {
  if (!email.value) return

  submitError.value = ''
  isSubmitting.value = true

  try {
    const { error } = await authClient.sendVerificationEmail({
      email: email.value,
      callbackURL: verificationCallback.value
    })

    if (error) {
      submitError.value = 'We could not send another verification email. Try again.'
      return
    }

    hasResent.value = true
  } catch {
    submitError.value = 'We could not reach Hoot. Try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-101.25 max-[761px]:max-w-107.5">
    <template v-if="isVerified">
      <p class="mb-3.5 text-[11px] font-bold tracking-[.15em] text-primary">YOU’RE ALL SET</p>
      <h1
        class="text-[clamp(1.9rem,2.8vw,2.5rem)] leading-[1.15] font-[750] tracking-tighter max-[761px]:text-[2.3rem]"
      >
        Email verified.
      </h1>
      <p class="mt-3.5 text-[15px] leading-[1.7] text-muted">
        Your Hoot account is ready. Choose a few interests so we can tune your feed.
      </p>
      <UButton
        to="/onboarding"
        block
        size="xl"
        trailing-icon="i-lucide-arrow-right"
        class="mt-8 min-h-12.25 rounded-[9px] text-[15px] font-bold text-[#20140e]"
      >
        Continue
      </UButton>
    </template>

    <template v-else>
      <p class="mb-3.5 text-[11px] font-bold tracking-[.15em] text-primary">CHECK YOUR INBOX</p>
      <h1
        class="text-[clamp(1.9rem,2.8vw,2.5rem)] leading-[1.15] font-[750] tracking-tighter max-[761px]:text-[2.3rem]"
      >
        Verify your email.
      </h1>
      <p class="mt-3.5 text-[15px] leading-[1.7] text-muted">
        <template v-if="usesLocalEmailPreview">
          Open the verification link printed in your Hoot terminal.
        </template>
        <template v-else-if="email">
          If this address still needs verification, a link is on its way to
          <span class="font-semibold text-highlighted">{{ email }}</span
          >.
        </template>
        <template v-else>Open the verification link we sent to your email address.</template>
      </p>

      <p
        v-if="hasInvalidToken"
        role="alert"
        class="mt-6 rounded-lg border border-error/25 bg-error/10 px-3.5 py-3 text-sm text-error"
      >
        That verification link is invalid or has expired.
      </p>
      <p
        v-else-if="hasResent"
        role="status"
        class="mt-6 rounded-lg border border-success/25 bg-success/10 px-3.5 py-3 text-sm text-success"
      >
        {{
          usesLocalEmailPreview
            ? 'A new verification link was logged in your terminal.'
            : 'A new verification link is on its way.'
        }}
      </p>
      <p
        v-if="submitError"
        role="alert"
        class="mt-6 rounded-lg border border-error/25 bg-error/10 px-3.5 py-3 text-sm text-error"
      >
        {{ submitError }}
      </p>

      <UButton
        v-if="email"
        block
        size="xl"
        :loading="isSubmitting"
        trailing-icon="i-lucide-refresh-cw"
        class="mt-8 min-h-12.25 rounded-[9px] text-[15px] font-bold text-[#20140e]"
        @click="resendVerification"
      >
        {{ usesLocalEmailPreview ? 'Generate another link' : 'Send another link' }}
      </UButton>

      <p class="mt-6.25 text-center text-sm leading-[1.7] text-muted">
        <NuxtLink
          :to="email ? '/login' : '/signup'"
          class="font-[550] text-[#ffab83] hover:text-[#ffc3a7] hover:underline hover:underline-offset-4"
          >{{ email ? 'Back to log in' : 'Back to sign up' }}</NuxtLink
        >
      </p>
    </template>
  </div>
</template>
