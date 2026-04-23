<template>
  <UApp>
    <div class="min-h-screen" :style="{ background: wedding?.theme_color ? `linear-gradient(135deg, ${wedding.theme_color}22 0%, #fff 100%)` : 'white' }">
      <!-- Minimal top bar for wedding pages -->
      <div class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-md border-b border-white/40">
        <NuxtLink to="/" class="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
          <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 17.5s-7.5-4.375-7.5-9.375A4.375 4.375 0 0110 4.5a4.375 4.375 0 017.5 3.625C17.5 13.125 10 17.5 10 17.5z" fill="white"/></svg>
          </div>
          <span class="text-sm font-semibold text-gray-700">Cardy</span>
        </NuxtLink>
        <button @click="share" class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-gray-200 shadow-sm hover:shadow transition-shadow text-gray-700">
          <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/></svg>
          Share
        </button>
      </div>
      <main class="pt-16">
        <slot />
      </main>
    </div>
    <UNotifications />
  </UApp>
</template>

<script setup lang="ts">
import type { Wedding } from '~/types'
const wedding = inject<Wedding | null>('wedding', null)
const toast = useToast()
const share = async () => {
  if (navigator.share) {
    await navigator.share({ title: document.title, url: window.location.href })
  } else {
    await navigator.clipboard.writeText(window.location.href)
    toast.add({ title: 'Link copied!', description: 'Share the link with your guests', color: 'success' })
  }
}
</script>
