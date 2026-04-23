<template>
  <UApp>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <NuxtLink to="/" class="inline-flex items-center gap-2 group">
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                <path d="M10 17.5s-7.5-4.375-7.5-9.375A4.375 4.375 0 0110 4.5a4.375 4.375 0 017.5 3.625C17.5 13.125 10 17.5 10 17.5z" fill="white"/>
              </svg>
            </div>
            <span class="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Cardy</span>
          </NuxtLink>
        </div>
        <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <slot />
        </div>
        <p class="text-center text-xs text-gray-400 mt-6">© {{ new Date().getFullYear() }} Cardy · <NuxtLink to="/privacy" class="hover:text-purple-600">Privacy</NuxtLink> · <NuxtLink to="/terms" class="hover:text-purple-600">Terms</NuxtLink></p>
      </div>
    </div>
    <UNotifications />
  </UApp>
</template>
