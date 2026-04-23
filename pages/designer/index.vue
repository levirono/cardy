<template>
  <div class="max-w-6xl mx-auto px-4 py-10">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Designer Dashboard</h1>
      <p class="text-gray-500 mt-1">Manage requests and your templates</p>
    </div>

    <div class="grid sm:grid-cols-3 gap-4 mb-10">
      <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
        <div class="text-3xl font-bold text-amber-600 mb-1">{{ stats.pending }}</div>
        <div class="text-sm text-gray-500">Pending Requests</div>
      </div>
      <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
        <div class="text-3xl font-bold text-blue-600 mb-1">{{ stats.inProgress }}</div>
        <div class="text-sm text-gray-500">In Progress</div>
      </div>
      <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
        <div class="text-3xl font-bold text-green-600 mb-1">{{ stats.completed }}</div>
        <div class="text-sm text-gray-500">Completed</div>
      </div>
    </div>

    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-bold text-gray-800">Design Requests</h2>
      <NuxtLink to="/designer/templates" class="text-sm text-amber-600 font-medium hover:text-amber-800">Manage Templates →</NuxtLink>
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-20 bg-gray-100 rounded-2xl animate-pulse"></div>
    </div>
    <div v-else-if="requests.length === 0" class="text-center py-16 text-gray-400">
      <div class="text-4xl mb-3">🎨</div>
      <p class="font-medium">No requests yet</p>
    </div>
    <div v-else class="space-y-4">
      <div v-for="r in requests" :key="r.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-1">
              <h3 class="font-bold text-gray-900 truncate">{{ r.title }}</h3>
              <span class="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0" :class="statusColor(r.status)">{{ r.status }}</span>
            </div>
            <p class="text-sm text-gray-500 line-clamp-2 mb-2">{{ r.description }}</p>
            <p class="text-xs text-gray-400">From: {{ (r.user as any)?.full_name || 'Unknown' }} · {{ fmtDate(r.created_at) }}</p>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <template v-if="r.status === 'Pending'">
              <button @click="updateStatus(r.id, 'In Progress')" class="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">Accept</button>
              <button @click="updateStatus(r.id, 'Rejected')" class="px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Reject</button>
            </template>
            <template v-else-if="r.status === 'In Progress'">
              <button @click="updateStatus(r.id, 'Completed')" class="px-3 py-1.5 text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">Mark Done</button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DesignRequest } from '~/types'
definePageMeta({ middleware: 'designer' })
useHead({ title: 'Designer Dashboard' })

const { $supabase } = useNuxtApp()
const toast = useToast()
const requests = ref<DesignRequest[]>([])
const loading = ref(true)
const stats = reactive({ pending: 0, inProgress: 0, completed: 0 })

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const statusColor = (s: string) => ({ 'Pending': 'bg-yellow-100 text-yellow-700', 'In Progress': 'bg-blue-100 text-blue-700', 'Completed': 'bg-green-100 text-green-700', 'Rejected': 'bg-red-100 text-red-700' }[s] || 'bg-gray-100 text-gray-600')

const updateStatus = async (id: string, status: string) => {
  const { error } = await $supabase.from('design_requests').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) { toast.add({ title: 'Error', description: error.message, color: 'error' }); return }
  const req = requests.value.find(r => r.id === id)
  if (req) req.status = status as any
  calcStats()
  toast.add({ title: `Request ${status}`, color: 'success' })
}

const calcStats = () => {
  stats.pending = requests.value.filter(r => r.status === 'Pending').length
  stats.inProgress = requests.value.filter(r => r.status === 'In Progress').length
  stats.completed = requests.value.filter(r => r.status === 'Completed').length
}

onMounted(async () => {
  const { data } = await $supabase.from('design_requests')
    .select('*, user:profiles!design_requests_user_id_fkey(full_name)')
    .order('created_at', { ascending: false })
  requests.value = (data as DesignRequest[]) ?? []
  calcStats()
  loading.value = false
})
</script>
