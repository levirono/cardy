<template>
  <div v-if="loading" class="min-h-screen flex items-center justify-center">
    <div class="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
  </div>

  <div v-else-if="!wedding" class="min-h-screen flex items-center justify-center text-center p-8">
    <div>
      <div class="text-6xl mb-4">💔</div>
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Wedding not found</h1>
      <p class="text-gray-500 mb-6">This invitation may have been removed or the link is incorrect.</p>
      <NuxtLink to="/" class="px-5 py-2.5 bg-rose-500 text-white rounded-xl font-semibold text-sm">← Go Home</NuxtLink>
    </div>
  </div>

  <div v-else>
    <!-- 1. Hero / Cover -->
    <section class="min-h-screen flex items-center justify-center relative overflow-hidden"
      :style="{ background: wedding.cover_image_url ? `url(${wedding.cover_image_url}) center/cover` : `linear-gradient(135deg, ${wedding.theme_color || '#d4a5a5'}44 0%, white 100%)` }">
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <div class="text-5xl mb-6 animate-bounce">💍</div>
        <p class="text-sm font-medium tracking-[0.3em] uppercase mb-4" :style="{ color: wedding.theme_color || '#d4a5a5' }">Wedding Invitation</p>
        <h1 class="text-5xl sm:text-7xl font-bold text-gray-900 mb-3" style="font-family: 'Playfair Display', serif">
          {{ wedding.couple_name_1 }}
        </h1>
        <div class="text-3xl text-gray-400 my-2" style="font-family: 'Playfair Display', serif">&</div>
        <h1 class="text-5xl sm:text-7xl font-bold text-gray-900 mb-8" style="font-family: 'Playfair Display', serif">
          {{ wedding.couple_name_2 }}
        </h1>
        <div class="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur rounded-2xl shadow-sm text-gray-700 font-medium">
          <svg class="w-5 h-5 text-rose-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/></svg>
          {{ fmtDate(wedding.wedding_date) }}
        </div>
        <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#rsvp" class="px-8 py-3.5 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
            :style="{ background: `linear-gradient(135deg, ${wedding.theme_color || '#d4a5a5'}, #ec4899)` }">
            RSVP Now 💌
          </a>
          <a href="#details" class="px-8 py-3.5 rounded-2xl font-semibold bg-white/80 backdrop-blur text-gray-700 shadow hover:shadow-md transition-all text-sm border border-white/60">
            View Details
          </a>
        </div>
        <div class="mt-10 animate-bounce">
          <svg class="w-6 h-6 text-gray-400 mx-auto" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
        </div>
      </div>
    </section>

    <!-- 2. Welcome Message -->
    <section v-if="wedding.welcome_message" class="py-20 px-6 bg-white text-center">
      <div class="max-w-2xl mx-auto">
        <div class="text-4xl mb-6">🌸</div>
        <p class="text-xl text-gray-700 leading-relaxed italic" style="font-family: 'Playfair Display', serif">"{{ wedding.welcome_message }}"</p>
      </div>
    </section>

    <!-- 3. Our Story -->
    <section v-if="wedding.story_text" class="py-20 px-6" :style="{ background: `${wedding.theme_color || '#d4a5a5'}11` }">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-6" style="font-family: 'Playfair Display', serif">Our Story</h2>
        <div class="w-16 h-0.5 mx-auto mb-8" :style="{ background: wedding.theme_color || '#d4a5a5' }"></div>
        <p class="text-gray-600 leading-relaxed text-lg">{{ wedding.story_text }}</p>
      </div>
    </section>

    <!-- 4. Event Details -->
    <section id="details" class="py-20 px-6 bg-white">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-3" style="font-family: 'Playfair Display', serif">The Details</h2>
        <div class="w-16 h-0.5 mx-auto mb-12" :style="{ background: wedding.theme_color || '#d4a5a5' }"></div>
        <div class="grid sm:grid-cols-2 gap-6">
          <div v-if="wedding.ceremony_time" class="text-center p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-3xl mb-3">⛪</div>
            <h3 class="font-bold text-gray-900 text-lg mb-2">Ceremony</h3>
            <p class="text-gray-500 text-sm">{{ fmtDate(wedding.wedding_date) }}</p>
            <p class="font-semibold text-gray-700 mt-1">{{ fmtTime(wedding.ceremony_time) }}</p>
            <div v-if="wedding.venue_name" class="mt-3 text-sm text-gray-500">{{ wedding.venue_name }}</div>
          </div>
          <div v-if="wedding.reception_time" class="text-center p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-3xl mb-3">🥂</div>
            <h3 class="font-bold text-gray-900 text-lg mb-2">Reception</h3>
            <p class="text-gray-500 text-sm">{{ fmtDate(wedding.wedding_date) }}</p>
            <p class="font-semibold text-gray-700 mt-1">{{ fmtTime(wedding.reception_time) }}</p>
          </div>
          <div v-if="wedding.venue_address" class="sm:col-span-2 text-center p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div class="text-3xl mb-3">📍</div>
            <h3 class="font-bold text-gray-900 text-lg mb-2">Venue</h3>
            <p class="text-gray-600">{{ wedding.venue_name }}</p>
            <p class="text-gray-500 text-sm mt-1">{{ wedding.venue_address }}</p>
            <a :href="`https://maps.google.com/?q=${encodeURIComponent(wedding.venue_address)}`" target="_blank"
              class="mt-4 inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border transition-colors hover:bg-gray-50"
              :style="{ color: wedding.theme_color || '#d4a5a5', borderColor: wedding.theme_color || '#d4a5a5' }">
              <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
              Get Directions
            </a>
          </div>
          <div v-if="wedding.dress_code" class="sm:col-span-2 text-center p-6 rounded-2xl" :style="{ background: `${wedding.theme_color || '#d4a5a5'}11` }">
            <span class="text-2xl">👗</span>
            <p class="font-semibold text-gray-800 mt-2">Dress Code: {{ wedding.dress_code }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. RSVP Section -->
    <section id="rsvp" class="py-20 px-6" :style="{ background: `${wedding.theme_color || '#d4a5a5'}11` }">
      <div class="max-w-xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-3" style="font-family: 'Playfair Display', serif">RSVP</h2>
        <div class="w-16 h-0.5 mx-auto mb-10" :style="{ background: wedding.theme_color || '#d4a5a5' }"></div>

        <div v-if="rsvpDone" class="text-center py-10 bg-white rounded-2xl shadow-sm">
          <div class="text-5xl mb-4">🎊</div>
          <h3 class="text-xl font-bold text-gray-900">Thank you, {{ rsvpForm.guest_name }}!</h3>
          <p class="text-gray-500 mt-2 text-sm">
            {{ rsvpForm.attendance_status === 'attending' ? "We can't wait to celebrate with you! 🥂" :
               rsvpForm.attendance_status === 'maybe' ? "We hope you can make it!" : "We'll miss you!" }}
          </p>
        </div>

        <form v-else @submit.prevent="submitRsvp" class="bg-white rounded-2xl shadow-sm p-8 space-y-5">
          <div>
            <label class="label">Your Name *</label>
            <input v-model="rsvpForm.guest_name" type="text" placeholder="Your full name" class="form-input" required/>
          </div>
          <div>
            <label class="label">Email (optional)</label>
            <input v-model="rsvpForm.guest_email" type="email" placeholder="your@email.com" class="form-input"/>
          </div>
          <div>
            <label class="label">Will you be attending? *</label>
            <div class="grid grid-cols-3 gap-3">
              <button v-for="opt in attendanceOptions" :key="opt.value" type="button"
                @click="rsvpForm.attendance_status = opt.value as any"
                class="py-3 rounded-xl border-2 text-sm font-medium transition-all flex flex-col items-center gap-1"
                :class="rsvpForm.attendance_status === opt.value ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-gray-200 text-gray-600 hover:border-rose-300'">
                <span class="text-xl">{{ opt.emoji }}</span>{{ opt.label }}
              </button>
            </div>
          </div>
          <div>
            <label class="label">How do you know the couple? *</label>
            <div class="grid grid-cols-2 gap-2">
              <button v-for="opt in knowOptions" :key="opt.value" type="button"
                @click="rsvpForm.how_they_know = opt.value as any"
                class="py-2.5 rounded-xl border-2 text-sm font-medium transition-all"
                :class="rsvpForm.how_they_know === opt.value ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-gray-200 text-gray-600 hover:border-rose-300'">
                {{ opt.label }}
              </button>
            </div>
          </div>
          <div>
            <label class="label">Tell us how you met (optional)</label>
            <input v-model="rsvpForm.how_they_know_detail" type="text" placeholder="Share your connection story…" class="form-input"/>
          </div>
          <div class="flex items-center gap-3">
            <div @click="rsvpForm.plus_one = !rsvpForm.plus_one"
              class="w-11 h-6 rounded-full cursor-pointer transition-colors relative"
              :class="rsvpForm.plus_one ? 'bg-rose-500' : 'bg-gray-300'">
              <div class="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform"
                :class="rsvpForm.plus_one ? 'translate-x-5' : 'translate-x-0.5'"></div>
            </div>
            <span class="text-sm font-medium text-gray-700">I'm bringing a plus-one</span>
          </div>
          <div v-if="rsvpForm.plus_one">
            <label class="label">Plus-one name</label>
            <input v-model="rsvpForm.plus_one_name" type="text" placeholder="Their name" class="form-input"/>
          </div>
          <div>
            <label class="label">Dietary restrictions (optional)</label>
            <input v-model="rsvpForm.dietary_restrictions" type="text" placeholder="e.g. Vegetarian, Gluten-free" class="form-input"/>
          </div>
          <div>
            <label class="label">Message to the couple (optional)</label>
            <textarea v-model="rsvpForm.message_to_couple" rows="3" placeholder="Share your excitement or well wishes…" class="form-input resize-none"></textarea>
          </div>
          <div v-if="rsvpError" class="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{{ rsvpError }}</div>
          <button type="submit" :disabled="rsvpSubmitting || !rsvpForm.guest_name || !rsvpForm.attendance_status"
            class="w-full py-3 rounded-xl font-semibold text-white text-sm disabled:opacity-60 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            :style="{ background: `linear-gradient(135deg, ${wedding.theme_color || '#d4a5a5'}, #ec4899)` }">
            <span v-if="rsvpSubmitting">Sending…</span>
            <span v-else>Send RSVP 💌</span>
          </button>
        </form>
      </div>
    </section>

    <!-- 6. Wishes Wall -->
    <section class="py-20 px-6 bg-white">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-3" style="font-family: 'Playfair Display', serif">Wishes Wall</h2>
        <div class="w-16 h-0.5 mx-auto mb-12" :style="{ background: wedding.theme_color || '#d4a5a5' }"></div>

        <!-- Submit wish -->
        <div v-if="!wishDone" class="bg-gray-50 rounded-2xl p-6 mb-10">
          <h3 class="font-semibold text-gray-800 mb-4">Send your wishes to the couple 💝</h3>
          <div class="space-y-3">
            <input v-model="wishForm.guest_name" type="text" placeholder="Your name" class="form-input"/>
            <textarea v-model="wishForm.wish_message" rows="3" placeholder="Write your heartfelt wishes…" class="form-input resize-none"></textarea>
            <button @click="submitWish" :disabled="wishSubmitting || !wishForm.guest_name || !wishForm.wish_message"
              class="px-5 py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-60 transition-all hover:shadow-md"
              :style="{ background: wedding.theme_color || '#d4a5a5' }">
              <span v-if="wishSubmitting">Sending…</span>
              <span v-else>Send Wish ✨</span>
            </button>
          </div>
        </div>
        <div v-else class="bg-green-50 rounded-2xl p-6 mb-10 text-center">
          <div class="text-3xl mb-2">✨</div>
          <p class="font-semibold text-green-800">Your wish was sent!</p>
        </div>

        <!-- Wishes list -->
        <div v-if="wishes.length === 0" class="text-center text-gray-400 py-8">
          <div class="text-4xl mb-2">💌</div>
          <p class="text-sm">Be the first to send wishes!</p>
        </div>
        <div v-else class="columns-1 sm:columns-2 gap-5 space-y-5">
          <div v-for="wish in wishes" :key="wish.id"
            class="break-inside-avoid bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p class="text-gray-700 leading-relaxed mb-4 italic">"{{ wish.wish_message }}"</p>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                :style="{ background: wedding.theme_color || '#d4a5a5' }">
                {{ wish.guest_name[0].toUpperCase() }}
              </div>
              <div>
                <p class="font-semibold text-gray-800 text-sm">{{ wish.guest_name }}</p>
                <p class="text-xs text-gray-400">{{ fmtRelative(wish.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. Additional Info -->
    <section v-if="wedding.additional_info" class="py-16 px-6" :style="{ background: `${wedding.theme_color || '#d4a5a5'}11` }">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-6" style="font-family: 'Playfair Display', serif">Good to Know</h2>
        <p class="text-gray-600 leading-relaxed">{{ wedding.additional_info }}</p>
      </div>
    </section>

    <!-- Footer -->
    <div class="py-8 text-center text-sm text-gray-400 bg-white border-t border-gray-100">
      Made with ❤️ on <NuxtLink to="/" class="text-rose-400 font-medium hover:text-rose-600">Cardy</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Wedding, WeddingWish } from '~/types'
definePageMeta({ layout: 'wedding' })

const route = useRoute()
const { fetchWeddingBySlug, submitRsvp: doRsvp, fetchWishes: doFetchWishes, submitWish: doWish } = useWeddings()

const wedding = ref<Wedding | null>(null)
const loading = ref(true)
const wishes = ref<WeddingWish[]>([])

provide('wedding', wedding)

const rsvpDone = ref(false)
const rsvpSubmitting = ref(false)
const rsvpError = ref('')
const rsvpForm = reactive({
  guest_name: '', guest_email: '', attendance_status: '' as any,
  how_they_know: 'both' as any, how_they_know_detail: '',
  plus_one: false, plus_one_name: '', dietary_restrictions: '', message_to_couple: '',
})

const wishDone = ref(false)
const wishSubmitting = ref(false)
const wishForm = reactive({ guest_name: '', wish_message: '' })

const attendanceOptions = [
  { value: 'attending', label: 'Attending', emoji: '🎉' },
  { value: 'not_attending', label: 'Declining', emoji: '😢' },
  { value: 'maybe', label: 'Maybe', emoji: '🤔' },
]
const knowOptions = [
  { value: 'bride', label: "Bride's side" },
  { value: 'groom', label: "Groom's side" },
  { value: 'both', label: 'Both' },
  { value: 'other', label: 'Other' },
]

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
const fmtTime = (t: string) => { const [h, m] = t.split(':'); const hr = parseInt(h); return `${hr > 12 ? hr-12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}` }
const fmtRelative = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

const submitRsvp = async () => {
  rsvpSubmitting.value = true; rsvpError.value = ''
  const { error } = await doRsvp(wedding.value!.id, rsvpForm)
  rsvpSubmitting.value = false
  if (error) { rsvpError.value = error.message; return }
  rsvpDone.value = true
}

const submitWish = async () => {
  wishSubmitting.value = true
  const { error } = await doWish(wedding.value!.id, wishForm.guest_name, wishForm.wish_message)
  wishSubmitting.value = false
  if (error) return
  wishDone.value = true
  const { data } = await doFetchWishes(wedding.value!.id)
  wishes.value = data
}

useHead(() => ({
  title: wedding.value ? `${wedding.value.couple_name_1} & ${wedding.value.couple_name_2} — Wedding` : 'Wedding Invitation',
}))

onMounted(async () => {
  const { data } = await fetchWeddingBySlug(route.params.slug as string)
  wedding.value = data
  loading.value = false
  if (data) {
    const { data: w } = await doFetchWishes(data.id)
    wishes.value = w
  }
})
</script>

<style scoped>
@reference "tailwindcss";
.label { @apply block text-sm font-medium text-gray-700 mb-1.5; }
.form-input { @apply w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-sm; }
</style>
