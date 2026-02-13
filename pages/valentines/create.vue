<template>
  <section class="min-h-screen bg-gradient-to-br from-rose-50 via-indigo-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
    <div class="max-w-xl mx-auto">
        
      <div class="mb-6">
        <UButton to="/valentines" variant="outline" icon="i-heroicons-arrow-left" label="Back"/>
      </div>

      <UCard class="mb-6">
        <template #header>
          <h1 class="text-3xl font-bold text-center">✨ Write your Valentine ✨</h1>
        </template>
        <form @submit.prevent="onSubmit" class="space-y-6">
          <div class="grid gap-4 sm:grid-cols-2">
            <UFormGroup label="Your name (optional)" :ui="{ label: 'text-text mb-2', container: 'mt-2' }">
              <UInput
                v-model="form.sender"
                placeholder="Your name"
                :disabled="isLoading"
              />
            </UFormGroup>
            
            <UFormGroup label="Recipient name" required :ui="{ label: 'text-text mb-2', container: 'mt-2' }">
              <UInput
                v-model="form.recipient"
                placeholder="Recipient name"
                required
                :disabled="isLoading"
              />
            </UFormGroup>
          </div>
  <UFormGroup label="Your Message" required :ui="{ label: 'text-text mb-2', container: 'mt-2' }">
    <UTextarea
      v-model="form.message"
      placeholder="Type your heartfelt message here…"
      :rows="8"
      required
      :disabled="isLoading"
      class="w-full"
    />
  </UFormGroup>

  <div v-if="errorMessage" class="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg">
    {{ errorMessage }}
  </div>

  <UButton
    type="submit"
    color="primary"
    size="lg"
    class="w-full"
    :loading="isLoading"
    :disabled="isLoading || !form.recipient || !form.message"
  >
    <template v-if="!isLoading">
      💌 Create Shareable Link
    </template>
  </UButton>
</form>
  </UCard>

  <UCard v-if="shareLink" class="bg-green-50 dark:bg-green-900/20 border-2 border-green-400">
<template #header>
  <h2 class="text-2xl font-bold text-center text-green-600 dark:text-green-400">✅ Your link is ready!</h2>
</template>

<div class="space-y-4">
  <p class="text-text">Share this link with your Valentine:</p>
  <div class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-border break-all">
    <a :href="shareLink" class="text-blue-600 dark:text-blue-400 underline hover:font-bold">
      {{ shareLink }}
    </a>
  </div>

  <div class="flex gap-2">
    <UButton
      @click="copyToClipboard"
      color="primary"
      variant="soft"
      icon="i-heroicons-document-duplicate"
      label="Copy link"
    />
    <UButton
      :to="shareLink"
      color="success"
      variant="soft"
      icon="i-heroicons-eye"
      label="Preview"
    />
  </div>
</div>
  </UCard>
</div>
  </section>
</template>

<style scoped>
:deep(input), :deep(textarea) {
  caret-color: #ea580c !important;
  animation: blink-cursor 1.2s infinite;
  transition: all 0.2s ease;
  border: 2px solid transparent !important;
  padding: 12px 14px !important;
}

:deep(input:focus), :deep(textarea:focus) {
  border-color: #a78bfa !important;
  background-color: rgba(168, 85, 247, 0.05) !important;
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1) !important;
  outline: none !important;
}

:deep(input::placeholder), :deep(textarea::placeholder) {
  color: rgba(107, 114, 128, 0.5) !important;
}

@keyframes blink-cursor {
  0%, 49% {
    caret-color: #ea580c;
  }
  50%, 100% {
    caret-color: transparent;
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { useValentinesApi } from '~/composables/useValentinesApi'

interface Form {
  sender: string
  recipient: string
  message: string
}

const form = ref<Form>({ sender: '', recipient: '', message: '' })
const shareLink = ref<string>('')
const isLoading = ref(false)
const errorMessage = ref('')
const { createValentine } = useValentinesApi()

const onSubmit = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    const data: any = await createValentine(form.value)
    if (data && data.id) {
      shareLink.value = `${window.location.origin}/valentines?id=${data.id}`
    } else {
      throw new Error('Invalid response from server')
    }
  } catch (err: any) {
    console.error('Error creating valentine:', err)
    errorMessage.value = err?.message || 'Failed to create your valentine. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value)
    alert('Link copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>
