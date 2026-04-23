<template>
  <div class="max-w-3xl mx-auto px-4 py-10">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Create Wedding Invitation</h1>
      <p class="text-gray-500 mt-1">Set up your wedding page in a few simple steps</p>
    </div>

    <!-- Step indicator -->
    <div class="flex items-center mb-10 overflow-x-auto pb-2">
      <div v-for="(s, i) in steps" :key="s.label" class="flex items-center flex-shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
            :class="step === i+1 ? 'bg-rose-500 text-white shadow-md shadow-rose-200' : step > i+1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'">
            <svg v-if="step > i+1" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            <span v-else>{{ i+1 }}</span>
          </div>
          <span class="text-xs font-medium hidden sm:block" :class="step === i+1 ? 'text-rose-700' : 'text-gray-400'">{{ s.label }}</span>
        </div>
        <div v-if="i < steps.length-1" class="w-6 sm:w-10 h-0.5 mx-1 sm:mx-2 flex-shrink-0" :class="step > i+1 ? 'bg-green-300' : 'bg-gray-200'"></div>
      </div>
    </div>

    <!-- Step 1: Couple Info -->
    <div v-if="step === 1" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
      <div class="text-center mb-4">
        <div class="text-4xl mb-2">💑</div>
        <h2 class="text-lg font-bold text-gray-900">About the Couple</h2>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="label">Partner 1 Name *</label>
          <input v-model="form.couple_name_1" type="text" placeholder="e.g. Sarah" class="form-input" required/>
        </div>
        <div>
          <label class="label">Partner 2 Name *</label>
          <input v-model="form.couple_name_2" type="text" placeholder="e.g. Michael" class="form-input" required/>
        </div>
      </div>
      <div>
        <label class="label">Your Love Story (optional)</label>
        <textarea v-model="form.story_text" rows="4" placeholder="How did you meet? What makes your love story special?" class="form-input resize-none"></textarea>
      </div>
      <div>
        <label class="label">Welcome Message (optional)</label>
        <textarea v-model="form.welcome_message" rows="3" placeholder="A warm message for your guests…" class="form-input resize-none"></textarea>
      </div>
      <button @click="nextStep" :disabled="!form.couple_name_1 || !form.couple_name_2"
        class="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-semibold text-sm disabled:opacity-50 hover:shadow-lg hover:-translate-y-0.5 transition-all">
        Continue →
      </button>
    </div>

    <!-- Step 2: Event Details -->
    <div v-if="step === 2" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
      <div class="text-center mb-4">
        <div class="text-4xl mb-2">📅</div>
        <h2 class="text-lg font-bold text-gray-900">Event Details</h2>
      </div>
      <div>
        <label class="label">Wedding Date *</label>
        <input v-model="form.wedding_date" type="date" class="form-input" required/>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="label">Ceremony Time</label>
          <input v-model="form.ceremony_time" type="time" class="form-input"/>
        </div>
        <div>
          <label class="label">Reception Time</label>
          <input v-model="form.reception_time" type="time" class="form-input"/>
        </div>
      </div>
      <div>
        <label class="label">Venue Name</label>
        <input v-model="form.venue_name" type="text" placeholder="e.g. The Grand Ballroom" class="form-input"/>
      </div>
      <div>
        <label class="label">Venue Address</label>
        <input v-model="form.venue_address" type="text" placeholder="Full address for guests" class="form-input"/>
      </div>
      <div>
        <label class="label">Dress Code (optional)</label>
        <input v-model="form.dress_code" type="text" placeholder="e.g. Black Tie, Smart Casual" class="form-input"/>
      </div>
      <div class="flex gap-3">
        <button @click="step--" class="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">← Back</button>
        <button @click="nextStep" :disabled="!form.wedding_date"
          class="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-semibold text-sm disabled:opacity-50 hover:shadow-lg transition-all">
          Continue →
        </button>
      </div>
    </div>

    <!-- Step 3: Design -->
    <div v-if="step === 3" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
      <div class="text-center mb-4">
        <div class="text-4xl mb-2">🎨</div>
        <h2 class="text-lg font-bold text-gray-900">Design Your Page</h2>
      </div>
      <div>
        <label class="label">Cover Image URL (optional)</label>
        <input v-model="form.cover_image_url" type="url" placeholder="https://…" class="form-input"/>
        <p class="text-xs text-gray-400 mt-1">Link to a photo of you both for the cover</p>
      </div>
      <div>
        <label class="label">Theme</label>
        <div class="grid grid-cols-4 gap-2">
          <button v-for="t in themes" :key="t.value" @click="form.theme_preset = t.value"
            class="py-3 rounded-xl border-2 text-xs font-medium transition-all flex flex-col items-center gap-1"
            :class="form.theme_preset === t.value ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-gray-200 text-gray-600 hover:border-rose-300'">
            <span class="text-xl">{{ t.emoji }}</span>{{ t.label }}
          </button>
        </div>
      </div>
      <div>
        <label class="label">Accent Color</label>
        <div class="flex items-center gap-3">
          <input v-model="form.theme_color" type="color" class="h-10 w-16 rounded-lg border border-gray-200 p-1 cursor-pointer"/>
          <span class="text-sm text-gray-500">{{ form.theme_color }}</span>
        </div>
      </div>
      <div>
        <label class="label">Additional Information (optional)</label>
        <textarea v-model="form.additional_info" rows="3" placeholder="Parking info, accommodation, gift registry details…" class="form-input resize-none"></textarea>
      </div>
      <div class="flex gap-3">
        <button @click="step--" class="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">← Back</button>
        <button @click="nextStep" class="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all">Continue →</button>
      </div>
    </div>

    <!-- Step 4: Publish & Get Link -->
    <div v-if="step === 4" class="space-y-6">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div class="text-center mb-6">
          <div class="text-4xl mb-2">🔗</div>
          <h2 class="text-lg font-bold text-gray-900">Almost there!</h2>
          <p class="text-gray-500 text-sm mt-1">Review and publish your wedding invitation</p>
        </div>

        <!-- Summary -->
        <div class="space-y-3 text-sm mb-6">
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <span>💑</span><span class="font-medium">{{ form.couple_name_1 }} & {{ form.couple_name_2 }}</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <span>📅</span><span>{{ fmtDate(form.wedding_date) }}</span>
          </div>
          <div v-if="form.venue_name" class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <span>📍</span><span>{{ form.venue_name }}</span>
          </div>
        </div>

        <div class="border-t border-gray-100 pt-5">
          <label class="flex items-center gap-3 cursor-pointer">
            <div @click="form.is_published = !form.is_published"
              class="w-11 h-6 rounded-full transition-colors relative"
              :class="form.is_published ? 'bg-rose-500' : 'bg-gray-300'">
              <div class="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform"
                :class="form.is_published ? 'translate-x-5' : 'translate-x-0.5'"></div>
            </div>
            <span class="text-sm font-medium text-gray-700">Publish now (make it public)</span>
          </label>
          <p class="text-xs text-gray-400 mt-2 ml-14">If off, only you can see this page</p>
        </div>
      </div>

      <div v-if="error" class="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{{ error }}</div>

      <div class="flex gap-3">
        <button @click="step--" class="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">← Back</button>
        <button @click="createWedding" :disabled="saving"
          class="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-semibold text-sm disabled:opacity-60 hover:shadow-lg transition-all">
          <span v-if="saving">Creating…</span>
          <span v-else>{{ form.is_published ? 'Publish & Get Link 🎉' : 'Save as Draft' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Create Wedding Invitation' })

const { createWedding: create } = useWeddings()
const router = useRouter()
const toast = useToast()

const step = ref(1)
const saving = ref(false)
const error = ref('')

const steps = [
  { label: 'The Couple' }, { label: 'Event Details' }, { label: 'Design' }, { label: 'Publish' }
]
const themes = [
  { value: 'classic', label: 'Classic', emoji: '🤍' },
  { value: 'modern', label: 'Modern', emoji: '🖤' },
  { value: 'rustic', label: 'Rustic', emoji: '🌾' },
  { value: 'floral', label: 'Floral', emoji: '🌸' },
  { value: 'tropical', label: 'Tropical', emoji: '🌺' },
  { value: 'bohemian', label: 'Boho', emoji: '🌙' },
  { value: 'minimal', label: 'Minimal', emoji: '⬜' },
]

const form = reactive({
  couple_name_1: '', couple_name_2: '',
  story_text: '', welcome_message: '',
  wedding_date: '', ceremony_time: '', reception_time: '',
  venue_name: '', venue_address: '', dress_code: '',
  cover_image_url: '', theme_preset: 'classic' as any, theme_color: '#d4a5a5',
  additional_info: '', is_published: true,
})

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : ''

const nextStep = () => step.value++

const createWedding = async () => {
  saving.value = true; error.value = ''
  const { data, error: err } = await create(form)
  saving.value = false
  if (err || !data) { error.value = err?.message ?? 'Failed to create wedding'; return }
  toast.add({ title: 'Wedding created! 🎉', description: form.is_published ? 'Your invitation is now live' : 'Saved as draft', color: 'success' })
  router.push(`/weddings/${data.slug}`)
}
</script>
<style scoped>
@reference "tailwindcss";
.label { @apply block text-sm font-medium text-gray-700 mb-1.5; }
.form-input { @apply w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-sm; }
</style>
