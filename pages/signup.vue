<template>
  <div class="p-8">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Create your account</h1>
      <p class="text-gray-500 mt-1.5 text-sm">Join Cardy and start creating</p>
    </div>

    <form @submit.prevent="handleSignup" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
        <input v-model="fullName" type="text" placeholder="Jane Doe" autocomplete="name"
          class="form-input" :class="{ 'border-red-300': errors.fullName }" />
        <p v-if="errors.fullName" class="text-xs text-red-500 mt-1">{{ errors.fullName }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
        <input v-model="email" type="email" placeholder="you@example.com" autocomplete="email"
          class="form-input" :class="{ 'border-red-300': errors.email }" />
        <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
        <div class="relative">
          <input v-model="password" :type="showPw ? 'text' : 'password'" placeholder="At least 8 characters"
            autocomplete="new-password" class="form-input pr-11" :class="{ 'border-red-300': errors.password }" />
          <button type="button" @click="showPw = !showPw" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path v-if="!showPw" d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path v-if="!showPw" fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
              <path v-if="showPw" fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"/>
              <path v-if="showPw" d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
            </svg>
          </button>
        </div>
        <p v-if="errors.password" class="text-xs text-red-500 mt-1">{{ errors.password }}</p>
        <!-- Strength bar -->
        <div class="flex gap-1 mt-2" v-if="password">
          <div v-for="i in 4" :key="i" class="h-1 flex-1 rounded-full transition-colors"
            :class="strength >= i ? strengthColors[strength-1] : 'bg-gray-200'" />
        </div>
      </div>

      <div v-if="serverError" class="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
        <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
        {{ serverError }}
      </div>

      <!-- Email confirm notice -->
      <div v-if="checkEmail" class="bg-green-50 border border-green-100 rounded-xl px-4 py-4 text-center">
        <div class="text-2xl mb-2">📧</div>
        <p class="text-sm font-semibold text-green-800">Check your email!</p>
        <p class="text-xs text-green-600 mt-1">We sent a confirmation link to <strong>{{ email }}</strong></p>
      </div>

      <button v-if="!checkEmail" type="submit" :disabled="loading"
        class="w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-sm">
        <span v-if="loading" class="flex items-center justify-center gap-2">
          <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" class="opacity-75"/></svg>
          Creating account…
        </span>
        <span v-else>Create Account</span>
      </button>
    </form>

    <p class="text-center text-sm text-gray-500 mt-6">
      Already have an account?
      <NuxtLink to="/login" class="text-purple-600 font-semibold hover:text-purple-800 ml-1">Sign in →</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth', middleware: 'guest' })
useHead({ title: 'Sign Up' })

const { signUp } = useAuth()
const toast = useToast()

const fullName = ref('')
const email = ref('')
const password = ref('')
const showPw = ref(false)
const loading = ref(false)
const checkEmail = ref(false)
const serverError = ref('')
const errors = reactive({ fullName: '', email: '', password: '' })
const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500']
const strength = computed(() => {
  const p = password.value
  let s = 0
  if (p.length >= 8) s++
  if (/[A-Z]/.test(p)) s++
  if (/[0-9]/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
})

const validate = () => {
  errors.fullName = fullName.value.trim().length < 2 ? 'Enter your full name' : ''
  errors.email = !email.value.includes('@') ? 'Enter a valid email' : ''
  errors.password = password.value.length < 8 ? 'Password must be at least 8 characters' : ''
  return !errors.fullName && !errors.email && !errors.password
}

const handleSignup = async () => {
  if (!validate()) return
  serverError.value = ''
  loading.value = true
  const { data, error } = await signUp(email.value, password.value, fullName.value)
  loading.value = false
  if (error) {
    serverError.value = error.message ?? 'Sign up failed. Please try again.'
  } else if (data?.user && !data?.session) {
    checkEmail.value = true
  } else {
    toast.add({ title: 'Account created!', description: 'Welcome to Cardy!', color: 'success' })
    navigateTo('/dashboard')
  }
}
</script>

<style scoped>
@reference "tailwindcss";
.form-input {
  @apply w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm;
}
</style>