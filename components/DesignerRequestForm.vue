<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Request Title -->
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Request Title <span class="text-red-500">*</span>
      </label>
      <UInput id="title" v-model="form.title" placeholder="E.g., Modern Business Card Design" required
        class="w-full rounded-xl px-4 py-3 transition duration-200 shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500" />
    </div>

    <!-- Design Type -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Design Type <span class="text-red-500">*</span>
      </label>
      <USelectMenu 
        v-model="form.designType" 
        :options="designTypes" 
        placeholder="Select design type"
        class="w-full h-12"
        :ui="{ 
          base: 'w-full rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500',
        }"
      >
        <template >
          {{ form.designType || 'Select design type' }}
        </template>
      </USelectMenu>
    </div>

    <!-- Description -->
    <div>
      <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Design Requirements <span class="text-red-500">*</span>
      </label>
      <UTextarea id="description" v-model="form.description"
        placeholder="Please describe your design requirements in detail..." :rows="5" required
        class="w-full rounded-xl px-4 py-3 transition duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500" />
      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Be as detailed as possible about colors, style, and any specific elements you want to include.
      </p>
    </div>

    <!-- Attachments -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Attachments (Optional)
      </label>
      <UInput type="file" multiple @change="handleFileUpload" accept="image/*,.pdf,.ai,.psd" :ui="{
        base: 'w-full file:mr-4 file:rounded-lg file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200 dark:file:bg-gray-700 dark:file:text-gray-200',
      }" />
      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Upload any reference images or files (Max 10MB)
      </p>
    </div>

    <!-- Submit Button -->
    <div class="pt-4">
      <UButton type="submit" color="primary" size="lg" :loading="isSubmitting" :disabled="isSubmitting"
        class="w-full justify-center rounded-xl shadow-md transition hover:shadow-lg">
        <template #leading>
          <UIcon name="i-heroicons-paper-airplane" class="w-5 h-5" />
        </template>
        Submit Design Request
      </UButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface FormData {
  title: string;
  designType: string | null;
  description: string;
  attachments: File[];
}

const form = ref<FormData>({
  title: '',
  designType: null,
  description: '',
  attachments: []
});

const designTypes = [
  'Business Card',
  'Logo',
  'Flyer',
  'Brochure',
  'Social Media Post',
  'Other'
];

const isSubmitting = ref(false);

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    form.value.attachments = Array.from(input.files);
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    console.log('Form submitted:', form.value);
    form.value = {
      title: '',
      designType: null,
      description: '',
      attachments: []
    };
  } catch (error) {
    console.error('Error submitting form:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
