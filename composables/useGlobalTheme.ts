import { watch, computed } from 'vue'
import { useColorMode } from '#imports'

export function useGlobalTheme() {
  const colorMode = useColorMode()
  const isDark = computed(() => colorMode.value === 'dark')
  const nextMode = computed(() => isDark.value ? 'light' : 'dark')
  const iconTarget = computed(() => isDark.value ? 'i-heroicons-sun' : 'i-heroicons-moon')

  function toggleTheme() {
    colorMode.preference = nextMode.value
    colorMode.value = nextMode.value
  }

  // Apply theme class to <html>
  watch(
    () => colorMode.value,
    (mode) => {
      document.documentElement.classList.toggle('dark', mode === 'dark')
      document.documentElement.classList.toggle('light', mode === 'light')
    },
    { immediate: true }
  )

  return { isDark, nextMode, iconTarget, toggleTheme }
}