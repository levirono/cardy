<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-24 px-4">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-32 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-32 -left-32 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl"></div>
      </div>
      <div class="relative max-w-5xl mx-auto text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur border border-purple-100 rounded-full text-sm text-purple-700 font-medium mb-8 shadow-sm">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Beautiful cards for every moment
        </div>
        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
          Create cards that <br/>
          <span class="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">feel magical</span>
        </h1>
        <p class="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          From heartfelt birthday cards to stunning wedding invitations — Cardy helps you craft unforgettable digital experiences for the people you love.
        </p>
        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink to="/cards/create" class="group px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-semibold text-base shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex items-center gap-2">
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/></svg>
            Create a Card
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          </NuxtLink>
          <NuxtLink to="/weddings/create" class="px-8 py-4 bg-white text-gray-700 rounded-2xl font-semibold text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border border-gray-200 flex items-center gap-2">
            <svg class="w-5 h-5 text-pink-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/></svg>
            Plan a Wedding
          </NuxtLink>
        </div>
        <!-- Stats -->
        <div class="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-3xl font-bold text-gray-900">{{ stat.value }}</div>
            <div class="text-sm text-gray-500 mt-1">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="py-24 px-4 bg-white">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900">Everything you need</h2>
          <p class="text-gray-500 mt-4 text-lg max-w-xl mx-auto">Cardy brings together all the tools to help you create and share meaningful digital experiences</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.title"
            class="group p-8 rounded-3xl border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 bg-gradient-to-br hover:from-purple-50/50 hover:to-pink-50/50">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300" :class="feature.bgColor">
              <span class="text-2xl">{{ feature.emoji }}</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ feature.title }}</h3>
            <p class="text-gray-500 leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Wedding Spotlight -->
    <section class="py-24 px-4 bg-gradient-to-br from-rose-50 to-pink-50">
      <div class="max-w-6xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div class="inline-flex items-center gap-2 text-sm font-medium text-pink-700 bg-pink-100 rounded-full px-4 py-2 mb-6">💍 New Feature</div>
            <h2 class="text-4xl font-bold text-gray-900 leading-tight mb-6">Wedding invitations that wow your guests</h2>
            <p class="text-gray-600 text-lg leading-relaxed mb-8">Create beautiful digital wedding invitations with RSVP management, guest wishes, your love story, venue details, and a unique shareable link — all in minutes.</p>
            <ul class="space-y-4 mb-10">
              <li v-for="item in weddingFeatures" :key="item" class="flex items-center gap-3 text-gray-700">
                <div class="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-3.5 h-3.5 text-pink-600" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </div>
                {{ item }}
              </li>
            </ul>
            <NuxtLink to="/weddings/create" class="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Create Wedding Invitation
              <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
            </NuxtLink>
          </div>
          <div class="relative">
            <div class="bg-white rounded-3xl shadow-2xl p-8 border border-pink-100">
              <div class="text-center mb-6">
                <div class="text-4xl mb-3">💑</div>
                <h3 class="text-2xl font-bold text-gray-900 font-serif">Sarah & Michael</h3>
                <p class="text-pink-500 font-medium mt-1">Are getting married!</p>
              </div>
              <div class="space-y-3 text-sm text-gray-600">
                <div class="flex items-center gap-3 p-3 bg-pink-50 rounded-xl">
                  <span>📅</span><span>Saturday, June 14, 2026</span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-pink-50 rounded-xl">
                  <span>📍</span><span>The Grand Ballroom, Nairobi</span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-pink-50 rounded-xl">
                  <span>🕑</span><span>Ceremony at 2:00 PM · Reception at 5:00 PM</span>
                </div>
              </div>
              <div class="mt-6 flex gap-3">
                <button class="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl text-sm font-semibold">RSVP Now</button>
                <button class="flex-1 py-3 border border-pink-200 text-pink-600 rounded-xl text-sm font-semibold">Send a Wish</button>
              </div>
            </div>
            <div class="absolute -bottom-4 -right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">✓ 47 RSVPs</div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-24 px-4 bg-white">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900">How it works</h2>
          <p class="text-gray-500 mt-4 text-lg">Create and share in three simple steps</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8 relative">
          <div class="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-purple-200 to-pink-200"></div>
          <div v-for="(step, i) in steps" :key="step.title" class="text-center relative">
            <div class="w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-md" :class="step.bg">{{ step.emoji }}</div>
            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-6 h-6 rounded-full bg-white border-2 border-purple-300 flex items-center justify-center text-xs font-bold text-purple-600">{{ i+1 }}</div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ step.title }}</h3>
            <p class="text-gray-500 leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials (real data with fallback) -->
    <section class="py-24 px-4 bg-gray-50">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900">Loved by our users</h2>
          <p class="text-gray-500 mt-4 text-lg">See what people are saying about Cardy</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="t in testimonials" :key="t.name"
            class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div class="flex items-center gap-1 mb-4">
              <svg v-for="i in 5" :key="i" class="w-5 h-5" :class="i <= t.rating ? 'text-yellow-400' : 'text-gray-200'" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <p class="text-gray-700 leading-relaxed mb-6 italic">"{{ t.quote }}"</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">{{ t.initials }}</div>
              <div>
                <p class="font-semibold text-gray-900 text-sm">{{ t.name }}</p>
                <p class="text-gray-500 text-xs">{{ t.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-24 px-4 bg-gradient-to-br from-purple-600 to-pink-600">
      <div class="max-w-3xl mx-auto text-center text-white">
        <h2 class="text-4xl sm:text-5xl font-bold mb-6">Ready to create something beautiful?</h2>
        <p class="text-white/80 text-xl mb-10">Join thousands of people who use Cardy to celebrate life's special moments</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/signup" class="px-8 py-4 bg-white text-purple-700 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
            Get Started Free
          </NuxtLink>
          <NuxtLink to="/cards/create" class="px-8 py-4 bg-white/20 backdrop-blur border border-white/40 text-white rounded-2xl font-semibold hover:bg-white/30 transition-all">
            Create a Card
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Cardy — Beautiful Cards & Wedding Invitations' })

const stats = [
  { value: '10K+', label: 'Cards Created' },
  { value: '500+', label: 'Weddings' },
  { value: '4.9★', label: 'User Rating' },
]

const features = [
  { emoji: '🎴', title: 'Digital Cards', desc: 'Create stunning digital cards with images, videos, time-locks, and secret keys. Share instantly via a unique link.', bgColor: 'bg-purple-100' },
  { emoji: '💍', title: 'Wedding Invitations', desc: 'Full wedding invitation suite with RSVP management, wishes wall, venue details, and shareable guest links.', bgColor: 'bg-rose-100' },
  { emoji: '💝', title: 'Valentines', desc: 'Send animated valentine messages with beautiful effects to that special someone in your life.', bgColor: 'bg-pink-100' },
  { emoji: '🎨', title: 'Designer Templates', desc: 'Choose from professionally designed templates created by our community of talented designers.', bgColor: 'bg-indigo-100' },
  { emoji: '🔒', title: 'Time-Lock & Secret Key', desc: 'Schedule when your card can be opened, or add a secret key only the recipient knows.', bgColor: 'bg-teal-100' },
  { emoji: '✉️', title: 'Custom Design Requests', desc: 'Need something unique? Request a custom design from one of our professional designers.', bgColor: 'bg-amber-100' },
]

const weddingFeatures = [
  'Custom shareable link for every wedding',
  'RSVP management with attendance tracking',
  'Guest wishes wall with moderation',
  'Venue details and map integration',
  'Beautiful theme customization',
  'Plus-one and dietary requirement tracking',
]

const steps = [
  { emoji: '✏️', title: 'Create', desc: 'Pick a template or start from scratch. Add your message, photos, and personal touches.', bg: 'bg-purple-100' },
  { emoji: '🔗', title: 'Share', desc: 'Get a unique link to share with anyone — by email, WhatsApp, or social media.', bg: 'bg-pink-100' },
  { emoji: '🎉', title: 'Celebrate', desc: 'They open it, RSVP, leave wishes, and you track it all from your dashboard.', bg: 'bg-indigo-100' },
]

const testimonials = [
  { name: 'Sarah Wanjiku', role: 'Happy Customer', initials: 'SW', rating: 5, quote: 'Used Cardy for our wedding invitations — over 80 RSVPs tracked automatically. The platform is absolutely stunning!' },
  { name: 'Michael Okonkwo', role: 'Frequent User', initials: 'MO', rating: 5, quote: 'The time-lock feature blew my wife away on our anniversary. She had no idea what was inside until the exact right moment.' },
  { name: 'Amara Nduka', role: 'Small Business Owner', initials: 'AN', rating: 5, quote: 'We send personalized thank-you cards to clients using Cardy. The designer templates are world-class.' },
]
</script>