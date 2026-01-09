export function useDesignerSettings() {
  const enabled = useState<boolean | null>('designer_applications_enabled', () => null)
  const loading = useState<boolean>('designer_applications_loading', () => false)

  const fetchSetting = async () => {
    if (loading.value) return
    loading.value = true
    try {
      const data = await $fetch<{ enabled: boolean }>('/api/settings/designer-applications')
      enabled.value = data.enabled
    } catch (error) {
      console.error('Failed to load designer applications setting:', error)
      enabled.value = true // fail-open so users can still apply
    } finally {
      loading.value = false
    }
  }

  if (process.client && enabled.value === null) {
    fetchSetting()
  }

  return {
    enabled,
    loading,
    fetchSetting,
  }
}

