<template>
  <div
    class="w-full h-full flex items-center justify-center rounded-xl overflow-hidden border"
    :class="isDark ? 'bg-gray-900 border-gray-700' : 'bg-white/80 border-gray-200'"
    :style="{ background: isDark ? (backgroundColor || '#18181b') : (backgroundColor || '#fff') }"
  >
    <template v-if="mediaType === 'image' && mediaUrl">
      <img :src="mediaUrl" alt="media" class="w-full h-full object-contain" />
    </template>
    <template v-else-if="mediaType === 'video' && mediaUrl">
      <video :src="mediaUrl" controls playsinline class="w-full h-full object-contain" />
    </template>
    <template v-else-if="mediaType === 'animation' && mediaUrl">
      <img :src="mediaUrl" alt="animation" class="w-full h-full object-contain" />
    </template>
    <template v-else-if="mediaType === 'text'">
      <div class="px-6 py-4 text-center max-w-prose">
        <slot name="text">
          <span :class="isDark ? 'text-gray-200' : 'text-gray-700'">No media selected</span>
        </slot>
      </div>
    </template>
    <template v-else>
      <span :class="isDark ? 'text-gray-200' : 'text-gray-500'">No media selected</span>
    </template>
  </div>
  
</template>
<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ mediaType?: string; mediaUrl?: string; backgroundColor?: string }>()

const isDark = computed(() => {
  if (typeof document === 'undefined') return false
  return document.documentElement.classList.contains('dark')
})
</script>