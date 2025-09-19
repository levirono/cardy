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

              <!-- Request Design -->
              <UButton to="/designer-request" color="neutral" variant="ghost" icon="i-heroicons-paint-brush"
                class="hidden sm:inline-flex rounded-lg">
                Request Design
              </UButton>

              <UButton to="/designer-request" color="neutral" variant="ghost" icon="i-heroicons-paint-brush"
                class="sm:hidden rounded-lg" aria-label="Request Design" />

              <!-- My Cards -->
              <UButton to="/my" color="neutral" variant="ghost" icon="i-heroicons-rectangle-stack"
                class="hidden sm:inline-flex rounded-lg">
                My Cards
              </UButton>

              <UButton to="/my" color="neutral" variant="ghost" icon="i-heroicons-rectangle-stack"
                class="sm:hidden rounded-lg" aria-label="My Cards" />

              <!-- My Account Dropdown -->
              <UDropdown v-model="isOpen" :popper="{ placement: 'bottom-start' }" :ui="{ width: 'w-56' }">
                <UButton 
                  color="neutral" 
                  variant="ghost" 
                  icon="i-heroicons-user-circle" 
                  class="rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  @click="toggleDropdown"
                  aria-label="My Account"
                >
                  <span class="hidden sm:inline text-gray-700 dark:text-gray-200">My Account</span>
                </UButton>

                <template #panel>
                  <div class="w-full">
                    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                      <p class="font-medium text-gray-900 dark:text-white">John Doe</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Designer</p>
                    </div>
                    <div class="p-1">
                      <!-- Personal Section -->
                      <div class="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">Personal</div>

                      <UButton to="/profile" block color="neutral" variant="ghost" icon="i-heroicons-user"
                        class="justify-start text-gray-700 dark:text-gray-300" @click="closeDropdown">
                        My Profile
                      </UButton>

                      <UButton to="/settings" block color="neutral" variant="ghost" icon="i-heroicons-cog-6-tooth"
                        class="justify-start mt-1 text-gray-700 dark:text-gray-300" @click="closeDropdown">
                        Settings
                      </UButton>

                      <!-- My Content Section -->
                      <div class="px-3 py-1.5 mt-2 text-xs font-semibold text-gray-500 dark:text-gray-400">My Content
                      </div>

                      <UButton to="/my" block color="neutral" variant="ghost" icon="i-heroicons-rectangle-stack"
                        class="justify-start text-gray-700 dark:text-gray-300" @click="closeDropdown">
                        My Cards
                      </UButton>

                      <UButton to="/my-requests" block color="neutral" variant="ghost"
                        icon="i-heroicons-clipboard-document-list"
                        class="justify-start mt-1 text-gray-700 dark:text-gray-300" @click="closeDropdown">
                        My Requests
                      </UButton>

                      <UButton to="/favorites" block color="neutral" variant="ghost" icon="i-heroicons-heart"
                        class="justify-start mt-1 text-gray-700 dark:text-gray-300" @click="closeDropdown">
                        Favorites
                      </UButton>

                      <!-- Designer Section -->
                      <div class="px-3 py-1.5 mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400">Designer
                      </div>

                      <UButton to="/designer/dashboard" block color="neutral" variant="ghost"
                        icon="i-heroicons-wrench-screwdriver" class="justify-start" @click="closeDropdown">
                        Designer Dashboard
                      </UButton>

                      <UButton to="/designer/earnings" block color="neutral" variant="ghost"
                        icon="i-heroicons-banknotes" class="justify-start mt-1 text-gray-700 dark:text-gray-300"
                        @click="closeDropdown">
                        My Earnings
                      </UButton>

                      <!-- Account Section -->
                      <UDivider class="my-1.5" />

                      <UButton to="/help" block color="neutral" variant="ghost" icon="i-heroicons-question-mark-circle"
                        class="justify-start text-gray-700 dark:text-gray-300" @click="closeDropdown">
                        Help & Support
                      </UButton>

                      <UButton block color="error" variant="ghost" icon="i-heroicons-arrow-left-on-rectangle"
                        class="justify-start mt-1 text-error-600 dark:text-error-400" @click="signOut()">
                        Sign Out
                      </UButton>
                    </div>
                  </div>
                </template>
              </UDropdown>

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

              <UButton :icon="iconTarget" color="neutral" variant="ghost" :aria-label="`Switch to ${nextMode} mode`"
                @click="toggleTheme" class="sm:hidden rounded-lg" />
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
import { ref, onMounted, watch } from 'vue';
import { navigateTo } from '#imports';

const app = useAppConfig()
import { useGlobalTheme } from '~/composables/useGlobalTheme';

const { isDark, nextMode, iconTarget, toggleTheme } = useGlobalTheme()
const colorMode = useColorMode()

// Dropdown state
const isOpen = ref(false);

// Close dropdown function
const closeDropdown = () => {
  isOpen.value = false;
};

// Toggle dropdown
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// Sign out function
const signOut = async () => {
  try {
    // TODO: Implement actual sign out logic
    await navigateTo('/login');
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

// Watch for system theme changes
watch(() => colorMode.preference, (newPreference) => {
  colorMode.value = newPreference
}, { immediate: true })
</script>