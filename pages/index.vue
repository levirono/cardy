<template>
  <section class="py-14">
    <div class="mx-auto max-w-4xl">
      <div class="relative overflow-hidden rounded-2xl p-6 sm:p-8 text-gray-900 dark:text-gray-100" :class="[app.ui.tokens?.gradients?.brand, app.ui.tokens?.rings?.card]">
        <div class="absolute inset-0 bg-white/10 dark:bg-black/10"></div>
        <div class="relative text-center">
          <div class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm bg-white/20 dark:bg-black/20">
            <span class="size-2 rounded-full bg-green-300"></span>
            Virtual giftcards for the moments that matter
          </div>
          <h1 class="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">Send a beautiful card at the perfect time</h1>
          <p class="mt-4 opacity-90">
            Schedule unlocks, add a secret key, include images or videos, and request printing & delivery.
          </p>
          <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
            <UButton to="/create" size="lg" icon="i-heroicons-plus-circle" label="Create a card" color="primary" />
            <UButton to="/my" variant="ghost" size="lg" icon="i-heroicons-rectangle-stack" label="My cards" color="neutral" />
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto mt-14 max-w-4xl grid gap-6 sm:grid-cols-2">
      <UCard :ui="{ root: 'overflow-hidden' }">
        <template #header>
          <div class="font-semibold">Time-locked openings</div>
        </template>
        <div class="rounded-xl p-4 text-sm text-gray-700 dark:text-gray-300" :class="[app.ui.tokens?.gradients?.subtle, app.ui.tokens?.rings?.card]">
          Choose the exact date and time they'll be able to open.
        </div>
      </UCard>
      <UCard :ui="{ root: 'overflow-hidden' }">
        <template #header>
          <div class="font-semibold">Private lock key</div>
        </template>
        <div class="rounded-xl p-4 text-sm text-gray-700 dark:text-gray-300" :class="[app.ui.tokens?.gradients?.subtle, app.ui.tokens?.rings?.card]">
          Add a secret key so only they can peek.
        </div>
      </UCard>
    </div>
  </section>
</template>

<script setup lang="ts">
const app = useAppConfig() as any
</script> 