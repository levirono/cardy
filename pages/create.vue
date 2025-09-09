<template>
  <section
    class="py-8 grid gap-6 lg:grid-cols-2 bg-gradient-to-br from-rose-50 via-indigo-50 to-emerald-50 min-h-screen">
    <UCard class="shadow-xl rounded-2xl border-2 border-indigo-100 bg-white/80 backdrop-blur">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-indigo-700">Create a card</h2>
        </div>
      </template>

      <form class="grid gap-6" @submit.prevent="onSubmit">
        <div
          class="grid gap-4 sm:grid-cols-2 bg-gradient-to-r from-rose-100 via-indigo-100 to-emerald-100 p-4 rounded-xl">
          <UFormGroup label="Title" required :ui="{ label: 'text-rose-700 dark:text-rose-300' }">
            <UInput v-model="form.title" placeholder="e.g. Happy Birthday!" required
              class="border border-gray-400 rounded shadow focus:ring-2 focus:ring-rose-300 transition-all duration-200" />
          </UFormGroup>
          <UFormGroup label="Recipient name" required :ui="{ label: 'text-emerald-700 dark:text-emerald-300' }">
            <UInput v-model="form.recipientName" placeholder="e.g. Alex" required
              class="border border-gray-400 rounded shadow focus:ring-2 focus:ring-emerald-300 transition-all duration-200" />
          </UFormGroup>
        </div>

        <UFormGroup label="Message" :ui="{ label: 'text-indigo-700 dark:text-indigo-300' }">
          <UTextarea v-model="form.message" :rows="5" placeholder="Write something lovely..."
            class="border border-gray-400 rounded shadow focus:ring-2 focus:ring-indigo-300 transition-all duration-200" />
        </UFormGroup>

        <div class="grid gap-4 sm:grid-cols-3 bg-gradient-to-r from-sky-50 via-cyan-50 to-amber-50 p-4 rounded-xl">
          <UFormGroup label="Media type" :ui="{ label: 'text-sky-700 dark:text-sky-300' }">
            <USelect v-model="form.mediaType" :options="mediaOptions" option-attribute="label" value-attribute="value"
              class="border border-gray-400 rounded shadow focus:ring-2 focus:ring-sky-300 transition-all duration-200" />
          </UFormGroup>
          <UFormGroup label="Media URL" :help="mediaHelp" :ui="{ label: 'text-cyan-700 dark:text-cyan-300' }">
            <UInput v-model="form.mediaUrl" placeholder="https://..."
              class="border border-gray-400 rounded shadow focus:ring-2 focus:ring-cyan-300 transition-all duration-200" />
          </UFormGroup>
          <UFormGroup label="Unlock at (optional)" :ui="{ label: 'text-amber-700 dark:text-amber-300' }">
            <UInput type="datetime-local" v-model="form.unlockAt"
              class="border border-gray-400 rounded shadow focus:ring-2 focus:ring-amber-300 transition-all duration-200" />
          </UFormGroup>
        </div>

        <div class="grid gap-4 sm:grid-cols-3 bg-gradient-to-r from-pink-50 via-pink-100 to-pink-200 p-4 rounded-xl"
          v-if="form.mediaType === 'image' || form.mediaType === 'animation'">
          <UFormGroup label="Upload image (optional)" :help="'JPEG, PNG, GIF. Overrides Media URL when set.'"
            :ui="{ label: 'text-pink-700 dark:text-pink-300' }">
            <input type="file" accept="image/*" @change="onFileChange" class="block text-sm" />
          </UFormGroup>
          <div class="sm:col-span-2 flex items-end gap-2">
            <UButton v-if="form.mediaUrl && isDataUrl(form.mediaUrl)" color="neutral" variant="soft"
              icon="i-heroicons-x-mark" @click="clearUploaded" label="Remove uploaded image" />
          </div>
        </div>

        <div
          class="grid gap-4 sm:grid-cols-3 bg-gradient-to-r from-violet-50 via-violet-100 to-violet-200 p-4 rounded-xl">
          <UFormGroup label="Style preset" :ui="{ label: 'text-violet-700 dark:text-violet-300' }">
            <USelect v-model="form.themePreset" :options="presetOptions" option-attribute="label"
              value-attribute="value"
              class="border border-gray-400 rounded shadow focus:ring-2 focus:ring-violet-300 transition-all duration-200"
              @change="applyPreset" />
          </UFormGroup>
          <UFormGroup label="Background color" :ui="{ label: 'text-sky-700 dark:text-sky-300' }">
            <div class="flex items-center gap-2">
              <input type="color" v-model="form.backgroundColor"
                class="h-12 w-20 rounded-lg border border-gray-400 shadow cursor-pointer transition-all duration-200" />
              <div class="flex flex-wrap gap-2">
                <button v-for="c in bgSwatches" :key="c" type="button" :style="{ backgroundColor: c }"
                  class="size-8 rounded-lg border-2 border-black/10 shadow hover:scale-110 hover:border-indigo-400 transition-all duration-200"
                  @click="form.backgroundColor = c" aria-label="Pick bg color" />
              </div>
            </div>
          </UFormGroup>
          <UFormGroup label="Body text color" :ui="{ label: 'text-amber-700 dark:text-amber-300' }">
            <div class="flex items-center gap-2">
              <input type="color" v-model="form.textColor"
                class="h-12 w-20 rounded-lg border border-gray-400 shadow cursor-pointer transition-all duration-200" />
              <div class="flex flex-wrap gap-2">
                <button v-for="c in textSwatches" :key="c" type="button" :style="{ backgroundColor: c }"
                  class="size-8 rounded-lg border-2 border-black/10 shadow hover:scale-110 hover:border-amber-400 transition-all duration-200"
                  @click="form.textColor = c" aria-label="Pick text color" />
              </div>
            </div>
          </UFormGroup>
        </div>

        <div class="grid gap-4 sm:grid-cols-3 bg-gradient-to-r from-rose-50 via-rose-100 to-rose-200 p-4 rounded-xl">
          <UFormGroup label="Title color" :ui="{ label: 'text-rose-700 dark:text-rose-300' }">
            <div class="flex items-center gap-2">
              <input type="color" v-model="form.titleColor"
                class="h-12 w-20 rounded-lg border border-gray-400 shadow cursor-pointer transition-all duration-200" />
              <div class="flex flex-wrap gap-2">
                <button v-for="c in titleSwatches" :key="c" type="button" :style="{ backgroundColor: c }"
                  class="size-8 rounded-lg border-2 border-black/10 shadow hover:scale-110 hover:border-rose-400 transition-all duration-200"
                  @click="form.titleColor = c" aria-label="Pick title color" />
              </div>
            </div>
          </UFormGroup>
          <UFormGroup label="Message color" :ui="{ label: 'text-emerald-700 dark:text-emerald-300' }">
            <div class="flex items-center gap-2">
              <input type="color" v-model="form.messageColor"
                class="h-12 w-20 rounded-lg border border-gray-400 shadow cursor-pointer transition-all duration-200" />
              <div class="flex flex-wrap gap-2">
                <button v-for="c in messageSwatches" :key="c" type="button" :style="{ backgroundColor: c }"
                  class="size-8 rounded-lg border-2 border-black/10 shadow hover:scale-110 hover:border-emerald-400 transition-all duration-200"
                  @click="form.messageColor = c" aria-label="Pick message color" />
              </div>
            </div>
          </UFormGroup>
          <UFormGroup label="Font (with preview)" :ui="{ label: 'text-indigo-700 dark:text-indigo-300' }">
            <USelect v-model="form.fontFamily" :options="fontOptions" option-attribute="label" value-attribute="value"
              class="border border-gray-400 rounded shadow focus:ring-2 focus:ring-indigo-300 transition-all duration-200" />
            <div class="mt-1 text-sm text-gray-500">Sample: <span :style="{ fontFamily: form.fontFamily }">The quick
                brown
                fox</span></div>
          </UFormGroup>
        </div>

        <div class="grid gap-4 sm:grid-cols-3 bg-gradient-to-r from-rose-50 via-emerald-50 to-indigo-50 p-4 rounded-xl">
          <UFormGroup label="Title alignment" :ui="{ label: 'text-rose-700 dark:text-rose-300' }">
            <USelect v-model="form.titleAlign" :options="alignOptions"
              class="border border-gray-400 rounded shadow focus:ring-2 focus:ring-rose-300 transition-all duration-200" />
          </UFormGroup>
          <UFormGroup label="Message alignment" :ui="{ label: 'text-emerald-700 dark:text-emerald-300' }">
            <USelect v-model="form.messageAlign" :options="alignOptions"
              class="border border-gray-400 rounded shadow focus:ring-2 focus:ring-emerald-300 transition-all duration-200" />
          </UFormGroup>
          <UFormGroup label="Title size" :ui="{ label: 'text-rose-700 dark:text-rose-300' }">
            <USelect v-model="form.titleSize" :options="titleSizeOptions"
              class="border border-gray-400 rounded shadow focus:ring-2 focus:ring-rose-300 transition-all duration-200" />
          </UFormGroup>
        </div>
        <div
          class="grid gap-4 sm:grid-cols-3 bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-200 p-4 rounded-xl">
          <UFormGroup label="Message size" :ui="{ label: 'text-emerald-700 dark:text-emerald-300' }">
            <USelect v-model="form.messageSize" :options="messageSizeOptions"
              class="border border-gray-400 rounded shadow focus:ring-2 focus:ring-emerald-300 transition-all duration-200" />
          </UFormGroup>
        </div>

        <div class="flex items-center gap-3 bg-gradient-to-r from-indigo-50 via-rose-50 to-emerald-50 p-4 rounded-xl">
          <USwitch v-model="form.isLocked" label="Require a key to open" />
          <UInput v-if="form.isLocked" v-model="form.key" placeholder="Secret key"
            class="border border-gray-400 rounded shadow focus:ring-2 focus:ring-indigo-300 transition-all duration-200" />
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <UButton type="submit" icon="i-heroicons-check-circle" :loading="saving" label="Create"
            class="bg-gradient-to-r from-rose-400 via-indigo-400 to-emerald-400 text-white shadow-lg hover:scale-105 transition-all duration-200" />
        </div>
      </form>

      <template #footer>
        <ShareLink v-if="createdUrl" :url="createdUrl" />
      </template>
    </UCard>

    <div class="grid gap-4">
      <CardPreview v-if="form.title || form.message || form.recipientName" :card="previewCard">
        <template #actions>
          <UButton color="neutral" variant="ghost" :to="previewPath" icon="i-heroicons-eye" label="Preview page" />
        </template>
      </CardPreview>
      <div class="rounded-2xl shadow-lg p-4"
        :style="{ background: form.backgroundColor, minHeight: '200px', transition: 'background 0.3s' }">
        <MediaRenderer :media-type="form.mediaType as any" :media-url="form.mediaUrl as any"
          :background-color="form.backgroundColor as any" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Card } from '~/composables/useCards'

const { createCard, buildShareUrl } = useCards()

const mediaOptions = [
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' },
  { label: 'Animation (GIF)', value: 'animation' },
  { label: 'Text only', value: 'text' }
]

const form = reactive<Partial<Card>>({
  title: '',
  recipientName: '',
  message: '',
  mediaType: 'image',
  mediaUrl: '',
  backgroundColor: '#ffffff',
  textColor: '#111827',
  titleColor: '',
  messageColor: '',
  fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'",
  themePreset: '',
  titleAlign: 'left',
  messageAlign: 'left',
  titleSize: '1.25rem',
  messageSize: '1rem',
  unlockAt: '',
  isLocked: false,
  key: ''
})

const saving = ref(false)
const createdUrl = ref<string | null>(null)

const mediaHelp = computed(() => {
  switch (form.mediaType) {
    case 'image': return 'Link to an image (PNG, JPG, GIF)'
    case 'video': return 'Link to a video file (MP4, WebM)'
    case 'animation': return 'Link to an animated GIF or image'
    default: return 'Optional'
  }
})

const previewCard = computed<Card>(() => ({
  id: 'preview',
  title: String(form.title || 'Your title here'),
  recipientName: String(form.recipientName || 'Recipient'),
  message: String(form.message || 'Your message...'),
  mediaType: (form.mediaType as any) || 'text',
  mediaUrl: String(form.mediaUrl || ''),
  backgroundColor: form.backgroundColor || undefined,
  textColor: form.textColor || undefined,
  titleColor: form.titleColor || undefined,
  messageColor: form.messageColor || undefined,
  fontFamily: form.fontFamily || undefined,
  titleAlign: form.titleAlign || undefined,
  messageAlign: form.messageAlign || undefined,
  titleSize: form.titleSize || undefined,
  messageSize: form.messageSize || undefined,
  themePreset: form.themePreset || undefined,
  unlockAt: form.unlockAt ? new Date(form.unlockAt as string).toISOString() : undefined,
  isLocked: !!form.isLocked,
  key: form.isLocked ? String(form.key || '') : undefined,
  createdAt: new Date().toISOString()
}))

const previewPath = computed(() => `/card/${previewCard.value.id}`)

const presetOptions = [
  { label: 'None', value: '' },
  { label: 'Birthday – Confetti', value: 'birthday' },
  { label: 'Wedding – Elegant', value: 'wedding' },
  { label: 'Anniversary – Classic', value: 'anniversary' },
  { label: 'Baby – Soft Pastel', value: 'baby' },
  { label: 'Graduation – Bold', value: 'graduation' },
  { label: 'Valentine – Romantic', value: 'valentine' }
]

const fontOptions = [
  { label: 'Inter (Clean Sans)', value: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'" },
  { label: 'Poppins (Modern Sans)', value: "'Poppins', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" },
  { label: 'Playfair Display (Serif)', value: "'Playfair Display', ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif" },
  { label: 'Lobster (Decorative)', value: "'Lobster', 'Segoe Script', 'Comic Sans MS', cursive, sans-serif" },
  { label: 'Dancing Script (Handwritten)', value: "'Dancing Script', 'Segoe Script', 'Comic Sans MS', cursive, sans-serif" }
]
const alignOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' }
]
const titleSizeOptions = [
  { label: 'Small', value: '1.125rem' },
  { label: 'Medium', value: '1.25rem' },
  { label: 'Large', value: '1.5rem' },
  { label: 'X-Large', value: '1.875rem' }
]
const messageSizeOptions = [
  { label: 'Small', value: '0.875rem' },
  { label: 'Normal', value: '1rem' },
  { label: 'Large', value: '1.125rem' },
  { label: 'X-Large', value: '1.25rem' }
]

const bgSwatches = ['#ffffff', '#f8fafc', '#fef9c3', '#fee2e2', '#dcfce7', '#dbeafe', '#fae8ff']
const textSwatches = ['#111827', '#0f172a', '#334155', '#6b7280', '#7c2d12', '#1e1b4b', '#4c0519']
const titleSwatches = ['#111827', '#7c2d12', '#065f46', '#1d4ed8', '#b91c1c', '#4c0519']
const messageSwatches = ['#334155', '#0f172a', '#374151', '#475569', '#1e1b4b', '#7c2d12']

function applyPreset() {
  switch (form.themePreset) {
    case 'birthday':
      form.backgroundColor = '#FFF7ED' // orange-50
      form.textColor = '#7C2D12' // orange-900
      form.titleColor = '#9A3412'
      form.messageColor = '#7C2D12'
      form.fontFamily = "Poppins, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
      break
    case 'wedding':
      form.backgroundColor = '#F8FAFC' // slate-50
      form.textColor = '#0F172A' // slate-900
      form.titleColor = '#111827'
      form.messageColor = '#334155'
      form.fontFamily = "'Playfair Display', ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif"
      break
    case 'anniversary':
      form.backgroundColor = '#FFFBEB' // amber-50
      form.textColor = '#78350F' // amber-900
      form.titleColor = '#92400E'
      form.messageColor = '#78350F'
      form.fontFamily = "'Playfair Display', ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif"
      break
    case 'baby':
      form.backgroundColor = '#ECFEFF' // cyan-50
      form.textColor = '#083344' // cyan-950
      form.titleColor = '#0E7490'
      form.messageColor = '#164E63'
      form.fontFamily = "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
      break
    case 'graduation':
      form.backgroundColor = '#EEF2FF' // indigo-50
      form.textColor = '#1E1B4B' // indigo-950
      form.titleColor = '#1E3A8A'
      form.messageColor = '#312E81'
      form.fontFamily = "Poppins, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
      break
    case 'valentine':
      form.backgroundColor = '#FFF1F2' // rose-50
      form.textColor = '#4C0519' // rose-950
      form.titleColor = '#9F1239'
      form.messageColor = '#4C0519'
      form.fontFamily = "'Dancing Script', 'Segoe Script', 'Comic Sans MS', cursive, sans-serif"
      break
    default:
      // Reset to defaults
      form.backgroundColor = '#ffffff'
      form.textColor = '#111827'
      form.titleColor = ''
      form.messageColor = ''
      form.fontFamily = "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'"
  }
}

function isDataUrl(url: string | undefined) {
  return !!url && url.startsWith('data:')
}

function clearUploaded() {
  form.mediaUrl = ''
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files && input.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    const result = typeof reader.result === 'string' ? reader.result : ''
    form.mediaUrl = result
  }
  reader.readAsDataURL(file)
}

async function onSubmit() {
  saving.value = true
  try {
    const card = createCard({
      title: String(form.title || ''),
      recipientName: String(form.recipientName || ''),
      message: String(form.message || ''),
      mediaType: (form.mediaType as any) || 'text',
      mediaUrl: String(form.mediaUrl || ''),
      backgroundColor: form.backgroundColor || undefined,
      textColor: form.textColor || undefined,
      titleColor: form.titleColor || undefined,
      messageColor: form.messageColor || undefined,
      fontFamily: form.fontFamily || undefined,
      titleAlign: form.titleAlign || undefined,
      messageAlign: form.messageAlign || undefined,
      titleSize: form.titleSize || undefined,
      messageSize: form.messageSize || undefined,
      themePreset: form.themePreset || undefined,
      unlockAt: form.unlockAt ? new Date(form.unlockAt as string).toISOString() : undefined,
      isLocked: !!form.isLocked,
      key: form.isLocked ? String(form.key || '') : undefined
    })
    createdUrl.value = buildShareUrl(card.id, card.isLocked ? card.key : undefined)
  } finally {
    saving.value = false
  }
}
</script>