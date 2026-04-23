<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 py-16 px-4">
    <div class="max-w-4xl mx-auto text-center">
      <div class="mb-12">
        <div class="text-7xl mb-4 animate-bounce">💝</div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Valentine's Messages</h1>
        <p class="text-gray-500 text-lg">Send beautiful animated love messages to someone special</p>
        <NuxtLink to="/valentines/create"
          class="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
          💌 Create a Valentine
        </NuxtLink>
      </div>

      <!-- Hearts animation -->
      <div class="relative h-64 mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-red-100 to-pink-100">
        <div v-for="h in hearts" :key="h.id" class="absolute text-2xl animate-float select-none pointer-events-none"
          :style="{ left: h.x + '%', top: h.y + '%', animationDuration: h.dur + 's', animationDelay: h.delay + 's', fontSize: h.size + 'px' }">
          {{ h.emoji }}
        </div>
        <div class="absolute inset-0 flex items-center justify-center">
          <p class="text-2xl font-bold text-rose-600" style="font-family: 'Playfair Display', serif">Love is in the air ✨</p>
        </div>
      </div>

      <!-- Recent valentines (public) -->
      <div v-if="recentValentines.length > 0">
        <h2 class="text-xl font-bold text-gray-800 mb-6">Recent Valentines</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="v in recentValentines" :key="v.id"
            class="bg-white rounded-2xl border border-pink-100 shadow-sm p-6 text-left hover:shadow-md transition-shadow">
            <div class="flex items-center gap-2 mb-3 text-rose-400">
              <span class="text-xl">💌</span>
            </div>
            <p class="text-gray-700 text-sm leading-relaxed line-clamp-3 italic mb-4">"{{ v.message }}"</p>
            <div class="text-xs text-gray-400">
              <span v-if="v.sender_name">From: <strong class="text-gray-600">{{ v.sender_name }}</strong> → </span>
              To: <strong class="text-rose-500">{{ v.recipient }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Valentine } from '~/types'
useHead({ title: 'Valentines' })

const { $supabase } = useNuxtApp()
const recentValentines = ref<Valentine[]>([])

const hearts = Array.from({ length: 20 }, (_, i) => ({
  id: i, x: Math.random() * 90, y: Math.random() * 90,
  dur: 3 + Math.random() * 4, delay: Math.random() * 3,
  size: 14 + Math.random() * 20,
  emoji: ['❤️', '💕', '💖', '💗', '💓', '💝'][Math.floor(Math.random() * 6)],
}))

onMounted(async () => {
  const { data } = await $supabase.from('valentines').select('*').order('created_at', { ascending: false }).limit(6)
  recentValentines.value = (data as Valentine[]) ?? []
})
</script>

<style scoped>
@reference "tailwindcss";
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(-5deg); opacity: 0.7; }
  50% { transform: translateY(-20px) rotate(5deg); opacity: 1; }
}
.animate-float { animation: float linear infinite; }
</style>