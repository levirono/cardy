<template>
  <UAlert color="primary" variant="soft" :title="title" :description="url">
    <template #actions>
      <div class="flex items-center gap-2">
        <UButton color="primary" variant="solid" :to="url">Open</UButton>
        <UButton color="neutral" variant="ghost" icon="i-heroicons-clipboard" @click="copy">Copy</UButton>
      </div>
    </template>
  </UAlert>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ url: string, title?: string }>(), { title: 'Share link ready' })
function copy() {
  if (navigator?.clipboard) navigator.clipboard.writeText(props.url)
}
</script> 