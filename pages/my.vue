<template>
  <section class="py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">My cards</h2>
      <UButton to="/create" icon="i-heroicons-plus-circle" label="New card" />
    </div>

    <div v-if="cards.length === 0" class="text-gray-500 dark:text-gray-400">
      No cards yet. <NuxtLink to="/create" class="underline">Create one</NuxtLink>.
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <CardPreview v-for="card in cards" :key="card.id" :card="card">
        <template #actions>
          <div class="flex items-center gap-2">
            <UButton :to="`/print-request/${card.id}`" size="sm" color="neutral" variant="ghost"
              icon="i-heroicons-truck" />
            <UButton size="sm" color="error" variant="ghost" icon="i-heroicons-trash" @click="onDelete(card.id)" />
          </div>
        </template>
      </CardPreview>
    </div>
  </section>
</template>

<script setup lang="ts">
const { fetchCards, deleteCard } = useCardsApi()
const cards = ref<any[]>([])

onMounted(async () => {
  cards.value = await fetchCards()
})

async function onDelete(id: string) {
  if (!confirm('Delete this card?')) return
  await deleteCard(id)
  cards.value = await fetchCards()
}
</script>