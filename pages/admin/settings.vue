<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white">App Settings</h1>
      <p class="text-gray-400 mt-1">Manage feature flags and platform configuration</p>
    </div>
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-20 bg-gray-800 rounded-2xl animate-pulse"></div>
    </div>
    <div v-else class="space-y-4">
      <div class="bg-gray-800 rounded-2xl border border-gray-700 p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-bold text-white">Designer Applications</h3>
            <p class="text-sm text-gray-400 mt-1">Allow users to apply to become designers</p>
          </div>
          <div @click="toggleSetting('designer_applications_enabled', 'enabled')"
            class="w-12 h-6 rounded-full cursor-pointer transition-colors relative flex-shrink-0"
            :class="getSetting('designer_applications_enabled', 'enabled') ? 'bg-purple-600' : 'bg-gray-600'">
            <div class="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform"
              :class="getSetting('designer_applications_enabled', 'enabled') ? 'translate-x-6' : 'translate-x-0.5'"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AppSetting } from '~/types'
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Settings — Admin' })

const { fetchSettings, updateSetting } = useAdmin()
const toast = useToast()
const settings = ref<AppSetting[]>([])
const loading = ref(true)

const getSetting = (key: string, field: string) => {
  const s = settings.value.find(s => s.key === key)
  return s ? (s.value as any)[field] : false
}

const toggleSetting = async (key: string, field: string) => {
  const current = getSetting(key, field)
  const newValue = { [field]: !current }
  const { error } = await updateSetting(key, newValue)
  if (error) { toast.add({ title: 'Error', color: 'error' }); return }
  const s = settings.value.find(s => s.key === key)
  if (s) s.value = newValue
  toast.add({ title: 'Setting updated', color: 'success' })
}

onMounted(async () => {
  const { data } = await fetchSettings()
  settings.value = data
  loading.value = false
})
</script>
