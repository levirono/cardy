<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 py-16 px-4 flex items-center justify-center">
    <div class="w-full max-w-lg">

      <div v-if="sent" class="text-center py-12">
        <div class="text-7xl mb-6 animate-bounce">💝</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-3">Your valentine was sent!</h2>
        <p class="text-gray-500 mb-8">Share this link with <strong class="text-rose-500">{{ form.recipient }}</strong></p>
        <div class="bg-white rounded-2xl border border-pink-100 shadow-sm p-4 mb-6 flex items-center gap-3">
          <input :value="shareUrl" readonly class="flex-1 bg-transparent text-sm text-gray-700 outline-none truncate"/>
          <button @click="copyLink" class="px-4 py-2 bg-rose-100 text-rose-600 rounded-xl text-sm font-semibold hover:bg-rose-200 transition-colors flex-shrink-0">Copy</button>
        </div>
        <div class="flex gap-3 justify-center">
          <NuxtLink to="/valentines" class="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">← Back</NuxtLink>
          <button @click="reset" class="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl text-sm font-semibold hover:shadow-md transition-all">Send Another</button>
        </div>
      </div>

      <div v-else>
        <div class="text-center mb-8">
          <div class="text-5xl mb-3">💌</div>
          <h1 class="text-2xl font-bold text-gray-900">Create a Valentine</h1>
          <p class="text-gray-500 mt-1.5">Write a heartfelt message for someone special</p>
        </div>

        <div class="bg-white rounded-3xl shadow-lg border border-pink-100 p-8 space-y-5">
          <div>
            <label class="label">Your Name (optional)</label>
            <input v-model="form.sender_name" type="text" placeholder="From: Secret Admirer" class="form-input"/>
          </div>
          <div>
            <label class="label">Recipient's Name *</label>
            <input v-model="form.recipient" type="text" placeholder="To: My Love" class="form-input" required/>
          </div>
          <div>
            <label class="label">Your Message *</label>
            <textarea v-model="form.message" rows="5" placeholder="Write your heartfelt valentine message here… 💕" class="form-input resize-none"></textarea>
            <p class="text-xs text-gray-400 mt-1">{{ form.message.length }}/500 characters</p>
          </div>

          <!-- Preview -->
          <div v-if="form.message && form.recipient" class="rounded-2xl p-6 text-center" style="background: linear-gradient(135deg, #ffe4e6, #fce7f3)">
            <div class="text-3xl mb-2">💕</div>
            <p class="text-sm text-rose-400 font-medium mb-1">To {{ form.recipient }}</p>
            <p class="text-gray-700 italic text-sm leading-relaxed">"{{ form.message }}"</p>
            <p v-if="form.sender_name" class="text-xs text-gray-400 mt-3">— {{ form.sender_name }}</p>
          </div>

          <div v-if="error" class="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{{ error }}</div>

          <button @click="sendValentine" :disabled="loading || !form.recipient || !form.message"
            class="w-full py-3 rounded-xl font-semibold text-white text-sm disabled:opacity-60 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            style="background: linear-gradient(135deg, #f43f5e, #ec4899)">
            <span v-if="loading">Sending…</span>
            <span v-else>Send Valentine 💝</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Create a Valentine' })

const { $supabase } = useNuxtApp()
const toast = useToast()
const form = reactive({ sender_name: '', recipient: '', message: '' })
const loading = ref(false)
const sent = ref(false)
const error = ref('')
const createdId = ref('')
const shareUrl = computed(() => process.client ? `${window.location.origin}/valentines/${createdId.value}` : '')

const reset = () => { sent.value = false; createdId.value = ''; Object.assign(form, { sender_name: '', recipient: '', message: '' }) }

const copyLink = async () => {
  await navigator.clipboard.writeText(shareUrl.value)
  toast.add({ title: 'Link copied!', color: 'success' })
}

const sendValentine = async () => {
  if (form.message.length > 500) { error.value = 'Message too long (max 500 characters)'; return }
  loading.value = true; error.value = ''
  const { data, error: err } = await $supabase.from('valentines')
    .insert({ sender_name: form.sender_name || null, recipient: form.recipient, message: form.message })
    .select().single()
  loading.value = false
  if (err) { error.value = err.message; return }
  createdId.value = data.id
  sent.value = true
}
</script>

<style scoped>
@reference "tailwindcss";
.label { @apply block text-sm font-medium text-gray-700 mb-1.5; }
.form-input { @apply w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-sm; }
</style>
