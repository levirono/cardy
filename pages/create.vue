<template>
  <section class="py-8 grid gap-6 lg:grid-cols-2">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">Create a card</h2>
        </div>
      </template>

      <form class="grid gap-4" @submit.prevent="onSubmit">
        <div class="grid gap-2 sm:grid-cols-2">
          <UFormGroup label="Title" required>
            <UInput v-model="form.title" placeholder="e.g. Happy Birthday!" required
              class="border border-gray-400 rounded" />
          </UFormGroup>
          <UFormGroup label="Recipient name" required>
            <UInput v-model="form.recipientName" placeholder="e.g. Alex" required
              class="border border-gray-400 rounded" />
          </UFormGroup>
        </div>

        <UFormGroup label="Message">
          <UTextarea v-model="form.message" :rows="5" placeholder="Write something lovely..."
            class="border border-gray-400 rounded" />
        </UFormGroup>

        <div class="grid gap-2 sm:grid-cols-3">
          <UFormGroup label="Media type">
            <USelect v-model="form.mediaType" :options="mediaOptions" option-attribute="label" value-attribute="value"
              class="border border-gray-400 rounded" />
          </UFormGroup>
          <UFormGroup label="Media URL" :help="mediaHelp">
            <UInput v-model="form.mediaUrl" placeholder="https://..." class="border border-gray-400 rounded" />
          </UFormGroup>
          <UFormGroup label="Unlock at (optional)">
            <UInput type="datetime-local" v-model="form.unlockAt" class="border border-gray-400 rounded" />
          </UFormGroup>
        </div>

        <div class="flex items-center gap-3">
          <USwitch v-model="form.isLocked" label="Require a key to open" />
          <UInput v-if="form.isLocked" v-model="form.key" placeholder="Secret key"
            class="border border-gray-400 rounded" />
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <UButton type="submit" icon="i-heroicons-check-circle" :loading="saving" label="Create" />
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
      <MediaRenderer :media-type="form.mediaType as any" :media-url="form.mediaUrl as any" />
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
  unlockAt: form.unlockAt ? new Date(form.unlockAt as string).toISOString() : undefined,
  isLocked: !!form.isLocked,
  key: form.isLocked ? String(form.key || '') : undefined,
  createdAt: new Date().toISOString()
}))

const previewPath = computed(() => `/card/${previewCard.value.id}`)

async function onSubmit() {
  saving.value = true
  try {
    const card = createCard({
      title: String(form.title || ''),
      recipientName: String(form.recipientName || ''),
      message: String(form.message || ''),
      mediaType: (form.mediaType as any) || 'text',
      mediaUrl: String(form.mediaUrl || ''),
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