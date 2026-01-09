<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-indigo-50 to-emerald-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 p-4">
    <UCard class="w-full max-w-md shadow-xl">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-text">Welcome Back</h1>
          <p class="text-sm text-text-secondary mt-1">Sign in to your account</p>
        </div>
      </template>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-text mb-1">Email</label>
          <UInput
            v-model="email"
            type="email"
            placeholder="your@email.com"
            required
            :disabled="loading"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text mb-1">Password</label>
          <UInput
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            :disabled="loading"
            class="w-full"
          />
        </div>

        <UButton
          type="submit"
          color="success"
          block
          size="lg"
          :loading="loading"
          class="mt-6"
        >
          Sign In
        </UButton>
      </form>

      <template #footer>
        <div class="text-center text-sm text-text-secondary">
          Don't have an account?
          <NuxtLink to="/signup" class="text-primary hover:underline font-medium">
            Sign up
          </NuxtLink>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: 'guest'
})

const { signIn } = useAuth()
const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const toast = useToast()

const handleLogin = async () => {
  if (!email.value || !password.value) {
    toast.add({
      title: 'Error',
      description: 'Please fill in all fields',
      color: 'error'
    })
    return
  }

  loading.value = true
  const { error } = await signIn(email.value, password.value)
  loading.value = false

  if (error) {
    toast.add({
      title: 'Login Failed',
      description: error.message || 'Invalid email or password',
      color: 'error'
    })
  } else {
    toast.add({
      title: 'Welcome Back!',
      description: 'You have been successfully logged in',
      color: 'success'
    })
    router.push('/')
  }
}
</script>

