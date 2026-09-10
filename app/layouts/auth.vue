<script setup lang="ts">
import AuthStory from '~/components/auth/AuthStory.vue'
</script>

<template>
  <main
    class="grid h-dvh grid-rows-[minmax(0,1fr)] grid-cols-[minmax(360px,.95fr)_minmax(460px,1.05fr)] overflow-hidden max-[1000px]:grid-cols-[minmax(300px,.85fr)_minmax(400px,1.15fr)] max-[761px]:block"
  >
    <AuthStory />
    <section class="flex h-full min-h-0 min-w-0 flex-col overflow-y-auto overscroll-y-contain">
      <header
        class="flex shrink-0 items-center justify-end px-10 py-7.5 max-[1000px]:p-6.25 max-[761px]:justify-between max-[761px]:p-6"
      >
        <div class="hidden max-[761px]:block">
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
        </div>
        <UButton
          to="/"
          color="neutral"
          variant="ghost"
          leading-icon="i-lucide-arrow-left"
          class="text-sm text-muted"
        >
          Back to Hoot
        </UButton>
      </header>
      <div
        id="auth-content"
        class="grid flex-1 place-items-center px-12 pt-8.75 pb-12 max-[1000px]:px-8 max-[761px]:px-6 max-[761px]:pt-8.5 max-[761px]:pb-9.5"
      >
        <slot />
      </div>
      <footer
        class="flex shrink-0 items-center justify-center gap-2 p-6.25 text-xs text-[#969ba7] max-[761px]:pt-3"
      >
        <UIcon
          name="i-lucide-sparkles"
          class="text-[#ad765c]"
        /><span>Come as you are. Find where you belong.</span>
      </footer>
    </section>
  </main>
</template>
