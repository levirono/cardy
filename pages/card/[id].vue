<template>
  <section class="py-8">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="size-8 rounded-lg bg-gradient-to-br from-green-400 via-blue-400 to-red-400" />
            <div>
              <div class="font-semibold">Cardy</div>
              <div class="text-xs text-gray-500">Virtual Giftcard</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <UButton to="/" color="neutral" variant="ghost" icon="i-heroicons-home" />
            <UButton v-if="card" color="neutral" variant="ghost" icon="i-heroicons-link" @click="showShare = true" />
          </div>
        </div>
      </template>

      <div v-if="loading" class="text-gray-500">Loading…</div>
      <div v-else-if="!card" class="text-gray-500">Card not found.</div>
      <div v-else>
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-xl font-semibold">{{ card.title }}</h2>
            <p class="text-gray-500">To: {{ card.recipientName }}</p>
          </div>
          <div class="flex items-center gap-2">
            <UBadge v-if="card.isLocked" color="neutral" variant="solid" label="Locked" />
            <UBadge v-if="card.unlockAt" color="primary" variant="soft" :label="unlockBadge" />
          </div>
        </div>

        <LockKeyPrompt v-if="!canOpenNow.ok" :locked="canOpenNow.reason === 'locked'" :scheduled-at="unlockAtLocal" label="Unlock" @unlock="onUnlock" />

        <div v-else class="grid gap-4">
          <MediaRenderer :media-type="card.mediaType" :media-url="card.mediaUrl" />
          <p v-if="card.message" class="text-lg">{{ card.message }}</p>

          <div class="flex items-center justify-between">
            <UButton color="primary" :to="`/print-request/${card.id}`" icon="i-heroicons-truck" label="Request print & delivery" />
            <UButton color="neutral" variant="ghost" icon="i-heroicons-arrow-uturn-left" @click="goBack" label="Back" />
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
</script> 