<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">My Templates</h1>
        <p class="text-gray-500 mt-1">Upload and manage your card templates</p>
      </div>
      <button @click="showForm = true" class="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold text-sm shadow hover:shadow-md transition-all flex items-center gap-2">
        + Upload Template
      </button>
    </div>

    <!-- Upload form modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-gray-900">Upload New Template</h2>
          <button @click="showForm = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="label">Title *</label>
            <input v-model="newTemplate.title" type="text" placeholder="Template name" class="form-input"/>
          </div>
          <div>
            <label class="label">Description</label>
            <textarea v-model="newTemplate.description" rows="3" placeholder="Describe this template…" class="form-input resize-none"></textarea>
          </div>
          <div>
            <label class="label">Category</label>
            <select v-model="newTemplate.category" class="form-input">
              <option v-for="c in categories" :key="c.value" :value="c.value">{{ c.label }}</option>
            </select>
          </div>
          <div>
            <label class="label">Thumbnail URL</label>
            <input v-model="newTemplate.thumbnail_url" type="url" placeholder="https://…" class="form-input"/>
          </div>
          <div v-if="formError" class="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{{ formError }}</div>
          <div class="flex gap-3">
            <button @click="showForm = false" class="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600">Cancel</button>
            <button @click="uploadTemplate" :disabled="saving || !newTemplate.title"
              class="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold text-sm disabled:opacity-60">
              <span v-if="saving">Uploading…</span><span v-else>Upload</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="h-52 bg-gray-100 rounded-2xl animate-pulse"></div>
    </div>
    <div v-else-if="templates.length === 0" class="text-center py-16 text-gray-400">
      <div class="text-4xl mb-3">🎨</div>
      <p class="font-medium">No templates yet</p>
      <button @click="showForm = true" class="mt-4 text-sm text-amber-600 font-medium">Upload your first →</button>
    </div>
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="t in templates" :key="t.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div class="h-32 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
          <img v-if="t.thumbnail_url" :src="t.thumbnail_url" :alt="t.title" class="w-full h-full object-cover"/>
          <span v-else class="text-4xl">🎨</span>
        </div>
        <div class="p-4">
          <h3 class="font-bold text-gray-900 truncate">{{ t.title }}</h3>
          <p class="text-xs text-gray-500 mt-1 capitalize">{{ t.category }}</p>
          <div class="flex items-center justify-between mt-3">
            <span class="text-xs px-2 py-1 rounded-full" :class="t.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
              {{ t.is_active ? 'Active' : 'Inactive' }}
            </span>
            <button @click="toggleActive(t)" class="text-xs text-amber-600 hover:text-amber-800 font-medium">
              {{ t.is_active ? 'Deactivate' : 'Activate' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CardTemplate } from '~/types'
definePageMeta({ middleware: 'designer' })
useHead({ title: 'My Templates' })

const { createTemplate } = useTemplates()
const { $supabase } = useNuxtApp()
const { user } = useAuth()
const toast = useToast()

const templates = ref<CardTemplate[]>([])
const loading = ref(true)
const showForm = ref(false)
const saving = ref(false)
const formError = ref('')

const newTemplate = reactive({ title: '', description: '', category: 'general', thumbnail_url: '' })
const categories = [
  { value: 'general', label: 'General' }, { value: 'birthday', label: 'Birthday' },
  { value: 'anniversary', label: 'Anniversary' }, { value: 'wedding', label: 'Wedding' },
  { value: 'christmas', label: 'Christmas' }, { value: 'valentine', label: 'Valentine' },
  { value: 'thank_you', label: 'Thank You' }, { value: 'graduation', label: 'Graduation' },
]

const uploadTemplate = async () => {
  saving.value = true; formError.value = ''
  const { data, error } = await createTemplate({ title: newTemplate.title, description: newTemplate.description, thumbnail_url: newTemplate.thumbnail_url || undefined, category: newTemplate.category })
  saving.value = false
  if (error) { formError.value = error.message; return }
  templates.value.unshift(data as CardTemplate)
  showForm.value = false
  Object.assign(newTemplate, { title: '', description: '', category: 'general', thumbnail_url: '' })
  toast.add({ title: 'Template uploaded!', color: 'success' })
}

const toggleActive = async (t: CardTemplate) => {
  await $supabase.from('card_templates').update({ is_active: !t.is_active }).eq('id', t.id)
  t.is_active = !t.is_active
}

onMounted(async () => {
  if (!user.value) return
  const { data } = await $supabase.from('card_templates').select('*').eq('designer_id', user.value.id).order('created_at', { ascending: false })
  templates.value = (data as CardTemplate[]) ?? []
  loading.value = false
})
</script>
<style scoped>
@reference "tailwindcss";
.label { @apply block text-sm font-medium text-gray-700 mb-1.5; }
.form-input { @apply w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm; }
</style>
