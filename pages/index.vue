<template>
  <section class="py-14 bg-bg text-text">
    <div class="container">
      <!-- Hero Section -->
      <div class="relative overflow-hidden rounded-2xl p-6 sm:p-8 sm:py-12 lg:p-12 text-center">
        <!-- Gradient Background -->
        <div class="absolute inset-0 rounded-2xl"
          style="background: linear-gradient(135deg, #e754ec 0%, #5b9df9 100%);"></div>

        <div class="relative z-10 max-w-3xl mx-auto">
          <!-- Badge -->
          <div
            class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium bg-bg-secondary/80 backdrop-blur-sm border border-border/50 mb-6">
            <span class="size-2 rounded-full bg-green-500"></span>
            <span>Virtual giftcards for the moments that matter</span>
          </div>

          <!-- Heading -->
          <h1 class="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Send a beautiful card at the perfect time
          </h1>

          <!-- Description -->
          <p class="mt-6 text-lg text-text-secondary max-w-2xl mx-auto">
            Schedule unlocks, add a secret key, include images or videos, and
            request printing & delivery.
          </p>

          <!-- CTA Buttons -->
          <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
            <UButton to="/create" size="lg" icon="i-heroicons-plus-circle" color="primary" class="px-6 py-3 text-base">
              Create a card
            </UButton>

            <UButton to="/my" variant="outline" size="lg" icon="i-heroicons-rectangle-stack"
              class="px-6 py-3 text-base">
              My cards
            </UButton>
          </div>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Feature 1 -->
        <UCard class="h-full transition-all hover:shadow-lg hover:-translate-y-1" :ui="{
          root: 'h-full flex flex-col ring-1 ring-border/20 shadow-sm rounded-2xl bg-gradient-card',
          body: 'flex-1'
        }">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-primary/10 text-primary">
                <UIcon name="i-heroicons-clock" class="w-6 h-6" />
              </div>
              <h3 class="text-lg font-semibold">Time-locked openings</h3>
            </div>
          </template>

          <p class="text-text-secondary">
            Choose the exact date and time they'll be able to open your card.
            Perfect for birthdays, anniversaries, or any special occasion.
          </p>
        </UCard>

        <!-- Feature 2 -->
        <UCard class="h-full transition-all hover:shadow-lg hover:-translate-y-1" :ui="{
          root: 'h-full flex flex-col ring-1 ring-border/20 shadow-sm rounded-2xl bg-gradient-card',
          body: 'flex-1'
        }">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                <UIcon name="i-heroicons-key" class="w-6 h-6" />
              </div>
              <h3 class="text-lg font-semibold">Private lock key</h3>
            </div>
          </template>

          <p class="text-text-secondary">
            Add a secret key so only the intended recipient can access the card.
            Keep your messages private and secure.
          </p>
        </UCard>

        <!-- Feature 3 -->
        <UCard class="h-full transition-all hover:shadow-lg hover:-translate-y-1 sm:col-span-2 lg:col-span-1" :ui="{
          root: 'h-full flex flex-col ring-1 ring-border/20 shadow-sm rounded-2xl bg-gradient-card',
          body: 'flex-1'
        }">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-green-500/10 text-green-500">
                <UIcon name="i-heroicons-photo" class="w-6 h-6" />
              </div>
              <h3 class="text-lg font-semibold">Rich media support</h3>
            </div>
          </template>

          <p class="text-text-secondary">
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
    </div>
  </section>
</template>

<script setup lang="ts">
// Import components
const TestimonialCard = defineAsyncComponent((): Promise<typeof import('../components/TestimonialCard.vue')> => import('../components/TestimonialCard.vue'));
</script>

<style scoped>
/* Custom styles for the hero section */
.hero-gradient {
  background: linear-gradient(135deg, rgba(var(--color-primary), 0.1) 0%, rgba(var(--color-secondary), 0.1) 100%);
}

/* Smooth transitions for interactive elements */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Responsive typography */
@media (min-width: 1024px) {
  .text-6xl {
    font-size: 3.75rem;
    line-height: 1;
  }
}

.bg-gradient-card {
  background: linear-gradient(120deg, #e0ffe7 0%, #fbe7ff 60%, #e3f0ff 100%);
  border-radius: 1rem;
  /* No border, no lines */
  box-shadow: 0 2px 8px 0 rgba(120,120,180,0.06);
}

@media (prefers-color-scheme: dark) {
  .bg-gradient-card {
    background: linear-gradient(120deg, #232a2f 0%, #2d2233 60%, #1a2233 100%);
    box-shadow: 0 2px 12px 0 rgba(40,40,60,0.18);
  }
}
</style>