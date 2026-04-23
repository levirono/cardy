<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white">Users</h1>
      <p class="text-gray-400 mt-1">{{ users.length }} registered users</p>
    </div>
    <div class="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
      <div class="p-4 border-b border-gray-700">
        <input v-model="search" type="text" placeholder="Search by name or email…"
          class="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 text-sm outline-none focus:border-purple-500"/>
      </div>
      <div v-if="loading" class="p-8 text-center text-gray-400">Loading…</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-900/50">
            <tr>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined</th>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="u in filteredUsers" :key="u.id" class="hover:bg-gray-700/30 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    {{ u.full_name?.[0] || u.email?.[0] || '?' }}
                  </div>
                  <div>
                    <p class="font-medium text-white">{{ u.full_name || '—' }}</p>
                    <p class="text-gray-400 text-xs">{{ u.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 rounded-full text-xs font-medium" :class="roleColor(u.role)">{{ u.role }}</span>
              </td>
              <td class="px-6 py-4 text-gray-400">{{ fmtDate(u.created_at) }}</td>
              <td class="px-6 py-4">
                <select :value="u.role" @change="changeRole(u.id, ($event.target as HTMLSelectElement).value)"
                  class="bg-gray-700 border border-gray-600 text-white text-xs rounded-lg px-2 py-1.5 outline-none focus:border-purple-500">
                  <option value="user">user</option>
                  <option value="designer">designer</option>
                  <option value="admin">admin</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Profile } from '~/types'
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Users — Admin' })

const { fetchAllUsers, updateUserRole } = useAdmin()
const toast = useToast()
const users = ref<Profile[]>([])
const loading = ref(true)
const search = ref('')

const filteredUsers = computed(() => {
  const q = search.value.toLowerCase()
  return users.value.filter(u => u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))
})

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const roleColor = (r: string) => ({ admin: 'bg-red-900/50 text-red-400', designer: 'bg-amber-900/50 text-amber-400', user: 'bg-blue-900/50 text-blue-400' }[r] || 'bg-gray-700 text-gray-400')

const changeRole = async (userId: string, role: string) => {
  const { error } = await updateUserRole(userId, role as any)
  if (error) { toast.add({ title: 'Error', description: error.message, color: 'error' }); return }
  const u = users.value.find(u => u.id === userId)
  if (u) u.role = role as any
  toast.add({ title: `Role updated to ${role}`, color: 'success' })
}

onMounted(async () => {
  const { data } = await fetchAllUsers()
  users.value = data
  loading.value = false
})
</script>
