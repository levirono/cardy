import { computed } from 'vue'
import { useColorMode } from '#imports'

export function useGlobalTheme() {
  const colorMode = useColorMode()
  
  const isDark = computed(() => colorMode.value === 'dark')
  const nextMode = computed(() => isDark.value ? 'light' : 'dark')
  const iconTarget = computed(() => isDark.value ? 'i-heroicons-sun' : 'i-heroicons-moon')

  function toggleTheme() {
    // This will automatically update both the preference and the current mode
    colorMode.preference = nextMode.value
  }

  return { 
    isDark, 
    nextMode, 
    iconTarget, 
    toggleTheme 
  }
}