<template>
  <footer
    class="mx-auto flex w-full max-w-[1480px] items-center gap-5 px-8 py-8 text-xs text-muted max-[640px]:px-4"
  >
    <NuxtLink
      to="/"
      class="inline-flex w-fit shrink-0 items-center gap-[9px] no-underline"
      aria-label="Hoot home"
    >
      <img
        src="/favicon.svg"
        alt=""
        class="size-[25px]"
        width="25"
        height="25"
      />
      <span class="text-2xl leading-none font-[850] tracking-[-.065em] text-[#f5f5f7]">hoot</span>
    </NuxtLink>
    <span>A little corner of live.</span>
    <span class="ml-auto">© {{ new Date().getFullYear() }} Hoot</span>
  </footer>
</template>
