<template>
  <section class="py-8 grid gap-6 lg:grid-cols-2 bg-bgclass=" py-8 grid gap-6 lg:grid-cols-2 min-h-screen
    bg-gradient-to-br from-rose-50 via-indigo-50 to-emerald-50 dark:bg-gradient-to-br dark:from-gray-900
    dark:via-gray-800>
    <UCard class="shadow-xl rounded-2xl border-2 border-border backdrop-blur-xl transition-all duration-300
    bg-gradient-to-br from-blue-200/50 via-purple-200/50 to-pink-200/50
    dark:from-blue-900/60 dark:via-purple-900/60 dark:to-pink-900/60
    relative overflow-hidden
    before:content-[''] before:absolute before:inset-0
    before:bg-gradient-to-r before:from-white/20 before:via-transparent before:to-white/20
    dark:before:from-white/30 dark:via-transparent dark:to-white/30
    before:blur-3xl before:animate-liquid-glass">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-text">Create a card</h2>
        </div>
      </template>

      <form class="grid gap-6" @submit.prevent="onSubmit">
        <div class="grid gap-4 sm:grid-cols-2 bg-bg-secondary/50 p-4 rounded-xl border border-border">
          <UFormGroup label="Title" required :ui="{ label: 'text-text' }">
            <UInput v-model="form.title" placeholder="e.g. Happy Birthday!" required
              class="p-3 bg-blue-100/30 dark:bg-blue-900/40 rounded shadow focus:ring-2 focus:ring-primary/50 transition-all duration-200 text-text" />
          </UFormGroup>
          <UFormGroup label="Recipient name" required :ui="{ label: 'text-text' }">
            <UInput v-model="form.recipientName" placeholder="e.g. Alex" required
              class="p-3 bg-blue-100/30 dark:bg-blue-900/40 rounded shadow focus:ring-2 focus:ring-primary/50 transition-all duration-200 text-text" />
          </UFormGroup>
        </div>

        <UFormGroup label="Message" :ui="{ label: 'text-text' }">
          <UTextarea v-model="form.message" :rows="10" placeholder="Write something lovely..."
            class="p-3 bg-blue-100/30 dark:bg-blue-900/40 rounded shadow focus:ring-2 focus:ring-primary/50 transition-all duration-200 text-text" />
        </UFormGroup>

        <div class="grid gap-4 sm:grid-cols-3 bg-bg-secondary/50 p-4 rounded-xl border border-border">
          <UFormGroup label="Media type" :ui="{ label: 'text-text' }">
            <USelect v-model="form.mediaType" :options="mediaOptions" option-attribute="label" value-attribute="value"
              class="p-3 bg-blue-100/30 dark:bg-blue-900/40 rounded shadow focus:ring-2 focus:ring-primary/50 transition-all duration-200 text-text" />
          </UFormGroup>
          <UFormGroup label="Media URL" :help="mediaHelp" :ui="{ label: 'text-text' }">
            <UInput v-model="form.mediaUrl" placeholder="https://..."
              class="p-3 bg-blue-100/30 dark:bg-blue-900/40 rounded shadow focus:ring-2 focus:ring-primary/50 transition-all duration-200 text-text" />
          </UFormGroup>
          <UFormGroup label="Unlock at (optional)" :ui="{ label: 'text-text' }">
            <UInput type="datetime-local" v-model="form.unlockAt"
              class="p-3 bg-blue-100/30 dark:bg-blue-900/40 rounded shadow focus:ring-2 focus:ring-primary/50 transition-all duration-200 text-text" />
          </UFormGroup>
        </div>

        <div class="grid gap-4 sm:grid-cols-3 bg-bg-secondary/50 p-4 rounded-xl border border-border"
          v-if="form.mediaType === 'image' || form.mediaType === 'animation'">
          <UFormGroup label="Upload image (optional)" :help="'JPEG, PNG, GIF. Overrides Media URL when set.'"
            :ui="{ label: 'text-text' }">
            <input type="file" accept="image/*" @change="onFileChange"
              class="block p-3 text-sm text-text bg-blue-100/30 dark:bg-blue-900/40 rounded shadow" />
          </UFormGroup>
          <div class="sm:col-span-2 flex items-end gap-2">
            <UButton v-if="form.mediaUrl && isDataUrl(form.mediaUrl)" color="neutral" variant="soft"
              icon="i-heroicons-x-mark" @click="clearUploaded" label="Remove uploaded image" />
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-3 bg-bg-secondary/50 p-4 rounded-xl border border-border">
          <UFormGroup label="Style preset" :ui="{ label: 'text-text' }">
            <USelect v-model="form.themePreset" :options="presetOptions" option-attribute="label"
              value-attribute="value"
              class="p-3 bg-blue-100/30 dark:bg-blue-900/40 rounded shadow focus:ring-2 focus:ring-primary/50 transition-all duration-200 text-text"
              @change="applyPreset" />
          </UFormGroup>
          <UFormGroup label="Background color" :ui="{ label: 'text-text' }">
            <div class="flex items-center gap-2">
              <input type="color" v-model="form.backgroundColor"
                class="p-1 h-12 w-20 rounded-lg bg-blue-100/30 dark:bg-blue-900/40 shadow cursor-pointer transition-all duration-200" />
              <div class="flex flex-wrap gap-2">
                <button v-for="c in bgSwatches" :key="c" type="button" :style="{ backgroundColor: c }"
                  class="size-8 rounded-lg bg-blue-100/30 dark:bg-blue-900/40 shadow hover:scale-110 hover:ring-2 hover:ring-primary transition-all duration-200"
                  @click="form.backgroundColor = c" aria-label="Pick bg color" />
              </div>
            </div>
          </UFormGroup>
          <UFormGroup label="Body text color" :ui="{ label: 'text-text' }">
            <div class="flex items-center gap-2">
              <input type="color" v-model="form.textColor"
                class="p-1 h-12 w-20 rounded-lg bg-blue-100/30 dark:bg-blue-900/40 shadow cursor-pointer transition-all duration-200" />
              <div class="flex flex-wrap gap-2">
                <button v-for="c in textSwatches" :key="c" type="button" :style="{ backgroundColor: c }"
                  class="size-8 rounded-lg bg-blue-100/30 dark:bg-blue-900/40 shadow hover:scale-110 hover:ring-2 hover:ring-primary transition-all duration-200"
                  @click="form.textColor = c" aria-label="Pick text color" />
              </div>
            </div>
          </UFormGroup>
        </div>

        <div class="grid gap-4 sm:grid-cols-3 bg-bg-secondary/50 p-4 rounded-xl border border-border">
          <UFormGroup label="Title color" :ui="{ label: 'text-text' }">
            <div class="flex items-center gap-2">
              <input type="color" v-model="form.titleColor"
                class="p-1 h-12 w-20 rounded-lg bg-blue-100/30 dark:bg-blue-900/40 shadow cursor-pointer transition-all duration-200" />
              <div class="flex flex-wrap gap-2">
                <button v-for="c in titleSwatches" :key="c" type="button" :style="{ backgroundColor: c }"
                  class="size-8 rounded-lg bg-blue-100/30 dark:bg-blue-900/40 shadow hover:scale-110 hover:ring-2 hover:ring-primary transition-all duration-200"
                  @click="form.titleColor = c" aria-label="Pick title color" />
              </div>
            </div>
          </UFormGroup>
          <UFormGroup label="Message color" :ui="{ label: 'text-text' }">
            <div class="flex items-center gap-2">
              <input type="color" v-model="form.messageColor"
                class="p-1 h-12 w-20 rounded-lg bg-blue-100/30 dark:bg-blue-900/40 shadow cursor-pointer transition-all duration-200" />
              <div class="flex flex-wrap gap-2">
                <button v-for="c in messageSwatches" :key="c" type="button" :style="{ backgroundColor: c }"
                  class="size-8 rounded-lg bg-blue-100/30 dark:bg-blue-900/40 shadow hover:scale-110 hover:ring-2 hover:ring-primary transition-all duration-200"
                  @click="form.messageColor = c" aria-label="Pick message color" />
              </div>
            </div>
          </UFormGroup>
          <UFormGroup label="Font (with preview)" :ui="{ label: 'text-text' }">
            <USelect v-model="form.fontFamily" :options="fontOptions" option-attribute="label" value-attribute="value"
              class="p-3 bg-blue-100/30 dark:bg-blue-900/40 rounded shadow focus:ring-2 focus:ring-primary/50 transition-all duration-200 text-text" />
            <div class="mt-1 text-sm text-text-secondary">Sample: <span :style="{ fontFamily: form.fontFamily }">The
                quick brown fox</span></div>
          </UFormGroup>
        </div>

        <div class="grid gap-4 sm:grid-cols-3 bg-bg-secondary/50 p-4 rounded-xl border border-border">
          <UFormGroup label="Title alignment" :ui="{ label: 'text-text' }">
            <USelect v-model="form.titleAlign" :options="alignOptions"
              class="p-3 bg-blue-100/30 dark:bg-blue-900/40 rounded shadow focus:ring-2 focus:ring-primary/50 transition-all duration-200 text-text" />
          </UFormGroup>
          <UFormGroup label="Message alignment" :ui="{ label: 'text-text' }">
            <USelect v-model="form.messageAlign" :options="alignOptions"
              class="p-3 bg-blue-100/30 dark:bg-blue-900/40 rounded shadow focus:ring-2 focus:ring-primary/50 transition-all duration-200 text-text" />
          </UFormGroup>
          <UFormGroup label="Title size" :ui="{ label: 'text-text' }">
            <USelect v-model="form.titleSize" :options="titleSizeOptions"
              class="p-3 bg-blue-100/30 dark:bg-blue-900/40 rounded shadow focus:ring-2 focus:ring-primary/50 transition-all duration-200 text-text" />
          </UFormGroup>
        </div>
        <div class="grid gap-4 sm:grid-cols-3 bg-bg-secondary/50 p-4 rounded-xl border border-border">
          <UFormGroup label="Message size" :ui="{ label: 'text-text' }">
            <USelect v-model="form.messageSize" :options="messageSizeOptions"
              class="p-3 bg-blue-100/30 dark:bg-blue-900/40 rounded shadow focus:ring-2 focus:ring-primary/50 transition-all duration-200 text-text" />
          </UFormGroup>
        </div>

        <div
          class="flex items-center gap-3 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-4 rounded-xl border border-border backdrop-blur-sm">
          <USwitch v-model="form.isLocked" label="Require a key to open" />
          <UInput v-if="form.isLocked" v-model="form.key" placeholder="Secret key"
            class="p-3 bg-blue-100/30 dark:bg-blue-900/40 rounded shadow focus:ring-2 focus:ring-primary/50 transition-all duration-200 text-text" />
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <UButton type="submit" icon="i-heroicons-check-circle" :loading="saving" label="Create"
            class="bg-primary text-white shadow-lg hover:scale-105 transition-all duration-200" />
        </div>
      </form>

      <template #footer>
        <ShareLink v-if="createdUrl" :url="createdUrl" />
      </template>
    </UCard>

    <div class="grid gap-4">
      <CardPreview v-if="form.title || form.message || form.recipientName" :card="previewCard"
        class="rounded-2xl shadow-lg bg-bg-secondary/80 border border-border">
        <template #actions>
          <UButton color="neutral" variant="ghost" :to="previewPath" icon="i-heroicons-eye" label="Preview page" />
        </template>
      </CardPreview>
      <div
        class="rounded-2xl shadow-lg p-4 bg-bg-secondary/80 border border-border flex flex-col items-center justify-center min-h-[200px]"
        :style="{ background: form.backgroundColor, transition: 'background 0.3s' }">
        <div class="w-full h-full flex items-center justify-center">
          <MediaRenderer :media-type="form.mediaType as any" :media-url="form.mediaUrl as any"
            :background-color="form.backgroundColor as any" class="w-full h-full object-contain" />
        </div>
        <span v-if="!form.mediaUrl" class="text-text-secondary mt-2">No media selected</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Card } from '~/composables/useCards'
const colorMode = useColorMode()

const { createCard, buildShareUrl } = useCards()

const mediaOptions = [
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' },
  { label: 'Animation (GIF)', value: 'animation' },
  { label: 'Text only', value: 'text' }
]

// Choose dark-friendly defaults when the app is in dark mode so no large white blocks appear
const initialBackgroundColor = colorMode.value === 'dark' ? '#0b1120' : '#ffffff'
const initialTextColor = colorMode.value === 'dark' ? '#e5e7eb' : '#111827'

const form = reactive<Partial<Card>>({
  title: '',
  recipientName: '',
  message: '',
  mediaType: 'image',
  mediaUrl: '',
  backgroundColor: initialBackgroundColor,
  textColor: initialTextColor,
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

// Put a dark option first when in dark mode to avoid accidental bright backgrounds
const bgSwatches = colorMode.value === 'dark'
  ? ['#0b1120', '#111827', '#1f2937', '#334155', '#0f172a', '#083344', '#1e1b4b']
  : ['#ffffff', '#f8fafc', '#fef9c3', '#fee2e2', '#dcfce7', '#dbeafe', '#fae8ff']
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
      // Reset to sensible defaults for the current color scheme
      form.backgroundColor = colorMode.value === 'dark' ? '#0b1120' : '#ffffff'
      form.textColor = colorMode.value === 'dark' ? '#e5e7eb' : '#111827'
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