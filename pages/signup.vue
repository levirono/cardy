<template>
  <div class="relative min-h-screen flex items-center justify-center overflow-hidden p-4"
    style="background: linear-gradient(135deg, #e754ec 0%, #9b68f3 45%, #5b9df9 100%)">

    <!-- Background blobs -->
    <div class="absolute -top-40 -left-36 w-[480px] h-[480px] rounded-full blur-[90px] opacity-50 animate-pulse"
      style="background: #e754ec" />
    <div class="absolute -bottom-28 -right-28 w-[420px] h-[420px] rounded-full blur-[80px] opacity-45 animate-pulse"
      style="background: #5b9df9; animation-delay: 2s" />
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full blur-[80px] opacity-35 animate-pulse"
      style="background: #9b68f3; animation-delay: 4s" />

    <!-- Glass card -->
    <div class="relative z-10 w-full max-w-[420px] rounded-[22px] overflow-hidden
      bg-white/[0.13] backdrop-blur-2xl border border-white/30
      shadow-[0_8px_40px_rgba(0,0,0,0.20),inset_0_1px_0_rgba(255,255,255,0.38)]">

      <!-- Inner top-shine overlay -->
      <div class="absolute inset-0 rounded-[22px] pointer-events-none"
        style="background: linear-gradient(155deg, rgba(255,255,255,0.20) 0%, transparent 55%)" />

      <!-- Progress bar -->
      <div class="h-[3px] overflow-hidden" :class="loading ? 'bg-white/15' : 'bg-transparent'">
        <div v-if="loading"
          class="h-full w-3/4 animate-[shimmer_1.4s_linear_infinite]"
          style="background: linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.35), rgba(255,255,255,0.9)); background-size: 200% 100%" />
      </div>

      <!-- Header -->
      <div class="relative px-8 pt-8 pb-0 text-center">
        <div class="inline-flex items-center justify-center w-[50px] h-[50px] rounded-2xl mb-4
          bg-white/[0.18] border border-white/40
          shadow-[0_2px_14px_rgba(0,0,0,0.12)]">
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill="url(#lg)" />
            <path d="M8 14.5L12.5 19L20 10" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
              <linearGradient id="lg" x1="0" y1="0" x2="28" y2="28">
                <stop offset="0%" stop-color="#e754ec"/>
                <stop offset="100%" stop-color="#5b9df9"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-white tracking-tight" style="text-shadow: 0 1px 10px rgba(0,0,0,0.12)">
          Create your account
        </h1>
        <p class="text-sm text-white/70 mt-1">Join thousands already using the platform</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSignup" class="relative px-8 pt-6 pb-0 flex flex-col gap-[1.1rem]" novalidate>

        <!-- Full Name -->
        <div class="flex flex-col gap-1.5">
          <label for="fullName" class="text-[0.78rem] font-semibold text-white/88 tracking-wide">Full Name</label>
          <div class="flex items-center gap-2 px-3.5 rounded-[10px] transition-all duration-200"
            :class="focused === 'fullName'
              ? 'bg-white/[0.18] border border-white/55 shadow-[0_0_0_3px_rgba(255,255,255,0.14)]'
              : 'bg-white/10 border border-white/20'">
            <svg class="w-4 h-4 flex-shrink-0 transition-colors duration-200"
              :class="focused === 'fullName' ? 'text-white/95' : 'text-white/50'"
              viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
            </svg>
            <input
              id="fullName" v-model="fullName" type="text" placeholder="Jane Smith"
              autocomplete="name" :disabled="loading"
              @focus="focused = 'fullName'" @blur="focused = null"
              class="flex-1 bg-transparent border-none outline-none py-[0.7rem] text-sm text-white placeholder-white/35 disabled:opacity-55 disabled:cursor-not-allowed"
              style="caret-color: white; font-family: inherit"
            />
          </div>
        </div>

        <!-- Email -->
        <div class="flex flex-col gap-1.5">
          <label for="email" class="text-[0.78rem] font-semibold text-white/88 tracking-wide">Email address</label>
          <div class="flex items-center gap-2 px-3.5 rounded-[10px] transition-all duration-200"
            :class="focused === 'email'
              ? 'bg-white/[0.18] border border-white/55 shadow-[0_0_0_3px_rgba(255,255,255,0.14)]'
              : 'bg-white/10 border border-white/20'">
            <svg class="w-4 h-4 flex-shrink-0 transition-colors duration-200"
              :class="focused === 'email' ? 'text-white/95' : 'text-white/50'"
              viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
            <input
              id="email" v-model="email" type="email" placeholder="you@example.com"
              autocomplete="email" :disabled="loading"
              @focus="focused = 'email'" @blur="focused = null"
              class="flex-1 bg-transparent border-none outline-none py-[0.7rem] text-sm text-white placeholder-white/35 disabled:opacity-55 disabled:cursor-not-allowed"
              style="caret-color: white; font-family: inherit"
            />
          </div>
        </div>

        <!-- Password -->
        <div class="flex flex-col gap-1.5">
          <label for="password" class="text-[0.78rem] font-semibold text-white/88 tracking-wide">Password</label>
          <div class="flex items-center gap-2 px-3.5 rounded-[10px] transition-all duration-200"
            :class="focused === 'password'
              ? 'bg-white/[0.18] border border-white/55 shadow-[0_0_0_3px_rgba(255,255,255,0.14)]'
              : 'bg-white/10 border border-white/20'">
            <svg class="w-4 h-4 flex-shrink-0 transition-colors duration-200"
              :class="focused === 'password' ? 'text-white/95' : 'text-white/50'"
              viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
            </svg>
            <input
              id="password" v-model="password" :type="showPw ? 'text' : 'password'"
              placeholder="Min. 6 characters" autocomplete="new-password" :disabled="loading"
              @focus="focused = 'password'" @blur="focused = null"
              class="flex-1 bg-transparent border-none outline-none py-[0.7rem] text-sm text-white placeholder-white/35 disabled:opacity-55 disabled:cursor-not-allowed"
              style="caret-color: white; font-family: inherit"
            />
            <button type="button" @click="showPw = !showPw" tabindex="-1"
              class="flex items-center text-white/50 hover:text-white transition-colors duration-200">
              <svg v-if="!showPw" viewBox="0 0 20 20" fill="currentColor" class="w-[17px] h-[17px]">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
              </svg>
              <svg v-else viewBox="0 0 20 20" fill="currentColor" class="w-[17px] h-[17px]">
                <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"/>
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
              </svg>
            </button>
          </div>
          <!-- Strength bar -->
          <div v-if="password" class="h-[3px] rounded-full bg-white/15 overflow-hidden mt-0.5">
            <div class="h-full rounded-full transition-all duration-300" :style="{ width: swid, background: scol }" />
          </div>
          <p class="text-[0.74rem] text-white/55">{{ password ? slabel : 'At least 6 characters' }}</p>
        </div>

        <!-- CTA button -->
        <button
          type="submit"
          :disabled="loading"
          class="mt-1 w-full py-[0.82rem] px-6 rounded-[10px] font-bold text-[0.95rem] text-white
            border border-white/38 backdrop-blur-sm
            transition-all duration-200 cursor-pointer
            shadow-[0_4px_18px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.32)]
            disabled:opacity-65 disabled:cursor-not-allowed
            relative overflow-hidden"
          :class="signupDone
            ? 'bg-green-500/30 border-green-400/55'
            : 'bg-white/20 hover:bg-white/30 hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(0,0,0,0.20),inset_0_1px_0_rgba(255,255,255,0.42)] active:translate-y-0'"
        >
          <!-- Shine overlay -->
          <div class="absolute inset-0 pointer-events-none"
            style="background: linear-gradient(155deg, rgba(255,255,255,0.22) 0%, transparent 55%)" />

          <span v-if="!loading && !signupDone" class="relative flex items-center justify-center gap-2">
            Create Account
            <svg viewBox="0 0 20 20" fill="currentColor" class="w-[17px] h-[17px]">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </span>
          <span v-else-if="loading" class="relative flex items-center justify-center gap-2">
            <span class="w-[17px] h-[17px] rounded-full border-2 border-white/30 border-t-white animate-spin flex-shrink-0" />
            Creating your account…
          </span>
          <span v-else class="relative flex items-center justify-center gap-2">
            <svg viewBox="0 0 20 20" fill="currentColor" class="w-[18px] h-[18px]">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            Account Created!
          </span>
        </button>
      </form>

      <!-- Footer -->
      <div class="relative px-8 py-7 text-center text-sm text-white/65">
        Already have an account?
        <NuxtLink to="/login" class="text-white font-bold ml-1 hover:opacity-80 hover:underline transition-opacity">
          Sign in →
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'guest' })

const { signUp } = useAuth()
const router = useRouter()
const toast = useToast()

const fullName = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const signupDone = ref(false)
const showPw = ref(false)
const focused = ref<string | null>(null)

const strength = computed(() => {
  const p = password.value; if (!p) return 0
  let s = 0
  if (p.length >= 6) s++; if (p.length >= 10) s++
  if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++
  return s
})
const swid = computed(() => `${Math.min(strength.value / 5 * 100, 100)}%`)
const scol = computed(() => ['#ef4444','#ef4444','#f97316','#eab308','#22c55e'][Math.min(strength.value, 4)])
const slabel = computed(() => ['','Weak','Fair','Good','Strong ✓','Strong ✓'][Math.min(strength.value, 5)])

const handleSignup = async () => {
  if (!fullName.value || !email.value || !password.value) {
    toast.add({ title: 'Error', description: 'Please fill in all fields', color: 'error' }); return
  }
  if (password.value.length < 6) {
    toast.add({ title: 'Error', description: 'Password must be at least 6 characters', color: 'error' }); return
  }
  loading.value = true
  try {
    const { error } = await signUp(email.value, password.value, fullName.value)
    if (error) {
      const msg = (error.message?.includes('timeout') || error.message?.includes('504'))
        ? 'Request timed out. Please check your connection.'
        : error.message || 'Failed to create account'
      toast.add({ title: 'Signup Failed', description: msg, color: 'error' })
    } else {
      signupDone.value = true
      toast.add({ title: 'Account Created!', description: 'Check your email to verify.', color: 'success' })
      setTimeout(() => router.push('/login'), 1500)
    }
  } catch {
    toast.add({ title: 'Signup Failed', description: 'An unexpected error occurred.', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Only used for the shimmer keyframe — not possible in plain Tailwind */
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>