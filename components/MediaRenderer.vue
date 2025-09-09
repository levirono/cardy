<template>
  <div class="overflow-hidden rounded-xl ring-1 ring-inset ring-gray-200 dark:ring-gray-800" :style="containerStyle">
    <img v-if="mediaType === 'image' || mediaType === 'animation'" :src="mediaUrl" alt="media" class="w-full h-auto object-cover" />
    <video v-else-if="mediaType === 'video'" :src="mediaUrl" controls class="w-full h-auto" />
    <div v-else class="p-6 text-gray-500 dark:text-gray-400 text-center">No media</div>
  </div>
  
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ mediaType?: 'image' | 'video' | 'animation' | 'text', mediaUrl?: string, backgroundColor?: string }>(), {
  mediaType: 'text',
  mediaUrl: '',
  backgroundColor: ''
})

const containerStyle = computed(() => ({
  backgroundColor: props.backgroundColor || 'transparent'
}))
</script>