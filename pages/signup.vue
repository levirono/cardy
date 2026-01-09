<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-indigo-50 to-emerald-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 p-4">
    <UCard class="w-full max-w-md shadow-xl">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-text">Create Account</h1>
          <p class="text-sm text-text-secondary mt-1">Sign up to get started</p>
        </div>
      </template>

      <form @submit.prevent="handleSignup" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-text mb-1">Full Name</label>
          <UInput
            v-model="fullName"
            type="text"
            placeholder="John Doe"
            required
            :disabled="loading"
            class="w-full"
          />
        </div>

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
          <p class="mt-1 text-xs text-text-secondary">Must be at least 6 characters</p>
        </div>

        <UButton
          type="submit"
          color="success"
          block
          size="lg"
          :loading="loading"
          class="mt-6"
        >
          Create Account
        </UButton>
      </form>

      <template #footer>
        <div class="text-center text-sm text-text-secondary">
          Already have an account?
          <NuxtLink to="/login" class="text-primary hover:underline font-medium">
            Sign in
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

const { signUp } = useAuth()
const router = useRouter()
const fullName = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const toast = useToast()

const handleSignup = async () => {
  if (!fullName.value || !email.value || !password.value) {
    toast.add({
      title: 'Error',
      description: 'Please fill in all fields',
      color: 'error'
    })
    return
  }

  if (password.value.length < 6) {
    toast.add({
      title: 'Error',
      description: 'Password must be at least 6 characters',
      color: 'error'
    })
    return
  }

  loading.value = true
  const { error } = await signUp(email.value, password.value, fullName.value)
  loading.value = false

  if (error) {
    toast.add({
      title: 'Signup Failed',
      description: error.message || 'Failed to create account',
      color: 'error'
    })
  } else {
    toast.add({
      title: 'Account Created!',
      description: 'Please check your email to verify your account',
      color: 'success'
    })
    router.push('/login')
  }
}
</script>

