<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'en',
    class:
      'scroll-smooth scroll-pt-[100px] motion-reduce:scroll-auto [--ui-primary:#ff7a45] [--ui-bg:#0d0e11] [--ui-bg-elevated:#1b1d23] [--ui-text-muted:#a4a8b3] [--ui-text-dimmed:#9498a2]'
  },
  bodyAttrs: {
    class:
      'm-0 bg-default font-sans text-[#f5f5f7] selection:bg-primary/30 selection:text-white [&_a]:cursor-pointer [&_a]:touch-manipulation [&_button]:touch-manipulation [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-primary [&_:focus-visible]:outline-offset-4'
  }
})

useSeoMeta({
  title: 'Hoot',
  description: 'A place to stream, watch, and hang out.'
})
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
