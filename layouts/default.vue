<template>
  <UApp>
    <div class="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <!-- Header -->
      <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/80 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <!-- Logo -->
            <NuxtLink to="/" class="flex items-center gap-2.5 group">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 17.5s-7.5-4.375-7.5-9.375A4.375 4.375 0 0110 4.5a4.375 4.375 0 017.5 3.625C17.5 13.125 10 17.5 10 17.5z" fill="white"/>
                </svg>
              </div>
              <span class="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Cardy</span>
            </NuxtLink>

            <!-- Desktop Nav -->
            <nav class="hidden md:flex items-center gap-1">
              <template v-if="isAuthenticated">
                <NuxtLink to="/dashboard" class="nav-link" active-class="nav-link-active">Dashboard</NuxtLink>
                <NuxtLink to="/cards/create" class="nav-link" active-class="nav-link-active">Create Card</NuxtLink>
                <NuxtLink to="/weddings/my" class="nav-link" active-class="nav-link-active">Weddings</NuxtLink>
                <NuxtLink to="/valentines" class="nav-link" active-class="nav-link-active">Valentines</NuxtLink>
                <template v-if="profile?.role === 'designer' || profile?.role === 'admin'">
                  <NuxtLink to="/designer" class="nav-link text-amber-600 font-medium" active-class="nav-link-active">Designer</NuxtLink>
                </template>
                <template v-if="profile?.role === 'admin'">
                  <NuxtLink to="/admin" class="nav-link text-red-600 font-medium" active-class="nav-link-active">Admin</NuxtLink>
                </template>
              </template>
              <template v-else>
                <NuxtLink to="/valentines" class="nav-link" active-class="nav-link-active">Valentines</NuxtLink>
                <NuxtLink to="/#features" class="nav-link">Features</NuxtLink>
              </template>
            </nav>

            <!-- Right actions -->
            <div class="flex items-center gap-2">
              <template v-if="isAuthenticated">
                <!-- User menu -->
                <div class="relative" ref="menuRef">
                  <button @click="menuOpen = !menuOpen"
                    class="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {{ initials }}
                    </div>
                    <span class="hidden sm:block text-sm font-medium text-gray-700">{{ profile?.full_name?.split(' ')[0] || 'Account' }}</span>
                    <svg class="w-4 h-4 text-gray-400 transition-transform" :class="menuOpen ? 'rotate-180' : ''" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                  <!-- Dropdown -->
                  <Transition enter-active-class="transition ease-out duration-150" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                    <div v-if="menuOpen" class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <div class="px-4 py-2.5 border-b border-gray-100">
                        <p class="font-semibold text-gray-900 text-sm">{{ profile?.full_name }}</p>
                        <p class="text-xs text-gray-500 mt-0.5">{{ profile?.email }}</p>
                        <span class="inline-block mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium" :class="roleBadgeClass">{{ profile?.role }}</span>
                      </div>
                      <div class="py-1">
                        <NuxtLink to="/dashboard" class="dropdown-item" @click="menuOpen = false">
                          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/></svg>
                          Dashboard
                        </NuxtLink>
                        <NuxtLink to="/cards/my" class="dropdown-item" @click="menuOpen = false">
                          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/></svg>
                          My Cards
                        </NuxtLink>
                        <NuxtLink to="/weddings/my" class="dropdown-item" @click="menuOpen = false">
                          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/></svg>
                          My Weddings
                        </NuxtLink>
                        <NuxtLink to="/cards/my-requests" class="dropdown-item" @click="menuOpen = false">
                          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/></svg>
                          My Requests
                        </NuxtLink>
                        <template v-if="profile?.role === 'designer' || profile?.role === 'admin'">
                          <div class="my-1 border-t border-gray-100"/>
                          <NuxtLink to="/designer" class="dropdown-item text-amber-700" @click="menuOpen = false">
                            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
                            Designer Panel
                          </NuxtLink>
                        </template>
                        <template v-if="profile?.role === 'admin'">
                          <NuxtLink to="/admin" class="dropdown-item text-red-700" @click="menuOpen = false">
                            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                            Admin Panel
                          </NuxtLink>
                        </template>
                      </div>
                      <div class="border-t border-gray-100 pt-1">
                        <button @click="handleSignOut" class="dropdown-item w-full text-red-600">
                          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"/></svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </Transition>
                </div>
              </template>
              <template v-else>
                <NuxtLink to="/login" class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Sign In</NuxtLink>
                <NuxtLink to="/signup" class="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl hover:shadow-lg hover:scale-105 transition-all">
                  Get Started
                </NuxtLink>
              </template>

              <!-- Mobile menu toggle -->
              <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path v-if="!mobileOpen" fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                  <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Nav -->
        <Transition enter-active-class="transition ease-out duration-150" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
          <div v-if="mobileOpen" class="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            <template v-if="isAuthenticated">
              <NuxtLink to="/dashboard" class="mobile-nav-link" @click="mobileOpen = false">Dashboard</NuxtLink>
              <NuxtLink to="/cards/create" class="mobile-nav-link" @click="mobileOpen = false">Create Card</NuxtLink>
              <NuxtLink to="/weddings/my" class="mobile-nav-link" @click="mobileOpen = false">My Weddings</NuxtLink>
              <NuxtLink to="/valentines" class="mobile-nav-link" @click="mobileOpen = false">Valentines</NuxtLink>
              <template v-if="profile?.role === 'designer' || profile?.role === 'admin'">
                <NuxtLink to="/designer" class="mobile-nav-link text-amber-700" @click="mobileOpen = false">Designer Panel</NuxtLink>
              </template>
              <template v-if="profile?.role === 'admin'">
                <NuxtLink to="/admin" class="mobile-nav-link text-red-700" @click="mobileOpen = false">Admin Panel</NuxtLink>
              </template>
              <button @click="handleSignOut" class="mobile-nav-link w-full text-left text-red-600">Sign Out</button>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="mobile-nav-link" @click="mobileOpen = false">Sign In</NuxtLink>
              <NuxtLink to="/signup" class="mobile-nav-link font-semibold text-purple-600" @click="mobileOpen = false">Get Started</NuxtLink>
              <NuxtLink to="/valentines" class="mobile-nav-link" @click="mobileOpen = false">Valentines</NuxtLink>
            </template>
          </div>
        </Transition>
      </header>

      <!-- Page content -->
      <main>
        <slot />
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 mt-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div class="md:col-span-2">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 17.5s-7.5-4.375-7.5-9.375A4.375 4.375 0 0110 4.5a4.375 4.375 0 017.5 3.625C17.5 13.125 10 17.5 10 17.5z" fill="white"/></svg>
                </div>
                <span class="text-lg font-bold text-gray-900">Cardy</span>
              </div>
              <p class="text-gray-500 text-sm leading-relaxed">Beautiful digital cards, wedding invitations & valentines for every moment that matters. Create, share, and celebrate.</p>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 mb-3 text-sm">Features</h4>
              <ul class="space-y-2 text-sm text-gray-500">
                <li><NuxtLink to="/cards/create" class="hover:text-purple-600 transition-colors">Create Cards</NuxtLink></li>
                <li><NuxtLink to="/weddings/create" class="hover:text-purple-600 transition-colors">Wedding Invitations</NuxtLink></li>
                <li><NuxtLink to="/valentines" class="hover:text-purple-600 transition-colors">Valentines</NuxtLink></li>
                <li><NuxtLink to="/cards/request-design" class="hover:text-purple-600 transition-colors">Custom Designs</NuxtLink></li>
              </ul>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 mb-3 text-sm">Company</h4>
              <ul class="space-y-2 text-sm text-gray-500">
                <li><NuxtLink to="/about" class="hover:text-purple-600 transition-colors">About</NuxtLink></li>
                <li><NuxtLink to="/privacy" class="hover:text-purple-600 transition-colors">Privacy Policy</NuxtLink></li>
                <li><NuxtLink to="/terms" class="hover:text-purple-600 transition-colors">Terms of Service</NuxtLink></li>
              </ul>
            </div>
          </div>
          <div class="border-t border-gray-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p class="text-sm text-gray-400">© {{ new Date().getFullYear() }} Cardy. All rights reserved.</p>
            <p class="text-sm text-gray-400">Made with ❤️ for special moments</p>
          </div>
        </div>
      </footer>
    </div>
    <UNotifications />
  </UApp>
</template>

<script setup lang="ts">
const { isAuthenticated, profile, signOut } = useAuth()
const toast = useToast()
const router = useRouter()

const menuOpen = ref(false)
const mobileOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const initials = computed(() => {
  const name = profile.value?.full_name ?? ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
})

const roleBadgeClass = computed(() => {
  const role = profile.value?.role
  if (role === 'admin') return 'bg-red-100 text-red-700'
  if (role === 'designer') return 'bg-amber-100 text-amber-700'
  return 'bg-blue-100 text-blue-700'
})

const handleSignOut = async () => {
  const { error } = await signOut()
  menuOpen.value = false
  mobileOpen.value = false
  if (!error) {
    toast.add({ title: 'Signed out', description: 'See you soon!', color: 'success' })
    router.push('/login')
  }
}

// Close menu on outside click
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (menuRef.value && !menuRef.value.contains(e.target as Node)) menuOpen.value = false
  })
})
</script>

<style scoped>
@reference "tailwindcss";

.nav-link {
  @apply px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-150;
}
.nav-link-active {
  @apply text-purple-700 bg-purple-50;
}
.dropdown-item {
  @apply flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer;
}
.mobile-nav-link {
  @apply block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors;
}
</style>