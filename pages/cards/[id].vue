<template>
  <div class="min-h-screen flex items-center justify-center p-4" :style="cardBg">
    <div v-if="loading" class="text-center text-gray-500">
      <div class="w-10 h-10 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
      Loading card…
    </div>

    <div v-else-if="!card" class="text-center">
      <div class="text-6xl mb-4">🔍</div>
      <h1 class="text-2xl font-bold text-gray-800">Card not found</h1>
      <NuxtLink to="/" class="mt-4 inline-block text-purple-600">← Back to home</NuxtLink>
    </div>

    <!-- Key prompt -->
    <div v-else-if="needsKey" class="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
      <div class="text-5xl mb-4">🔐</div>
      <h2 class="text-xl font-bold text-gray-900 mb-2">This card has a secret key</h2>
      <p class="text-gray-500 text-sm mb-6">Enter the key to unlock this card</p>
      <input v-model="keyInput" type="text" placeholder="Secret key…"
        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-center text-sm mb-4"/>
      <div v-if="keyError" class="text-red-500 text-sm mb-4">{{ keyError }}</div>
      <button @click="checkKey" class="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-sm">Unlock</button>
    </div>

    <!-- Locked by time -->
    <div v-else-if="isTimeLocked" class="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
      <div class="text-5xl mb-4">⏰</div>
      <h2 class="text-xl font-bold text-gray-900 mb-2">This card is time-locked</h2>
      <p class="text-gray-500 text-sm mb-4">It will unlock on</p>
      <div class="text-2xl font-bold text-purple-600">{{ fmtDate(card.unlock_at!) }}</div>
      <div class="mt-6 flex gap-3 text-center justify-center">
        <div v-for="t in countdown" :key="t.label" class="bg-purple-50 rounded-xl px-4 py-3">
          <div class="text-2xl font-bold text-purple-700">{{ t.value }}</div>
          <div class="text-xs text-purple-500 mt-1">{{ t.label }}</div>
        </div>
      </div>
    </div>

    <!-- Card Content -->
    <div v-else class="max-w-lg w-full">
      <div class="rounded-3xl shadow-2xl overflow-hidden" :style="cardStyle">
        <div class="p-10 text-center">
          <p class="text-sm opacity-60 mb-2">A card for</p>
          <h1 class="text-3xl font-bold mb-6" :style="{ color: card.title_color || 'inherit', fontFamily: card.font_family || 'inherit' }">{{ card.recipient_name }}</h1>
          <div class="text-xl font-semibold mb-6" :style="{ color: card.title_color || 'inherit' }">{{ card.title }}</div>
          <div v-if="card.media_url && card.media_type === 'image'" class="rounded-2xl overflow-hidden mb-6 max-h-72">
            <img :src="card.media_url" alt="Card image" class="w-full h-full object-cover"/>
          </div>
          <video v-else-if="card.media_url && card.media_type === 'video'" :src="card.media_url" controls class="w-full rounded-2xl mb-6"></video>
          <p class="text-base leading-relaxed whitespace-pre-wrap" :style="{ color: card.message_color || 'inherit' }">{{ card.message }}</p>
        </div>
      </div>
      <div class="mt-6 flex gap-3 justify-center">
        <button @click="copyLink" class="flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur rounded-xl text-sm font-medium text-gray-700 shadow hover:shadow-md transition-all">
          📋 Copy Link
        </button>
        <NuxtLink to="/cards/create" class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-semibold shadow hover:shadow-md transition-all">
          Create yours →
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Card } from '~/types'
definePageMeta({ layout: false })

const route = useRoute()
const toast = useToast()
const { $supabase } = useNuxtApp()

const card = ref<Card | null>(null)
const loading = ref(true)
const needsKey = ref(false)
const keyInput = ref('')
const keyError = ref('')
const unlocked = ref(false)

const isTimeLocked = computed(() => {
  if (!card.value?.unlock_at || unlocked.value) return false
  return new Date(card.value.unlock_at) > new Date()
})

const cardBg = computed(() => ({
  background: card.value?.background_color ? `${card.value.background_color}22` : 'linear-gradient(135deg,#f3e8ff,#e0f2fe)',
}))

const cardStyle = computed(() => ({
  backgroundColor: card.value?.background_color || '#f3e8ff',
  color: card.value?.text_color || '#1f2937',
  fontFamily: card.value?.font_family || 'inherit',
}))

const countdown = ref<{ label: string; value: string }[]>([])

const fmtDate = (d: string) => new Date(d).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const copyLink = async () => {
  await navigator.clipboard.writeText(window.location.href)
  toast.add({ title: 'Link copied!', color: 'success' })
}

const checkKey = () => {
  if (keyInput.value.trim().toLowerCase() === card.value?.key?.toLowerCase()) {
    needsKey.value = false; unlocked.value = true; keyError.value = ''
  } else {
    keyError.value = 'Wrong key. Try again.'
  }
}

const updateCountdown = () => {
  if (!card.value?.unlock_at) return
  const diff = new Date(card.value.unlock_at).getTime() - Date.now()
  if (diff <= 0) { unlocked.value = true; return }
  const d = Math.floor(diff / 86400000), h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000)
  countdown.value = [
    { label: 'Days', value: String(d).padStart(2, '0') },
    { label: 'Hours', value: String(h).padStart(2, '0') },
    { label: 'Mins', value: String(m).padStart(2, '0') },
    { label: 'Secs', value: String(s).padStart(2, '0') },
  ]
}

onMounted(async () => {
  const { data } = await $supabase.from('cards').select('*').eq('id', route.params.id as string).single()
  card.value = data as Card
  loading.value = false
  if (!data) return
  if (data.key) needsKey.value = true
  if (data.unlock_at && new Date(data.unlock_at) > new Date()) {
    updateCountdown()
    setInterval(updateCountdown, 1000)
  }
})
</script>
