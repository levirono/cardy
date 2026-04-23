<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white">Designer Applications</h1>
      <p class="text-gray-400 mt-1">Review and approve applications from users wanting to become designers</p>
    </div>
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-24 bg-gray-800 rounded-2xl animate-pulse"></div>
    </div>
    <div v-else-if="applications.length === 0" class="text-center py-16 text-gray-400">
      <div class="text-4xl mb-3">📋</div>
      <p>No applications yet</p>
    </div>
    <div v-else class="space-y-4">
      <div v-for="app in applications" :key="app.id"
        class="bg-gray-800 rounded-2xl border border-gray-700 p-6 hover:border-gray-600 transition-colors">
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
              {{ (app.user as any)?.full_name?.[0] || '?' }}
            </div>
            <div>
              <p class="font-bold text-white">{{ (app.user as any)?.full_name }}</p>
              <p class="text-sm text-gray-400">{{ (app.user as any)?.email }}</p>
              <div class="flex items-center gap-3 mt-1">
                <span class="text-xs text-gray-500">Applied {{ fmtDate(app.created_at) }}</span>
                <span class="text-xs px-2 py-0.5 rounded-full" :class="statusColor(app.status)">{{ app.status }}</span>
              </div>
            </div>
          </div>
          <div v-if="app.status === 'pending'" class="flex gap-2 flex-shrink-0">
            <button @click="decide(app.id, app.user_id, 'approved')"
              class="px-4 py-2 text-xs font-semibold text-green-400 bg-green-900/30 hover:bg-green-900/50 rounded-xl transition-colors border border-green-800">
              Approve
            </button>
            <button @click="decide(app.id, app.user_id, 'rejected')"
              class="px-4 py-2 text-xs font-semibold text-red-400 bg-red-900/30 hover:bg-red-900/50 rounded-xl transition-colors border border-red-800">
              Reject
            </button>
          </div>
        </div>
        <div v-if="app.motivation" class="mt-4 text-sm text-gray-300 bg-gray-700/50 rounded-xl p-4">
          <p class="text-xs text-gray-500 mb-1.5">Motivation</p>
          {{ app.motivation }}
        </div>
        <div v-if="app.portfolio_url" class="mt-2">
          <a :href="app.portfolio_url" target="_blank" class="text-xs text-purple-400 hover:text-purple-300 underline">View Portfolio ↗</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DesignerApplication } from '~/types'
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Applications — Admin' })

const { fetchAllApplications, decideApplication } = useAdmin()
const toast = useToast()
const applications = ref<DesignerApplication[]>([])
const loading = ref(true)

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const statusColor = (s: string) => ({ pending: 'bg-yellow-900/50 text-yellow-400', approved: 'bg-green-900/50 text-green-400', rejected: 'bg-red-900/50 text-red-400' }[s] || '')

const decide = async (appId: string, userId: string, decision: 'approved' | 'rejected') => {
  const { error } = await decideApplication(appId, userId, decision)
  if (error) { toast.add({ title: 'Error', description: error.message, color: 'error' }); return }
  const app = applications.value.find(a => a.id === appId)
  if (app) app.status = decision
  toast.add({ title: `Application ${decision}`, color: decision === 'approved' ? 'success' : 'neutral' })
}

onMounted(async () => {
  const { data } = await fetchAllApplications()
  applications.value = data
  loading.value = false
})
</script>
