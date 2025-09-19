<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Request Title <span class="text-red-500">*</span>
      </label>
      <UInput
        id="title"
        v-model="form.title"
        placeholder="E.g., Modern Business Card Design"
        required
        :ui="{
          base: 'w-full',
          input: {
            base: 'w-full',
            color: {
              white: {
                outline: 'shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
              }
            }
          }
        }"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Design Type <span class="text-red-500">*</span>
      </label>
      <USelectMenu
        v-model="form.designType"
        :options="designTypes"
        placeholder="Select design type"
        :ui="{
          width: 'w-full',
          base: 'w-full',
          option: {
            base: 'flex items-center gap-2',
            selected: 'text-primary dark:text-primary-400 font-medium',
            active: 'bg-primary/5 dark:bg-primary/10',
          }
        }"
      >
        <template #label>
          {{ form.designType || 'Select design type' }}
        </template>
      </USelectMenu>
    </div>

    <div>
      <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Design Requirements <span class="text-red-500">*</span>
      </label>
      <UTextarea
        id="description"
        v-model="form.description"
        placeholder="Please describe your design requirements in detail..."
        :rows="5"
        required
        :ui="{
          base: 'w-full',
          textarea: {
            base: 'w-full',
            color: {
              white: {
                outline: 'shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
              }
            }
          }
        }"
      />
      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Be as detailed as possible about colors, style, and any specific elements you want to include.
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Attachments (Optional)
      </label>
      <UInput
        type="file"
        multiple
        @change="handleFileUpload"
        accept="image/*,.pdf,.ai,.psd"
        :ui="{ base: 'w-full' }"
      />
      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Upload any reference images or files (Max 10MB)
      </p>
    </div>

    <div class="pt-4">
      <UButton
        type="submit"
        color="primary"
        size="lg"
        :loading="isSubmitting"
        :disabled="isSubmitting"
        class="w-full justify-center"
      >
        <template #leading>
          <UIcon name="i-heroicons-paper-airplane" class="w-5 h-5" />
        </template>
        Submit Design Request
      </UButton>
    </div>
  </form>
</template>

<script setup>
const emit = defineEmits(['submit']);

const form = reactive({
  title: '',
  designType: null,
  description: '',
  attachments: []
});

const isSubmitting = ref(false);

const designTypes = [
  'Business Card',
  'Logo',
  'Flyer',
  'Brochure',
  'Social Media Post',
  'Other'
];

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);
  // Basic validation
  const validFiles = files.filter(file => {
    const fileSizeMB = file.size / (1024 * 1024);
    return fileSizeMB <= 10; // 10MB limit
  });
  
  if (validFiles.length !== files.length) {
    useToast().add({
      title: 'File too large',
      description: 'Some files exceeded the 10MB limit and were not added.',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'orange'
    });
  }
  
  form.attachments = [...form.attachments, ...validFiles];
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    // TODO: Add form validation
    
    // Prepare form data for submission
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'attachments') {
        form.attachments.forEach(file => {
          formData.append('attachments', file);
        });
      } else {
        formData.append(key, value);
      }
    });
    
    // Emit the form data to the parent component
    emit('submit', formData);
  } catch (error) {
    console.error('Error in form submission:', error);
    useToast().add({
      title: 'Error',
      description: 'An error occurred while processing your request.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>
