<template>
  <div class="grid gap-3">
    <UAlert v-if="scheduledAt" color="primary" variant="soft" title="Not yet!" :description="`Opens at ${scheduledAt}`" />
    <div v-if="locked" class="flex items-center gap-2">
      <UInput v-model="inputKey" placeholder="Enter key" />
      <UButton color="primary" icon="i-heroicons-lock-open" :label="label" @click="emit('unlock', inputKey)" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ locked: boolean, scheduledAt?: string, label?: string }>()
const emit = defineEmits<{ (e: 'unlock', key: string): void }>()
const inputKey = ref('')
</script> 