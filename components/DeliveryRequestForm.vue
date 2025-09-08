<template>
  <form class="grid gap-4" @submit.prevent="onSubmit">
    <UAlert color="primary" variant="soft" :title="cardTitle" :description="cardSubtitle" />

    <UFormGroup label="Recipient full name" required>
      <UInput v-model="recipientName" required />
    </UFormGroup>
    <UFormGroup label="Delivery address" required>
      <UTextarea v-model="addressLine" :rows="4" required />
    </UFormGroup>
    <UFormGroup label="Wrapping style">
      <USelect v-model="wrapStyle" :options="wrapOptions" option-attribute="label" value-attribute="value" />
    </UFormGroup>
    <UFormGroup label="Note to printer (optional)">
      <UTextarea v-model="note" :rows="3" />
    </UFormGroup>

    <div class="flex items-center justify-end gap-2">
      <UButton type="submit" icon="i-heroicons-paper-airplane" label="Submit request" :loading="loading" />
    </div>

    <UAlert v-if="done" title="Request received" color="primary" variant="soft" :description="'We\'ll email you updates. Ref: ' + done" />
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{ cardTitle: string, cardSubtitle: string, onSubmitRequest: (payload: { recipientName: string, addressLine: string, wrapStyle: 'classic' | 'festive' | 'minimal', note?: string }) => Promise<string> }>()

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
  loading.value = true
  try {
    done.value = await props.onSubmitRequest({
      recipientName: recipientName.value,
      addressLine: addressLine.value,
      wrapStyle: wrapStyle.value,
      note: note.value
    })
  } finally {
    loading.value = false
  }
}
</script> 