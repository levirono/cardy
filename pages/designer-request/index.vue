<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8">Request Professional Design</h1>
    
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <DesignerRequestForm @submit="handleSubmit" />
    </div>
    
    <div class="mt-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
      <h3 class="font-semibold text-lg mb-2">How it works</h3>
      <ul class="space-y-2">
        <li class="flex items-start">
          <UIcon name="i-heroicons-check-circle" class="text-green-500 mt-1 mr-2" />
          <span>Submit your design requirements</span>
        </li>
        <li class="flex items-start">
          <UIcon name="i-heroicons-check-circle" class="text-green-500 mt-1 mr-2" />
          <span>Our designers will review your request</span>
        </li>
        <li class="flex items-start">
          <UIcon name="i-heroicons-check-circle" class="text-green-500 mt-1 mr-2" />
          <span>You'll be notified when your design is ready</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const handleSubmit = async (formData) => {
  try {
    // TODO: Implement API call to submit design request
    console.log('Submitting design request:', formData);
    
    // Show success message
    useToast().add({
      title: 'Request Submitted',
      description: 'Your design request has been received. We\'ll notify you when a designer is assigned.',
      icon: 'i-heroicons-check-circle',
      color: 'green'
    });
    
    // Redirect to my-requests page
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
