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
            <div class="relative">
              <input type="file" accept="image/*" @change="onFileChange"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="file-upload" />
              <label for="file-upload"
                class="block p-3 text-sm text-text bg-blue-100/30 dark:bg-blue-900/40 rounded shadow hover:bg-blue-100/50 dark:hover:bg-blue-900/50 transition-colors duration-200 text-center cursor-pointer border border-dashed border-border">
                <UIcon name="i-heroicons-arrow-up-tray" class="w-5 h-5 mx-auto mb-1" />
                <span>Click to upload or drag and drop</span>
              </label>
            </div>
          </UFormGroup>
          <div class="sm:col-span-2 flex items-end gap-2">
            <UButton v-if="form.mediaUrl && isDataUrl(form.mediaUrl)" color="error" variant="soft"
              icon="i-heroicons-trash" @click="clearUploaded" label="Remove uploaded" class="mt-2" />
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-3 bg-bg-secondary/50 p-4 rounded-xl border border-border">
          <UFormGroup label="Style preset" :ui="{ label: 'text-text' }">
            <USelect v-model="form.themePreset" :options="presetOptions" option-attribute="label"
              value-attribute="value"
              class="p-3 bg-blue-100/30 dark:bg-blue-900/40 rounded shadow focus:ring-2 focus:ring-primary/50 transition-all duration-200 text-text"
              @change="applyPreset" />
          </UFormGroup>
          <ColorSwatch v-model="form.backgroundColor" :swatches="bgSwatches" label="Background color"
            @update:modelValue="updatePreview" />
          <ColorSwatch v-model="form.textColor" :swatches="textSwatches" label="Text color" />
        </div>

        <div class="grid gap-4 sm:grid-cols-3 bg-bg-secondary/50 p-4 rounded-xl border border-border">
          <ColorSwatch v-model="form.titleColor" :swatches="titleSwatches" label="Title color" />
          <ColorSwatch v-model="form.messageColor" :swatches="messageSwatches" label="Message color" />
          <UFormGroup label="Font" :ui="{ label: 'text-text' }" class="relative">
            <USelectMenu v-model="form.fontFamily" :options="fontOptions" option-attribute="label"
              value-attribute="value" placeholder="Select a font" :uiMenu="{ 
                background: 'bg-bg-secondary/90 backdrop-blur-lg',
                ring: 'ring-1 ring-border/50',
                shadow: 'shadow-lg',
                option: {
                  base: 'flex items-center gap-2 px-3 py-2 hover:bg-primary/10 dark:hover:bg-primary/20',
                  selected: 'text-primary dark:text-primary-400 font-medium',
                  active: 'bg-primary/5 dark:bg-primary/10',
                  inactive: 'text-text/90 dark:text-text/90',
                }
              }" class="w-full">
              <template #leading>
                <div class="flex items-center justify-between w-full">
                  <span :style="{ fontFamily: form.fontFamily || 'inherit' }">
                    {{ fontOptions.find(f => f.value === form.fontFamily)?.label || 'Select a font' }}
                  </span>
                </div>
              </template>
              <template #default="{ modelValue }">
                <span v-if="typeof modelValue === 'object' && modelValue !== null"
                  :style="{ fontFamily: modelValue.value }">
                  {{ modelValue.label || 'Select a font' }}
                </span>
                <span v-else :style="fontStyle">
                  {{fontOptions.find(f => f.value === modelValue)?.label || 'Select a font'}}
                </span>
              </template>
              <template #trailing>
                <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 text-text/60" />
              </template>
            </USelectMenu>
            <div class="mt-2 px-1">
              <p class="text-sm text-text/80 transition-all duration-300" :style="{
                  fontFamily: form.fontFamily,
                  fontSize: '0.9375rem',
                  lineHeight: '1.5',
                }">
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
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
          class="space-y-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-4 rounded-xl border border-border backdrop-blur-sm transition-all duration-300"
          :class="{ 'ring-2 ring-primary/30': form.isLocked }">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-text">Card Protection</h3>
              <p class="text-sm text-text/70">Add a secret key to restrict access</p>
            </div>
            <USwitch v-model="form.isLocked" :ui="{
              container: 'group relative flex items-center',
              wrapper: 'h-4 w-8 rounded-full transition-colors ring-0',
              base: 'h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200',
              // checked: 'bg-primary-500 dark:bg-primary-400',  // Changed from 'active' to 'checked'
              // unchecked: 'bg-gray-200 dark:bg-gray-600',  // Changed from 'inactive' to 'unchecked'
            }" />
          </div>

          <transition enter-active-class="transition-all duration-300 ease-out"
            leave-active-class="transition-all duration-200 ease-in" enter-from-class="opacity-0 -translate-y-2"
            leave-to-class="opacity-0 -translate-y-2">
            <div v-if="form.isLocked" class="space-y-2 mt-3">
              <UFormGroup label="Secret Key"
                :ui="{ label: { base: 'text-text font-medium' }, description: 'text-text/60 text-xs' }"
                description="Anyone with this key can view the card">
                <UInput v-model="form.key" placeholder="Enter a secret key" color="primary" variant="outline"
                  class="w-full p-3 rounded-lg shadow-sm bg-white/50 dark:bg-gray-800/50 border border-border focus:ring-2 focus:ring-primary/50">
                  <template #trailing>
                    <UButton variant="ghost" icon="i-heroicons-x-mark-20-solid" :padded="false"
                      class="opacity-50 hover:opacity-100 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      @click="form.key = ''" />
                    <UButton variant="ghost" icon="i-heroicons-arrow-path" :padded="false"
                      class="opacity-50 hover:opacity-100" @click="form.key = generateRandomKey()" />
                  </template>
                </UInput>
              </UFormGroup>

              <div v-if="form.key" class="flex items-center gap-2 text-xs text-text/60">
                <UIcon name="i-heroicons-information-circle" class="w-4 h-4 flex-shrink-0" />
                <span>Remember this key! You won't be able to recover it later.</span>
              </div>
            </div>
          </transition>
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
import { computed, ref, nextTick, reactive } from 'vue'
import ColorSwatch from '~/components/ColorSwatch.vue'
import { useColorMode } from '#imports'
import { useCardsApi } from '~/composables/useCardsApi'

const fontStyle = computed(() =>
  form.fontFamily ? { fontFamily: form.fontFamily } : undefined
)

const colorMode = useColorMode()

const { createCard } = useCardsApi()

const mediaOptions = [
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' },
  { label: 'Animation (GIF)', value: 'animation' },
  { label: 'Text only', value: 'text' }
]

type TextAlign = 'left' | 'center' | 'right'

export interface FormData {
  title: string
  message: string
  recipientName: string
  recipientEmail: string
  senderName: string
  senderEmail: string
  mediaType: 'image' | 'video' | 'animation' | 'text'
  mediaUrl: string
  backgroundColor: string
  textColor: string
  titleColor: string
  messageColor: string
  fontFamily: string
  titleSize: string
  messageSize: string
  titleAlign: TextAlign
  messageAlign: TextAlign
  themePreset: string
  unlockAt: string
  isLocked: boolean
  key: string
}

interface PreviewCard {
  id: string
  title: string
  recipientName: string
  message: string
  mediaType: 'image' | 'video' | 'animation' | 'text'
  mediaUrl: string
  backgroundColor: string
  textColor: string
  titleColor: string
  messageColor: string
  fontFamily: string
  titleSize: string
  messageSize: string
  titleAlign: TextAlign
  messageAlign: TextAlign
  createdAt: string
  isLocked: boolean
  key?: string
  unlockAt?: string
}

// Choose dark-friendly defaults when the app is in dark mode so no large white blocks appear
const initialBackgroundColor = colorMode.value === 'dark' ? '#0b1120' : '#ffffff'
const initialTextColor = colorMode.value === 'dark' ? '#e5e7eb' : '#111827'

const form = reactive<FormData>({
  title: '',
  message: '',
  recipientName: '',
  recipientEmail: '',
  senderName: '',
  senderEmail: '',
  mediaType: 'image',
  mediaUrl: '',
  backgroundColor: initialBackgroundColor,
  textColor: initialTextColor,
  titleColor: initialTextColor,
  messageColor: initialTextColor,
  fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'",
  titleSize: '1.25rem',
  messageSize: '1rem',
  titleAlign: 'left',
  messageAlign: 'left',
  themePreset: 'custom',
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

const previewCard = computed<PreviewCard>(() => ({
  id: 'preview',
  title: form.title || 'Your Title Here',
  recipientName: form.recipientName || 'Recipient Name',
  message: form.message || 'Your message will appear here. You can write a heartfelt note, a special wish, or anything you\'d like to share!',
  mediaType: form.mediaType,
  mediaUrl: form.mediaUrl,
  backgroundColor: form.backgroundColor,
  textColor: form.textColor,
  titleColor: form.titleColor || form.textColor,
  messageColor: form.messageColor || form.textColor,
  fontFamily: form.fontFamily,
  titleSize: form.titleSize,
  isLocked: false,
  messageSize: form.messageSize,
  titleAlign: form.titleAlign || 'left',
  messageAlign: form.messageAlign || 'left',
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

interface FontOption {
  label: string
  value: string
  // Add other required SelectMenuItem properties
  disabled?: boolean
  icon?: string
  iconClass?: string
}

const fontOptions: FontOption[] = [
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

// Color palettes
const bgSwatches = computed(() => colorMode.value === 'dark'
  ? ['#0b1120', '#111827', '#1f2937', '#1e40af', '#1e3a8a', '#064e3b', '#6b21a8']
  : ['#ffffff', '#f8fafc', '#fef9c3', '#fef3c7', '#dbeafe', '#e0f2fe', '#f0fdf4'])

const textSwatches = [
  '#111827', // gray-900
  '#1f2937', // gray-800
  '#374151', // gray-700
  '#4b5563', // gray-600
  '#6b7280', // gray-500
  '#9ca3af', // gray-400
  '#d1d5db'  // gray-300
]

const titleSwatches = [
  '#1e40af', // blue-800
  '#9f1239', // rose-900
  '#166534', // green-800
  '#92400e', // amber-900
  '#7e22ce', // purple-700
  '#0f766e', // teal-700
  '#000000'  // black
]

const messageSwatches = [
  '#1f2937', // gray-800
  '#374151', // gray-700
  '#4b5563', // gray-600
  '#6b7280', // gray-500
  '#9ca3af', // gray-400
  '#d1d5db', // gray-300
  '#f3f4f6'  // gray-100
]

// Set default colors if not set
if (!form.titleColor) form.titleColor = form.textColor || '#111827'
if (!form.messageColor) form.messageColor = form.textColor || '#111827'
if (!form.backgroundColor) form.backgroundColor = bgSwatches.value[0]

function updatePreview() {
  // Force Vue to detect the color change
  const bgColor = form.backgroundColor || bgSwatches.value[0]
  form.backgroundColor = ''
  nextTick(() => {
    form.backgroundColor = bgColor
  })
}

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

const isDataUrl = (url: string | undefined) => {
  return url?.startsWith('data:')
}

const generateRandomKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const length = 12
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function clearUploaded() {
  form.mediaUrl = ''
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files && input.files[0]
  if (!file) return
  
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!validTypes.includes(file.type)) {
    alert('Please select a valid image file (JPEG, PNG, or GIF)')
    return
  }
  
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    alert('Image size should be less than 5MB')
    return
  }
  
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      form.mediaUrl = reader.result
      // Reset the file input to allow selecting the same file again if needed
      if (input) input.value = ''
    }
  }
  reader.onerror = () => {
    console.error('Error reading file')
  }
  reader.readAsDataURL(file)
}

function buildShareUrl(id: string, key?: string) {
  const base = typeof window !== 'undefined' ? window.location.origin : ''
  const url = new URL(`/card/${id}`, base || 'http://localhost')
  if (key) url.searchParams.set('k', key)
  return url.toString()
}

async function onSubmit() {
  saving.value = true
  try {
    const card = await createCard({
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