<template>
  <UApp>
    <div class="min-h-screen bg-gray-950 text-white flex">
      <!-- Sidebar -->
      <aside class="w-64 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-screen z-40">
        <div class="p-5 border-b border-gray-800">
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 17.5s-7.5-4.375-7.5-9.375A4.375 4.375 0 0110 4.5a4.375 4.375 0 017.5 3.625C17.5 13.125 10 17.5 10 17.5z" fill="white"/></svg>
            </div>
            <span class="font-bold text-white">Cardy <span class="text-xs font-normal text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded ml-1">Admin</span></span>
          </NuxtLink>
        </div>
        <nav class="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="admin-nav-link" active-class="admin-nav-link-active">
            <component :is="'div'" class="w-4 h-4 flex-shrink-0" v-html="item.icon" />
            {{ item.label }}
          </NuxtLink>
        </nav>
        <div class="p-4 border-t border-gray-800">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-sm font-bold">{{ initials }}</div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-100 truncate">{{ profile?.full_name }}</p>
              <p class="text-xs text-gray-400 truncate">{{ profile?.email }}</p>
            </div>
          </div>
          <button @click="handleSignOut" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-colors">
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"/></svg>
            Sign Out
          </button>
        </div>
      </aside>
      <!-- Main content -->
      <div class="flex-1 ml-64 min-h-screen flex flex-col">
        <header class="h-14 bg-gray-900/80 backdrop-blur border-b border-gray-800 flex items-center px-6 sticky top-0 z-30">
          <h1 class="text-sm font-semibold text-gray-300">Admin Panel</h1>
          <div class="ml-auto flex items-center gap-3">
            <NuxtLink to="/" target="_blank" class="text-xs text-gray-500 hover:text-gray-300 transition-colors">View Site ↗</NuxtLink>
          </div>
        </header>
        <main class="flex-1 p-6 overflow-auto">
          <slot />
        </main>
      </div>
    </div>
    <UNotifications />
  </UApp>
</template>

<script setup lang="ts">
const { profile, signOut } = useAuth()
const router = useRouter()
const toast = useToast()

const initials = computed(() => {
  const name = profile.value?.full_name ?? ''
  return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'A'
})

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/></svg>' },
  { to: '/admin/users', label: 'Users', icon: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>' },
  { to: '/admin/applications', label: 'Applications', icon: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/></svg>' },
  { to: '/admin/requests', label: 'Design Requests', icon: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>' },
  { to: '/admin/settings', label: 'Settings', icon: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/></svg>' },
]

const handleSignOut = async () => {
  await signOut()
  toast.add({ title: 'Signed out', color: 'success' })
  router.push('/login')
}
</script>

<style scoped>
@reference "tailwindcss";
.admin-nav-link {
  @apply flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-150;
}
.admin-nav-link-active {
  @apply text-white bg-gray-800 font-medium;
}
</style>
