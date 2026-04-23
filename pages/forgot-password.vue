<template>
  <div class="p-8">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Reset your password</h1>
      <p class="text-gray-500 mt-1.5 text-sm">We'll send you a link to reset it</p>
    </div>

    <div v-if="sent" class="text-center py-6">
      <div class="text-5xl mb-4">📬</div>
      <p class="font-semibold text-gray-800">Check your inbox!</p>
      <p class="text-sm text-gray-500 mt-2">A password reset link has been sent to <strong>{{ email }}</strong></p>
      <NuxtLink to="/login" class="mt-6 inline-block text-sm text-purple-600 font-medium hover:text-purple-800">← Back to sign in</NuxtLink>
    </div>

    <form v-else @submit.prevent="handleReset" class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
        <input v-model="email" type="email" placeholder="you@example.com"
          class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm" />
      </div>
      <div v-if="error" class="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{{ error }}</div>
      <button type="submit" :disabled="loading"
        class="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-60 transition-all shadow-md text-sm">
        <span v-if="loading">Sending…</span>
        <span v-else>Send Reset Link</span>
      </button>
      <p class="text-center text-sm text-gray-500">
        <NuxtLink to="/login" class="text-purple-600 font-medium hover:text-purple-800">← Back to sign in</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useHead({ title: 'Forgot Password' })

const { $supabase } = useNuxtApp()
const email = ref('')
const loading = ref(false)
const sent = ref(false)
const error = ref('')

const handleReset = async () => {
  if (!email.value) { error.value = 'Please enter your email'; return }
  loading.value = true
  error.value = ''
  const { error: err } = await $supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  loading.value = false
  if (err) error.value = err.message ?? 'Failed to send reset email'
  else sent.value = true
}
</script>
