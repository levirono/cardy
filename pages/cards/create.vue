<template>
  <div class="max-w-3xl mx-auto px-4 py-10">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Create a Card</h1>
      <p class="text-gray-500 mt-1">Pick a template or start blank, then personalize your message</p>
    </div>

    <!-- Step indicator -->
    <div class="flex items-center gap-3 mb-10">
      <div v-for="(s, i) in steps" :key="s" class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
          :class="step === i+1 ? 'bg-purple-600 text-white shadow-md' : step > i+1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'">
          <svg v-if="step > i+1" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          <span v-else>{{ i+1 }}</span>
        </div>
        <span class="text-sm font-medium hidden sm:block" :class="step === i+1 ? 'text-purple-700' : 'text-gray-400'">{{ s }}</span>
        <div v-if="i < steps.length-1" class="w-8 h-0.5 bg-gray-200 hidden sm:block"></div>
      </div>
    </div>

    <!-- Step 1: Template -->
    <div v-if="step === 1">
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <button @click="selectTemplate(null)"
          :class="form.template_id === null ? 'ring-2 ring-purple-500 border-purple-200' : 'border-gray-200'"
          class="p-6 rounded-2xl border-2 text-center hover:border-purple-300 transition-all">
          <div class="text-3xl mb-2">✏️</div>
          <p class="text-sm font-medium text-gray-700">Blank</p>
          <p class="text-xs text-gray-400 mt-1">Start from scratch</p>
        </button>
        <button v-for="t in templates" :key="t.id" @click="selectTemplate(t.id)"
          :class="form.template_id === t.id ? 'ring-2 ring-purple-500 border-purple-200' : 'border-gray-200'"
          class="p-4 rounded-2xl border-2 text-center hover:border-purple-300 transition-all overflow-hidden">
          <div v-if="t.thumbnail_url" class="w-full h-20 rounded-lg mb-2 overflow-hidden">
            <img :src="t.thumbnail_url" :alt="t.title" class="w-full h-full object-cover"/>
          </div>
          <div v-else class="w-full h-20 rounded-lg mb-2 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-3xl">🎨</div>
          <p class="text-xs font-medium text-gray-700 truncate">{{ t.title }}</p>
        </button>
      </div>
      <button @click="step = 2" class="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-sm shadow hover:shadow-md hover:-translate-y-0.5 transition-all">
        Continue →
      </button>
    </div>

    <!-- Step 2: Details -->
    <div v-if="step === 2" class="space-y-5">
      <div>
        <label class="label">Card Title</label>
        <input v-model="form.title" type="text" placeholder="e.g. Happy Birthday!" class="form-input"/>
      </div>
      <div>
        <label class="label">Recipient's Name</label>
        <input v-model="form.recipient_name" type="text" placeholder="e.g. Sarah" class="form-input"/>
      </div>
      <div>
        <label class="label">Your Message</label>
        <textarea v-model="form.message" rows="5" placeholder="Write your heartfelt message here…" class="form-input resize-none"></textarea>
      </div>
      <div>
        <label class="label">Media Type</label>
        <div class="grid grid-cols-4 gap-2">
          <button v-for="mt in mediaTypes" :key="mt.value" @click="form.media_type = mt.value"
            class="py-3 rounded-xl border-2 text-center text-xs font-medium transition-all"
            :class="form.media_type === mt.value ? 'border-purple-400 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-purple-300'">
            {{ mt.emoji }} {{ mt.label }}
          </button>
        </div>
      </div>
      <div v-if="form.media_type !== 'text'">
        <label class="label">Media URL</label>
        <input v-model="form.media_url" type="url" placeholder="https://…" class="form-input"/>
      </div>

      <!-- Advanced toggle -->
      <details class="bg-gray-50 rounded-xl p-4">
        <summary class="cursor-pointer text-sm font-medium text-gray-700 select-none">⚙️ Advanced Options (optional)</summary>
        <div class="mt-4 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Background Color</label>
              <input v-model="form.background_color" type="color" class="h-10 w-full rounded-lg border border-gray-200 p-1"/>
            </div>
            <div>
              <label class="label">Text Color</label>
              <input v-model="form.text_color" type="color" class="h-10 w-full rounded-lg border border-gray-200 p-1"/>
            </div>
          </div>
          <div>
            <label class="label">Unlock Date/Time (optional)</label>
            <input v-model="form.unlock_at" type="datetime-local" class="form-input"/>
            <p class="text-xs text-gray-400 mt-1">Leave blank to unlock immediately</p>
          </div>
          <div>
            <label class="label">Secret Key (optional)</label>
            <input v-model="form.key" type="text" placeholder="A word only the recipient knows" class="form-input"/>
          </div>
        </div>
      </details>

      <div v-if="saveError" class="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{{ saveError }}</div>
      <div class="flex gap-3">
        <button @click="step = 1" class="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">← Back</button>
        <button @click="step = 3" :disabled="!form.title || !form.recipient_name || !form.message"
          class="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-sm disabled:opacity-50 hover:shadow-md hover:-translate-y-0.5 transition-all">
          Preview →
        </button>
      </div>
    </div>

    <!-- Step 3: Preview & Save -->
    <div v-if="step === 3">
      <div class="rounded-2xl overflow-hidden border border-gray-200 shadow-lg mb-6"
        :style="{ backgroundColor: form.background_color || '#f3e8ff', color: form.text_color || '#1f2937' }">
        <div class="p-8 text-center">
          <h2 class="text-2xl font-bold mb-2" :style="{ color: form.title_color || form.text_color || '#6d28d9' }">{{ form.title }}</h2>
          <p class="text-sm opacity-70 mb-6">To: {{ form.recipient_name }}</p>
          <div v-if="form.media_url && form.media_type === 'image'" class="mb-6 rounded-xl overflow-hidden max-h-60">
            <img :src="form.media_url" alt="Card media" class="w-full h-full object-cover"/>
          </div>
          <p class="leading-relaxed whitespace-pre-wrap">{{ form.message }}</p>
          <div v-if="form.unlock_at" class="mt-6 inline-flex items-center gap-2 bg-white/30 backdrop-blur px-4 py-2 rounded-full text-xs">
            🔒 Unlocks {{ fmtDate(form.unlock_at) }}
          </div>
        </div>
      </div>
      <div class="flex gap-3">
        <button @click="step = 2" class="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">← Edit</button>
        <button @click="saveCard" :disabled="saving"
          class="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-sm disabled:opacity-60 hover:shadow-md transition-all">
          <span v-if="saving">Saving…</span>
          <span v-else>Save & Share 🎉</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CardTemplate } from '~/types'
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Create a Card' })

const { $supabase } = useNuxtApp()
const { user } = useAuth()
const router = useRouter()
const toast = useToast()

const steps = ['Choose Template', 'Add Details', 'Preview & Save']
const step = ref(1)
const saving = ref(false)
const saveError = ref('')
const templates = ref<CardTemplate[]>([])

const mediaTypes = [
  { value: 'text', label: 'Text', emoji: '📝' },
  { value: 'image', label: 'Image', emoji: '🖼️' },
  { value: 'video', label: 'Video', emoji: '🎬' },
  { value: 'animation', label: 'GIF', emoji: '✨' },
]

const form = reactive({
  template_id: null as string | null,
  title: '', recipient_name: '', message: '',
  media_type: 'text', media_url: '',
  background_color: '#f3e8ff', text_color: '#1f2937',
  title_color: '', unlock_at: '', key: '',
})

const selectTemplate = (id: string | null) => {
  form.template_id = id
  if (id) {
    const t = templates.value.find(t => t.id === id)
    if (t?.thumbnail_url) form.background_color = '#f3e8ff'
  }
}

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''

const saveCard = async () => {
  saving.value = true; saveError.value = ''
  const payload: any = {
    user_id: user.value?.id,
    title: form.title, recipient_name: form.recipient_name, message: form.message,
    media_type: form.media_type,
    media_url: form.media_url || null,
    background_color: form.background_color || null,
    text_color: form.text_color || null,
    unlock_at: form.unlock_at || null,
    is_locked: !!form.unlock_at,
    key: form.key || null,
    template_id: form.template_id,
  }
  const { data, error } = await $supabase.from('cards').insert(payload).select().single()
  saving.value = false
  if (error) { saveError.value = error.message; return }
  toast.add({ title: 'Card created!', description: 'Share the link with the recipient', color: 'success' })
  router.push(`/cards/${data.id}`)
}

onMounted(async () => {
  const { data } = await $supabase.from('card_templates').select('*').eq('is_active', true).limit(8)
  templates.value = (data as CardTemplate[]) ?? []
})
</script>

<style scoped>
@reference "tailwindcss";
.label { @apply block text-sm font-medium text-gray-700 mb-1.5; }
.form-input { @apply w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm; }
</style>
