<template>
  <div class="max-w-2xl mx-auto px-4 py-10">
    <div class="mb-8">
      <NuxtLink to="/cards/my-requests" class="text-sm text-gray-500 hover:text-purple-600 flex items-center gap-1 mb-4">
        ← My Requests
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900">Request a Custom Design</h1>
      <p class="text-gray-500 mt-1">Describe what you need and a designer will create it for you</p>
    </div>

    <div v-if="submitted" class="text-center py-16">
      <div class="text-6xl mb-4">🎉</div>
      <h2 class="text-xl font-bold text-gray-800 mb-2">Request submitted!</h2>
      <p class="text-gray-500 mb-8">A designer will review your request and reach out soon.</p>
      <div class="flex gap-3 justify-center">
        <NuxtLink to="/cards/my-requests" class="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700">View Requests</NuxtLink>
        <button @click="submitted = false; resetForm()" class="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-semibold">Submit Another</button>
      </div>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <div>
        <label class="label">Request Title *</label>
        <input v-model="form.title" type="text" placeholder="e.g. Birthday card for my mum" class="form-input" required/>
      </div>
      <div>
        <label class="label">Description *</label>
        <textarea v-model="form.description" rows="5" required placeholder="Describe the card you'd like — occasion, style, colours, any specific requests…" class="form-input resize-none"></textarea>
      </div>
      <div class="bg-purple-50 rounded-xl p-4 text-sm text-purple-700">
        💡 The more detail you provide, the better your designer can match your vision. Include the occasion, preferred colours, any text you'd like included, and the tone (funny, emotional, formal, etc.).
      </div>
      <div v-if="error" class="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{{ error }}</div>
      <div class="flex gap-3">
        <NuxtLink to="/cards/my-requests" class="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 text-center hover:bg-gray-50">Cancel</NuxtLink>
        <button type="submit" :disabled="loading" class="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-sm disabled:opacity-60 hover:shadow-md transition-all">
          <span v-if="loading">Submitting…</span>
          <span v-else>Submit Request</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Request a Design' })

const { $supabase } = useNuxtApp()
const { user } = useAuth()
const toast = useToast()

const form = reactive({ title: '', description: '' })
const loading = ref(false)
const submitted = ref(false)
const error = ref('')

const resetForm = () => { form.title = ''; form.description = '' }

const handleSubmit = async () => {
  if (!user.value) return
  loading.value = true; error.value = ''
  const { error: err } = await $supabase.from('design_requests').insert({
    user_id: user.value.id, title: form.title, description: form.description, status: 'Pending'
  })
  loading.value = false
  if (err) { error.value = err.message; return }
  submitted.value = true
  toast.add({ title: 'Request submitted!', color: 'success' })
}
</script>
<style scoped>
@reference "tailwindcss";
.label { @apply block text-sm font-medium text-gray-700 mb-1.5; }
.form-input { @apply w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm; }
</style>
