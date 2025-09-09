<template>
  <UCard :ui="{ base: 'overflow-hidden' }">
    <template #header>
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="font-semibold truncate">{{ card.title }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">To: {{ card.recipientName }}</div>
        </div>
        <div class="flex items-center gap-2">
          <UBadge v-if="card.isLocked" color="neutral" variant="solid" label="Locked" />
          <UBadge v-if="card.unlockAt" color="primary" variant="soft" :label="unlockLabel" />
        </div>
      </div>
    </template>
    <div class="rounded-xl p-4 ring-1 ring-inset ring-gray-200/70 dark:ring-gray-800/70 gradient-animate">
      <p class="line-clamp-3">{{ card.message }}</p>
    </div>
    <template #footer>
      <div class="flex items-center justify-between">
        <UButton :to="`/card/${card.id}`" size="sm" icon="i-heroicons-eye" color="primary" variant="solid" label="Open" />
        <slot name="actions" />
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { Card } from '~/composables/useCards'
const props = defineProps<{ card: Card }>()
const unlockLabel = computed(() => props.card.unlockAt ? 'Opens ' + new Date(props.card.unlockAt).toLocaleString() : '')
</script> 