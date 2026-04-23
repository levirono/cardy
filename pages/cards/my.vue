<template>
  <div class="max-w-5xl mx-auto px-4 py-10">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">My Cards</h1>
        <p class="text-gray-500 mt-1">{{ cards.length }} card{{ cards.length !== 1 ? 's' : '' }} created</p>
      </div>
      <NuxtLink to="/cards/create" class="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-sm shadow hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2">
        <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/></svg>
        New Card
      </NuxtLink>
    </div>

    <div v-if="loading" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="h-52 bg-gray-100 rounded-2xl animate-pulse"></div>
    </div>

    <div v-else-if="cards.length === 0" class="text-center py-20">
      <div class="text-6xl mb-4">🎴</div>
      <h2 class="text-xl font-bold text-gray-800 mb-2">No cards yet</h2>
      <p class="text-gray-500 mb-8">Create your first digital card to get started</p>
      <NuxtLink to="/cards/create" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow">
        Create Your First Card
      </NuxtLink>
    </div>

    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="card in cards" :key="card.id"
        class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden">
        <div class="h-32 flex items-center justify-center text-4xl relative"
          :style="{ background: card.background_color || 'linear-gradient(135deg,#e879f9,#818cf8)' }">
          <span>🎴</span>
          <div class="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click.prevent="copyLink(card.id)" class="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white shadow text-gray-600 hover:text-purple-600 transition-colors">
              <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/></svg>
            </button>
            <button @click.prevent="deleteCard(card.id)" class="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white shadow text-gray-600 hover:text-red-600 transition-colors">
              <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
            </button>
          </div>
          <div v-if="card.is_locked" class="absolute top-3 left-3 bg-white/90 rounded-full px-2 py-1 text-xs font-medium text-gray-700 flex items-center gap-1">🔒 Locked</div>
        </div>
        <NuxtLink :to="`/cards/${card.id}`" class="block p-4">
          <h3 class="font-bold text-gray-900 truncate">{{ card.title }}</h3>
          <p class="text-sm text-gray-500 mt-0.5">To: {{ card.recipient_name }}</p>
          <div class="flex items-center justify-between mt-3">
            <span class="text-xs text-gray-400">{{ fmtDate(card.created_at) }}</span>
            <span class="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">{{ card.media_type }}</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Card } from '~/types'
definePageMeta({ middleware: 'auth' })
useHead({ title: 'My Cards' })

const { $supabase } = useNuxtApp()
const { user } = useAuth()
const toast = useToast()
const cards = ref<Card[]>([])
const loading = ref(true)

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const copyLink = async (id: string) => {
  await navigator.clipboard.writeText(`${window.location.origin}/cards/${id}`)
  toast.add({ title: 'Link copied!', color: 'success' })
}

const deleteCard = async (id: string) => {
  if (!confirm('Delete this card? This cannot be undone.')) return
  await $supabase.from('cards').delete().eq('id', id)
  cards.value = cards.value.filter(c => c.id !== id)
  toast.add({ title: 'Card deleted', color: 'neutral' })
}

onMounted(async () => {
  if (!user.value) return
  const { data } = await $supabase.from('cards').select('*').eq('user_id', user.value.id).order('created_at', { ascending: false })
  cards.value = (data as Card[]) ?? []
  loading.value = false
})
</script>
