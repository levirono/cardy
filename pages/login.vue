<template>
  <div class="p-8">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Welcome back</h1>
      <p class="text-gray-500 mt-1.5 text-sm">Sign in to your Cardy account</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
        <input v-model="email" type="email" placeholder="you@example.com" autocomplete="email"
          class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm"
          :class="{ 'border-red-300': error }" />
      </div>
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <label class="text-sm font-medium text-gray-700">Password</label>
          <NuxtLink to="/forgot-password" class="text-xs text-purple-600 hover:text-purple-800 font-medium">Forgot password?</NuxtLink>
        </div>
        <div class="relative">
          <input v-model="password" :type="showPw ? 'text' : 'password'" placeholder="••••••••" autocomplete="current-password"
            class="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm"
            :class="{ 'border-red-300': error }" />
          <button type="button" @click="showPw = !showPw" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path v-if="!showPw" d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path v-if="!showPw" fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
              <path v-if="showPw" fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"/>
              <path v-if="showPw" d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
            </svg>
          </button>
        </div>
      </div>

      <div v-if="error" class="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
        <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
        {{ error }}
      </div>

      <button type="submit" :disabled="loading"
        class="w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-sm">
        <span v-if="loading" class="flex items-center justify-center gap-2">
          <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" class="opacity-75"/></svg>
          Signing in…
        </span>
        <span v-else>Sign In</span>
      </button>
    </form>

    <p class="text-center text-sm text-gray-500 mt-6">
      Don't have an account?
      <NuxtLink to="/signup" class="text-purple-600 font-semibold hover:text-purple-800 ml-1">Create one →</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth', middleware: 'guest' })
useHead({ title: 'Sign In' })

const { signIn, defaultRedirect } = useAuth()
const router = useRouter()
const toast = useToast()

const email = ref('')
const password = ref('')
const showPw = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }
  error.value = ''
  loading.value = true
  const { error: err } = await signIn(email.value, password.value)
  loading.value = false
  if (err) {
    error.value = err.message?.includes('Invalid login') ? 'Invalid email or password' : (err.message ?? 'Login failed')
  } else {
    toast.add({ title: 'Welcome back!', color: 'success' })
    router.push(defaultRedirect.value)
  }
}
</script>