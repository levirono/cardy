<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white">Admin Dashboard</h1>
      <p class="text-gray-400 mt-1">Platform overview</p>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
      <div v-for="s in statCards" :key="s.label" class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <div class="text-2xl mb-3">{{ s.emoji }}</div>
        <div class="text-3xl font-bold text-white mb-1">{{ loading ? '—' : s.value }}</div>
        <div class="text-sm text-gray-400">{{ s.label }}</div>
      </div>
    </div>
    <div class="grid lg:grid-cols-2 gap-6">
      <div class="bg-gray-800 rounded-2xl border border-gray-700 p-6">
        <h2 class="font-bold text-white mb-4">Quick Links</h2>
        <div class="space-y-2">
          <NuxtLink v-for="link in quickLinks" :key="link.to" :to="link.to"
            class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-700 transition-colors text-gray-300 hover:text-white">
            <span class="text-lg">{{ link.emoji }}</span>
            <span class="text-sm font-medium">{{ link.label }}</span>
            <svg class="w-4 h-4 ml-auto text-gray-600" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>
          </NuxtLink>
        </div>
      </div>
      <div class="bg-gray-800 rounded-2xl border border-gray-700 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-bold text-white">Pending Applications</h2>
          <NuxtLink to="/admin/applications" class="text-xs text-purple-400 hover:text-purple-300">View all →</NuxtLink>
        </div>
        <div v-if="pendingApps.length === 0" class="text-sm text-gray-400 text-center py-4">No pending applications</div>
        <div v-else class="space-y-3">
          <div v-for="app in pendingApps" :key="app.id" class="flex items-center gap-3 p-3 bg-gray-700/50 rounded-xl">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
              {{ (app.user as any)?.full_name?.[0] || '?' }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate">{{ (app.user as any)?.full_name }}</p>
              <p class="text-xs text-gray-400">Applied {{ fmtDate(app.created_at) }}</p>
            </div>
            <NuxtLink to="/admin/applications" class="text-xs text-purple-400 hover:text-purple-300 font-medium">Review</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Admin Dashboard' })

const { fetchStats, fetchAllApplications } = useAdmin()
const loading = ref(true)
const statsData = ref({ users: 0, cards: 0, weddings: 0, pendingApplications: 0 })
const pendingApps = ref<any[]>([])

const statCards = computed(() => [
  { emoji: '👥', label: 'Total Users', value: statsData.value.users },
  { emoji: '🎴', label: 'Cards Created', value: statsData.value.cards },
  { emoji: '💍', label: 'Weddings', value: statsData.value.weddings },
  { emoji: '⏳', label: 'Pending Applications', value: statsData.value.pendingApplications },
])

const quickLinks = [
  { to: '/admin/users', label: 'Manage Users & Roles', emoji: '👥' },
  { to: '/admin/applications', label: 'Designer Applications', emoji: '🎨' },
  { to: '/admin/requests', label: 'All Design Requests', emoji: '📋' },
  { to: '/admin/settings', label: 'App Settings', emoji: '⚙️' },
]

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

onMounted(async () => {
  const [s, apps] = await Promise.all([fetchStats(), fetchAllApplications()])
  statsData.value = { users: s.users, cards: s.cards, weddings: s.weddings, pendingApplications: s.pendingApplications }
  pendingApps.value = apps.data.filter((a: any) => a.status === 'pending').slice(0, 5)
  loading.value = false
})
</script>
