<template>
  <section class="py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <UCard :ui="{ root: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Request print & delivery</h2>
          <UButton :to="`/card/${route.params.id}`" color="neutral" variant="ghost"
            icon="i-heroicons-arrow-uturn-left" />
        </div>
      </template>

      <div v-if="!card" class="text-gray-500 dark:text-gray-400">Card not found.</div>
      <form v-else class="grid gap-4" @submit.prevent="onSubmit">
        <UAlert color="primary" variant="soft" :title="card.title" :description="'For ' + card.recipientName" />

        <UFormGroup label="Recipient full name" required>
          <UInput v-model="recipientName" required
            class="border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        </UFormGroup>
        <UFormGroup label="Delivery address" required>
          <UTextarea v-model="addressLine" :rows="4" required
            class="border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        </UFormGroup>
        <UFormGroup label="Wrapping style">
          <USelect v-model="wrapStyle" :options="wrapOptions" option-attribute="label" value-attribute="value"
            class="border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        </UFormGroup>
        <UFormGroup label="Note to printer (optional)">
          <UTextarea v-model="note" :rows="3"
            class="border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        </UFormGroup>

        <div class="flex items-center justify-end gap-2">
          <UButton type="submit" icon="i-heroicons-paper-airplane" label="Submit request" :loading="loading" />
        </div>

        <UAlert v-if="done" title="Request received" color="primary" variant="soft"
          :description="'We\'ll email you updates. Ref: ' + done" />
      </form>
    </UCard>
  </section>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
import { useCardsApi } from '~/composables/useCardsApi'
const { fetchCard, addPrintRequest } = useCardsApi()

const card = ref<any>(null)

onMounted(async () => {
  card.value = await fetchCard(route.params.id as string)
})

const recipientName = ref('')
const addressLine = ref('')
const wrapStyle = ref<'classic' | 'festive' | 'minimal'>('classic')
const note = ref('')
const loading = ref(false)
const done = ref<string | null>(null)

const wrapOptions = [
  { label: 'Classic', value: 'classic' },
  { label: 'Festive', value: 'festive' },
  { label: 'Minimal', value: 'minimal' }
]

async function onSubmit() {
  if (!card.value) return
  loading.value = true
  try {
    const req = await addPrintRequest({
      cardId: card.value.id,
      recipientName: recipientName.value,
      addressLine: addressLine.value,
      wrapStyle: wrapStyle.value,
      note: note.value
    })
    done.value = req.id
  } finally {
    loading.value = false
  }
}
</script>