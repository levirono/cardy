<template>
  <UApp>
    <div class="min-h-dvh" :class="app.ui.tokens?.gradients?.surface">
      <UContainer>
        <header class="sticky top-2 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-gray-900/60 bg-white/60 dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-800/60 rounded-xl px-4 py-2 mt-2">
          <div class="flex items-center justify-between">
            <NuxtLink to="/" class="flex items-center gap-2 font-semibold">
              <div class="size-8 rounded-lg" :class="app.ui.tokens?.gradients?.brand" />
              <span>Cardy</span>
            </NuxtLink>
            <div class="flex items-center gap-1 sm:gap-2">
              <!-- Icon-only on mobile, labeled on sm+ -->
              <UButton class="sm:hidden" to="/create" color="primary" variant="solid" icon="i-heroicons-plus-circle" :aria-label="'Create'" />
              <UButton class="hidden sm:inline-flex" to="/create" color="primary" variant="solid" icon="i-heroicons-plus-circle" label="Create" />

              <UButton class="sm:hidden" to="/my" color="neutral" variant="ghost" icon="i-heroicons-rectangle-stack" :aria-label="'My cards'" />
              <UButton class="hidden sm:inline-flex" to="/my" color="neutral" variant="ghost" icon="i-heroicons-rectangle-stack" label="My cards" />

              <ColorScheme>
                <UButton class="sm:hidden" variant="ghost" color="neutral" :icon="icon" @click="toggleTheme" :aria-label="`Toggle ${colorMode.preference} mode`" />
                <UButton class="hidden sm:inline-flex" variant="ghost" color="neutral" :icon="icon" @click="toggleTheme" :label="isDark ? 'Dark' : 'Light'" :aria-label="`Toggle ${colorMode.preference} mode`" />
              </ColorScheme>
            </div>
          </div>
        </header>

        <main class="py-6">
          <slot />
        </main>

        <footer class="mt-8 border-t border-gray-200/60 dark:border-gray-800/60 py-6 flex items-center justify-between">
          <p class="text-sm text-gray-500">© {{ new Date().getFullYear() }} Cardy</p>
          <UButton to="/about" variant="link" color="neutral" label="About" />
        </footer>
      </UContainer>
    </div>
  </UApp>
</template>

<script setup lang="ts">
const app = useAppConfig() as any
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const icon = computed(() => isDark.value ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid')

function toggleTheme() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script> 