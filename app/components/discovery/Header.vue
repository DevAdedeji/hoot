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
      <UButton
        to="/login"
        color="neutral"
        variant="ghost"
        >Log in</UButton
      >
      <UButton
        to="/signup"
        class="font-bold text-[#1c110c]"
        >Join Hoot</UButton
      >
    </div>
  </header>
</template>
