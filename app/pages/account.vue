<script setup lang="ts">
import { authClient } from '~/lib/auth-client'

definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'Your account — Hoot',
  robots: 'noindex, nofollow'
})

const { data: session } = await authClient.useSession(useFetch)

async function signOut() {
  await authClient.signOut()
  await navigateTo('/')
}
</script>

<template>
  <main class="min-h-dvh bg-[#0d0e11] px-5 py-8 text-[#f5f5f7]">
    <div class="mx-auto w-full max-w-2xl">
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
          <span class="text-[1.75rem] leading-none font-[850] tracking-[-.065em] text-[#f5f5f7]"
            >hoot</span
          >
        </NuxtLink>
        <UButton
          color="neutral"
          variant="ghost"
          leading-icon="i-lucide-arrow-left"
          to="/"
          >Back to discover</UButton
        >
      </header>

      <section class="mt-20 rounded-3xl border border-white/8 bg-[#15161b] p-8">
        <div
          class="grid size-14 place-items-center rounded-full bg-primary/15 text-lg font-bold text-primary"
        >
          {{ session?.user.name?.slice(0, 2).toUpperCase() }}
        </div>
        <p class="mt-8 text-[11px] font-bold tracking-[.15em] text-primary">YOUR ACCOUNT</p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight">{{ session?.user.name }}</h1>
        <p class="mt-2 text-sm text-muted">{{ session?.user.email }}</p>

        <div class="mt-8 border-t border-white/8 pt-6">
          <p class="text-sm text-muted">
            You are signed in. This page is protected by a database-backed Hoot session.
          </p>
          <UButton
            class="mt-6"
            color="neutral"
            variant="soft"
            leading-icon="i-lucide-log-out"
            @click="signOut"
            >Log out</UButton
          >
        </div>
      </section>
    </div>
  </main>
</template>
