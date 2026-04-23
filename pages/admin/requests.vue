<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white">All Design Requests</h1>
      <p class="text-gray-400 mt-1">{{ requests.length }} total requests</p>
    </div>
    <div class="flex gap-3 mb-6 flex-wrap">
      <button v-for="f in filters" :key="f" @click="activeFilter = f"
        class="px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
        :class="activeFilter === f ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'">
        {{ f }}
      </button>
    </div>
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="h-20 bg-gray-800 rounded-2xl animate-pulse"></div>
    </div>
    <div v-else class="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-900/50">
          <tr>
            <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Request</th>
            <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase hidden md:table-cell">From</th>
            <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
            <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase hidden lg:table-cell">Date</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr v-for="r in filteredRequests" :key="r.id" class="hover:bg-gray-700/30 transition-colors">
            <td class="px-5 py-4 max-w-xs">
              <p class="font-medium text-white truncate">{{ r.title }}</p>
              <p class="text-xs text-gray-400 truncate mt-0.5">{{ r.description }}</p>
            </td>
            <td class="px-5 py-4 text-gray-400 hidden md:table-cell">{{ (r.user as any)?.full_name || '—' }}</td>
            <td class="px-5 py-4">
              <span class="text-xs px-2.5 py-1 rounded-full font-medium" :class="statusColor(r.status)">{{ r.status }}</span>
            </td>
            <td class="px-5 py-4 text-gray-400 hidden lg:table-cell">{{ fmtDate(r.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DesignRequest } from '~/types'
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Design Requests — Admin' })

const { fetchAllRequests } = useAdmin()
const requests = ref<DesignRequest[]>([])
const loading = ref(true)
const activeFilter = ref('All')
const filters = ['All', 'Pending', 'In Progress', 'Completed', 'Rejected']

const filteredRequests = computed(() => activeFilter.value === 'All' ? requests.value : requests.value.filter(r => r.status === activeFilter.value))
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const statusColor = (s: string) => ({ 'Pending': 'bg-yellow-900/40 text-yellow-400', 'In Progress': 'bg-blue-900/40 text-blue-400', 'Completed': 'bg-green-900/40 text-green-400', 'Rejected': 'bg-red-900/40 text-red-400' }[s] || '')

onMounted(async () => {
  const { data } = await fetchAllRequests()
  requests.value = data
  loading.value = false
})
</script>
