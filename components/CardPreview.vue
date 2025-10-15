<template>
  <UCard :ui="{ base: 'overflow-hidden' }">
    <template #header>
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <div class="font-semibold truncate" :style="titleStyle">{{ card.title }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400 truncate">To: {{ card.recipientName }}</div>
        </div>
        <div class="flex items-center gap-2">
          <UBadge v-if="card.isLocked" color="neutral" variant="solid" label="Locked" />
          <UBadge v-if="card.unlockAt" color="primary" variant="soft" :label="unlockLabel" />
        </div>
      </div>
    </template>
    <div class="grid grid-cols-3 gap-3">
      <div class="col-span-1 rounded-lg overflow-hidden border border-gray-200/70 dark:border-gray-800/70" :style="thumbStyle">
        <MediaRenderer :media-type="card.mediaType as any" :media-url="card.mediaUrl" :background-color="card.backgroundColor" />
      </div>
      <div class="col-span-2 rounded-xl p-4 ring-1 ring-inset ring-gray-200/70 dark:ring-gray-800/70" :style="cardSurfaceStyle">
        <p class="line-clamp-5" :style="messageStyle">{{ card.message }}</p>
      </div>
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

const cardSurfaceStyle = computed(() => ({
  backgroundColor: props.card.backgroundColor || undefined,
  color: props.card.textColor || undefined,
  fontFamily: props.card.fontFamily || undefined
}))

const thumbStyle = computed(() => ({
  backgroundColor: props.card.backgroundColor || undefined
}))

const titleStyle = computed(() => ({
  color: props.card.titleColor || props.card.textColor || undefined,
  fontFamily: props.card.fontFamily || undefined,
  textAlign: props.card.titleAlign || undefined,
  fontSize: props.card.titleSize || undefined
}))

const messageStyle = computed(() => ({
  color: props.card.messageColor || props.card.textColor || undefined,
  fontFamily: props.card.fontFamily || undefined,
  textAlign: props.card.messageAlign || undefined,
  fontSize: props.card.messageSize || undefined
}))
</script> 