<template>
  <div class="h-full">
    <UCard 
      class="h-full flex flex-col ring-1 ring-border/30 shadow-sm rounded-xl bg-bg-secondary/50 dark:bg-bg-tertiary/20"
      :ui="{
        root: 'h-full flex flex-col',
        body: 'flex-1'
      }"
    >
      <!-- Rating -->
      <div class="flex items-center mb-4">
        <div class="flex items-center">
          <UIcon 
            v-for="i in 5" 
            :key="i" 
            :name="i <= parseInt(rating) ? 'i-heroicons-star-solid' : 'i-heroicons-star'" 
            class="w-5 h-5 text-yellow-400"
          />
        </div>
      </div>
      
      <!-- Testimonial Text -->
      <p class="text-text-secondary italic mb-6">"{{ quote }}"</p>
      
      <!-- Author -->
      <div class="mt-auto flex items-center gap-3">
        <UAvatar 
          :src="avatar" 
          :alt="name"
          size="md"
          class="flex-shrink-0"
        />
        <div class="min-w-0">
          <p class="font-medium text-text truncate">{{ name }}</p>
          <p class="text-sm text-text-secondary">{{ role }}</p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: string;
}

defineProps<Props>();
</script>

<style scoped>
/* Add any custom styles here */
</style>
