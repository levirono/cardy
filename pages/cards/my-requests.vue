<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">My Design Requests</h1>
        <p class="text-gray-500 mt-1">Track your custom card requests</p>
      </div>
      <NuxtLink to="/cards/request-design" class="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-sm shadow hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2">
        + New Request
      </NuxtLink>
    </div>
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-24 bg-gray-100 rounded-2xl animate-pulse"></div>
    </div>
    <div v-else-if="requests.length === 0" class="text-center py-20">
      <div class="text-6xl mb-4">🎨</div>
      <h2 class="text-xl font-bold text-gray-800 mb-2">No requests yet</h2>
      <p class="text-gray-500 mb-6">Request a custom card design from our designers</p>
      <NuxtLink to="/cards/request-design" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow">
        Request a Design
      </NuxtLink>
    </div>
    <div v-else class="space-y-4">
      <div v-for="r in requests" :key="r.id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="font-bold text-gray-900">{{ r.title }}</h3>
              <span class="text-xs px-2.5 py-1 rounded-full font-medium" :class="statusColor(r.status)">{{ r.status }}</span>
            </div>
            <p class="text-sm text-gray-600 line-clamp-2">{{ r.description }}</p>
            <div class="flex items-center gap-4 mt-3 text-xs text-gray-400">
              <span>Submitted {{ fmtDate(r.created_at) }}</span>
              <span v-if="r.designer">· Assigned to {{ (r.designer as any)?.full_name }}</span>
            </div>
          </div>
          <div v-if="r.status === 'Completed'" class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DesignRequest } from '~/types'
definePageMeta({ middleware: 'auth' })
useHead({ title: 'My Design Requests' })

const { $supabase } = useNuxtApp()
const { user } = useAuth()
const requests = ref<DesignRequest[]>([])
const loading = ref(true)

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const statusColor = (s: string) => ({
  'Pending': 'bg-yellow-100 text-yellow-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  'Completed': 'bg-green-100 text-green-700',
  'Rejected': 'bg-red-100 text-red-700',
}[s] || 'bg-gray-100 text-gray-600')

onMounted(async () => {
  if (!user.value) return
  const { data } = await $supabase.from('design_requests')
    .select('*, designer:profiles!design_requests_designer_id_fkey(full_name)')
    .eq('user_id', user.value.id).order('created_at', { ascending: false })
  requests.value = (data as DesignRequest[]) ?? []
  loading.value = false
})
</script>
