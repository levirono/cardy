<template>
  <section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-indigo-50 to-emerald-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 p-4">
    <UCard class="w-full max-w-2xl shadow-xl">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-text">Apply to become a designer</h1>
            <p class="text-sm text-text-secondary mt-1">
              Tell us a bit about your experience. An admin will review and upgrade your account.
            </p>
          </div>
        </div>
      </template>

      <div v-if="!designerEnabled" class="space-y-4">
        <UAlert
          color="warning"
          variant="soft"
          title="Applications are currently closed"
          description="The admin has disabled new designer applications. Please check back later."
        />
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-text mb-1">Why do you want to become a designer?</label>
          <UTextarea
            v-model="motivation"
            :rows="5"
            placeholder="Share your experience, tools you use, and what kind of designs you love creating..."
            required
            :disabled="loading"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text mb-1">Portfolio link (optional)</label>
          <UInput
            v-model="portfolioUrl"
            type="url"
            placeholder="https://behance.net/your-work or https://dribbble.com/you"
            :disabled="loading"
          />
        </div>

        <UAlert
          color="info"
          variant="soft"
          title="What happens next?"
          description="Once you submit, an admin will review your application. If approved, your role will be changed from user to designer."
        />

        <div class="flex items-center justify-end gap-3 pt-2">
          <UButton
            type="submit"
            color="primary"
            size="lg"
            :loading="loading"
            icon="i-heroicons-paper-airplane"
          >
            Submit application
          </UButton>
        </div>
      </form>

      <template #footer>
        <div class="text-xs text-text-secondary text-center">
          You can continue using Cardy as a normal user while your application is being reviewed.
        </div>
      </template>
    </UCard>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const router = useRouter()
const toast = useToast()
const { isUser, isDesigner } = useAuth()
const { enabled: designerEnabled, loading: settingsLoading, fetchSetting } = useDesignerSettings()

const motivation = ref('')
const portfolioUrl = ref('')
const loading = ref(false)

onMounted(async () => {
  // If already a designer, redirect away
  if (isDesigner.value) {
    router.push('/')
    return
  }

  if (!isUser.value) {
    router.push('/')
    return
  }

  if (designerEnabled.value === null && !settingsLoading.value) {
    await fetchSetting()
  }
})

const handleSubmit = async () => {
  if (!motivation.value.trim()) {
    toast.add({
      title: 'Tell us a bit more',
      description: 'Please share why you want to become a designer.',
      color: 'warning'
    })
    return
  }

  loading.value = true
  try {
    await $fetch('/api/designer-applications', {
      method: 'POST',
      body: {
        motivation: motivation.value,
        portfolioUrl: portfolioUrl.value || undefined
      }
    })

    toast.add({
      title: 'Application submitted',
      description: 'Your designer application has been sent for review.',
      color: 'success'
    })

    router.push('/')
  } catch (error: any) {
    console.error('Error submitting designer application:', error)
    toast.add({
      title: 'Error',
      description: error?.data?.statusMessage || error?.message || 'Failed to submit application',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

