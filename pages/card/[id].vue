<template>
  <section class="min-h-screen bg-bg-primary">
    <div class="container mx-auto px-4 py-8">
      <UCard class="shadow-xl rounded-2xl border border-border/50 bg-bg-secondary/50 backdrop-blur"
        :ui="{
          root: 'h-full flex flex-col',
          body: 'flex-1',
          header: 'border-b border-border/50',
          footer: 'border-t border-border/50'
        }">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="size-10 rounded-xl bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 dark:from-primary-600 dark:via-secondary-600 dark:to-accent-600 shadow-lg" />
              <div>
                <div class="font-semibold text-text-primary">Cardy</div>
                <div class="text-xs text-text-muted">Virtual Giftcard</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <UButton to="/" color="neutral" variant="ghost" icon="i-heroicons-home"
                class="hover:scale-110 transition-all duration-200 rounded-lg hover:bg-bg-tertiary/50" />
              <UButton v-if="card" color="neutral" variant="ghost" icon="i-heroicons-link" @click="showShare = true"
                class="hover:scale-110 transition-all duration-200 rounded-lg hover:bg-bg-tertiary/50" />
            </div>
          </div>
        </template>

        <div v-if="loading" class="text-gray-500">Loading…</div>
        <div v-else-if="!card" class="text-gray-500">Card not found.</div>
        <div v-else>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 class="text-2xl font-bold text-text-primary" :style="titleStyle">{{ card.title }}</h2>
              <p class="text-text-muted">To: {{ card.recipientName }}</p>
            </div>
            <div class="flex items-center gap-2">
              <UBadge v-if="card.isLocked" color="neutral" variant="solid" label="Locked" />
              <UBadge v-if="card.unlockAt" color="primary" variant="soft" :label="unlockBadge" />
            </div>
          </div>

          <LockKeyPrompt v-if="!canOpenNow.ok" :locked="canOpenNow.reason === 'locked'" :scheduled-at="unlockAtLocal"
            label="Unlock" @unlock="onUnlock" />

          <div v-else class="grid gap-6">
            <div class="rounded-xl shadow-md p-6 cursor-pointer transition-all duration-300 border border-border/30 bg-bg-secondary/50"
              :class="{
                'fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/90 backdrop-blur-lg m-0 p-0': isFullscreen,
                'hover:shadow-lg hover:border-primary/50': !isFullscreen
              }"
              :style="cardStyle" @dblclick="toggleFullscreen" ref="cardPreviewRef">
              <MediaRenderer :media-type="card.mediaType" :media-url="card.mediaUrl"
                :background-color="card.backgroundColor" />
              <h2 v-if="card.title" class="mb-2" :style="titleStyle">{{ card.title }}</h2>
              <p v-if="card.message" class="text-lg" :style="messageStyle">{{ card.message }}</p>
              <div v-if="card.recipientName" class="mt-2 text-sm text-gray-500">To: {{ card.recipientName }}</div>
              <UButton v-if="isFullscreen" icon="i-heroicons-x-mark" color="error" variant="soft"
                class="absolute top-4 right-4 z-60" @click="toggleFullscreen" label="Close" />
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6" v-if="!isFullscreen">
              <UButton color="primary" :to="`/print-request/${card.id}`" icon="i-heroicons-truck"
                label="Request print & delivery"
                class="w-full sm:w-auto bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 text-white shadow-lg hover:scale-105 transition-all duration-200" />
              <UButton color="neutral" variant="ghost" icon="i-heroicons-arrow-uturn-left" @click="goBack" label="Back to cards"
                class="w-full sm:w-auto hover:bg-bg-tertiary/50" />
            </div>
          </div>
        </div>

        <template #footer>
          <ShareLink v-if="showShare && card" :url="shareUrl" />
        </template>
      </UCard>
    </div>
  </section>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { getCardById, canOpen, markOpened, buildShareUrl } = useCards()

const loading = ref(true)
const card = ref<ReturnType<typeof getCardById> extends infer T ? T : any>() as any
const keyInput = ref<string>('')
const showShare = ref(false)
const unlockBadge = computed(() => card.value?.unlockAt ? 'Opens ' + new Date(card.value.unlockAt).toLocaleString() : '')
const unlockAtLocal = computed(() => card.value?.unlockAt ? new Date(card.value.unlockAt).toLocaleString() : '')
const shareUrl = computed(() => card.value ? buildShareUrl(card.value.id, card.value.isLocked ? card.value.key : undefined) : '')

const canOpenNow = computed(() => {
  if (!card.value) return { ok: false }
  const k = (route.query.k as string | undefined) || keyInput.value || undefined
  return canOpen(card.value, k)
})

const messageStyle = computed(() => ({
  color: card.value?.messageColor || card.value?.textColor || 'var(--color-text-primary)',
  fontFamily: card.value?.fontFamily || 'var(--font-sans)',
  lineHeight: '1.6',
  fontSize: card.value?.messageSize || '1.125rem',
  margin: '1rem 0'
}))

const titleStyle = computed(() => ({
  color: card.value?.titleColor || card.value?.textColor || 'var(--color-text-primary)',
  fontFamily: card.value?.fontFamily || 'var(--font-sans)',
  textAlign: card.value?.titleAlign || 'left',
  fontSize: card.value?.titleSize || '1.5rem',
  fontWeight: '600',
  lineHeight: '1.2',
  margin: '0 0 0.5rem 0'
}))

const cardStyle = computed(() => ({
  background: card.value?.backgroundColor || 'var(--color-bg-secondary)',
  color: card.value?.textColor || 'var(--color-text-primary)',
  fontFamily: card.value?.fontFamily || 'var(--font-sans)',
  borderRadius: '0.75rem',
  transition: 'all 0.3s ease',
  textAlign: card.value?.messageAlign || 'left',
  borderColor: 'var(--color-border)',
  '--tw-shadow': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  '--tw-shadow-colored': '0 1px 2px 0 var(--tw-shadow-color)'
}))

onMounted(() => {
  const id = route.params.id as string
  card.value = getCardById(id)
  loading.value = false
  if (card.value && canOpenNow.value.ok) markOpened(card.value.id)
})

function onUnlock(key: string) {
  keyInput.value = key
  if (card.value && canOpenNow.value.ok) markOpened(card.value.id)
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push('/my')
}

import { ref } from 'vue'
const isFullscreen = ref(false)
const cardPreviewRef = ref<HTMLElement | null>(null)

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value

  if (isFullscreen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

onBeforeUnmount(() => {
  // Clean up body overflow when component is unmounted
  document.body.style.overflow = ''
})
</script>