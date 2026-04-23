<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Welcome back, {{ profile?.full_name?.split(' ')[0] || 'there' }} 👋</h1>
      <p class="text-gray-500 mt-1">Here's what's happening with your account</p>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div class="text-2xl mb-3">🎴</div>
        <div class="text-3xl font-bold text-gray-900">{{ cardCount }}</div>
        <div class="text-sm text-gray-500 mt-1">Cards Created</div>
      </div>
      <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div class="text-2xl mb-3">💍</div>
        <div class="text-3xl font-bold text-gray-900">{{ weddingCount }}</div>
        <div class="text-sm text-gray-500 mt-1">Weddings</div>
      </div>
      <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div class="text-2xl mb-3">🎨</div>
        <div class="text-3xl font-bold text-gray-900">{{ requestCount }}</div>
        <div class="text-sm text-gray-500 mt-1">Design Requests</div>
      </div>
      <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div class="text-2xl mb-3">💝</div>
        <div class="text-3xl font-bold text-gray-900">—</div>
        <div class="text-sm text-gray-500 mt-1">Valentines Sent</div>
      </div>
    </div>
    <div class="mb-10">
      <h2 class="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLink v-for="a in quickActions" :key="a.label" :to="a.to"
          class="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" :class="a.bg">{{ a.emoji }}</div>
          <div>
            <p class="font-semibold text-gray-900 text-sm">{{ a.label }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ a.desc }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
    <div class="grid lg:grid-cols-2 gap-8">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="flex items-center justify-between p-6 border-b border-gray-50">
          <h2 class="font-bold text-gray-900">Recent Cards</h2>
          <NuxtLink to="/cards/my" class="text-sm text-purple-600 font-medium">View all →</NuxtLink>
        </div>
        <div v-if="loadingCards" class="p-6 space-y-3">
          <div v-for="i in 3" :key="i" class="h-14 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>
        <div v-else-if="recentCards.length === 0" class="p-10 text-center text-gray-400">
          <div class="text-4xl mb-3">🎴</div>
          <p class="font-medium text-sm">No cards yet</p>
          <NuxtLink to="/cards/create" class="mt-3 inline-block text-sm text-purple-600 font-medium">Create your first →</NuxtLink>
        </div>
        <div v-else class="divide-y divide-gray-50">
          <NuxtLink v-for="card in recentCards" :key="card.id" :to="`/cards/${card.id}`"
            class="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm flex-shrink-0">🎴</div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-900 text-sm truncate">{{ card.title }}</p>
              <p class="text-xs text-gray-500">To: {{ card.recipient_name }}</p>
            </div>
            <span class="text-xs text-gray-400">{{ fmtDate(card.created_at) }}</span>
          </NuxtLink>
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="flex items-center justify-between p-6 border-b border-gray-50">
          <h2 class="font-bold text-gray-900">My Weddings</h2>
          <NuxtLink to="/weddings/my" class="text-sm text-pink-600 font-medium">View all →</NuxtLink>
        </div>
        <div v-if="loadingWeddings" class="p-6 space-y-3">
          <div v-for="i in 2" :key="i" class="h-14 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>
        <div v-else-if="recentWeddings.length === 0" class="p-10 text-center text-gray-400">
          <div class="text-4xl mb-3">💍</div>
          <p class="font-medium text-sm">No weddings yet</p>
          <NuxtLink to="/weddings/create" class="mt-3 inline-block text-sm text-pink-600 font-medium">Plan a wedding →</NuxtLink>
        </div>
        <div v-else class="divide-y divide-gray-50">
          <NuxtLink v-for="w in recentWeddings" :key="w.id" :to="`/weddings/${w.slug}`"
            class="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
            <div class="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-lg flex-shrink-0">💑</div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-900 text-sm truncate">{{ w.couple_name_1 }} & {{ w.couple_name_2 }}</p>
              <p class="text-xs text-gray-500">{{ fmtDate(w.wedding_date) }}</p>
            </div>
            <span class="text-xs px-2 py-1 rounded-full" :class="w.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
              {{ w.is_published ? 'Live' : 'Draft' }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Card, Wedding } from '~/types'
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Dashboard' })

const { profile, user } = useAuth()
const { $supabase } = useNuxtApp()
const recentCards = ref<Card[]>([])
const recentWeddings = ref<Wedding[]>([])
const loadingCards = ref(true)
const loadingWeddings = ref(true)
const cardCount = ref(0)
const weddingCount = ref(0)
const requestCount = ref(0)

const quickActions = [
  { emoji: '🎴', label: 'Create a Card', desc: 'Send a digital card', to: '/cards/create', bg: 'bg-purple-100' },
  { emoji: '💍', label: 'Plan a Wedding', desc: 'Create invitations', to: '/weddings/create', bg: 'bg-rose-100' },
  { emoji: '💝', label: 'Send Valentine', desc: 'Spread the love', to: '/valentines/create', bg: 'bg-pink-100' },
  { emoji: '🎨', label: 'Request Design', desc: 'Get a custom card', to: '/cards/request-design', bg: 'bg-amber-100' },
]

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

onMounted(async () => {
  if (!user.value) return
  const uid = user.value.id
  const [c, w, r] = await Promise.all([
    $supabase.from('cards').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(5),
    $supabase.from('weddings').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(3),
    $supabase.from('design_requests').select('id', { count: 'exact', head: true }).eq('user_id', uid),
  ])
  recentCards.value = (c.data as Card[]) ?? []; cardCount.value = recentCards.value.length; loadingCards.value = false
  recentWeddings.value = (w.data as Wedding[]) ?? []; weddingCount.value = recentWeddings.value.length; loadingWeddings.value = false
  requestCount.value = r.count ?? 0
})
</script>
