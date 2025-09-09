<template>
  <div class="w-full h-full flex items-center justify-center rounded-xl overflow-hidden border"
    :class="isDark ? 'bg-gray-900 border-gray-700' : 'bg-white/80 border-gray-200'"
    :style="{ background: isDark ? (backgroundColor || '#18181b') : (backgroundColor || '#fff') }">
    <template v-if="mediaType === 'image' && mediaUrl">
      <img :src="mediaUrl" alt="media" class="max-w-full max-h-full object-contain" />
    </template>
    <template v-else-if="mediaType === 'video' && mediaUrl">
      <video :src="mediaUrl" controls class="max-w-full max-h-full object-contain" />
    </template>
    <template v-else-if="mediaType === 'animation' && mediaUrl">
      <img :src="mediaUrl" alt="animation" class="max-w-full max-h-full object-contain" />
    </template>
    <template v-else>
      <span :class="isDark ? 'text-gray-200' : 'text-gray-500'">No media selected</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ mediaType?: string; mediaUrl?: string; backgroundColor?: string }>()

const isDark = computed(() => document.documentElement.classList.contains('dark'))
</script>