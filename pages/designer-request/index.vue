<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
      Request Professional Design
    </h1>

    <!-- Form container -->
    <div
      class="bg-gradient-to-br from-green-50 via-blue-50 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
      <DesignerRequestForm class="space-y-4" @submit="handleSubmit" />
    </div>

    <!-- How it works section -->
    <div
      class="mt-10 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800 transition duration-300 hover:scale-[1.01]">
      <h3 class="font-semibold text-xl mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <UIcon name="i-heroicons-light-bulb" class="text-green-500 w-6 h-6" />
        How it works
      </h3>
      <ul class="space-y-3">
        <li class="flex items-start group">
          <UIcon name="i-heroicons-check-circle"
            class="text-green-500 mt-1 mr-3 transition-transform group-hover:scale-110" />
          <span class="text-gray-700 dark:text-gray-200">Submit your design requirements</span>
        </li>
        <li class="flex items-start group">
          <UIcon name="i-heroicons-check-circle"
            class="text-green-500 mt-1 mr-3 transition-transform group-hover:scale-110" />
          <span class="text-gray-700 dark:text-gray-200">Our designers will review your request</span>
        </li>
        <li class="flex items-start group">
          <UIcon name="i-heroicons-check-circle"
            class="text-green-500 mt-1 mr-3 transition-transform group-hover:scale-110" />
          <span class="text-gray-700 dark:text-gray-200">You'll be notified when your design is ready</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { isUser } = useAuth()
const router = useRouter()

// Redirect if not a regular user
onMounted(() => {
  if (!isUser.value) {
    router.push('/')
  }
})

const handleSubmit = async (formData) => {
  try {
    console.log('Submitting design request:', formData);

    useToast().add({
      title: 'Request Submitted',
      description: 'Your design request has been received. We\'ll notify you when a designer is assigned.',
      icon: 'i-heroicons-check-circle',
      color: 'green'
    });

    return navigateTo('/my-requests');
  } catch (error) {
    console.error('Error submitting design request:', error);
    useToast().add({
      title: 'Error',
      description: 'Failed to submit design request. Please try again.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    });
  }
};
</script>
    