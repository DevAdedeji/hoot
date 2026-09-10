<script setup lang="ts">
import type { StreamCategory } from '~/types/discovery'

defineProps<{
  category: StreamCategory
}>()
</script>

<template>
  <NuxtLink
    to="/signup"
    class="group overflow-hidden rounded-2xl border border-white/[0.07] bg-[#15161b] hover:border-white/[0.14]"
  >
    <div
      class="grid aspect-5/3 place-items-center bg-linear-to-br"
      :class="category.gradient"
    >
      <UIcon
        :name="category.icon"
        class="size-9 transition group-hover:scale-110"
        :class="category.color"
      />
    </div>
    <div class="p-4">
      <h3 class="text-sm font-semibold group-hover:text-primary">
        {{ category.name }}
      </h3>
      <p class="mt-1.5 text-[11px] text-muted">{{ category.viewers }}</p>
    </div>
  </NuxtLink>
</template>
