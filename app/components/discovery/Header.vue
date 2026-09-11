<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { authClient } from '@/lib/auth-client'

const sessionState = authClient.useSession()
const session = computed(() => sessionState.value.data)
const isPending = computed(() => sessionState.value.isPending)
const isSigningOut = ref(false)
const ownChannel = ref<{ handle: string } | null>(null)
let channelRequest = 0

watch(
  () => session.value?.user.id,
  async (userId) => {
    const request = ++channelRequest

    if (!userId) {
      ownChannel.value = null
      return
    }

    try {
      const response = await $fetch('/api/channels/me')
      if (request === channelRequest) ownChannel.value = response.channel
    } catch {
      if (request === channelRequest) ownChannel.value = null
    }
  },
  { immediate: true }
)

const initials = computed(() =>
  session.value?.user.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
)
const firstName = computed(() => session.value?.user.name.split(/\s+/)[0])

const accountMenuItems = computed<DropdownMenuItem[][]>(() => {
  const channelItems: DropdownMenuItem[] = ownChannel.value
    ? [
        {
          label: 'Your channel',
          description: `@${ownChannel.value.handle} on Hoot`,
          icon: 'i-lucide-radio-tower',
          to: `/${ownChannel.value.handle}`
        },
        {
          label: 'Channel settings',
          description: 'Edit your handle, name, and bio',
          icon: 'i-lucide-settings-2',
          to: '/account/channel'
        }
      ]
    : [
        {
          label: 'Create your channel',
          description: 'Set up your public space',
          icon: 'i-lucide-circle-plus',
          to: '/creator/onboarding'
        }
      ]

  return [
    channelItems,
    [
      {
        label: 'Account',
        description: 'Profile and account details',
        icon: 'i-lucide-circle-user-round',
        to: '/account'
      },
      {
        label: 'Your interests',
        description: 'Tune what appears in your feed',
        icon: 'i-lucide-sliders-horizontal',
        to: '/account#interests'
      },
      {
        label: 'Security',
        description: 'Password and active session',
        icon: 'i-lucide-shield-check',
        to: '/account#security'
      }
    ],
    [
      {
        label: 'Log out',
        icon: 'i-lucide-log-out',
        color: 'error',
        loading: isSigningOut.value,
        onSelect: signOut
      }
    ]
  ]
})

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
  <header
    class="sticky top-0 z-50 flex h-17 items-center gap-5 border-b border-white/[0.07] bg-[#0d0e11]/90 px-5 backdrop-blur-xl max-[640px]:gap-3 max-[640px]:px-4"
  >
    <NuxtLink
      to="/"
      class="inline-flex w-fit shrink-0 items-center gap-2.25 no-underline"
      aria-label="Hoot home"
    >
      <img
        src="/favicon.svg"
        alt=""
        class="size-6.25"
        width="25"
        height="25"
      />
      <span class="text-2xl leading-none font-[850] tracking-[-.065em] text-[#f5f5f7]">hoot</span>
    </NuxtLink>

    <nav
      class="flex items-center gap-1 max-[720px]:hidden"
      aria-label="Primary navigation"
    >
      <UButton
        color="neutral"
        variant="soft"
        icon="i-lucide-compass"
        >Discover</UButton
      >
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-radio"
        >Browse</UButton
      >
    </nav>

    <UInput
      type="search"
      placeholder="Search channels, categories, or tags"
      leading-icon="i-lucide-search"
      size="lg"
      aria-label="Search Hoot"
      class="mx-auto w-full max-w-130 max-[640px]:hidden"
      :ui="{ base: 'rounded-xl border-white/[0.08] bg-white/[0.045]' }"
    />

    <div class="ml-auto flex shrink-0 items-center gap-2">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-search"
        aria-label="Search Hoot"
        class="hidden max-[640px]:inline-flex"
      />
      <template v-if="session?.user">
        <UDropdownMenu
          :items="accountMenuItems"
          :content="{ align: 'end', sideOffset: 10 }"
          :ui="{
            content: 'w-70 rounded-xl border border-white/10 bg-[#17181d] p-1.5 shadow-2xl',
            item: 'rounded-lg px-3 py-2.5',
            itemLeadingIcon: 'mt-0.5 self-start',
            itemLabel: 'leading-5',
            itemDescription: 'mt-0.5 text-xs leading-4 text-muted'
          }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            class="gap-2 rounded-xl px-2 py-1.5"
            aria-label="Open account menu"
          >
            <span
              class="grid size-8 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary"
              >{{ initials }}</span
            >
            <span class="max-w-24 truncate text-sm font-semibold max-[480px]:hidden">{{
              firstName
            }}</span>
            <UIcon
              name="i-lucide-chevron-down"
              class="size-4 text-muted max-[480px]:hidden"
            />
          </UButton>

          <template #content-top>
            <div class="border-b border-white/8 px-3 py-3">
              <p class="truncate text-sm font-semibold text-highlighted">{{ session.user.name }}</p>
              <p class="mt-0.5 truncate text-xs text-muted">{{ session.user.email }}</p>
            </div>
          </template>
        </UDropdownMenu>
      </template>
      <template v-else>
        <UButton
          to="/login"
          color="neutral"
          variant="ghost"
          :loading="isPending"
          >Log in</UButton
        >
        <UButton
          to="/signup"
          class="font-bold text-[#1c110c]"
          >Join Hoot</UButton
        >
      </template>
    </div>
  </header>
</template>
