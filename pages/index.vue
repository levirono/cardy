<template>
  <section class="py-14 bg-bg text-text transition-colors duration-300">
    <div class="container">
      <!-- Hero Section -->
      <div class="relative overflow-hidden rounded-2xl p-6 sm:p-8 sm:py-12 lg:p-12 text-center">
        <!-- Gradient Background -->
        <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#e754ec] to-[#5b9df9] dark:from-[#4b1c71] dark:to-[#0d3b8a]"></div>

        <div class="relative z-10 max-w-3xl mx-auto">
          <!-- Badge -->
          <div
            class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium bg-bg-secondary/80 backdrop-blur-sm border border-border/50 mb-6">
            <span class="size-2 rounded-full bg-green-500"></span>
            <span>Virtual giftcards for the moments that matter</span>
          </div>

          <!-- Heading with Gradient Text -->
          <h1 class="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 dark:from-gray-200 dark:to-gray-400">
            Send a beautiful card at the perfect time
          </h1>

          <!-- Description -->
          <p class="mt-6 text-lg text-text-secondary/90 dark:text-gray-400 max-w-2xl mx-auto">
            Schedule unlocks, add a secret key, include images or videos, and
            request printing & delivery.
          </p>

          <!-- CTA Buttons with Gradients -->
          <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
            <UButton to="/create" size="lg" icon="i-heroicons-plus-circle" class="px-6 py-3 text-base font-medium transition-all duration-300 group relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span class="relative z-10 flex items-center gap-2">
                <UIcon name="i-heroicons-plus-circle" class="w-5 h-5" />
                Create a card
              </span>
            </UButton>

            <UButton to="/my" variant="outline" size="lg" class="px-6 py-3 text-base font-medium transition-all duration-300 group relative overflow-hidden border-2 border-transparent bg-gradient-to-r from-bg to-bg bg-origin-border hover:from-primary-500/10 hover:to-purple-500/10 dark:hover:from-primary-500/5 dark:hover:to-purple-500/5">
              <div class="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span class="relative z-10 flex items-center gap-2 text-text dark:text-gray-200">
                <UIcon name="i-heroicons-rectangle-stack" class="w-5 h-5" />
                My cards
              </span>
            </UButton>

            <!-- Become a designer (only normal users, when feature is enabled) -->
            <UButton
              v-if="isAuthenticated && isUser && (designerEnabled ?? true)"
              to="/designer/apply"
              variant="ghost"
              size="lg"
              class="px-6 py-3 text-base font-medium transition-all duration-300 group relative overflow-hidden border border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <span class="relative z-10 flex items-center gap-2">
                <UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
                Become a designer
              </span>
            </UButton>
          </div>
          </div>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Feature 1 -->
        <UCard class="h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 group" :ui="{
          root: 'h-full flex flex-col ring-1 ring-border/20 shadow-sm rounded-2xl bg-gradient-to-br from-green-50 via-purple-50 to-blue-50 dark:from-[#0f172a] dark:via-[#0f0f23] dark:to-[#0f1a2e] hover:ring-2 hover:ring-primary/20 dark:hover:ring-primary/30',
          body: 'flex-1',
          header: 'pb-4',
          footer: 'pt-4',
        }">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                <UIcon name="i-heroicons-clock" class="w-6 h-6" />
              </div>
              <h3 class="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 dark:from-primary-400 dark:to-purple-400">
                Time-locked openings
              </h3>
            </div>
          </template>

          <p class="text-text-secondary dark:text-gray-300">
            Choose the exact date and time they'll be able to open your card.
            Perfect for birthdays, anniversaries, or any special occasion.
          </p>
        </UCard>

        <!-- Feature 2 -->
        <UCard class="h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 group" :ui="{
          root: 'h-full flex flex-col ring-1 ring-border/20 shadow-sm rounded-2xl bg-gradient-to-br from-green-50 via-purple-50 to-blue-50 dark:from-[#0f172a] dark:via-[#0f0f23] dark:to-[#0f1a2e] hover:ring-2 hover:ring-purple-500/20 dark:hover:ring-purple-500/30',
          body: 'flex-1',
          header: 'pb-4',
          footer: 'pt-4',
        }">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform duration-300">
                <UIcon name="i-heroicons-key" class="w-6 h-6" />
              </div>
              <h3 class="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-400">
                Private lock key
              </h3>
            </div>
          </template>

          <p class="text-text-secondary dark:text-gray-300">
            Add a secret key so only the intended recipient can access the card.
            Keep your messages private and secure.
          </p>
        </UCard>

        <!-- Feature 3 -->
        <UCard class="h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 sm:col-span-2 lg:col-span-1 group" :ui="{
          root: 'h-full flex flex-col ring-1 ring-border/20 shadow-sm rounded-2xl bg-gradient-to-br from-green-50 via-purple-50 to-blue-50 dark:from-[#0f172a] dark:via-[#0f0f23] dark:to-[#0f1a2e] hover:ring-2 hover:ring-green-500/20 dark:hover:ring-green-500/30',
          body: 'flex-1',
          header: 'pb-4',
          footer: 'pt-4',
        }">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-green-500/10 text-green-500 group-hover:scale-110 transition-transform duration-300">
                <UIcon name="i-heroicons-photo" class="w-6 h-6" />
              </div>
              <h3 class="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500 dark:from-green-400 dark:to-teal-400">
                Rich media support
              </h3>
            </div>
          </template>

          <p class="text-text-secondary dark:text-gray-300">
            Include images, videos, and custom messages to make your card truly
            special and personalized.
          </p>
        </UCard>
      </div>

      <!-- Testimonial Section -->
      <div class="mt-20 text-center">
        <h2 class="text-2xl font-bold sm:text-3xl">
          Loved by thousands of users
        </h2>

        <div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <TestimonialCard name="Sarah Johnson" role="Happy Customer"
            avatar="https://randomuser.me/api/portraits/women/43.jpg"
            quote="I used Cardy to send a birthday surprise to my sister. The time-lock feature made it extra special!"
            rating="5" />

          <TestimonialCard name="Michael Chen" role="Frequent User"
            avatar="https://randomuser.me/api/portraits/men/32.jpg"
            quote="The private lock key gives me peace of mind when sending sensitive messages. Highly recommended!"
            rating="5" />

          <TestimonialCard name="Emma Rodriguez" role="Small Business Owner"
            avatar="https://randomuser.me/api/portraits/women/65.jpg"
            quote="Perfect for sending personalized thank you notes to our best clients. The design options are fantastic!"
            rating="4" />
        </div>
      </div>    
  </section>
</template>

<script setup lang="ts">
// Import components
const TestimonialCard = defineAsyncComponent(
  (): Promise<typeof import('../components/TestimonialCard.vue')> =>
    import('../components/TestimonialCard.vue')
)

const { isAuthenticated, isUser, isDesigner } = useAuth()
const { enabled: designerEnabled } = useDesignerSettings()
</script>

<style scoped>
/* All styles have been converted to Tailwind classes */
</style>