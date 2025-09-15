<template>
  <UApp>
    <div class="app-root min-h-dvh bg-bg text-text transition-colors">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <!-- Header -->
        <header class="sticky top-2 z-40 mb-8">
          <div
            class="flex items-center justify-between p-3 rounded-xl bg-bg-secondary/80 backdrop-blur-md border border-border shadow-sm">
            <!-- Logo -->
            <NuxtLink to="/" class="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
              <div class="size-8 rounded-lg" :class="app.ui.tokens?.gradients?.brand" />
              <span>Cardy</span>
            </NuxtLink>

            <!-- Navigation -->
            <nav class="flex items-center gap-1 sm:gap-3">
              <!-- Create Button -->
              <UButton to="/create" color="primary" variant="solid" icon="i-heroicons-plus-circle"
                class="hidden sm:inline-flex rounded-lg">
                Create
              </UButton>

              <UButton to="/create" color="primary" variant="solid" icon="i-heroicons-plus-circle"
                class="sm:hidden rounded-lg" aria-label="Create" />

              <!-- My Cards -->
              <UButton to="/my" color="neutral" variant="ghost" icon="i-heroicons-rectangle-stack"
                class="hidden sm:inline-flex rounded-lg">
                My Cards
              </UButton>

              <UButton to="/my" color="neutral" variant="ghost" icon="i-heroicons-rectangle-stack"
                class="sm:hidden rounded-lg" aria-label="My Cards" />

              <!-- Theme Toggle -->
              <!-- <UButton 
                :icon="iconTarget" 
                color="neutral" 
                variant="ghost" 
                :aria-label="`Switch to ${nextMode} mode`"
                @click="toggleTheme" 
                class="hidden sm:flex rounded-lg"
              >
                {{ isDark ? 'Light' : 'Dark' }}
              </UButton> -->

              <UButton 
                :icon="iconTarget" 
                color="neutral" 
                variant="ghost" 
                :aria-label="`Switch to ${nextMode} mode`"
                @click="toggleTheme" 
                class="sm:hidden rounded-lg" 
              />
            </nav>
          </div>
        </header>

        <!-- Main Content -->
        <main class="py-4">
          <slot />
        </main>

        <!-- Footer -->
        <footer class="mt-12 pt-6 border-t border-border">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="text-sm text-text-secondary">
              {{ new Date().getFullYear() }} Cardy. All rights reserved.
            </p>

            <div class="flex items-center gap-4">
              <UButton to="/about" variant="ghost" color="neutral" size="sm" label="About" />
              <UButton to="/privacy" variant="ghost" color="neutral" size="sm" label="Privacy" />
              <UButton to="/terms" variant="ghost" color="neutral" size="sm" label="Terms" />
            </div>
          </div>

          <div class="mt-4 text-center text-xs text-text-tertiary">
            Made with ❤️ for special moments
          </div>
        </footer>
      </div>
    </div>
  </UApp>
</template>

<script setup lang="ts">
const app = useAppConfig()
import { useGlobalTheme } from '~/composables/useGlobalTheme';

const { isDark, nextMode, iconTarget, toggleTheme } = useGlobalTheme()

// Watch for system theme changes
const colorMode = useColorMode()
watch(() => colorMode.preference, (newPreference) => {
  // This ensures the UI updates when system theme changes
  colorMode.value = newPreference
}, { immediate: true })
</script>