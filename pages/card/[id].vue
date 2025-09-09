<template>
  <section class="py-8 min-h-screen bg-gradient-to-br from-rose-50 via-indigo-50 to-emerald-50">
    <UCard class="shadow-2xl rounded-2xl border-2 border-indigo-100 bg-white/80 backdrop-blur">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="size-10 rounded-xl bg-gradient-to-br from-green-400 via-blue-400 to-red-400 dark:from-green-600 dark:via-blue-600 dark:to-red-600 shadow-lg" />
            <div>
              <div class="font-semibold text-indigo-700">Cardy</div>
              <div class="text-xs text-gray-500">Virtual Giftcard</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <UButton to="/" color="neutral" variant="ghost" icon="i-heroicons-home"
              class="hover:scale-110 transition-all duration-200 rounded-lg" />
            <UButton v-if="card" color="neutral" variant="ghost" icon="i-heroicons-link" @click="showShare = true"
              class="hover:scale-110 transition-all duration-200 rounded-lg" />
          </div>
        </div>
      </template>

      <div v-if="loading" class="text-gray-500">Loading…</div>
      <div v-else-if="!card" class="text-gray-500">Card not found.</div>
      <div v-else>
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold" :style="titleStyle">{{ card.title }}</h2>
            <p class="text-gray-500">To: {{ card.recipientName }}</p>
          </div>
          <div class="flex items-center gap-2">
            <UBadge v-if="card.isLocked" color="neutral" variant="solid" label="Locked" />
            <UBadge v-if="card.unlockAt" color="primary" variant="soft" :label="unlockBadge" />
          </div>
        </div>

        <LockKeyPrompt v-if="!canOpenNow.ok" :locked="canOpenNow.reason === 'locked'" :scheduled-at="unlockAtLocal"
          label="Unlock" @unlock="onUnlock" />

        <div v-else class="grid gap-6">
          <div class="rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300"
            :class="{ 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg m-0 p-0': isFullscreen }"
            :style="cardStyle" @dblclick="toggleFullscreen" ref="cardPreviewRef">
            <MediaRenderer :media-type="card.mediaType" :media-url="card.mediaUrl"
              :background-color="card.backgroundColor" />
            <h2 v-if="card.title" class="mb-2" :style="titleStyle">{{ card.title }}</h2>
            <p v-if="card.message" class="text-lg" :style="messageStyle">{{ card.message }}</p>
            <div v-if="card.recipientName" class="mt-2 text-sm text-gray-500">To: {{ card.recipientName }}</div>
            <UButton v-if="isFullscreen" icon="i-heroicons-x-mark" color="error" variant="soft"
              class="absolute top-4 right-4 z-60" @click="toggleFullscreen" label="Close" />
          </div>

          <div class="flex items-center justify-between" v-if="!isFullscreen">
            <UButton color="primary" :to="`/print-request/${card.id}`" icon="i-heroicons-truck"
              label="Request print & delivery"
              class="bg-gradient-to-r from-rose-400 via-indigo-400 to-emerald-400 text-white shadow-lg hover:scale-105 transition-all duration-200 rounded-xl" />
            <UButton color="neutral" variant="ghost" icon="i-heroicons-arrow-uturn-left" @click="goBack" label="Back"
              class="hover:scale-105 transition-all duration-200 rounded-xl" />
          </div>
        </div>
      </div>

      <template #footer>
        <ShareLink v-if="showShare && card" :url="shareUrl" />
      </template>
    </UCard>
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
  color: card.value?.messageColor || card.value?.textColor || undefined,
  fontFamily: card.value?.fontFamily || undefined
}))

const titleStyle = computed(() => ({
  color: card.value?.titleColor || card.value?.textColor || undefined,
  fontFamily: card.value?.fontFamily || undefined,
  textAlign: card.value?.titleAlign || undefined,
  fontSize: card.value?.titleSize || undefined
}))

const cardStyle = computed(() => ({
  background: card.value?.backgroundColor || '#fff',
  color: card.value?.textColor || '#111827',
  fontFamily: card.value?.fontFamily || undefined,
  borderRadius: '1rem',
  transition: 'background 0.3s',
  textAlign: card.value?.messageAlign || 'left',
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
const cardPreviewRef = ref(null)
function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}
</script>